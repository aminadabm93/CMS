DROP DATABASE IF EXISTS cms_DB;
CREATE DATABASE cms_DB;

USE cms_DB;

CREATE TABLE departments(
	department_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name varchar(30) NOT NULL
);

CREATE TABLE roles(
	role_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title varchar(30) not null,
    salary DECIMAL not null,
    department_id int,
    foreign key (department_id) references departments(department_id)
);

CREATE TABLE employees(
	employee_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
    role_id int,
    manager_id int,
    foreign key (role_id) references roles(role_id) ,
    foreign key(manager_id) references roles (role_id)
);
INSERT INTO departments(name)
VALUES ("hr"), ("fire"),("police"),("health");

INSERT INTO roles(title, salary, department_id)
VALUES ("captain",50000,3),("chief",55555,2);

INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES("bob","morales",1,2),("susan","morales",1,1);
SELECT * FROM employees;

