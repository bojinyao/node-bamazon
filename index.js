const fs = require("fs");
const utils = require("./utils.js");
const customer = require("./bamazonCustomer.js");
const manager = require("./bamazonManager.js");
const supervisor = require("./bamazonSupervisor.js");
const inquirer = require("inquirer");

const DOTENV = ".env";

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
            message: `Name of Database to create:`,
            name: 'database'
        }
    ]).then(function(answer) {
        let host = answer.host.trim();
        let port = answer.port.trim();
        let user = answer.user.trim();
        let pswd = answer.pswd.trim();
        let database = answer.database.trim();
        fs.appendFileSync(`./${DOTENV}`, `DB_HOST=${host}`);
        fs.appendFileSync(`./${DOTENV}`, `DB_PORT=${port}`);
        fs.appendFileSync(`./${DOTENV}`, `DB_USER=${user}`);
        fs.appendFileSync(`./${DOTENV}`, `DB_PASS=${pswd}`);
        fs.appendFileSync(`./${DOTENV}`, `DB_NAME=${database}`);

        let connection = mysql.createConnection({
            multipleStatements: true,
            host: 'localhost',
            user: 'root',
            password: 'root'
        });
        connection.query(
            ``
        )
    })
}

/**
 * Starting point of the entire App.
 */
function Main() {

    let configured = utils.fileExists(`./${DOTENV}`);
    if (configured) {
        require("dotenv").config();
    } else {

    }


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
                customer();
                break;

            case 'Manager':
                manager();
                break;

            case 'Supervisor':
                supervisor();
                break;
            default:
                break;
        }
    })
}

//===================
//Start of Entire App
//===================
Main();
