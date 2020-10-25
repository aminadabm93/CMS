var mysql = require("mysql");
var inquirer = require("inquirer");

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
            runSearch();
        });
    });
}

function addEmployee(){
    //inquire employee first, last, roleID, 
    // inquirere if known manager ID then insert
}

function addRole(){
    //inquire title, salary,department ID
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
