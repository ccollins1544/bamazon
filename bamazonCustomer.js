/**
 * @package bamazon
 * @subpackage Customer 
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

/* ===============[ Sub Menus ]========================*/
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
        var Table = new PrettyTable({
          head: ["Sub Total".yellow, "Quantity".yellow, "Grand Total".yellow],
        });
        
        Table.push(["$".green + successObj.sub_total.toString().green, successObj.quantity.toString().green, "$".green + successObj.grand_total.toString().green]);
          
        console.log("Your item was purchased successfully!".cyan);
        console.log(Table.toString());
      }else{
        console.log("Insufficient Quantity!\r\n".red);
      }

      console.log("_".repeat(60).white);
      products_for_sale();
    };

    var products = new Mydb();
    products.connect();
    products.updateStockQty(itemID, (answer.how_many*(-1)), restart_callback)
    products.end();
  })
}

/* ===============[ Customer Start Endpoint ]========================*/
products_for_sale();
