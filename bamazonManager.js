//=============
// Dependencies
//=============
const mysql = require("mysql");
const colors = require("colors");
const inquirer = require("inquirer");

const utils = require("./utils.js");

//=================
// Global Variables
//=================
const DB = "bamazon";
const STDTIMEOUT = 10000;
const SERVERDB = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: DB
}
const productTable = "products";
const LOWQUANTITYCUTOFF = 4; //inclusive
const DEPARTMENTS = ['Books', 'Movies', 'Electronics', 'Home', 'Grocery', 'Toys', 'Clothing'];
const MAXINT = Number.MAX_SAFE_INTEGER;

//---------- Color Themes -------------
colors.setTheme(utils.colorTheme);

//------------- Functions ---------------

/**
 * Beginning of App.
 */
function Main() {
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
}

function viewProducts(fn = null) {
    let connection = mysql.createConnection(SERVERDB);
    connection.query(
        {
            sql: `SELECT * FROM ${productTable} ORDER BY item_id;`,
            timeout: STDTIMEOUT
        },
        function (error, result, field) {
            if (error) {
                console.log(error);
                return;
            }
            result.forEach(rawDataPacket => {
                let id = rawDataPacket.item_id;
                let name = rawDataPacket.product_name;
                let department = rawDataPacket.department_name;
                let price = rawDataPacket.price;
                let quantity = rawDataPacket.stock_quantity;
                console.log(`ID: ${id} | Product: ${name.info} | Department: ${department.verbose} | Price: $${price} | Inventory: ${quantity}`);
            });
            if (fn) {
                fn(result);
            }
        }
    )
    connection.end();
}

function viewLowInventory() {
    let connection = mysql.createConnection(SERVERDB);
    connection.query(
        {
            sql: `SELECT * FROM ${productTable} where stock_quantity <= ${LOWQUANTITYCUTOFF};`,
            timeout: STDTIMEOUT
        },
        function (error, result, field) {
            if (error) {
                console.log(error);
                return;
            }
            result.forEach(rawDataPacket => {
                let id = rawDataPacket.item_id;
                let name = rawDataPacket.product_name;
                let department = rawDataPacket.department_name;
                let price = rawDataPacket.price;
                let quantity = rawDataPacket.stock_quantity;
                console.log(`ID: ${id} | Product: ${name.info} | Department: ${department.verbose} | Price: $${price} | Inventory: ${quantity}`);
            });
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
                utils.queryDB(SERVERDB,
                    `UPDATE ${productTable} SET stock_quantity=${newQuantity} WHERE item_id=${id};`,
                    function (unused) {
                        console.log(`Update successful!`.success);
                        console.log(`Updated inventory:`.warn);
                        viewProducts();
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
                return input.length <= 100 ? true : `Exceed 100 character limit.`.error
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
                return utils.isNumber(input) && -1 < input && input < MAXINT ? true : `Invalid Price!`.error;
            }
        },
        {
            type: 'number',
            message: `Quantity to stock:`,
            name: 'quantity',
            validate: input => {
                return utils.isInteger(input) && -1 < input && input < MAXINT ? true : `Invalid Quantity!`.error;
            }
        }
    ]).then(function (answer) {
        let name = answer.name;
        let department = answer.department;
        let price = answer.price;
        let quantity = answer.quantity;
        utils.queryDB(SERVERDB,
            `INSERT INTO ${productTable} (product_name, department_name, price, stock_quantity) VALUES ("${name}", "${department}", ${price}, ${quantity});`,
            function (unused) {
                console.log(`Update successful!`.success);
                console.log(`Updated inventory:`.warn);
                viewProducts();
            })
    })
}


//=============
// Start of App
//=============
Main();
