const customer = require("./bamazonCustomer.js");
const manager = require("./bamazonManager.js");
const supervisor = require("./bamazonSupervisor.js");
const inquirer = require("inquirer");

/**
 * Starting point of the entire App.
 */
function Main() {
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
