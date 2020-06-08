const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_tracker_db",
});

connection.connect();

connection.query = util.promisify(connection.query);

promptUser = () =>
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which would you like to add?",
        name: "list",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
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
      const list = answer.list;

      switch (option) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Employees By Department":
          viewEmployeesByDepartment();
          break;
        case "View All Employees By Manager":
          viewEmployeesByManager();
          break;
        case "Add Employee":
          addEmployees();
          break;
        case "Remove Employees":
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
        case "View Departments":
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
  return new Promise((resolve, reject) => {
    const allEmployees = [];
    connection.query("SELECT * FROM employee");
  });
};

//Array of all Managers
//used to update employee's managers

managersList = () => {
  return new Promise((resolve, reject) => {
    const allManagers = [];
    //??????????????????????/????
    connection.query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?"
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
     // [employee],
     // async (err, res) => {
     //   if (err) throw err;
      //  return err ? reject(err) : resolve(res[0].id);
     // }
    );
  });
};

// list of all roles
roleList = () => {
  return new Promise((resolve, reject) => {
    const allRoles = [];
    connection.query("SELECT * FROM role", 
    //(err, res) => {
      //if (err) throw err;
     // res.forEach((role) => {
      //  allRoles.push(role.title);
       // return err ? reject(err) : resolve(allRoles);
     // });
   // });
  );
  });
};

//role IDs. Used to update roles
roleIdList = (role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM role WHERE title=?",
     // [role],
      //async (err, res) => {
       // if (err) throw err;
       // return err ? reject(err) : resolve(res[0].id);
     // }
    );
  });
};

// View All Employees logged in table
viewEmployees = () => {
  const allEmployees = connection.query("Select * FROM employee");
  //may need db and requr db at top
  //(err, res) => {
   // if (err) throw err;
    console.table(allEmployees);
    console.log(
      "-------------------------------------------------------------------------------------"
    );

    promptUser();
  }


//View All Employees by department

viewEmployeesByDepartment = () => {
 allEmployeesbyDept = connection.query("Select * FROM department"); 
  //(err, res) => {
   // if (err) throw err;
    console.table(allEmployeesbyDept);
    console.log(
      "-------------------------------------------------------------------------------------"
);
  };


//View All Employees by Manager
//help ???

viewEmployeesByManager = () => {
  const viewAllEmployeebyManager = connection.query("Select * FROM department", (err, res) => {
    if (err) throw err;
    console.table(viewAllEmployeesByManager);
    console.log(
      "-------------------------------------------------------------------------------------"
    );
  });
};

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
        choices: managerQuery,
      },
    ])
    .then(async (answer) => {
      console.log("adding new employee");
      const firstName = answer.employeeFirstName;
      const lastName = answer.employeeLastName;
      const employeeRole = answer.employeesRole;
      const managerName = answer.employeeManagerQuery;
      const query = connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: firstName,
          last_name: lastName,
          role_id: employeeRole,
          manager_id: managerName,
        },
        //(err, res) => {
         // if (err) throw err;
         // console.log(res.affectedRows + "\n Added Employee");
       // }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
    });
};

//remove Employees
removeEmployees = async () => {
  inquirer
    .prompt({
      type: "list",
      message: "Who would you like to remove?",
      choices: await employeeList,
      name: "employeeToDelete",
    })
    .then(async (answer) => {
      console.log("\n deleting employee");
      const employeeId = await employeeIdList(answer.employeeToDelete);
      const query = connection.query(
        "DELETE FROM employee WHERE id=?",
       // [employeeId],
       // (err, res) => {
        //  if (err) throw err;
         // console.log(res.affectedRows + "\n employee deleted");
       // }
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
        //(err, res) => {
         // if (err) throw err;
         // console.log(res.affectedRows + "\n Updated Employee Role");
       // }
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
        //(err, res) => {
         // if (err) throw err;
         // console.log(res.affectedRows + "\n Employee Manager Updated!");
       // }
      );
      console.log(query.sql);
      console.log(
      "-------------------------------------------------------------------------------------"
);
  };

// List of all departments
departmentList = () => {
  return new Promise((resolve, reject) => {
    const allDepartments = [];
   // connection.query("SELECT * FROM department", (err, res) => {
      //if (err) throw err;
     // res.forEach((department) => {
      //  allDepartments.push(department.name);
       // return err ? reject(err) : resolve(allDepartments);
     // });
   // });
  });
};

viewDepartments = () => {
  viewAllDepts = connection.query("Select * FROM department"), 
  //(err, res) => {
   // if (err) throw err;
    console.table(viewAllDepts);
    console.log(
      "-------------------------------------------------------------------------------------"
);
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
       // (err, res) => {
        //  if (err) throw err;
        //  console.log(res.affectedRows + "\n Added Department");
      //  }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
    });
};

//Removing a department
removeDepartment = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which department would you like to remove ?",
        choices: ["Sales", "Engineering", "Finance", "Legal"],
        name: "departmentToBeDeleted",
      },
    ])
    .then((answer) => {
      console.log("Deleting department...");
      const dep = answer.departmentToBeDeleted;
      const query = connection.query(
        "DELETE FROM department WHERE name=?",
       // [dep],
       // (err, res) => {
       //   if (err) throw err;
        //  console.log(res.affectedRows + "\n Department Deleted!");
       // }
      );
      console.log(query.sql);
      console.log(
        "-------------------------------------------------------------------------------------"
      );
    });
};
