CREATE SEQUENCE confirmed_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE confirmed (
    confirmed_id integer DEFAULT nextval('confirmed_id_seq'::regclass) NOT NULL,
    shift_id integer NOT NULL,
    user_id integer NOT NULL,
    shift_bid_id integer,
    confirmed_by_id integer NOT NULL
);

CREATE SEQUENCE notifications_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE notifications (
    notification_id integer DEFAULT nextval('notifications_notification_id_seq'::regclass) NOT NULL,
    headline character varying,
    message character varying,
    date date DEFAULT now(),
    posted_by integer
);

CREATE SEQUENCE pay_period_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE pay_period (
    id integer DEFAULT nextval('pay_period_id_seq'::regclass) NOT NULL,
    start date,
    "end" date
);

CREATE SEQUENCE post_shifts_shift_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE post_shifts (
    shift_id integer DEFAULT nextval('post_shifts_shift_id_seq'::regclass) NOT NULL,
    shift character varying,
    shift_status character varying,
    shift_comments character varying,
    created_by integer,
    urgent boolean DEFAULT false,
    adl boolean DEFAULT false,
    mhw boolean DEFAULT false,
    nurse boolean DEFAULT false,
    date date NOT NULL,
    notify character varying[],
    floor character varying,
    filled integer
);

CREATE SEQUENCE shift_bids_bid_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE shift_bids (
    bid_id integer DEFAULT nextval('shift_bids_bid_id_seq'::regclass) NOT NULL,
    shift_id integer NOT NULL,
    user_id integer,
    staff_comments character varying
);

CREATE VIEW user_shifts AS
(
         SELECT shift_bids.user_id,
            shift_bids.shift_id,
            'pending'::text AS shift_state
           FROM shift_bids
        UNION
         SELECT confirmed.user_id,
            confirmed.shift_id,
            'confirmed'::text AS shift_state
           FROM confirmed
) EXCEPT
 SELECT confirmed.user_id,
    confirmed.shift_id,
    'pending'::text AS shift_state
   FROM confirmed;


CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE users (
    id integer DEFAULT nextval('users_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    password character varying NOT NULL,
    username character varying NOT NULL,
    role character varying,
    confirmed boolean DEFAULT false NOT NULL,
    phone character varying,
    code character varying DEFAULT false
);



ALTER TABLE ONLY confirmed
    ADD CONSTRAINT confirmed_pkey PRIMARY KEY (confirmed_id);

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);

ALTER TABLE ONLY pay_period
    ADD CONSTRAINT pay_periods_pkey PRIMARY KEY (id);

ALTER TABLE ONLY post_shifts
    ADD CONSTRAINT post_shifts_pkey PRIMARY KEY (shift_id);

ALTER TABLE ONLY shift_bids
    ADD CONSTRAINT shift_bids_pkey PRIMARY KEY (bid_id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_username_key UNIQUE (username);

ALTER TABLE ONLY confirmed
    ADD CONSTRAINT confirmed_confirmed_by_id_fkey FOREIGN KEY (confirmed_by_id) REFERENCES users(id);

ALTER TABLE ONLY confirmed
    ADD CONSTRAINT confirmed_shift_bid_id_fkey FOREIGN KEY (shift_bid_id) REFERENCES shift_bids(bid_id);

ALTER TABLE ONLY confirmed
    ADD CONSTRAINT confirmed_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES post_shifts(shift_id);

ALTER TABLE ONLY confirmed
    ADD CONSTRAINT confirmed_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES users(id);

ALTER TABLE ONLY post_shifts
    ADD CONSTRAINT post_shifts_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE ONLY post_shifts
    ADD CONSTRAINT post_shifts_filled_fkey FOREIGN KEY (filled) REFERENCES users(id);

ALTER TABLE ONLY shift_bids
    ADD CONSTRAINT shift_bids_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES post_shifts(shift_id);

ALTER TABLE ONLY shift_bids
    ADD CONSTRAINT shift_bids_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


