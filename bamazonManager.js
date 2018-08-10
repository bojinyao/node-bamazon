//=============
// Dependencies
//=============
const mysql = require("mysql");
const colors = require("colors");
const inquirer = require("inquirer");

const utils = require("./utils.js");
const server_db = require("./auth.js");

//=================
// Global Variables
//=================
const DB = "bamazon";
const STD_TIMEOUT = 10000;
const SERVER_DB = server_db;
const PRODUCT_TABLE = "products";
const LOW_QUANTITY_CUTOFF = 4; //inclusive
const MAX_INT = Number.MAX_SAFE_INTEGER;
const MAX_STR = 100;
var DEPARTMENTS = null;

//---------- Color Themes -------------
colors.setTheme(utils.colorTheme);

//------------- Functions ---------------

/**
 * Beginning of App.
 */
function Main() {
    utils.queryDB(SERVER_DB, `SELECT department_name FROM departments;`, 
    function(result, field) {
        DEPARTMENTS = result.map(rawDataPacket => rawDataPacket.department_name);
        inquirer.prompt(
            [
                {
                    type: 'list',
                    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
                    name: 'action'
                }
            ]
        ).then(answer => {
            let action = answer.action;
    
            switch (action) {
                case 'View Products for Sale':
                    viewProducts();
                    break;
    
                case 'View Low Inventory':
                    viewLowInventory();
                    break;
    
                case 'Add to Inventory':
                    addToInventory();
                    break;
    
                case 'Add New Product':
                    addNewProduct();
                    break;
                default:
                    console.log(`Unrecognized Command.`.error);
                    break;
            }
        })
    })   
}

function viewProducts(fn = null) {
    let connection = mysql.createConnection(SERVER_DB);
    connection.query(
        {
            sql: `SELECT item_id, product_name, department_name, price, stock_quantity FROM ${PRODUCT_TABLE} ORDER BY item_id;`,
            timeout: STD_TIMEOUT
        },
        function (error, result, field) {
            if (error) {
                console.log(error);
                return;
            }
            let headers = ["ID", "Product", "Department", "Price ($)", "Inventory"];
            let table = utils.makeCustomTable(result, headers);
            console.log(table.toString());
            if (fn) {
                fn(result);
            }
        }
    )
    connection.end();
}

function viewLowInventory() {
    let connection = mysql.createConnection(SERVER_DB);
    connection.query(
        {
            sql: `SELECT item_id, product_name, department_name, price, stock_quantity FROM ${PRODUCT_TABLE} where stock_quantity <= ${LOW_QUANTITY_CUTOFF};`,
            timeout: STD_TIMEOUT
        },
        function (error, result, field) {
            if (error) {
                console.log(error);
                return;
            }
            let headers = ["ID", "Product", "Department", "Price ($)", "Inventory"];
            let table = utils.makeCustomTable(result, headers);
            console.log(table.toString());
        }
    )
    connection.end();
}

function addToInventory() {
    viewProducts(
        function (rawDataPacket) {
            let maxId = rawDataPacket.length;
            inquirer.prompt([
                {
                    type: 'number',
                    message: `ID of product to restock:`,
                    name: 'id',
                    validate: input => {
                        return utils.isInteger(input) && 1 <= input && input <= maxId ? true : `Invalid ID`.error
                    }
                },
                {
                    type: 'number',
                    message: `Number of units to restock:`,
                    name: 'quantity',
                    validate: input => {
                        return utils.isInteger(input) && -1 < input ? true : `Invalid input`.error
                    }
                }
            ]).then(function (answer) {
                let id = answer.id;
                let quantity = answer.quantity;
                let currQuantity = rawDataPacket[id - 1].stock_quantity;
                let newQuantity = currQuantity + quantity;
                utils.queryDB(SERVER_DB,
                    `UPDATE ${PRODUCT_TABLE} SET stock_quantity=${newQuantity} WHERE item_id=${id};`,
                    function (result) {
                        if (result.affectedRows === 1) {
                            console.log(`Update successful!`.success);
                        } else {
                            console.log(`Something is wrong! Re-check Inventory!`.error);
                        }
                    });
            })
        }
    )
}

function addNewProduct() {
    inquirer.prompt([
        {
            type: 'input',
            message: `Product Name:`,
            name: 'name',
            validate: input => {
                return 1 <= input.length && input.length <= MAX_STR ? true : `Exceed character limit.`.error
            }
        },
        {
            type: 'list',
            choices: DEPARTMENTS,
            name: 'department'
        },
        {
            type: 'number',
            message: `Price of product: $`,
            name: 'price',
            validate: input => {
                return utils.isNumber(input) && 0 <= input && input < MAX_INT ? true : `Invalid Price!`.error;
            }
        },
        {
            type: 'number',
            message: `Quantity to stock:`,
            name: 'quantity',
            validate: input => {
                return utils.isInteger(input) && -1 < input && input < MAX_INT ? true : `Invalid Quantity!`.error;
            }
        }
    ]).then(function (answer) {
        let name = answer.name.trim();
        let department = answer.department;
        let price = utils.roundToTwo(answer.price);
        let quantity = answer.quantity;
        utils.queryDB(SERVER_DB,
            `INSERT INTO ${PRODUCT_TABLE} (product_name, department_name, price, stock_quantity) VALUES ("${name}", "${department}", ${price}, ${quantity});`,
            function (result) {
                console.log(`Update successful!`.success);
                console.log(`ID of new product: ${result.insertId}`.warn);
            })
    })
}


//=============
// Start of App
//=============
// Main();

module.exports = Main;
