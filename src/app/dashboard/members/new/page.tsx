"use client";

import { MemberRegistrationForm } from "@/components/members";
import { Button } from "@/components/ui/button";
import { useCreateMember } from "@/hooks/use-members";
import { MemberFormData } from "@/lib/validations/member";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewMemberPage() {
  const router = useRouter();
  const createMemberMutation = useCreateMember();

  const handleSubmit = async (data: MemberFormData) => {
    await createMemberMutation.mutateAsync(data);
    router.push("/dashboard/members");
  };

  const handleCancel = () => {
    router.push("/dashboard/members");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/members">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
          <p className="text-muted-foreground">
            Register a new gym member with their personal details
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <MemberRegistrationForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createMemberMutation.isPending}
        submitButtonText="Create Member"
        showCancelButton={true}
      />
    </div>
  );
}
