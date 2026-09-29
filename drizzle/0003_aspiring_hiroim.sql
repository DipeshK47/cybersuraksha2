CREATE TABLE `assignment_students` (
	`assignment_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`read_at` integer,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assignment_student_unique_idx` ON `assignment_students` (`assignment_id`,`student_id`);--> statement-breakpoint
CREATE INDEX `assignment_student_inbox_idx` ON `assignment_students` (`student_id`);--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`school_id` integer NOT NULL,
	`teacher_id` integer NOT NULL,
	`class_id` integer NOT NULL,
	`title` text NOT NULL,
	`instructions` text DEFAULT '' NOT NULL,
	`module_ids` text NOT NULL,
	`due_at` integer NOT NULL,
	`total_marks` real NOT NULL,
	`created_at` integer NOT NULL,
	`published_at` integer,
	FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `assignment_class_idx` ON `assignments` (`class_id`);--> statement-breakpoint
CREATE TABLE `learning_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` integer NOT NULL,
	`module_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`last_active_at` integer NOT NULL,
	`completed_at` integer,
	`score` real,
	`legacy` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `learning_attempt_student_module_idx` ON `learning_attempts` (`student_id`,`module_id`);--> statement-breakpoint
CREATE TABLE `learning_events` (
	`id` text PRIMARY KEY NOT NULL,
	`attempt_id` text NOT NULL,
	`type` text NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`attempt_id`) REFERENCES `learning_attempts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `learning_events_attempt_idx` ON `learning_events` (`attempt_id`);--> statement-breakpoint
INSERT OR IGNORE INTO learning_attempts (id, student_id, module_id, started_at, last_active_at, completed_at, score, legacy)
SELECT 'legacy:' || id, student_id, module_id,
COALESCE(CAST(strftime('%s', started_at) AS INTEGER) * 1000, CAST(strftime('%s', completed_at) AS INTEGER) * 1000),
CAST(strftime('%s', completed_at) AS INTEGER) * 1000,
CASE WHEN status = 'completed' THEN CAST(strftime('%s', completed_at) AS INTEGER) * 1000 ELSE NULL END,
CASE WHEN status = 'completed' THEN (drill + recall) / 2.0 ELSE NULL END, 1 FROM runs;
