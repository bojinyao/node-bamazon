# **node-bamazon**
A mock amazon app implemented in node using mysql as database. App supports three different types of users

* Customer
* Manager
* Supervisor

## Set Up
**Run Following SQL files in the exact order, using mySQL!**
1. `schema.sql` <-- will drop any existing bamazon database!
2. `products_seed.sql`
3. `departments_seed.sql`


**To start the APP, in command line type:** `node index.js`

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
