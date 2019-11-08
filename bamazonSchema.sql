drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
  item_id int not null auto_increment
  , sku varchar(100) default null
  , product_name varchar(100) not null
  , department_name varchar(100) default null
  , price decimal(12, 2) not null default 0
  , stock_qty int(10) unsigned default 0
  , published tinyint(1) default 1
  , long_description text default null
  , additional_info text default null
  , weight decimal(8, 2) default 0
  , timestamp timestamp null default current_timestamp
  , primary key(item_id)
);

create table departments (
  department_id int not null auto_increment
  , department_name varchar(100) not null
  , overhead_costs decimal(12, 2) not null default 0
  , primary key(department_id)
);

insert
  into
  departments (
    department_name
    , overhead_costs
  )
values (
  'electronics'
  , 500
)
, (
  'clothes'
  , 250
);

-- [Grant Access to Node]
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'