"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ClearSessionButton } from "./ui/clear-session-button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a JWT/authentication error
    const isAuthError =
      error.message?.includes("decryption") ||
      error.message?.includes("JWT") ||
      error.message?.includes("session") ||
      error.name?.includes("JWE");

    return {
      hasError: isAuthError,
      error: isAuthError ? error : undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Auth Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Session Error</CardTitle>
              <CardDescription>
                Your session has expired or become invalid. This can happen when
                security settings change.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <strong>What happened?</strong>
                <br />
                Your authentication token could not be decrypted, likely due to
                a security key change or expired session.
              </div>

              <div className="flex flex-col gap-2">
                <ClearSessionButton />
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                If the problem persists, please contact support.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
