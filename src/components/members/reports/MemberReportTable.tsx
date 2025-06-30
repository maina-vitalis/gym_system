import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemberPaymentReport } from "@/types";
import { Calendar } from "lucide-react";

interface MemberReportTableProps {
  selectedMember: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    membershipNumber: string;
    membershipStatus: string;
  } | null;
  getMonthName: (month: number) => string;
  reportParams: {
    year: number;
    month: number;
  };
  //TODO get the correct type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reportData: any;
  formatCurrency: (amount: number) => string;
}

function MemberReportTable({
  getMonthName,
  selectedMember,
  reportParams,
  reportData,
  formatCurrency,
}: MemberReportTableProps) {
  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            {selectedMember?.firstName} {selectedMember?.lastName}&apos;s
            payments for {getMonthName(reportParams.month)} {reportParams.year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(reportData.data as MemberPaymentReport).monthly.payments.length >
          0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(
                    reportData.data as MemberPaymentReport
                  ).monthly.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.method.toLowerCase().replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        {payment.description || payment.plan || "-"}
                      </TableCell>
                      <TableCell>
                        {payment.paidAt ? formatDate(payment.paidAt) : "-"}
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted rounded px-1 py-0.5 text-sm">
                          {payment.transactionRef || "-"}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No Payments Found</h3>
              <p className="text-muted-foreground">
                No payments were made by this member in{" "}
                {getMonthName(reportParams.month)} {reportParams.year}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MemberReportTable;
