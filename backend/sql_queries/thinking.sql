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

Here is the role table . And also there is the organization_department_designation table.
And the role_id is the composite key of the organization_id, department_id and designation_id.
I want the functionality such as the whenever the role is created, the organization_department_designation
 table will be updated with the organization_id, department_id and designation_id. ADD

Case 1 : Role creation: api
Frontend dropdown will have the organization, department and designation list.
And the role name will be such as the concat name of the designation and department names.
And the role_id will be the concat of the organization_id, department_id and designation_id ids not seperated 
by underscore here.
And also the whenever the role is created, the organization_department_designation table will be updated with
 the organization_id, department_id and designation_id.

Now in frontend the role table will have the organization, department and designation names role_id roleName . 
And in the there will be filter dropdown for the organization, department and designation. to check the roles.

And While fetching the roles we need the join with the organization, department and designation tables.
So we can get all the information related to the organization, department and designation. it will be an object.
and the key name will be the organization, department and designation. 
Also while create update form the dropdown will be shown. And also handle the is_deleted column effecienlty hard delete and soft delete.

Please provide the optimize and sorted code for the above functionality. 
Role service will have the create, update, delete, getById, getAll, getAllWithDeleted, getByIdWithDeleted, hardDelete, 
softDelete functions.
and the organization_department_designation service will have their own get all, get one, create, update, delete, 
getById, getAllWithDeleted, getByIdWithDeleted, hardDelete, softDelete functions.
And their service will be called here in roles service and the database operations for their own will be in their
 respective folder and we will call the services.
So when a role is fetched get all or single this will have the relations with the organization department and
 designation and i will return with their data in response. Now do we need here to have the tables changes to acheive this 
 Additions or deletion in the columns for it ? Please solve this and return with perfect solution here