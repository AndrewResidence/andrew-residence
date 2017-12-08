CREATE TABLE `Users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar NOT NULL,
	`username` varchar NOT NULL UNIQUE,
	`password` varchar NOT NULL,
	`email` varchar NOT NULL,
	`role` varchar NOT NULL,
	`phone` INT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Posted Shifts` (
	`date` DATE NOT NULL,
	`shift_id` INT NOT NULL AUTO_INCREMENT,
	`role` varchar NOT NULL AUTO_INCREMENT,
	`shift` varchar NOT NULL AUTO_INCREMENT,
	`shift_status` varchar NOT NULL AUTO_INCREMENT,
	`shift_comments` varchar NOT NULL,
	`created_by` INT NOT NULL,
	`urgent` BOOLEAN NOT NULL,
	PRIMARY KEY (`shift_id`)
);

CREATE TABLE `Shift Bids` (
	`shift_id` INT NOT NULL,
	`user_id` INT NOT NULL,
	`bid_id` INT NOT NULL AUTO_INCREMENT,
	`staff_comments` varchar NOT NULL,
	PRIMARY KEY (`bid_id`)
);

CREATE TABLE `Confirmed` (
	`confirmed_id` INT NOT NULL AUTO_INCREMENT,
	`shift_id` INT NOT NULL,
	`user_id` INT NOT NULL,
	`shift_bid_id` INT NOT NULL,
	`confirmed_by_id` INT NOT NULL,
	PRIMARY KEY (`confirmed_id`)
);

ALTER TABLE `Posted Shifts` ADD CONSTRAINT `Posted Shifts_fk0` FOREIGN KEY (`created_by`) REFERENCES `Users`(`id`);

ALTER TABLE `Shift Bids` ADD CONSTRAINT `Shift Bids_fk0` FOREIGN KEY (`shift_id`) REFERENCES `Posted Shifts`(`shift_id`);

ALTER TABLE `Shift Bids` ADD CONSTRAINT `Shift Bids_fk1` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`);

ALTER TABLE `Confirmed` ADD CONSTRAINT `Confirmed_fk0` FOREIGN KEY (`shift_id`) REFERENCES `Posted Shifts`(`shift_id`);

ALTER TABLE `Confirmed` ADD CONSTRAINT `Confirmed_fk1` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`);

ALTER TABLE `Confirmed` ADD CONSTRAINT `Confirmed_fk2` FOREIGN KEY (`shift_bid_id`) REFERENCES `Shift Bids`(`bid_id`);

ALTER TABLE `Confirmed` ADD CONSTRAINT `Confirmed_fk3` FOREIGN KEY (`confirmed_by_id`) REFERENCES `Users`(`id`);

