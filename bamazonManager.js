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

//---------- Color Themes -------------
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    success: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    info: 'blue',
    error: 'red'
});

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
                viewLowInventory(`stock_quantity <= ${LOWQUANTITYCUTOFF}`);
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

function viewProducts() {
    let connection = mysql.createConnection(SERVERDB);
    connection.query(
        {
            sql : `SELECT * FROM ${productTable};`,
            timeout : STDTIMEOUT
        }, 
        function(error, result, field) {
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

function viewLowInventory() {
    let connection = mysql.createConnection(SERVERDB);
    connection.query(
        {
            sql : `SELECT * FROM ${productTable} where stock_quantity <= ${LOWQUANTITYCUTOFF};`,
            timeout : STDTIMEOUT
        },
        function(error, result, field) {
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

}

function addNewProduct() {

}


//=============
// Start of App
//=============
Main();
