DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  sku varchar(100) default null,
  product_name varchar(100) not null,
  department_name varchar(100) default null,
  price decimal(12,2) not null default 0,
  stock_qty int(10) unsigned default 0,
  published tinyint(1) default 1, 
  long_description text default null,
  additional_info text default null,
  weight decimal(8,2) default 0,
  timestamp TIMESTAMP null default CURRENT_TIMESTAMP,
  PRIMARY KEY(item_id)
);

-- Extra Stuff for debugging
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

-- Add missing columns
-- alter table bamazon.products add sku varchar(100) default null;
-- alter table bamazon.products alter price set default 0;
-- update products set department_name = 'clothes' where sku like '%hoodie%' or sku like '%t-shirt%';