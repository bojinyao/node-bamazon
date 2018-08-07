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
const STD_TIMEOUT = 10000;
const SERVER_DB = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: DB
}
const PRODUCT_TABLE = "products";
const LOW_QUANTITY_CUTOFF = 4; //inclusive
const DEPARTMENTS = ['Books', 'Movies', 'Electronics', 'Home', 'Grocery', 'Toys', 'Clothing'];
const MAX_INT = Number.MAX_SAFE_INTEGER;

//---------- Color Themes -------------
colors.setTheme(utils.colorTheme);

//------------- Functions ---------------
