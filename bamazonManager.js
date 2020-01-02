/**
 * @package bamazon
 * @subpackage Manager 
 * @author Christopher Collins
 * @version 2.0.0
 * @license none (public domain)
/* ===============[ Libraries ]========================*/
var inquirer = require("inquirer");
const path = require("path");
var Mydb = require(path.resolve(__dirname, "./Mydb"));
var PrettyTable = require("cli-table2");
var colors = require("colors");

/* ===============[ Main Menu ]========================*/
function manager_dashboard(){
  inquirer.prompt({ 
    name: "menu_option",
    type: "list",
    message: "Select a menu option:",
    choices: ["View Products For Sale","View Low Inventory","Add to Inventory","Add New Product"]
  }).then(function(answer){
    next_menu(answer.menu_option);
  });
}

function next_menu(selected_menu){
  switch (selected_menu) {
    case "View Products For Sale":
      return products_for_sale();

    case "View Low Inventory":
      return view_low_inventory();

    case "Add to Inventory":
      return add_to_inventory();

    case "Add New Product":
      return add_new_product();
  
    default:
      return manager_dashboard();
  }
}

/* ===============[ Sub Menus ]========================*/
function products_for_sale(){
  var products = new Mydb();
  products.connect();
  products.querySelect("select item_id,product_name,price,stock_qty from products");
  products.end();
  return manager_dashboard();
}

function view_low_inventory(count=5){
  var sql="select item_id,product_name,price,stock_qty from products as p where p.stock_qty < " + count;
  var products = new Mydb();
  products.connect();
  products.querySelect(sql);
  products.end();
  return manager_dashboard();
}

function add_to_inventory(){
  var products = new Mydb();
  products.connect();
  products.querySelect("select item_id,product_name,price,stock_qty from products");
  products.end();

  inquirer.prompt([
    {
      name: "id",
      type: "number",
      message: "Select what item_id you want to add more of:".red,
      validate: function(id){
        if(isNaN(id) === false){
          return true;
        }
        return false;
      }
    }
  ]).then(function(answer){
    return update_inventory(answer.id);
  });
}

function update_inventory(item_id){
  var products = new Mydb();
  products.connect();
  products.fetchFields(item_id,["item_id","product_name","price","stock_qty"]);

  inquirer.prompt([
    {
      name: "add_more",
      type: "number",
      message: "How much more of this product [item_id: ".red + item_id.toString().yellow + "] would you like to add to inventory?".red,
      validate: function(qty){
        if(isNaN(qty) === false){
          return true;
        }else{
          return false;
        }
      }
    }
  ]).then(function(answer){
    let restart_callback = function(successObj){
      if(successObj.success){
        var Table = new PrettyTable({
          head: ["Previous Quantity".yellow, "Qty To Add".yellow, "New Quantity".yellow],
        });
        
        Table.push([successObj.previous_qty.toString().green, successObj.quantity.toString().green, successObj.new_stock.toString().green]);
          
        console.log("Stock Qty Updated Successfully!".cyan);
        console.log(Table.toString());
      }else{
        console.log("Stock Qty Failed to Update!\r\n".red);
      }

      console.log("_".repeat(60).white);
      manager_dashboard();
    };

    products.updateStockQty(item_id, answer.add_more, restart_callback)
    products.end();
  });
  
  return;
}

function add_new_product(){
  console.log("Preparing to add new product. We'll need to know the product name, department name, price, stock quantity, and a product description.".yellow)
  inquirer.prompt([
    {
      name: "product_name",
      type: "input",
      message: "Product Name?".red,
    },
    {
      name: "department_name",
      type: "input",
      message: "Department Name?".red,
    },
    {
      name: "price",
      type: "input",
      message: "Price?".red,
    },
    {
      name: "stock_qty",
      type: "number",
      message: "Stock Quantity?".red,
      validate: function(qty){
        if(isNaN(qty) === false){
          return true;
        }else{
          return false;
        }
      }
    },
    {
      name: "long_description",
      type: "input",
      message: "Product Description?".red,
    }
  ]).then(function(NewProductObj){
    var products = new Mydb();
    products.connect();
    products.create(NewProductObj);
    products.end();

    setTimeout(function(){
      products_for_sale()
    }, 1000);

    return manager_dashboard();
  });
}

/* ===============[ Manager Start Endpoint ]========================*/
manager_dashboard();
