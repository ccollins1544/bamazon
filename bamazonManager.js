var inquirer = require("inquirer");
var Mydb = require("./Mydb");
var PrettyTable = require("cli-table2");
var colors = require("colors");

function manager_dashboard(){
  inquirer.prompt({ 
    name: "menu_option",
    type: "list",
    message: "Select a menu option:",
    choices: ["View Products For Sale","View Low Inventory","Add to Inventory","Add New Product"]
  }).then(function(answer){
    // console.log(answer);
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

function products_for_sale(){
  var products = new Mydb();
  products.connect();
  products.querySelect("select item_id,product_name,price,stock_qty from products");
  products.end();
  manager_dashboard();
}

function view_low_inventory(count=5){
  var sql="select item_id,product_name,price,stock_qty from products as p where p.stock_qty < " + count;
  var products = new Mydb();
  products.connect();
  products.querySelect(sql)
  products.end();
  manager_dashboard();
}

function add_to_inventory(){
  var products = new Mydb();
  products.connect();
  products.querySelect("select item_id,product_name,price,stock_qty from products");
  products.end();

  inquirer.prompt({
    name: "id",
    type: "number",
    message: "Select what item_id you want to add more of:".red,
    validate: function(id){
      if(isNaN(id) === false){
        return true;
      }
      return false;
    }
  }).then(function(answer){
    update_inventory(answer.id)
  });
}

function update_inventory(item_id){
  var products = new Mydb();
  products.connect();
  products.fetchFields(item_id,["item_id","product_name","price","stock_qty"]);

  inquirer.prompt({
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
  }).then(function(answer){
    console.log("ok we need to add " + answer.add_more + " many more....");
  });
}


function add_new_product(){

}


manager_dashboard();