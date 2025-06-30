"use client";

import EditMemberForm from "@/components/members/MemberUpdateForm";
import MemberFormSkeleton from "@/components/members/MemberUpdateSkeleton";
import { Button } from "@/components/ui/button";
import { useMember } from "@/hooks/use-members";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

function EditMemberPage({ params }: Props) {
  const { id: memberId } = use(params);

  const { data: member, isLoading, error } = useMember(memberId);

  // Loading state
  if (isLoading) {
    return <MemberFormSkeleton memberId={memberId} />;
  }

  // Error state
  if (error || !member) {
    return (
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center">
          <Link href="/dashboard/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Member Not Found
          </h1>
          <p className="text-red-600">
            The member you&apos;re trying to edit doesn&apos;t exist or has been
            deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditMemberForm member={member} memberId={memberId} />
    </div>
  );
}

export default EditMemberPage;
