-- CreateTable
CREATE TABLE "podnosnik" (
    "id" SERIAL NOT NULL,
    "nazwa" TEXT NOT NULL,
    "aktywny" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "podnosnik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rezerwacje" (
    "id" BIGSERIAL NOT NULL,
    "podnosnikid" INTEGER NOT NULL,
    "imie" TEXT NOT NULL,
    "nazwisko" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sposob_platnosci" TEXT NOT NULL,
    "od_ts" TIMESTAMPTZ NOT NULL,
    "do_ts" TIMESTAMPTZ NOT NULL,
    "uslugi_json" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "rezerwacje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "podnosnik_nazwa_key" ON "podnosnik"("nazwa");

-- CreateIndex
CREATE INDEX "rezerwacje_podnosnikid_idx" ON "rezerwacje"("podnosnikid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "rezerwacje" ADD CONSTRAINT "rezerwacje_podnosnikid_fkey" FOREIGN KEY ("podnosnikid") REFERENCES "podnosnik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
