CREATE TABLE `platform_admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text DEFAULT '' NOT NULL,
	`totp_secret` text,
	`totp_last_step` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`setup_token_hash` text,
	`setup_expires_at` integer,
	`last_login_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_admins_email_idx` ON `platform_admins` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `platform_admins_setup_token_idx` ON `platform_admins` (`setup_token_hash`);--> statement-breakpoint
CREATE TABLE `platform_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`mfa_passed_at` text,
	`ip` text,
	`user_agent` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `platform_admins`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_sessions_token_hash_idx` ON `platform_sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `platform_sessions_admin_idx` ON `platform_sessions` (`admin_id`);--> statement-breakpoint
ALTER TABLE `audit_log` ADD `actor_platform_admin_id` integer REFERENCES platform_admins(id) ON DELETE set null;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `ip` text;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `school_requests` ADD `status` text DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `school_requests` ADD `school_id` integer REFERENCES schools(id) ON DELETE set null;--> statement-breakpoint
ALTER TABLE `school_requests` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `school_settings` ADD `hidden_modules` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `school_settings` ADD `features` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `schools` ADD `status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `schools` ADD `plan` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `seat_limit` integer;--> statement-breakpoint
ALTER TABLE `schools` ADD `teacher_limit` integer;--> statement-breakpoint
ALTER TABLE `schools` ADD `class_limit` integer;--> statement-breakpoint
ALTER TABLE `schools` ADD `contract_ends_at` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `contact_name` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `contact_email` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `notes` text;