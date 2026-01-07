-- 9. ROLE FEATURE PERMISSION TABLE (Junction table)
CREATE TABLE `role_feature_permission` (
  `role_id` varchar(100) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `permission_id` varchar(10) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  KEY `role_id` (`role_id`),
  KEY `feature_id` (`feature_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_feature_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `role_feature_permission_ibfk_2` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`feature_id`) ON DELETE CASCADE,
  CONSTRAINT `role_feature_permission_ibfk_3` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ROLE Creation is Done : organization_id + department_id + designation_id 



My design is in such a way that i can create a role for a specific organization, department and designation.
And i can assign permissions to the role for the given features too here.
So I need to create the user . User will have the multi-stepper page here.
In which at the start we will ask for the organization, department and designation.
after selecting a particular role is defined for the user it can be multiple up to 5.
A default password is created for that user automatically using bycrpt.
And only sign functionality will be there. change password etc etc.
and the rest cruds operations similarly how it works in the existing system.
for users.
A role is created by select organization, department and designation.
Id of the organization, department and designation will be concat and used as role_id.
So while creating a role we will ask for the organization, department and designation.
the drop for the must be shown . And the Authentication will be there jwt token plus refresh token.
So this is the design for the new system.
So if there any functionality for the organization, department and designation 
role feature and permission and the code for that must be in their own in specific
folder.
There Permission page in which there will be role selection using dropdown. with organization, department and designation.
and there will be checkboxes for the features and permissions. By clicking on the checkbox the permission will be assigned to the role.
the type of the functionality must be there . And also the user have the mutiple roles.

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) NOT NULL COMMENT 'Unique identifier, can be email or generated UUID',
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL COMMENT 'Hashed password',
  `login_type` varchar(50) NOT NULL,
  `email_verified` tinyint(4) DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='All the users are stored in this table';

CREATE TABLE `user_detail` (
  `user_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `profile_picture_url` varchar(500) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`user_detail_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  KEY `idx_user_role_user` (`user_id`),
  KEY `idx_user_role_role` (`role_id`),
  CONSTRAINT `user_role_fk_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `user_role_fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




When any role is created, the organization, department and designation will be stored in the organization_department_designation table.
But how can we get the organization, department and designation the names to the role?
CREATE TABLE `organization_department_designation` (
  `organization_id` int(11) NOT NULL,
  `department_id` varchar(10) NOT NULL,
  `designation_id` varchar(10) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  KEY `idx_odd_org` (`organization_id`),
  KEY `idx_odd_dept` (`department_id`),
  KEY `idx_odd_desig` (`designation_id`),
  CONSTRAINT `odd_fk_dept` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE,
  CONSTRAINT `odd_fk_desig` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`designation_id`) ON DELETE CASCADE,
  CONSTRAINT `odd_fk_org` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
Foe example if I assign the role to user then he must have the organization, department and designation names too.

CREATE TABLE `role` (
  `role_id` varchar(100) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

For the frontn Ui in the role section in menu bar there will be the list dropdown for the organization department and designation here
I will concat the organization, department and designation id and use it as role_id.
this will be role Id And the name of the role will automatically generated from the  department and designation names. And we will add the description manually.