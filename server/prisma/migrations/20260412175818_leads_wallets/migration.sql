-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('draft', 'submitted', 'matching', 'contact_limit_open', 'contact_limit_reached', 'quotes_received', 'hired', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "LeadPurchaseStatus" AS ENUM ('pending', 'paid', 'unlocked', 'rejected_limit_reached');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('recharge', 'lead_purchase', 'refund');

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "urgency" "UrgencyLevel" NOT NULL DEFAULT 'low',
    "preferredDate" TIMESTAMP(3),
    "status" "RequestStatus" NOT NULL DEFAULT 'draft',
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "purchaseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadPurchase" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "creditsCost" DOUBLE PRECISION NOT NULL,
    "status" "LeadPurchaseStatus" NOT NULL DEFAULT 'unlocked',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadPurchase_requestId_professionalId_key" ON "LeadPurchase"("requestId", "professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_professionalId_key" ON "Wallet"("professionalId");

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPurchase" ADD CONSTRAINT "LeadPurchase_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadPurchase" ADD CONSTRAINT "LeadPurchase_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
