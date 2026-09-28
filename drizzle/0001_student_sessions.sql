CREATE TABLE `student_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip` text,
	`user_agent` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `student_sessions_token_hash_idx` ON `student_sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `student_sessions_student_idx` ON `student_sessions` (`student_id`);