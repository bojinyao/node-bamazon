-- use bamazon;

-- select * from products;
-- select * from departments;
-- select department_name from departments;
-- select 
--     department_id, 
--     department_name, 
--     over_head_costs,
--     p_s as product_sales,
--     (p_s - over_head_costs) as total_profit 
--     from departments inner join 
--         (select 
--             department_name as d_n,
--             sum(product_sales) as p_s
--             from products group by department_name) as t2
--     where t2.d_n = departments.department_name;

