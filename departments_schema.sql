use bamazon;

drop table if exists departments;

create table departments (
    department_id int not null auto_increment,
    department_name VARCHAR(100) null,
    over_head_costs DECIMAL(10, 2) default 0,
    primary key (department_id)
);
