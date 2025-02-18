CREATE TABLE `requests` (
	`submit_id` serial AUTO_INCREMENT NOT NULL,  -- Changed `id` to `submit_id`
	`submitter` varchar(255) NOT NULL,           -- Changed `title` to `submitter`
	`request_type` varchar(50) DEFAULT 'service', -- Added `request_type` column
	`priority` varchar(50) DEFAULT 'unassigned',  -- Added `priority` column
	`status` varchar(50) DEFAULT 'new',          -- Same `status` column
	`created_at` timestamp DEFAULT now(),        -- Same `created_at` column
	`changed_at` timestamp DEFAULT now(),        -- Added `changed_at` column
	`details` text,                              -- Added `details` column (instead of `description`)
	`phone` varchar(255),                        -- Added `phone` column
	`requestTitle` varchar(255) NOT NULL,
	CONSTRAINT `requests_id` PRIMARY KEY(`submit_id`)  -- Primary key on `submit_id`
);

--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`password_hash` varchar(255),
	`provider` varchar(50) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`role` varchar(50) DEFAULT 'external',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_provider_id_unique` UNIQUE(`provider_id`)
);
--> statement-breakpoint
ALTER TABLE `requests` ADD CONSTRAINT `requests_assigned_to_users_id_fk` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `requests` ADD CONSTRAINT `requests_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;