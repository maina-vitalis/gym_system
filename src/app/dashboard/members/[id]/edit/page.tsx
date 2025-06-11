"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMember, useUpdateMember } from "@/hooks/use-members";
import {
  UpdateMemberFormData,
  updateMemberFormSchema,
} from "@/lib/validations/member";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const { data: member, isLoading, error } = useMember(memberId);
  const updateMemberMutation = useUpdateMember();

  const form = useForm<UpdateMemberFormData>({
    resolver: zodResolver(updateMemberFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      ageRange: "",
      gender: "",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      healthConditions: "",
      fitnessGoals: "",
      membershipStatus: "ACTIVE",
    },
  });

  // Update form when member data is loaded
  useEffect(() => {
    if (member) {
      form.reset({
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        email: member.user.email,
        phoneNumber: member.user.phoneNumber || "",
        ageRange:
          (member.ageRange as
            | ""
            | "18-25"
            | "26-35"
            | "36-45"
            | "46-55"
            | "56-65"
            | "66+"
            | undefined) || "",
        gender:
          (member.gender as
            | "Male"
            | "Female"
            | "Other"
            | "Prefer not to say"
            | "") || "",
        address: member.address || "",
        emergencyContactName: member.emergencyContactName || "",
        emergencyContactPhone: member.emergencyContactPhone || "",
        healthConditions: member.healthConditions || "",
        fitnessGoals: member.fitnessGoals || "",
        membershipStatus: member.membershipStatus as
          | "ACTIVE"
          | "INACTIVE"
          | "SUSPENDED"
          | "EXPIRED",
      });
    }
  }, [member, form]);

  const onSubmit = async (data: UpdateMemberFormData) => {
    try {
      await updateMemberMutation.mutateAsync({
        id: memberId,
        data,
      });
      router.push(`/dashboard/members/${memberId}`);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Form submission error:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/members/${memberId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Member
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Loading...</h1>
            <p className="text-muted-foreground">Loading member details...</p>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
            <p className=" text-red-600">
              The member you&apos;re trying to edit doesn&apos;t exist or has
              been deleted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/members/${memberId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Member
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Member: {member.user.firstName} {member.user.lastName}
          </h1>
          <p className="text-muted-foreground">
            Update member information and membership details
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic member details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Age Range
                        <span className="text-xs text-muted-foreground font-normal">
                          (Optional - for fitness planning)
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select your age range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="p-2 text-xs text-muted-foreground border-b">
                            Age ranges help us provide better fitness
                            recommendations
                          </div>
                          <SelectItem value="18-25" className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">18 – 25 years</span>
                              <span className="text-xs text-muted-foreground">
                                Young adult
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="26-35" className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">26 – 35 years</span>
                              <span className="text-xs text-muted-foreground">
                                Early career
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="36-45" className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">36 – 45 years</span>
                              <span className="text-xs text-muted-foreground">
                                Mid-career
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="46-55" className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">46 – 55 years</span>
                              <span className="text-xs text-muted-foreground">
                                Pre-retirement
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="56-65" className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">56 – 65 years</span>
                              <span className="text-xs text-muted-foreground">
                                Senior active
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="66+" className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">66+ years</span>
                              <span className="text-xs text-muted-foreground">
                                Golden years
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        📊 This information helps us tailor fitness programs and
                        recommendations to your age group
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full address"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Membership Status */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Status</CardTitle>
              <CardDescription>
                Current membership status and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="membershipStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="max-w-xs">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                Contact person in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter emergency contact name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter emergency contact phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Health & Fitness */}
          <Card>
            <CardHeader>
              <CardTitle>Health & Fitness Information</CardTitle>
              <CardDescription>
                Optional health conditions and fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="healthConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any health conditions, injuries, or medical concerns"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter member's fitness goals and objectives"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href={`/dashboard/members/${memberId}`}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateMemberMutation.isPending}>
              {updateMemberMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Member
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
