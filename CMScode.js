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
    // gather list of all employees that that could be manager
    
    connection.query("SELECT first_name,last_name,employee_id from employees",function(err,res){
        if (err) throw err;
        //res.foreach(element => console.log(element.name));
        var managerObjects=[];
        var managerNames=[];
        for(var i=0; i<res.length;i++){
            managerObjects.push(res[i]);
            var names = res[i].first_name + " " + res[i].last_name;
            managerNames.push(names);
        }
        //incase the employee doesn't have a manager select none
        managerNames.push("none");
        managerObjects.push({first_name:"none",last_name:"none",employee_id:null});

        //get roles that the employee can be, save id too
        var roleObjects = [];
        var roleNames =[];
        connection.query("SELECT title, role_id from roles",function (err,res){
            if (err) throw err;
            for(var i=0; i<res.length;i++){
                roleObjects.push(res[i]);
                roleNames.push(res[i].title);
            } 
            
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
                name:"role",
                type:"list",
                choices:roleNames
            },{
                message:"Select he employee's manager, otherwise select 'none'",
                name:"manager",
                type:"list",
                choices:managerNames
            }];

            inquirer
            .prompt(employeeQs).then(function(answer){
                //get role ID
                var roleIndex = roleNames.indexOf(answer.role);
                var roleID = roleObjects[roleIndex].role_id;
                //have to convertheir choices and find the id

                if (answer.manager=="none"){
                    var query = "INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?);";
                
                    connection.query(query,[answer.firstName,answer.lastName,roleID,null],function(err,res){
                        if (err) throw err;
                        console.log("You have successfuly added an employee with no manager!");
                        runSearch();
                    });
                }
                else{
                    var managerIndex = managerNames.indexOf(answer.manager);
                    var managerID = managerObjects[managerIndex].employee_id;

                    var query = "INSERT INTO employees(first_name,last_name,role_id,manager_id) VALUES(?,?,?,?);";
                    
                    connection.query(query,[answer.firstName,answer.lastName,roleID,managerID],function(err,res){
                        if (err) throw err;
                        console.log("You have successfuly added an employee!");
                        runSearch();
                    });
                }     
            });
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
        let department_id;
        connection.query(departmentQuery,[answer.department],function(err,res){
            if (err) throw err;
            department_id=res[0].department_id;
            console.log("dept_id "+ department_id);
            
            var query = "INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)";
            connection.query(query,[answer.title,answer.salary,department_id],function(err,res){
                if (err) throw err;
                runSearch();
            });
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

        switch(answer.view){
            case "departments":
                connection.query("SELECT * FROM departments",function (err,res){
                    if (err) throw err;
                    console.table(res);
                    runSearch();
                });
            break;

            case "employees":
                connection.query('SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(employees.first_name," ", employees.last_name) AS manager\nFROM employees \nINNER JOIN roles ON employees.role_id = roles.role_id\nINNER JOIN departments ON roles.department_id = departments.department_id\nLEFT JOIN employees AS mng ON employees.manager_id = employees.employee_id ',function (err,res){
                    if (err) throw err;
                    console.table(res);
                    //console.log(res);
                    runSearch();
                });
            break;

            case "roles":
                connection.query("SELECT roles.role_id,roles.title,roles.salary, departments.name as department FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id",function(err,res){
                    if (err) throw err;
                    console.table(res);
                    runSearch();
                });
            break;

        }   

        // var query = "SELECT * from "+answer.view;
        // connection.query(query,function (err,res){
        //     if (err) throw err;
        //     console.table(res);
        //     runSearch();
        // });
    });
}

function update(){
    //must be able to change employee roles 
    var employees=[];
    connection.query("SELECT first_name, last_name,employee_id from employees",function(err,res){
        if (err) throw err;
        //save all employees as objects to array
        for(var i=0; i<res.length;i++){
            employees.push({fullName: res[i].first_name+" "+ res[i].last_name, id:res[i].employee_id});
        }

        inquirer
        .prompt({
            message:"Which employee would you like to update?",
            name:"employeeChoice",
            type:"list",
            choices: employees.map(emp => emp.fullName)
        }).then(function(answer){
            let empINDEX = employees.map(element => element.fullName).indexOf(answer.employeeChoice);
            let employeeID = employees[empINDEX].id;
            //query roles 

            connection.query("SELECT role_id,title FROM roles",function(err,res){
                if (err) throw err;
                let roles = [];
                for(var i=0; i<res.length;i++){
                    roles.push({role_id:res[i].role_id, title:res[i].title});
                }
                //ask user for role 
                inquirer
                .prompt({
                    message:"Which role would you like to change it to?",
                    name:"roleChoice",
                    type:"list",
                    choices: roles.map(emp => emp.title)
                }).then(function(answer){
                    //save roleID
                    let roleIndex = roles.map(element => element.title).indexOf(answer.roleChoice);
                    let roleID = roles[roleIndex].role_id;

                    connection.query("UPDATE employees SET role_id=? WHERE employee_id=?",[roleID,employeeID],function(err,res){
                    if(err) throw err;
                    console.log("You successfully edited the employee role!");
                    runSearch();
                    });
                });
                
            });          
        });
    });

}
