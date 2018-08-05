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

function viewProducts() {

}

function viewLowInventory() {

}

function addToInventory() {

}

function addNewProduct() {

}


//=============
// Start of App
//=============
Main();
