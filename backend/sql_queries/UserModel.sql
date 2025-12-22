-- 1. USER TABLE
CREATE TABLE `user` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Unique identifier, can be email or generated UUID',
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(150) NOT NULL COMMENT 'Hashed password',
  `login_type` VARCHAR(50) NOT NULL,
  `email_verified` TINYINT(4) DEFAULT 0,
  `email_verified_at` TIMESTAMP NULL,
  `last_login` TIMESTAMP NULL,
  `is_active` TINYINT(4) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='All the users are stored in this table';


-- 2. USER DETAIL TABLE
CREATE TABLE `user_detail` (
  `user_detail_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `phone` VARCHAR(20),
  `alternate_phone` VARCHAR(20),
  `country` VARCHAR(100),
  `date_of_birth` DATE,
  `gender` ENUM('male', 'female', 'other'),
  `profile_picture_url` VARCHAR(500),
  `bio` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(1) DEFAULT 0,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. ROLE TABLE
CREATE TABLE `role` (
  `role_id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(25) NOT NULL UNIQUE,
  `description` VARCHAR(100),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. PERMISSION TABLE
CREATE TABLE `permission` (
  `permission_id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(25) NOT NULL UNIQUE,
  `description` VARCHAR(100),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. FEATURE TABLE
CREATE TABLE `feature` (
  `feature_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL UNIQUE,
  `description` VARCHAR(100),
  `fk_id` INT DEFAULT 0 COMMENT 'Unique feature key identifier',
  `parent_id` INT NULL COMMENT 'Self-referencing for hierarchy',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`feature_id`),
  FOREIGN KEY (`parent_id`) REFERENCES `feature`(`feature_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. ORGANIZATION TABLE
CREATE TABLE `organization` (
  `organization_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('internal', 'brand', 'outsourced') NOT NULL,
  `parent_id` INT NULL COMMENT 'For organizational hierarchy',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`organization_id`),
  FOREIGN KEY (`parent_id`) REFERENCES `organization`(`organization_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. DEPARTMENT TABLE
CREATE TABLE `department` (
  `department_id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(25) NOT NULL UNIQUE,
  `description` VARCHAR(100),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 8. DESIGNATION TABLE
CREATE TABLE `designation` (
  `designation_id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(25) NOT NULL UNIQUE,
  `description` VARCHAR(100),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(),
  `created_by` INT,
  `updated_by` INT,
  `is_deleted` TINYINT(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`designation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. ROLE FEATURE PERMISSION TABLE (Junction table)
CREATE TABLE `role_feature_permission` (
  `role_id` VARCHAR(100) NOT NULL,
  `feature_id` INT NOT NULL,
  `permission_id` VARCHAR(10) NOT NULL,
  FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE CASCADE,
  FOREIGN KEY (`feature_id`) REFERENCES `feature`(`feature_id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permission`(`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ROLE Creation is Done : organization_id + department_id + designation_id 