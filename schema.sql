drop database if EXISTS bamazon;

create database bamazon;
use bamazon;

drop table if exists products;

create table products (
    item_id int not null auto_increment,
    product_name varchar(100) null,
    department_name VARCHAR(100) null,
    price DECIMAL(10, 2) null,
    stock_quantity int null,
    product_sales DECIMAL(10, 2) DEFAULT 0,
    PRIMARY KEY(item_id)
);
