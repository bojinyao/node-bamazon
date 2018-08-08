//=============
// Dependencies
//=============
const mysql = require("mysql");
const colors = require("colors");
const inquirer = require("inquirer");
const Table = require("cli-table");

const utils = require("./utils.js");

//=================
// Global Variables
//=================
const DB = "bamazon";
const STD_TIMEOUT = 10000;
const SERVER_DB = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: DB
}
const PRODUCT_TABLE = "products";
const MAX_INT = Number.MAX_SAFE_INTEGER;
const MAX_STR = 100;

//---------- Color Themes -------------
colors.setTheme(utils.colorTheme);

//------------- Functions ---------------
function superVisorOptions() {
    inquirer.prompt([
        {
            type: 'list',
            choices: [
                'View Product Sales by Department',
                'Create New Department'
            ],
            name: 'choice'
        }
    ]).then(function (answer) {
        let choice = answer.choice;
        switch (choice) {
            case 'View Product Sales by Department':
                viewProductSales();
                break;

            case 'Create New Department':
                createNewDepartment();
                break;

            default:
                console.log(`Unrecognized Command`.error);
                break;
        }
    })
}

function viewProductSales() {
    utils.queryDB(SERVER_DB, 
    `select 
    department_id, 
    department_name, 
    over_head_costs,
    p_s as product_sales,
    (p_s - over_head_costs) as total_profit 
    from departments inner join 
        (select 
            department_name as d_n,
            sum(product_sales) as p_s
            from products group by department_name) as t2
    where t2.d_n = departments.department_name;`,
    function(result, field) {
        var table = new Table({
            chars : utils.customTable
        })
        let headers = [ 'department_id', 'department_name', 'over_head_costs', 'product_sales','total_profit' ];
        table.push(headers.map(department => department.verbose));
        result.forEach(rawDataPacket => {
            table.push(Object.values(rawDataPacket));
        });
        console.log(table.toString());
    })
}

function createNewDepartment() {
    utils.queryDB(SERVER_DB, `SELECT department_name FROM departments;`, 
        function(result, unused) {
            let existingDepartments = result.map(rawDataPacket => rawDataPacket.department_name);
            console.log(`Current departments: \n`.warn + `${existingDepartments.join('\n')}`.success);
            inquirer.prompt([
                {
                    type: 'input',
                    message: `New Department name:`,
                    name: 'name',
                    validate: input => {
                        return existingDepartments.indexOf(input) < 0 
                        && 1 <= input.length 
                        && input.length <= MAX_STR ? true : `Exceed character limit.`.error;
                    }
                },
                {
                    type: 'number',
                    message: `Overhead cost for this department: $`,
                    name: 'cost',
                    validate: input => {
                        return utils.isNumber(input) && 0 <= input && input < MAX_INT ? true : `Invalid input!`.error;
                    }
                }
            ]).then(function(answer) {
                let name = answer.name.trim();
                let cost = utils.roundToTwo(answer.cost);
                utils.queryDB(SERVER_DB,
                     `INSERT INTO departments (department_name, over_head_costs) values ("${name}", ${cost});`, 
                    function(result, unused) {
                        if (result.affectedRows === 1) {
                            console.log(`New Department added!`.success);
                        } else {
                            console.log(`Something went wrong!`.error);
                        }
                    })
            })
        })
}

/**
 * The beginning of app.
 */
function Main() {
    superVisorOptions();
}

//=============
// Start of App
//=============
// Main();

module.exports = Main;
