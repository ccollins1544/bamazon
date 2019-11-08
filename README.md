# bamazon

Amazon-like storefront using mysql and node cli for the client side. 

**Note:** this is a demo proof-of-concept store application not for real purchases. 

## Features
* A customer can **select an item for purchase** from a list queried from mysql. After that they can specify how much of that item they want.
* A manager can **view products for sale**.
* A manager can **view low inventory**.
* A manager can **add to inventory**.
* A manager can **add new product**.

## Prerequisites

In order to use the app you will need to download and install a few things. 
1. Download and install [Git for Windows](https://gitforwindows.org/)
2. Download and install [NodeJS](https://nodejs.org/en/download/)
3. Download this repository by opening **Git For Windows** and running,
```
git clone https://github.com/ccollins1544/bamazon.git
```
4. After running the above command you'll need to *cd* into the directory like this,
```
cd bamazon
```
5. Once you're in the application directory we need to setup NPM by entering the command,
```
npm init
```
and then do,
```
npm install
```
If those two commands ran with no errors you're all set to create the database in the next steps.

6. Use the schema file **bamazonSchema.sql** to create the database **bamazon** with the **products** table.

7. In order for the application to have access to the database we need to setup a `.env` file under the root folder `bamazon`. Use the following template to create your `.env` file,
```
# Database Connection Credentials
HOST=localhost
PORT=3306
USER=root
PASSWORD=xxxxxxx
DATABASE=bamazon
```

**NOTE:** Depending on what version of mysql you are using you might have to ***grant access to node*** for the node application to connect to the database. Run the following query to resolve the issue using the correct password, 
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
```

8. (optional) Import the `products_seeds.csv` file into the `products` table. Or you can import you're own data. That's it! 

## Using bamazon

**To use bamazon as a customer** use the following command in the root `bamazon` directory.
```
node bamazonCustomer.js
```
Follow the prompts shown. You'll be presented with an item for purchase.

**To use bamazon as a manager** use the following command in the root `bamazon` directory.
```
node bamazonManager.js
```
Follow the prompts shown. You'll be presented with a list of options listed in [features section](#features) above. 

### Video Demo
* [![bamazon Video Example](https://img.youtube.com/vi/Zl2vLLJnrxU/0.jpg)](https://www.youtube.com/watch?v=Zl2vLLJnrxU)

### Programs and Libraries Used
* [Git for Windows](https://gitforwindows.org/)
* [NodeJS](https://nodejs.org/en/download/)
* [MySQL Workbench](https://www.mysql.com/products/workbench/)
* NPM Libraries: inquirer, mysql, cli-table2, colors, dotenv.

### Credit
* [Christopher Collins](https://ccollins.io) *Lead Developer*