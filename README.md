# **node-database**
A mock amazon app implemented in node using mysql as database. App supports three different types of users

* Customer
* Manager
* Supervisor

## Set Up - is as easy as 1,2,3
1. Run `npm install` first inside `node-bamazon` directory
2. Start a MySQL server, such as MAMP
3. Finally, in your terminal, type `npm start`

## Configuration
The first time running this app, a `.env` file will be created. To configure the app, either delete the file, or change corresponding fields inside the file. 

# What this app does:

## *As a Customer:*

You have the option to purchase items from existing inventory. 
<br/> 
Follow the prompt. After each purchase, you will be provided with total amount. If there is not enough inventory, an error message will appear.
<br/>
<img src='./images/customer.png'>

## *As a Manager*

You have a number of options to choose from.
<br/>
Options are:
1. View Products for Sale
<img src='./images/manager_view_products.png'>
2. View Low Inventory
<img src='./images/manager_view_low_inventory.png'>
3. Add to Inventory
<img src='./images/manager_add_to_inventory.png'>
4. Add New Product
<img src='./images/manager_add_new_product.png'>

## *As a Supervisor*

You have two options to choose from.
<br/>

The option to add new departments is similar to adding new products as a manager.
<br/>
Option 1 is more fun in that the system dynamically calculates profits of each department:
<img src='./images/supervisor.png'>
