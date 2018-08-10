//==================
// Node Dependencies
//==================
const fs = require("fs");
const mysql = require("mysql");
const colors = require("colors");
const inquirer = require("inquirer");

//================================
// Required Files (NOT ALL LISTED)
//================================
const utils = require("./utils.js");

//=================
// Global Variables
//=================
const DOTENV = ".env";
const TABLES_SETUP_SQL = "./tables_setup.sql";

//---------- Color Themes -------------
colors.setTheme(utils.colorTheme);


//------------ Functions ----------------

/**
 * Check if App is configured with a .env file
 * If not, will prompt user to config App
 * @callback fn 
 */
function configApp(fn = null) {
    let configured = utils.fileExists(`./${DOTENV}`);
    if (configured) {
        let isParsed = require("dotenv").config();
        if (isParsed.error) {
            console.log(`Failed to parse .env File!`.error);
            return;
        }
        if (fn) {
            fn();
        }
    } else {
        console.log(`Welcome New User!`.success);
        console.log(`Please follow the following prompts to configure the app!`.success);
        console.log(`Make sure you have a MySQL server running!!`.success);
        console.log(`Result of your configuration can be found in .env file`.success);
        console.log(`You can make future configuration changes there!`.success)
        configPrompts(fn);
    }
}

/**
 * Helps user to config the App, and then
 * setting up dummy data into the database to get started.
 * @callback fn 
 */
function configPrompts(fn = null) {
    inquirer.prompt([
        {
            type: 'input',
            message: `Host:`,
            name: 'host'
        },
        {
            type: 'number',
            message: `Port:`,
            name: 'port'
        },
        {
            type: 'input',
            message: `User:`,
            name: 'user'
        },
        {
            type: 'password',
            message: `pswd:`,
            name: 'pswd'
        },
        {
            type: 'input',
            message: `Database to create (WILL OVER-WRITE EXISTING!):`,
            name: 'database'
        }
    ]).then(function (answer) {
        let host = answer.host.trim();
        let port = answer.port;
        let user = answer.user.trim();
        let pswd = answer.pswd.trim();
        let database = answer.database.trim();
        fs.appendFileSync(`./${DOTENV}`, `DB_HOST=${host}\n`);
        fs.appendFileSync(`./${DOTENV}`, `DB_PORT=${port}\n`);
        fs.appendFileSync(`./${DOTENV}`, `DB_USER=${user}\n`);
        fs.appendFileSync(`./${DOTENV}`, `DB_PASS=${pswd}\n`);
        fs.appendFileSync(`./${DOTENV}`, `DB_NAME=${database}\n`);

        let isParsed = require("dotenv").config();
        if (isParsed.error) {
            console.log(`Failed to parse .env File!`.error);
            return;
        }

        let connection = mysql.createConnection({
            multipleStatements: true,
            host: host,
            port: port,
            user: user,
            password: pswd
        });
        connection.query(
            `DROP DATABASE IF EXISTS ${database};
            CREATE DATABASE ${database};`,
            function (error, result, field) {
                if (error) {
                    console.log(`Failed configuration:`.error);
                    console.log(error);
                    return;
                }
                const stream = fs.createReadStream(TABLES_SETUP_SQL);
                stream.on('data', (data) => {
                    connection.query(`USE ${database}; ${data.toString('utf8')}`,
                        function (error, result, field) {
                            if (error) {
                                console.log(`Failed to set up tables:`.error);
                                console.log(error);
                                return;
                            }
                        })
                    connection.end(() => {
                        console.log(`\nAll set up! App ready to use!`.success.bold);
                        console.log(`Some dummy data is already inserted for your convenience!\n`.success.bold);
                        if (fn) {
                            fn();
                        }
                    });
                });
            }
        )
    })
}


/**
 * Prompt user to select while role to be in while 
 * using the app.
 * @requires ./bamazonCustomer.js
 * @requires ./bamazonManager.js
 * @requires ./bamazonSupervisor.js
 */
function roleSelection() {
    inquirer.prompt([
        {
            type: 'list',
            choices: ['Customer', 'Manager', 'Supervisor'],
            name: 'role'
        }
    ]).then(function (answer) {
        let role = answer.role;
        switch (role) {
            case 'Customer':
                const customer = require("./bamazonCustomer.js");
                customer();
                break;

            case 'Manager':
                const manager = require("./bamazonManager.js");
                manager();
                break;

            case 'Supervisor':
                const supervisor = require("./bamazonSupervisor.js");
                supervisor();
                break;
            default:
                break;
        }
    })
}

/**
 * Starting point of the entire App.
 */
function Main() {
    configApp(roleSelection);
}

//===================
//Start of Entire App
//===================
Main();

