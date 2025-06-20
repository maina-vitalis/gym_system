import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MemberPaymentReport } from "@/types";
import { JSX } from "react/jsx-runtime";

interface MemberReportInfoProps {
  //TODO fix the type error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reportData: any;
  getStatusBadge: (status: string) => JSX.Element;
}

function MemberReportInfo({
  reportData,
  getStatusBadge,
}: MemberReportInfoProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm text-muted-foreground">
                {(reportData.data as MemberPaymentReport).member.name}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">
                {(reportData.data as MemberPaymentReport).member.email}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Membership Number</Label>
              <p className="text-sm text-muted-foreground font-mono">
                {
                  (reportData.data as MemberPaymentReport).member
                    .membershipNumber
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                {getStatusBadge(
                  (reportData.data as MemberPaymentReport).member
                    .membershipStatus
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Join Date</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(
                  (reportData.data as MemberPaymentReport).member.joinDate
                ).toLocaleDateString()}
              </p>
            </div>
            {(reportData.data as MemberPaymentReport).member.phoneNumber && (
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-muted-foreground">
                  {(reportData.data as MemberPaymentReport).member.phoneNumber}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MemberReportInfo;
