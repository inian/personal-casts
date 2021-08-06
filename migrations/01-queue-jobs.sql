-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."queue-jobs" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "video_url" text,
    "type" text DEFAULT 'video'::text,
    "owner" uuid,
    PRIMARY KEY ("id")
);

-- Column Comment
COMMENT ON COLUMN "public"."queue-jobs"."type" IS 'type of podcast item (video | audio)';
COMMENT ON COLUMN "public"."queue-jobs"."owner" IS 'who queued the job';

-- Table Comment
COMMENT ON TABLE "public"."queue-jobs" IS 'table to queue podcast jobs';

ALTER TABLE "public"."queue-jobs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable queuing jobs based on user_id" ON "public"."queue-jobs" FOR INSERT WITH CHECK (auth.uid() = owner);