use bamazon;

alter table products add column product_sales decimal(10, 2) DEFAULT 0;

select * from products;
