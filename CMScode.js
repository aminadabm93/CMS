var mysql = require("mysql");
var inquirer = require("inquirer");
const { connect } = require("http2");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Melito5!",
  database: "cms_db"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

//inital question for user. copying code form class activity 13 
function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "Would you like to add, view, update, or exit?",
        choices: [
          "Add",
          "View",
          "Update",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Add":
          add();
          break;
  
        case "View":
          view();
          break;
  
        case "Update":
          update();
          break;
  
        case "Exit":
          connection.end();
          break;
        }
      });
  }

function add(){
    inquirer
    .prompt({
      name: "add",
      type: "list",
      message: "Which of the following would you like to add to?",
      choices:["departments","employees","roles"]
    })
    .then(function(answer) {
        
        switch (answer.add){
            case "departments":
                addDepartment();
                break;
            case "employees":
                addEmployee();
                break;
            case "roles":
                addRole();
                break;
        }
        // connection.query(query,function (err,res){
        //     if (err) throw err;
        //     console.table(res);
        //     runSearch();
        // });
    });
}

function addDepartment(){
    //inquire the department name and update db
    inquirer
    .prompt({
        name:"department",
        message:"What is the department name?",
        type:"input",
    })
    .then(function(answer){
        var query = "INSERT INTO departments(name) VALUES (?)";
        connection.query(query,answer.department,function(err,res){
            if (err) throw err;
            console.log("You have succesfully added a department!");
            runSearch();
        });
    });
}

function addEmployee(){
    //inquire employee first, last, roleID, 
    // inquirere if known manager ID then insert
    var employeeQs = [{
        message:"What is the employee's first name?",
        name:"firstName",
        type:"input"
    },{
        message:"What is the employee's last name?",
        name:"lastName",
        type:"input"
    },{
        message:"What is the employee's role id?",
        name:"roleID",
        type:"number"
    },{
        message:"If the employee has a manager id, input it. If none, input 0.",
        name:"managerID",
        type:"number"
    }];

    inquirer
    .prompt(employeeQs).then(function(answer){
        var query = "INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?)";
        connection.query(query,[answer.firstName,answer.lastName,answer.roleID,answer.managerID],function(err,res){
            if (err) throw err;
            console.log("You have successfuly added an employee!");
            runSearch();
        });
    });
}

function addRole(){
    //inquire title, salary,department ID
    var roleQs = [{
        message:"What is the role title?",
        name:"title",
        type:"input"
    },{
        message:"What is the salary?",
        name:"salary",
        type:"number"
    },{
        message:"What is the department id?",
        name:"departmentID",
        type:"number"
    }];

    inquirer
    .prompt(roleQs).then(function(answer){
        var query = "INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)";
        connection.query(query,[answer.title,answer.salary,answer.departmentID],function(err,res){
            if (err) throw err;
            console.log("You have successfuly added a role!");
            runSearch();
        });
    });

}
function view(){
    inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "Which of the following would you like to view?",
      choices:["departments","employees","roles"]
    })
    .then(function(answer) {
        var query = "SELECT * from "+answer.view;
        connection.query(query,function (err,res){
            if (err) throw err;
            console.table(res);
            runSearch();
        });
    });
}

function update(){

}
