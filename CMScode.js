var mysql = require("mysql");
var inquirer = require("inquirer");
const { connect } = require("http2");
const { stringify } = require("querystring");

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
        message:"What is the employee's role?",
        name:"roleID",
        type:""
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
    
    //gather list of departments to choose from
    var departments=[];
    connection.query("SELECT name from departments",function(err,res){
        if (err) throw err;
        //res.foreach(element => console.log(element.name));
        for(var i=0; i<res.length;i++){
            departments.push(res[i].name);
        }
    });


    var roleQs = [{
        message:"What is the role title?",
        name:"title",
        type:"input"
    },{
        message:"What is the salary?",
        name:"salary",
        type:"number"
    },{
        message:"What is the department?",
        name:"department",
        type:"list",
        choices:departments
    }];

    inquirer
    .prompt(roleQs).then(function(answer){
        //query to get departmentID
        //NEED TO GET DEPARTMENT ID BASED ON THEIR ANSWER CHOICE FROM ABOVE
        var departmentQuery = "SELECT department_id FROM departments WHERE name = ?";
        var department_id;
        connection.query(departmentQuery,[answer.department],function(err,res){
            if (err) throw err;
            department_id=res[0].department_id;
        });

        var query = "INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)";
        connection.query(query,[answer.title,answer.salary,department_id],function(err,res){
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
    //must be able to change employee roles 
}
