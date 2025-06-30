import ContactFormEmail from "@/components/email/Contact";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation function
interface EmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

function validateEmailData(data: EmailData) {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length < 2
  ) {
    errors.push("Name is required and must be at least 2 characters long");
  }

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Please provide a valid email address");
    }
  }

  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim().length < 10
  ) {
    errors.push("Message is required and must be at least 10 characters long");
  }

  // Subject is optional, but if provided, validate it
  if (
    data.subject &&
    (typeof data.subject !== "string" || data.subject.trim().length > 100)
  ) {
    errors.push("Subject must be less than 100 characters");
  }

  return errors;
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Parse and validate request body
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateEmailData(body);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationErrors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      message: sanitizeInput(body.message),
      subject: body.subject ? sanitizeInput(body.subject) : "",
    };

    // Create a more descriptive subject line
    const emailSubject = sanitizedData.subject
      ? `Contact Form: ${sanitizedData.subject}`
      : `New Contact Form Submission from ${sanitizedData.name}`;

    // Send email
    await resend.emails.send({
      from: "Tumaini Fitness Centre <no-reply@tumainifitness.co.ke>",
      to: ["mainavitalis65@gmail.com"],
      subject: emailSubject,
      react: ContactFormEmail({
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message,
        subject: sanitizedData.subject,
      }),
      // Optional: Add reply-to header for easier responses
      replyTo: sanitizedData.email,
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    // Log the full error for debugging (use proper logging in production)
    console.error("Contact form error:", error);

    // Return user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        message: "Please try again later or contact us directly.",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
