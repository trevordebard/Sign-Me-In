CREATE EXTENSION "uuid-ossp";

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "room_code" VARCHAR(10) NOT NULL,
    "fields" TEXT[],
    "created_at" TIMESTAMP(6) DEFAULT timezone('utc'::text, now()),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "room_code" VARCHAR(10),
    "first_name" TEXT,
    "last_name" TEXT,
    "data" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT timezone('utc'::text, now()),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms.room_code_unique" ON "rooms"("room_code");

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("room_code") REFERENCES "rooms"("room_code") ON DELETE SET NULL ON UPDATE CASCADE;
