CREATE TABLE `assignment_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assignment_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`answers` text NOT NULL,
	`grades` text NOT NULL,
	`feedback` text DEFAULT '' NOT NULL,
	`submitted_at` integer NOT NULL,
	`graded_at` integer,
	`graded_by` integer,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`graded_by`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `submission_assignment_student_idx` ON `assignment_submissions` (`assignment_id`,`student_id`);--> statement-breakpoint
CREATE TABLE `school_settings` (
	`school_id` integer PRIMARY KEY NOT NULL,
	`grades` text NOT NULL,
	`subjects` text NOT NULL,
	FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP INDEX `students_class_roll_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `students_school_class_roll_idx` ON `students` (`school_id`,`class_name`,`roll_no`);--> statement-breakpoint
ALTER TABLE `assignments` ADD `questions` text DEFAULT '[]' NOT NULL;