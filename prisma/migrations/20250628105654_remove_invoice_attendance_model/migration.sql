/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `attendances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_memberId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_memberId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_membershipPlanId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_userId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_invoiceId_fkey";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "invoiceId";

-- DropTable
DROP TABLE "attendances";

-- DropTable
DROP TABLE "invoices";

-- DropEnum
DROP TYPE "AttendanceType";

-- DropEnum
DROP TYPE "InvoiceStatus";
