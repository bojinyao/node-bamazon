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

insert into products (product_name, department_name, price, stock_quantity) values
    ("A Brief History of Time", "Books", 10.69, 100),
    ("1984", "Books", 6.49, 20),
    ("The Incredibles", "Movies", 14.99, 1000),
    ("Wreck-It Ralph", "Movies", 14.99, 500),
    ("Toshiba 50-inch 4K Ultra HD Smart LED TV with HDR", "Electronics", 399.99, 5),
    ("Sony UBP-X700 4K Ultra HD Blu-ray Player (2018 Model)", "Electronics", 178.00, 4),
    ("13‑inch MacBook Pro - Space Gray", "Electronics", 1799.00, 10),
    ("James Madison University 11x14 pen and ink print", "Home", 21.00, 50),
    ("School Principal Gift Personalized Custom Cartoon Print", "Home", 16.99, 30),
    ("KIND Bars, Dark Chocolate Nuts & Sea Salt 1.4oz, 12 Count", "Grocery", 13.48, 300),
    ("Brown-forman Korbel Brut California Champagne", "Grocery", 119.99, 10),
    ("LEGO Star Wars Ultimate Millennium Falcon 75192 Building Kit", "Toys", 799.95, 2),
    ("NIKE Men's Dry Legend 2 Tee", "Clothing", 14.27, 500);

drop table if exists departments;

create table departments (
    department_id int not null auto_increment,
    department_name VARCHAR(100) null,
    over_head_costs DECIMAL(10, 2) default 0,
    primary key (department_id)
);

insert into departments (department_name, over_head_costs) values 
    ("Books", 10000), 
    ('Movies', 20000),
    ('Electronics', 50000),
    ('Home', 5000),
    ('Grocery', 17000),
    ('Toys', 9000),
    ('Clothing', 12000);


