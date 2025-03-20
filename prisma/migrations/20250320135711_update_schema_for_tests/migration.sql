-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_username_key" ON "test"("username");

-- CreateIndex
CREATE UNIQUE INDEX "test_discordId_key" ON "test"("discordId");
