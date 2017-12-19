# 

One Paragraph of project description goes here. Link to the live version of the app if it's hosted on Heroku.

## Built With

List technologies and frameworks here

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- List other prerequisites here


### Installing

Steps to get the development environment running.

```sql
CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` varchar NOT NULL,
    `password` varchar NOT NULL,
    `username` varchar NOT NULL UNIQUE,
    `role` varchar,
    `phone` INT,
    `confirmed` BOOLEAN NOT NULL DEFAULT 'false',
    PRIMARY KEY (`id`)
);

CREATE TABLE `post_shifts` (
    `date` DATE NOT NULL,
    `shift_id` INT NOT NULL AUTO_INCREMENT,
    `shift` varchar NOT NULL
    `shift_status` varchar DEFAULT 'open',
    `shift_comments` varchar,
    `created_by` INT NOT NULL,
    `urgent` BOOLEAN NOT NULL DEFAULT 'false',
    `adl` BOOLEAN DEFAULT 'false',
    `mhw` BOOLEAN DEFAULT 'false',
    `nurse` BOOLEAN DEFAULT 'false',
    `notify` varchar[],
    `filled` INT NOT NULL,
    `floor` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`shift_id`)
);

CREATE TABLE `shift_bids` (
    `shift_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `bid_id` INT NOT NULL AUTO_INCREMENT,
    `staff_comments` varchar,
    PRIMARY KEY (`bid_id`)
);

CREATE TABLE `confirmed` (
    `confirmed_id` INT NOT NULL AUTO_INCREMENT,
    `shift_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `shift_bid_id` INT NOT NULL,
    `confirmed_by_id` INT NOT NULL,
    PRIMARY KEY (`confirmed_id`)
);

CREATE TABLE `user_availability` (
    `user_id` BINARY NOT NULL,
    `availability_id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`availability_id`)
);

CREATE TABLE `shift_interest` (
    `shift_interest_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `day` DATE NOT NULL,
    `shift` VARCHAR(255) NOT NULL,
    `comment` VARCHAR(255),
    PRIMARY KEY (`shift_interest_id`)
);

CREATE TABLE `pay_period` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `start` DATE NOT NULL,
    `end` DATE NOT NULL,
    PRIMARY KEY (`id`)
);

ALTER TABLE `post_shifts` ADD CONSTRAINT `post_shifts_fk0` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`);

ALTER TABLE `post_shifts` ADD CONSTRAINT `post_shifts_fk1` FOREIGN KEY (`filled`) REFERENCES `users`(`id`);

ALTER TABLE `shift_bids` ADD CONSTRAINT `shift_bids_fk0` FOREIGN KEY (`shift_id`) REFERENCES `post_shifts`(`shift_id`);

ALTER TABLE `shift_bids` ADD CONSTRAINT `shift_bids_fk1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

ALTER TABLE `confirmed` ADD CONSTRAINT `confirmed_fk0` FOREIGN KEY (`shift_id`) REFERENCES `post_shifts`(`shift_id`);

ALTER TABLE `confirmed` ADD CONSTRAINT `confirmed_fk1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

ALTER TABLE `confirmed` ADD CONSTRAINT `confirmed_fk2` FOREIGN KEY (`shift_bid_id`) REFERENCES `shift_bids`(`bid_id`);

ALTER TABLE `confirmed` ADD CONSTRAINT `confirmed_fk3` FOREIGN KEY (`confirmed_by_id`) REFERENCES `users`(`id`);

ALTER TABLE `user_availability` ADD CONSTRAINT `user_availability_fk0` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);

ALTER TABLE `shift_interest` ADD CONSTRAINT `shift_interest_fk0` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
```

## Screen Shot

Include one or two screen shots of your project here (optional). Remove if unused.

## Documentation

Link to a read-only version of your scope document or other relevant documentation here (optional). Remove if unused.

### Completed Features

High level list of items completed.

- [x] Feature a
- [x] Feature b

### Next Steps

Features that you would like to add at some point in the future.

- [ ] Feature c

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

* Name of author(s)


## Acknowledgments

* Hat tip to anyone who's code was used
