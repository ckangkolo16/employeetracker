-- Drops db if it already exists --
DROP DATABASE IF EXISTS employee_tracker_db;

-- Created the DB  (only works on local connections)
CREATE DATABASE employee_tracker_db;

-- Use the DB  for all the rest of the script
USE employee_tracker_db;

-- Created the table "schools"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);


CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary decimal (10,2)  NOT NULL,
  department_id INT  NOT NULL,
  PRIMARY KEY(id)
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES employee(id) ON DELETE SET NULL,
   INDEX role_ind (role_id),
);


CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL, 
  PRIMARY KEY(id)
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INDEX role_ind (role_id),