-- CreateTable
CREATE TABLE "GameEntity" (
    "id" TEXT NOT NULL,
    "glitchedCode" JSONB NOT NULL,
    "fixedCode" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEntity_pkey" PRIMARY KEY ("id")
);
