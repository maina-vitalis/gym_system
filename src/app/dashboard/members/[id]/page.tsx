"use client";

import { SubscriptionCountdown } from "@/components/subscription-countdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMember, useUpdateMemberStatus } from "@/hooks/use-members";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Crown,
  Edit,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MemberDetailPage() {
  const params = useParams();
  const memberId = params.id as string;

  const { data: member, isLoading, error } = useMember(memberId);
  const updateStatusMutation = useUpdateMemberStatus();
  const [currentSubscription, setCurrentSubscription] = useState<{
    id: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    membershipPlan: {
      id: string;
      name: string;
      duration: number;
      price: number;
      features: string[];
    };
    payment?: {
      id: string;
      amount: number;
      method: string;
      status: string;
      paidAt: string;
    };
  } | null>(null);

  // Fetch member's current subscription
  useEffect(() => {
    if (member) {
      fetch(`/api/members/${memberId}/subscriptions`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.currentSubscription) {
            setCurrentSubscription(data.data.currentSubscription);
          }
        })
        .catch(console.error);
    }
  }, [member, memberId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!member) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: member.id,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update member status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "expired":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDateTimeRequired = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Loading...</h1>
            <p className="text-muted-foreground">Loading member details...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Member Not Found</h1>
            <p className="text-red-600">
              The member you&apos;re looking for doesn&apos;t exist or has been
              deleted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src=""
                alt={`${member.user.firstName} ${member.user.lastName}`}
              />
              <AvatarFallback className="text-lg">
                {member.user.firstName[0]}
                {member.user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {member.user.firstName} {member.user.lastName}
              </h1>
              <p className="text-muted-foreground">
                Member since {formatDate(member.joinDate)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/members/${member.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Member
            </Button>
          </Link>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status and Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className={getStatusColor(member.membershipStatus)}
              >
                {member.membershipStatus}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Membership #: {member.membershipNumber}
              </span>
            </div>
            <div className="flex gap-2">
              {member.membershipStatus !== "ACTIVE" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("ACTIVE")}
                  disabled={updateStatusMutation.isPending}
                >
                  Activate
                </Button>
              )}
              {member.membershipStatus !== "SUSPENDED" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusChange("SUSPENDED")}
                  disabled={updateStatusMutation.isPending}
                >
                  Suspend
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.user.email}</span>
              </div>
              {member.user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.user.phoneNumber}</span>
                </div>
              )}
              {member.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.address}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Age Range</p>
                <p>{member.ageRange || "Not specified"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p>{member.gender || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            {member.emergencyContactName || member.emergencyContactPhone ? (
              <div className="space-y-3">
                {member.emergencyContactName && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contact Name
                    </p>
                    <p className="font-medium">{member.emergencyContactName}</p>
                  </div>
                )}
                {member.emergencyContactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {member.emergencyContactPhone}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No emergency contact information provided
              </p>
            )}
          </CardContent>
        </Card>

        {/* Membership Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membership Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Join Date</p>
                <p className="font-medium">{formatDate(member.joinDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Visit</p>
                <p className="font-medium">
                  {formatDateTime(member.lastVisit ?? null)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{formatDateTimeRequired(member.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{formatDateTimeRequired(member.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health & Fitness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Health & Fitness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Health Conditions
              </p>
              <p className="text-sm">
                {member.healthConditions || "No health conditions reported"}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Fitness Goals
              </p>
              <p className="text-sm">
                {member.fitnessGoals || "No fitness goals specified"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Subscription */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">
            Current Subscription
          </h2>
        </div>

        <SubscriptionCountdown
          subscription={currentSubscription}
          memberName={`${member.user.firstName} ${member.user.lastName}`}
          showDetails={true}
        />
      </div>
    </div>
  );
}
