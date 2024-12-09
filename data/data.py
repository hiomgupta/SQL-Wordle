import json

# JSON data
data = {
    "levels": [
        {
            "questions": [
                "Retrieve the first and last names of all employees.",
                "Find the names of departments located at location ID 1700.",
                "List all job titles with a minimum salary greater than $10,000.",
                "Show the city and state/province of all locations in the United States.",
                "Display employee IDs and salaries for employees in department 80, sorted by salary in descending order.",
                "Count the number of employees in each department, showing only departments with more than 10 employees.",
                "Show the last names of employees along with their department names.",
                "Calculate the average salary for each job ID.",
                "Find the first and last name of the employee(s) with the highest salary.",
                "Increase the salary by 10% for all employees with an 'Excellent' performance rating.",
                "Add a new department called 'Data Science' with ID 280, managed by employee 103, at location 1700.",
                "Remove all job history records that ended before January 1, 2010.",
                "Create a new table called 'projects' with columns for project ID, name, start date, end date, and manager ID.",
                "Add a new column called 'bonus' to the employees table.",
                "Delete the job_applicants table from the database."
            ],
            "answers": [
                "SELECT first_name, last_name FROM employees",
                "SELECT department_name FROM departments WHERE location_id = 1700",
                "SELECT job_title FROM jobs WHERE min_salary > 10000",
                "SELECT city, state_province FROM locations WHERE country_id = 'US'",
                "SELECT employee_id, salary FROM employees WHERE department_id = 80 ORDER BY salary DESC",
                "SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING COUNT(*) > 10",
                "SELECT e.last_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id",
                "SELECT job_id, AVG(salary) FROM employees GROUP BY job_id",
                "SELECT first_name, last_name FROM employees WHERE salary = (SELECT MAX(salary) FROM employees)",
                "UPDATE employees SET salary = salary * 1.1 WHERE performance_rating = 'Excellent'",
                "INSERT INTO departments (department_id, department_name, manager_id, location_id) VALUES (280, 'Data Science', 103, 1700)",
                "DELETE FROM job_history WHERE end_date < '01-JAN-2010'",
                "CREATE TABLE projects (project_id NUMBER PRIMARY KEY, project_name VARCHAR2(100), start_date DATE, end_date DATE, manager_id NUMBER)",
                "ALTER TABLE employees ADD (bonus NUMBER(8,2))",
                "DROP TABLE job_applicants"
            ],
            "options": [
                "SELECT FROM employees first_name last_name WHERE ORDER BY salary DESC HAVING JOIN",
                "SELECT FROM departments WHERE department_name location_id COUNT(*) GROUP BY = 1700 SUM AVG",
                "SELECT FROM jobs WHERE job_title min_salary > 10000 < MAX MIN BETWEEN AND",
                "SELECT FROM locations WHERE city state_province country_id = 'US' LIKE IN IS NULL",
                "SELECT employee_id salary FROM employees WHERE department_id = 80 ORDER BY DESC ASC LIMIT",
                "SELECT department_id COUNT(*) FROM employees GROUP BY HAVING > 10 < = DISTINCT",
                "SELECT e.last_name d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id INNER LEFT RIGHT",
                "SELECT job_id AVG(salary) FROM employees GROUP BY HAVING ORDER MIN MAX SUM",
                "SELECT first_name last_name FROM employees WHERE salary = (SELECT MAX(salary) FROM employees) SUBQUERY IN EXISTS",
                "UPDATE employees SET salary = salary * 1.1 WHERE performance_rating = 'Excellent' INSERT DELETE MERGE",
                "INSERT INTO departments (department_id department_name manager_id location_id) VALUES (280 'Data Science' 103 1700) UPDATE DELETE",
                "DELETE FROM job_history WHERE end_date < '01-JAN-2010' > BETWEEN AND OR TRUNCATE",
                "CREATE TABLE projects (project_id NUMBER PRIMARY KEY project_name VARCHAR2(100) start_date DATE end_date DATE manager_id NUMBER) ALTER DROP",
                "ALTER TABLE employees ADD (bonus NUMBER(8,2)) MODIFY DROP RENAME COLUMN CONSTRAINT",
                "DROP TABLE job_applicants CASCADE RESTRICT CREATE INDEX SEQUENCE VIEW"
            ]
        }
    ]
}

# Save as JSON file
with open("questions.json", "w") as file:
    json.dump(data, file, indent=4)

print("File saved as quiz_questions.json")
