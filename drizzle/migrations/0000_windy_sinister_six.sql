CREATE TABLE `department` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`sectionId` int,
	CONSTRAINT `department_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`privilege` varchar(191) NOT NULL,
	`sectionId` int NOT NULL,
	`departmentId` int NOT NULL,
	CONSTRAINT `employee_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `infosystem` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`description` text,
	`userId` int NOT NULL,
	CONSTRAINT `infosystem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `section_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeallowenc` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`startTime` time NOT NULL,
	`endTime` time NOT NULL,
	`type` varchar(100) DEFAULT '',
	`reason` text,
	`createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
	`employeeId` int NOT NULL,
	CONSTRAINT `timeallowenc_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'user',
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vacation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`dateStart` date NOT NULL,
	`dateEnd` date NOT NULL,
	`type` varchar(100) DEFAULT '',
	`reason` text,
	`createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `vacation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workingdays` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`day` varchar(50) NOT NULL,
	`startshift` time NOT NULL,
	`endshift` time NOT NULL,
	`employeeId` int NOT NULL,
	CONSTRAINT `workingdays_id` PRIMARY KEY(`id`)
);
