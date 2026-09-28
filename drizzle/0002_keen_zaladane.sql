CREATE TABLE `chapter_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`subject` text NOT NULL,
	`chapter_slug` text NOT NULL,
	`topics_total` integer DEFAULT 0 NOT NULL,
	`topics_completed` integer DEFAULT 0 NOT NULL,
	`marks_awarded` real DEFAULT 0 NOT NULL,
	`marks_possible` real DEFAULT 0 NOT NULL,
	`last_active_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chapter_progress_unique_idx` ON `chapter_progress` (`student_id`,`subject`,`chapter_slug`);--> statement-breakpoint
CREATE INDEX `chapter_progress_student_idx` ON `chapter_progress` (`student_id`);--> statement-breakpoint
CREATE TABLE `guardian_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guardian_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`guardian_id`) REFERENCES `guardians`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guardian_sessions_token_idx` ON `guardian_sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `guardian_sessions_guardian_idx` ON `guardian_sessions` (`guardian_id`);--> statement-breakpoint
CREATE TABLE `guardian_students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guardian_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`relationship` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`guardian_id`) REFERENCES `guardians`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guardian_student_idx` ON `guardian_students` (`guardian_id`,`student_id`);--> statement-breakpoint
CREATE INDEX `guardian_students_student_idx` ON `guardian_students` (`student_id`);--> statement-breakpoint
CREATE TABLE `guardians` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`school_id` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guardians_email_idx` ON `guardians` (`email`);--> statement-breakpoint
CREATE TABLE `question_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`question_id` text NOT NULL,
	`subject` text NOT NULL,
	`chapter_slug` text NOT NULL,
	`topic_slug` text NOT NULL,
	`chosen` text NOT NULL,
	`is_correct` integer NOT NULL,
	`marks_awarded` real DEFAULT 0 NOT NULL,
	`marks_possible` real DEFAULT 1 NOT NULL,
	`time_taken_ms` integer,
	`hints_used` integer DEFAULT 0 NOT NULL,
	`answered_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attempt_student_question_idx` ON `question_attempts` (`student_id`,`question_id`);--> statement-breakpoint
CREATE INDEX `attempt_student_topic_idx` ON `question_attempts` (`student_id`,`chapter_slug`,`topic_slug`);--> statement-breakpoint
CREATE INDEX `attempt_question_idx` ON `question_attempts` (`question_id`);--> statement-breakpoint
CREATE INDEX `attempt_answered_at_idx` ON `question_attempts` (`answered_at`);--> statement-breakpoint
CREATE TABLE `report_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`term` text NOT NULL,
	`payload` text NOT NULL,
	`marks_awarded` real DEFAULT 0 NOT NULL,
	`marks_possible` real DEFAULT 0 NOT NULL,
	`issued_by_teacher_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`published_at` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`issued_by_teacher_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `report_student_term_idx` ON `report_cards` (`student_id`,`term`);--> statement-breakpoint
CREATE INDEX `report_student_idx` ON `report_cards` (`student_id`);--> statement-breakpoint
CREATE TABLE `topic_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`subject` text NOT NULL,
	`chapter_slug` text NOT NULL,
	`topic_slug` text NOT NULL,
	`questions_total` integer DEFAULT 0 NOT NULL,
	`questions_attempted` integer DEFAULT 0 NOT NULL,
	`questions_correct` integer DEFAULT 0 NOT NULL,
	`marks_awarded` real DEFAULT 0 NOT NULL,
	`marks_possible` real DEFAULT 0 NOT NULL,
	`video_seconds_watched` integer DEFAULT 0 NOT NULL,
	`recap_completed` integer DEFAULT 0 NOT NULL,
	`examples_viewed` integer DEFAULT 0 NOT NULL,
	`first_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_active_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topic_progress_unique_idx` ON `topic_progress` (`student_id`,`subject`,`chapter_slug`,`topic_slug`);--> statement-breakpoint
CREATE INDEX `topic_progress_student_idx` ON `topic_progress` (`student_id`);--> statement-breakpoint
CREATE INDEX `topic_progress_chapter_idx` ON `topic_progress` (`chapter_slug`,`topic_slug`);