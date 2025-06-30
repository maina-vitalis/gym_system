import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactFormEmail = ({
  name,
  email,
  message,
  subject,
}: ContactFormEmailProps) => (
  <Html>
    <Head />
    <Preview>New Contact Form Submission</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={title}>New Contact Form Submission</Text>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>
            A user has submitted a message through the contact form. Below are
            the details:
          </Text>
          <Section style={detailsContainer}>
            <Text style={details}>
              <strong style={detailLabel}>Name:</strong>{" "}
              {name || "Not provided"}
            </Text>
            <Text style={details}>
              <strong style={detailLabel}>Email:</strong>{" "}
              {email || "Not provided"}
            </Text>
            <Text style={details}>
              <strong style={detailLabel}>Subject:</strong>{" "}
              {subject || "Not provided"}
            </Text>
            <Text style={details}>
              <strong style={detailLabel}>Message:</strong>
            </Text>
            <Text style={messageStyle}>
              {message || "No message provided."}
            </Text>
          </Section>
        </Section>
        <Hr style={hr} />
        <Section style={footerSection}>
          <Text style={footer}>
            Please respond to the user at the provided email address. This
            message was submitted via the contact form.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ContactFormEmail;

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "20px 0",
};

const container = {
  margin: "0 auto",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(30, 41, 57, 0.15)",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#1E2939",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const title = {
  fontSize: "24px",
  color: "#ffffff",
  fontWeight: "bold" as const,
  margin: "0",
  letterSpacing: "-0.5px",
};

const content = {
  padding: "32px 24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1E2939",
  marginBottom: "24px",
  margin: "0 0 24px 0",
};

const detailsContainer = {
  backgroundColor: "#f8f9fa",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  marginTop: "16px",
};

const details = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1E2939",
  marginBottom: "12px",
  margin: "0 0 12px 0",
};

const detailLabel = {
  color: "#F0B100",
  fontWeight: "600" as const,
};

const messageStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1E2939",
  marginTop: "12px",
  padding: "16px",
  backgroundColor: "#ffffff",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
  whiteSpace: "pre-wrap" as const,
  margin: "12px 0 0 0",
};

const hr = {
  borderColor: "#F0B100",
  borderWidth: "2px",
  margin: "0",
  opacity: 0.3,
};

const footerSection = {
  padding: "24px",
  backgroundColor: "#f8f9fa",
};

const footer = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6c757d",
  textAlign: "center" as const,
  margin: "0",
};
