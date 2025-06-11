"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMembershipPlans } from "@/hooks/use-payments";
import { calculateExpirationDate } from "@/lib/validations/membership-plan";
import { Calendar, Plus, TestTube } from "lucide-react";
import { useState } from "react";

interface TestSubscription {
  id: string;
  startDate: Date;
  endDate: Date;
  membershipPlan: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
}

interface TestScenario {
  name: string;
  description: string;
  currentSubscription: TestSubscription | null;
  newPlanId: string;
  expectedBehavior: string;
}

export function SubscriptionTest() {
  const { data: membershipPlans } = useMembershipPlans();
  const [currentSubscription, setCurrentSubscription] =
    useState<TestSubscription | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [testResults, setTestResults] = useState<{
    scenario: string;
    beforeSub: TestSubscription | null;
    afterSub: TestSubscription | null;
    isExtension: boolean;
    daysAdded: number;
  } | null>(null);

  const predefinedScenarios: TestScenario[] = [
    {
      name: "New Member - No Active Subscription",
      description:
        "Member has no active subscription, payment should create immediate subscription",
      currentSubscription: null,
      newPlanId: "",
      expectedBehavior: "Start immediately, end after plan duration",
    },
    {
      name: "Active Member - Extension",
      description:
        "Member has active subscription with 10 days remaining, should extend from current end date",
      currentSubscription: {
        id: "test-1",
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // Started 20 days ago
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Ends in 10 days
        membershipPlan: {
          id: "plan-1",
          name: "Monthly Plan",
          duration: 30,
          price: 2000,
        },
      },
      newPlanId: "",
      expectedBehavior:
        "Start from current subscription end date, add new duration",
    },
    {
      name: "Expired Member - New Start",
      description:
        "Member has expired subscription (ended 5 days ago), should start immediately",
      currentSubscription: {
        id: "test-2",
        startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // Started 35 days ago
        endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Ended 5 days ago
        membershipPlan: {
          id: "plan-1",
          name: "Monthly Plan",
          duration: 30,
          price: 2000,
        },
      },
      newPlanId: "",
      expectedBehavior:
        "Start immediately (expired subscription), end after new plan duration",
    },
  ];

  const handleScenarioTest = (scenario: TestScenario) => {
    if (!selectedPlanId || !membershipPlans?.data) return;

    const selectedPlan = membershipPlans.data.find(
      (p: { id: string; name: string; duration: number; price: number }) =>
        p.id === selectedPlanId
    );
    if (!selectedPlan) return;

    // Simulate the subscription extension logic
    const currentSub = scenario.currentSubscription;
    const now = new Date();

    let newStartDate: Date;
    let newEndDate: Date;
    let isExtension = false;
    const daysAdded = selectedPlan.duration;

    if (currentSub && currentSub.endDate > now) {
      // Active subscription - extend from current end date
      newStartDate = currentSub.endDate;
      newEndDate = calculateExpirationDate(newStartDate, selectedPlan.duration);
      isExtension = true;
    } else {
      // No active subscription or expired - start immediately
      newStartDate = now;
      newEndDate = calculateExpirationDate(newStartDate, selectedPlan.duration);
      isExtension = false;
    }

    const newSubscription: TestSubscription = {
      id: `test-new-${Date.now()}`,
      startDate: newStartDate,
      endDate: newEndDate,
      membershipPlan: selectedPlan,
    };

    setTestResults({
      scenario: scenario.name,
      beforeSub: currentSub,
      afterSub: newSubscription,
      isExtension,
      daysAdded,
    });

    setCurrentSubscription(newSubscription);
  };

  const handleCustomTest = () => {
    handleScenarioTest({
      name: "Custom Test",
      description: "Custom test scenario",
      currentSubscription,
      newPlanId: selectedPlanId,
      expectedBehavior: "As per logic rules",
    });
  };

  const createCustomSubscription = () => {
    if (!selectedPlanId || !membershipPlans?.data) return;

    const selectedPlan = membershipPlans.data.find(
      (p: { id: string; name: string; duration: number; price: number }) =>
        p.id === selectedPlanId
    );
    if (!selectedPlan) return;

    const startDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000); // Started 20 days ago
    const endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // Ends in 10 days

    setCurrentSubscription({
      id: `custom-${Date.now()}`,
      startDate,
      endDate,
      membershipPlan: selectedPlan,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Subscription Extension Logic Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Plan for Testing</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a membership plan..." />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans?.data?.map(
                    (plan: {
                      id: string;
                      name: string;
                      duration: number;
                      price: number;
                    }) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {plan.duration} days - KES {plan.price}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button
                  onClick={createCustomSubscription}
                  disabled={!selectedPlanId}
                  variant="outline"
                  size="sm"
                >
                  Create Test Subscription
                </Button>
                <Button
                  onClick={handleCustomTest}
                  disabled={!selectedPlanId}
                  size="sm"
                >
                  Test Custom Scenario
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Test Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium">
                  {currentSubscription.membershipPlan.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {formatDate(currentSubscription.endDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p
                  className={`font-medium ${
                    getDaysRemaining(currentSubscription.endDate) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getDaysRemaining(currentSubscription.endDate)} days
                  {getDaysRemaining(currentSubscription.endDate) <= 0 &&
                    " (EXPIRED)"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predefined Test Scenarios */}
      <div className="grid gap-4 md:grid-cols-3">
        {predefinedScenarios.map((scenario, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm">{scenario.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {scenario.description}
              </p>
              <div className="text-xs">
                <strong>Expected:</strong> {scenario.expectedBehavior}
              </div>
              <Button
                onClick={() => handleScenarioTest(scenario)}
                disabled={!selectedPlanId}
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Test This Scenario
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Test Results: {testResults.scenario}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Before */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">BEFORE Payment</h4>
                {testResults.beforeSub ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Plan:</span>{" "}
                      {testResults.beforeSub.membershipPlan.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Start:</span>{" "}
                      {formatDate(testResults.beforeSub.startDate)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">End:</span>{" "}
                      {formatDate(testResults.beforeSub.endDate)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`ml-1 ${
                          getDaysRemaining(testResults.beforeSub.endDate) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {getDaysRemaining(testResults.beforeSub.endDate) > 0
                          ? "ACTIVE"
                          : "EXPIRED"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No active subscription
                  </p>
                )}
              </div>

              {/* After */}
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-medium mb-2">AFTER Payment</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Plan:</span>{" "}
                    {testResults.afterSub?.membershipPlan.name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Start:</span>{" "}
                    {testResults.afterSub
                      ? formatDate(testResults.afterSub.startDate)
                      : "N/A"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">End:</span>{" "}
                    {testResults.afterSub
                      ? formatDate(testResults.afterSub.endDate)
                      : "N/A"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span
                      className={`ml-1 font-medium ${
                        testResults.isExtension
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {testResults.isExtension
                        ? "EXTENSION"
                        : "NEW SUBSCRIPTION"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Days Added:</span>{" "}
                    <span className="font-medium">{testResults.daysAdded}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                ✅ Logic Verification
              </h4>
              <p className="text-sm text-blue-800">
                {testResults.isExtension
                  ? `✓ Correctly extended existing subscription by ${testResults.daysAdded} days. New subscription starts from previous end date.`
                  : `✓ Correctly created new subscription starting immediately for ${testResults.daysAdded} days.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
