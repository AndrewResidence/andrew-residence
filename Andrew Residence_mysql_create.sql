CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" varchar,
	"phone" integer,
	CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "post_shifts" (
	"date" DATE NOT NULL,
	"shift_id" serial NOT NULL,
	"role" serial NOT NULL,
	"shift" serial NOT NULL,
	"shift_status" serial NOT NULL,
	"shift_comments" varchar NOT NULL,
	"created_by" integer NOT NULL,
	"urgent" BOOLEAN NOT NULL,
	CONSTRAINT post_shifts_pk PRIMARY KEY ("shift_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "shift_bids" (
	"shift_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"bid_id" serial NOT NULL,
	"staff_comments" varchar NOT NULL,
	CONSTRAINT shift_bids_pk PRIMARY KEY ("bid_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "confirmed" (
	"confirmed_id" serial NOT NULL,
	"shift_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"shift_bid_id" integer NOT NULL,
	"confirmed_by_id" integer NOT NULL,
	CONSTRAINT confirmed_pk PRIMARY KEY ("confirmed_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_availability" (
	"user_id" integer NOT NULL,
	"availability_id" serial NOT NULL,
	CONSTRAINT user_availability_pk PRIMARY KEY ("availability_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "shift_interest" (
	"shift_interest_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"day" DATE NOT NULL,
	"shift" VARCHAR(255) NOT NULL,
	"comment" VARCHAR(255) NOT NULL,
	CONSTRAINT shift_interest_pk PRIMARY KEY ("shift_interest_id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "post_shifts" ADD CONSTRAINT "post_shifts_fk0" FOREIGN KEY ("created_by") REFERENCES "users"("id");

ALTER TABLE "shift_bids" ADD CONSTRAINT "shift_bids_fk0" FOREIGN KEY ("shift_id") REFERENCES "post_shifts"("shift_id");
ALTER TABLE "shift_bids" ADD CONSTRAINT "shift_bids_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "confirmed" ADD CONSTRAINT "confirmed_fk0" FOREIGN KEY ("shift_id") REFERENCES "post_shifts"("shift_id");
ALTER TABLE "confirmed" ADD CONSTRAINT "confirmed_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "confirmed" ADD CONSTRAINT "confirmed_fk2" FOREIGN KEY ("shift_bid_id") REFERENCES "shift_bids"("bid_id");
ALTER TABLE "confirmed" ADD CONSTRAINT "confirmed_fk3" FOREIGN KEY ("confirmed_by_id") REFERENCES "users"("id");

ALTER TABLE "user_availability" ADD CONSTRAINT "user_availability_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "shift_interest" ADD CONSTRAINT "shift_interest_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");