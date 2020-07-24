const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  promptUser;
});

connection.query = util.promisify(connection.query);

promptUser = () =>
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which would you like to do?",
        name: "list",
        choices: [
          "View All Employees",
          // "View All Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Department",
          "Remove Department",
          "View Department",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      console.log(answer);
      const list = answer.list;
      switch (list) {
        case "View All Employees":
          viewEmployees();
          break;

        //case "View All Employees By Manager":
        // viewEmployeesByManager();
        // break;
        case "Add Employee":
          addEmployees();
          break;
        case "Remove Employee":
          removeEmployees();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;

        case "Add Department":
          addDepartment();
          break;
        case "Remove Department":
          removeDepartment();
          break;
        case "View Department":
          viewDepartments();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });

//Array of all employees
// used to delete employees: update employee roles:
employeeList = () => {
  return connection.query(
    'SELECT e.id as value, CONCAT(e.first_name, " ", e.last_name) AS name FROM employee as e'
  );
};

//Array of all Managers
//used to update employee's managers

managersList = () => {
  return new Promise((resolve, reject) => {
    const allManagers = [];
    connection.query(
      'SELECT employee.id, CONCAT(employee.first_name," ", employee.last_name) AS employee, role.title FROM employee RIGHT JOIN role ON employee.role_id = role.id WHERE role.title = "General Manager" OR role.title = "Assistant Manager" OR role.title = "Sales Lead" OR role.title = "HR Specialist"',
      (err, res) => {
        if (err) throw err;

        res.forEach((manager) => {
          allManagers.push(manager.employee);
          return err ? reject(err) : resolve(allManagers);
        });
      }
    );
  });
};

//Manager IDs
managerIdList = (manager) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM employee WHERE CONCAT(first_name,' ', last_name)=?"
    );
  });
};

//employee IDs
employeeIdList = (employee) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM employee WHERE CONCAT(first_name,' ', last_name)=?",
      [employee],
      async (err, res) => {
        if (err) throw err;
        return err ? reject(err) : resolve(res[0].id);
      }
    );
  });
};

// list of all roles
roleList = () => {
  return new Promise((resolve, reject) => {
    const allRoles = [];
    connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      res.forEach((role) => {
        allRoles.push(role.title);
        return err ? reject(err) : resolve(allRoles);
      });
    });
  });
};

//role IDs. Used to update roles
roleIdList = (role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM role WHERE title=?",
      [role],
      async (err, res) => {
        if (err) throw err;
        return err ? reject(err) : resolve(res[0].id);
      }
    );
  });
};

// View All Employees logged in table
viewEmployees = () => {
  connection.query(
    'SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS employee, role.title, department.name AS department, salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role ON e.role_id=role.id INNER JOIN department on role.department_id=department.id LEFT JOIN employee m ON m.id = e.manager_id',

    // may need db and requr db at top
    (err, res) => {
      if (err) throw err;
      console.table(res);
      console.log(
        "-------------------------------------------------------------------------------------"
      );

      promptUser();
    }
  );
};

//View All Employees by department

//View All Employees by Manager
//help ???

// viewEmployeesByManager = () => {
// inquirer.prompt({
// type: "list",
//  message: "Please select from List",
//choices: await managersList
// name: "managerChoice"
// }).then(async answer => {

// })

// connection.query("Select * FROM department", (err, res) => {
//   if (err) throw err;
//  console.table(res);
// console.log(
//  "-------------------------------------------------------------------------------------"
//  );

//  promptUser();
//  });
//};

// Add Employees
addEmployees = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "employeeFirstName",
      },

      {
        type: "input",
        message: "What is the employee's last name?",
        name: "employeeLastName",
      },

      {
        type: "list",
        message: "What is the employee's Role?",
        name: "employeesRole",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
        ],
      },

      {
        type: "list",
        message: "Who is the employee's Manager?",
        name: "employeeManagerQuery",
        //how to render manager query????
        choices: ["Malia Brown", "Kevin Tupik"],
      },
    ])
    .then(async (answer) => {
      console.log("adding new employee");
      const firstName = answer.employeeFirstName;
      const lastName = answer.employeeLastName;
      const employeeRole = answer.employeesRole;
      const managerName = answer.employeeManagerQuery;
      const queryRoleId = connection.query(
        "SELECT * FROM role WHERE title = ?",
        employeeRole,

        (err, res) => {
          if (err) throw err;
          console.log(res);
          const salesId = res[0].id;
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: firstName,
              last_name: lastName,
              role_id: salesId,
              manager_id: 1,
            },
            (err, res) => {
              if (err) throw err;
              console.log(res.affectedRows + "\n Added Employee");
            }
          );
        }
      );

      // const query = connection.query(
      //   " INSERT INTO employee SET ?",
      //   {
      //     first_name: firstName,
      //     last_name: lastName,
      //     role_id: salesId,
      //     manager_id: managerName,
      //   },
      //   (err, res) => {
      //     if (err) throw err;
      //     console.log(res.affectedRows + "\n Added Employee");
      //   }
      // );
      // console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
    });
};

//remove Employees
removeEmployees = async () => {
  console.log("remove employees function test");
  inquirer
    .prompt({
      type: "list",
      message: "Who would you like to remove?",
      choices: await employeeList(),
      name: "employeeToDelete",
    })
    .then(async (answer) => {
      console.log(answer.employeeToDelete);

      const query = connection.query(
        "DELETE FROM employee WHERE id=?",
        answer.employeeToDelete,
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + "\n employee deleted");
          promptUser();
        }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
    });
};

//update Employee Roles

updateEmployeeRole = async () => {
  inquirer
    .prompt([
      {
        type: "list",
        message:
          "Please select the employee whose role you would like to update:",
        choices: await employeeList(),
        name: "employeeToUpdate",
      },

      {
        type: "list",
        message: "Please select the employee's new role:",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Lawyer",
        ],
        name: "roleToUpdate",
      },
    ])
    .then(async (answer) => {
      console.log("updating role");
      const employeeId = await employeeList(answer.employeeToUpdate);
      const newRoleId = await roleIdList(answer.roleToUpdate);
      const query = connection.query(
        "UPDATE employee SET ? WHERE id=?",
        [
          {
            role_id: newRoleId,
          },
          employeeId,
        ],
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + "\n Updated Employee Role");

          promptUser();
        }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
    });
};

//update Employee Manager

updateEmployeeManager = async () => {
  inquirer
    .prompt([
      {
        type: "list",
        message:
          "Please select the employee whose manager you would like to update:",
        choices: await employeeList(),
        name: "employeeToUpdateManager",
      },

      {
        type: "list",
        message: "Please select the employee's new manager:",
        choices: await managersList(),
        name: "newManager",
      },
    ])
    .then(async (answer) => {
      console.log("updating Manager");
      const employeeId = await employeeIdList(answer.employeeToUpdateManager);
      const newMgrId = await managerIdList(answer.newManager);
      const query = connection.query(
        "UPDATE employee SET ? WHERE id=?",
        [
          {
            manager_id: newMgrId,
          },
          employeeId,
        ],
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + "\n Employee Manager Updated!");
          promptUser();
        }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
    });
};

// List of all departments
departmentList = () => {
  return new Promise((resolve, reject) => {
    const allDepartments = [];
    connection.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      res.forEach((department) => {
        allDepartments.push(department.name);
        return err ? reject(err) : resolve(allDepartments);
      });
    });
  });
};

viewDepartments = () => {
  connection.query("Select * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    console.log(
      "-------------------------------------------------------------------------------------"
    );

    promptUser();
  });
};

// Adding New Department
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "departmentName",
      },
    ])
    .then((answer) => {
      console.log("Adding new department...");
      const newDepartment = answer.departmentName;
      const query = connection.query(
        "INSERT INTO department set ? ",
        {
          name: newDepartment,
        },
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + "\n Added Department");
        }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
      promptUser();
    });
};

//Removing a department
removeDepartment = async () => {
  inquirer
    .prompt({
      type: "list",
      message: "Which department would you like to remove ?",
      choices: await departmentList(),
      name: "departmentToBeDeleted",
    })
    .then((answer) => {
      console.log(answer.departmentToBeDeleted);

      const query = connection.query(
        "DELETE FROM department WHERE name=?",
        answer.departmentToBeDeleted,
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + "\n Department Deleted!");
          promptUser();
        }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );

      promptUser();
    });
};

promptUser();
