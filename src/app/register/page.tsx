"use client";

import { MemberRegistrationForm } from "@/components/members";
import { Button } from "@/components/ui/button";
import { MemberFormData } from "@/lib/validations/member";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<MemberFormData | null>(
    null,
  );

  const handleSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }

      // Success
      setSubmittedData(data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      // You could add toast notification here
      alert(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (isSuccess && submittedData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-12">
          <div className="mx-auto max-w-2xl">
            {/* Success Message */}
            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>

                <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  Registration Successful! 🎉
                </h1>

                <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                  Welcome to Tumaini Fitness, {submittedData.firstName}!
                </p>

                <div className="mb-8 rounded-lg bg-gray-50 p-6 text-left dark:bg-gray-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    What&apos;s Next?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                      <span>
                        Our team will review your registration within 24 hours
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                      <span>
                        You&apos;ll receive a confirmation email with your
                        membership details
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                      <span>
                        Visit our gym to complete your membership and start your
                        fitness journey
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/">
                    <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-600 sm:w-auto">
                      Back to Home
                    </Button>
                  </Link>
                  <Link href="/#contact">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="w-fit">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Join Tumaini Fitness
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Start your fitness journey today! Fill out the form below to
                register as a member and get access to our world-class
                facilities.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <MemberRegistrationForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              submitButtonText="Complete Registration"
              showCancelButton={true}
            />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By registering, you agree to our terms of service and privacy
              policy.
              <br />
              Have questions?{" "}
              <Link
                href="/contact"
                className="text-yellow-600 hover:text-yellow-700"
              >
                Contact us
              </Link>{" "}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
