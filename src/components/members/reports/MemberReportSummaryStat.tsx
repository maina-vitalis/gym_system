import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberPaymentReport } from "@/types";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface MemberReportSummaryStatProps {
  //TODO come back and generate correct type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reportData: any;
  formatCurrency: (amount: number) => string;
  getMonthName: (month: number) => string;
  reportParams: {
    year: number;
    month: number;
  };
}

function MemberReportSummaryStat({
  formatCurrency,
  getMonthName,
  reportData,
  reportParams,
}: MemberReportSummaryStatProps) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                (reportData.data as MemberPaymentReport).monthly.totalAmount
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {getMonthName(reportParams.month)} {reportParams.year}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Transactions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (reportData.data as MemberPaymentReport).monthly
                  .totalTransactions
              }
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lifetime Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                (reportData.data as MemberPaymentReport).overall.totalPaid
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (reportData.data as MemberPaymentReport).overall
                  .totalTransactions
              }
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MemberReportSummaryStat;
