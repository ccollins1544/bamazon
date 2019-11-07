var inquirer = require("inquirer");
var Mydb = require("./Mydb");
var colors = require("colors");

function products_for_sale(){
  var products = new Mydb();
  products.connect();
  products.querySelect("select item_id,product_name,price,stock_qty from products");
  products.end();

  inquirer.prompt({
    name: "id",
    type: "number",
    message: "Enter the item_id that you would like to purchase:".red,
    validate: function(id){
      if(isNaN(id) === false ){
        return true;
      }
      return false;
    }

  }).then(function(answer){
    cart_checkout(answer.id);
  });
}

function cart_checkout(itemID){
  inquirer.prompt({
    name: "how_many",
    type: "number",
    message: "How many units of this product [item_id: ".red + itemID.toString().yellow + "] would you like to buy?".red,
    validate: function(qty){
      if(isNaN(qty) === false){
        return true;
      }else{
        return false;
      }
    }
  }).then(function(answer){
    let restart_callback = function(successObj){
      if(successObj.success){
        console.log("Your item was purchased successfully!".cyan);
        console.log("Sub Total: $".yellow + successObj.sub_total);
        console.log("Quantity: $".yellow + successObj.quantity);
        console.log("Grand Total: $".yellow + successObj.grand_total);
      }else{
        console.log("Insufficient Quantity!\r\n".red);
      }

      console.log("_".repeat(60).white);
      products_for_sale();
    }

    var products = new Mydb();
    products.connect();
    products.updateStockQty(itemID, answer.how_many, restart_callback)
    products.end();
  })
}

products_for_sale()

////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// products.connect();
// products.querySelect("select * from products as p where p.department_name='clothes' LIMIT 1;", loopArrayObject);
// products.querySelect("select item_id,sku,product_name,department_name,price from products as p where p.department_name='clothes';");
// products.querySingleRec("select item_id,sku,product_name,department_name,price from products as p where p.department_name='clothes';");
// products.querySingleRec("select * from products as p where p.item_id='1';", loopObject);
// products.querySingleRec("select * from products as p where p.item_id='1';");
// products.query("select item_id,sku,product_name,department_name,price from products as p where p.item_id='1';");
// products.querySingleRec("select * from products as p where p.item_id='1';");
// products.updateFields({product_name:"Ship Your Cool Idea"}, {item_id: 12});
// products.delete({sku:'T-SHIRT-WOO-LOGO'});
// var item = {
//   sku: "T-SHIRT-WOO-LOGO",
//   product_name: "Woo Logo",
//   department_name: "clothes",
//   price: 44,
//   stock_qty: 100,
//   long_description: "It's just a logo...",
//   weight: 1
// };
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
// products.end();