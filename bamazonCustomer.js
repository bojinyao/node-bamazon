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
 * Display all of the items available for sale. 
 * Include the ids, names, and prices of products for sale.
 * @param {string} table 
 * @callback fn 
 */
function selectAllFrom(table, fn = null) {
    let connection = mysql.createConnection(SERVERDB);
    connection.query(
        {
            sql: `SELECT * FROM ${table} ORDER BY item_id;`,
            timeout: STDTIMEOUT
        },
        function (error, result, field) {
            if (error) {
                console.log(error);
                return;
            }
            result.forEach(rawDataPacket => {
                console.log(`ID: ${rawDataPacket.item_id} | Product: ${rawDataPacket.product_name.info} | Price: $${rawDataPacket.price}`)
            });

            if (fn) {
                fn(result);
            }
        }
    )
    connection.end();
}

/**
 * Update query of mysql.
 * @param {string} table 
 * @param {JSON} set 
 * @param {JSON} where 
 * @callback fn
 */
function updateTableInfo(table, set, where, fn = null) {
    let connection = mysql.createConnection(SERVERDB);
    connection.query(
        {
            sql: `UPDATE ${table} SET ? WHERE ?;`,
            timeout: STDTIMEOUT
        },
        [set, where],
        function (error, result, field) {
            if (error) {
                console.log(error);
                return;
            }

            if (fn) {
                fn(result);
            }
        }
    )
    connection.end();
}

/**
 * Confirm if user wishes to make a purchase.
 * @param {RawDataPacket[]} dataPackets 
 */
function askIfPurchase(dataPackets) {
    inquirer.prompt(
        [
            {
                type: 'confirm',
                message: `Would you like to make a purchase?`,
                name: "makePurchase"
            }
        ]
    ).then(function (answer) {
        if (answer.makePurchase) {
            promptBuy(dataPackets);
        } else {
            return;
        }
    })
}

/**
 * Prompt which item user wishes to purchase and quantity of purchase.
 * @param {RawDataPacket[]} dataPackets 
 */
function promptBuy(dataPackets) {
    let maxId = dataPackets.length;
    inquirer.prompt(
        [
            {
                type: 'number',
                message: "Please enter the ID of the product:",
                name: "productId",
                validate: input => {
                    return utils.isInteger(input) && 1 <= input && input <= maxId ? true : `Invalid ID`.warn;
                }
            },
            {
                type: 'number',
                message: "How many would you like to purchase?",
                name: "quantity",
                validate: input => {
                    return utils.isInteger(input) && input > -1 ? true : `Invalid input`.warn;
                }
            }
        ]
    ).then(answer => {
        let id = answer.productId;
        let quantity = answer.quantity;
        let targetPacket = dataPackets[id - 1];
        if (targetPacket.stock_quantity < quantity) {
            console.log(`Insufficient quantity!`.error);
            return;
        } else {
            let newQuantity = targetPacket.stock_quantity - quantity;
            updateTableInfo(productTable,
                { stock_quantity: newQuantity },
                { item_id: id },
                function (unused) {
                    console.log(`Your total is $${(targetPacket.price * quantity).toFixed(2)}.`.success)
                }
            );
        }
    })
}



/**
 * The beginning of app.
 */
function Main() {
    selectAllFrom(productTable, promptBuy);

}


//=============
// Start of App
//=============
Main();

