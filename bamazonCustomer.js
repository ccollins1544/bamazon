var inquirer = require("inquirer");
var Mydb = require("./Mydb");
var products = new Mydb("products", "item_id");

products.connect();
// products.querySelect("select * from products as p where p.department_name='clothes' LIMIT 1;", loopArrayObject);
// products.querySelect("select item_id,sku,product_name,department_name,price from products as p where p.department_name='clothes';");

// products.querySingleRec("select item_id,sku,product_name,department_name,price from products as p where p.department_name='clothes';");

// products.querySingleRec("select * from products as p where p.item_id='1';", loopObject);
// products.querySingleRec("select * from products as p where p.item_id='1';");

products.query("select * from products as p where p.item_id='1';");

// products.querySingleRec("select * from products as p where p.item_id='1';");

// products.updateFields({product_name:"Ship Your Cool Idea"}, {item_id: 12});

// products.delete({sku:'T-SHIRT-WOO-LOGO'});

var item = {
  sku: "T-SHIRT-WOO-LOGO",
  product_name: "Woo Logo",
  department_name: "clothes",
  price: 44,
  stock_qty: 100,
  long_description: "It's just a logo...",
  weight: 1
};

// products.create(item);

// products.fetchValue(22,"product_name");
// products.searchField = "sku";
// products.fetchRowsLike("HOODIE")

// var fields = ['sku','product_name','price'];
// products.fetchFields(22,'sku');

// products.searchField = "price";
// var ids = ["HOODIE", "YOUR"];
// var ids = [22, 23, 24];
// products.fetchIDArray(ids);

// products.countByID(20);

// products.getColumns();
// products.columnExists('sku');
products.end();