import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma";
import { checkRateLimit, verifyPassword } from "./utils";

// ============================================================================
// NEXTAUTH CONFIGURATION
// ============================================================================

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("🔐 AUTHENTICATION ATTEMPT STARTED");
        console.log("📧 Email received:", credentials?.email);
        console.log(
          "🔑 Password received (length):",
          credentials?.password?.length
        );

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing email or password");
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const clientIP =
          req?.headers?.["x-forwarded-for"] ||
          req?.headers?.["x-real-ip"] ||
          "unknown";

        console.log("🔍 Processed email:", email);
        console.log("🌐 Client IP:", clientIP);

        // Rate limiting
        const rateLimit = checkRateLimit(
          `login:${clientIP}:${email}`,
          5,
          15 * 60 * 1000
        );
        if (!rateLimit.allowed) {
          console.log("🚫 Rate limit exceeded for:", email);
          throw new Error("Too many login attempts. Please try again later.");
        }

        try {
          console.log("🔎 Searching for user in database...");

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              password: true,
              emailVerified: true,
              name: true,
            },
          });

          if (!user) {
            console.log("❌ User not found in database:", email);
            return null;
          }

          if (!user.password) {
            console.log("❌ User has no password set:", email);
            return null;
          }

          console.log("✅ User found in database:");
          console.log("   - ID:", user.id);
          console.log("   - Email:", user.email);
          console.log("   - Role:", user.role);
          console.log("   - Name:", user.firstName, user.lastName);
          console.log("   - Password hash length:", user.password.length);
          console.log(
            "   - Password hash starts with:",
            user.password.substring(0, 10)
          );

          console.log("🔐 Starting password verification...");
          console.log("   - Input password:", credentials.password);
          console.log(
            "   - Input password length:",
            credentials.password.length
          );

          // Verify password
          const isValidPassword = await verifyPassword(
            credentials.password,
            user.password
          );

          console.log("🔍 Password verification result:", isValidPassword);

          if (!isValidPassword) {
            console.log("❌ Password verification FAILED for user:", email);
            console.log(
              "   - This means the password doesn't match the stored hash"
            );
            return null;
          }

          console.log("✅ Password verification SUCCESSFUL!");
          console.log("🎉 Authentication completed successfully for:", email);

          // Return user object for session
          const userForSession = {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified,
          };

          console.log("👤 Returning user for session:", userForSession);
          return userForSession;
        } catch (error) {
          console.error("💥 Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Handle JWT decryption errors by creating a fresh token
      if (trigger === "signIn" && user) {
        console.log("🎫 Creating JWT token for user:", user.email);
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        console.log("📋 Creating session for user:", token.sub);
        session.user.id = token.sub!;
        session.user.role = token.role as "ADMIN" | "MEMBER";
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      // Clear any cached data on sign out
      console.log("👋 User signed out:", token?.sub);
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Redirect JWT errors to sign-in page
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
