CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`privilege` varchar(100),
	`section_id` int NOT NULL,
	`department_id` int NOT NULL,
	`working_day_id` int,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fingerprints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`date` date NOT NULL,
	`time_in` time,
	`time_out` time,
	CONSTRAINT `fingerprints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `time_allowances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`type` varchar(100),
	`reason` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `time_allowances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vacations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`date_start` date NOT NULL,
	`date_end` date NOT NULL,
	`type` varchar(100),
	`reason` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `vacations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `working_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`day` varchar(50) NOT NULL,
	`start_shift` time NOT NULL,
	`end_shift` time NOT NULL,
	CONSTRAINT `working_days_id` PRIMARY KEY(`id`)
);
