require("dotenv").config();
var dbconf = require("./dbconf.js");
var mysql = require("mysql");
var PrettyTable = require("cli-table2");
var colors = require("colors");

/**
 * Mydb
 * Connects to mysql database and this constructor has all the CRUD functions (Create, Read, Update, Delete) 
 * for manipulating the database.
 * 
 * @param {*} myTable 
 * @param {*} mySearchField 
 */
var Mydb = function(myTable, mySearchField) {
  this.dbTable = (myTable === undefined) ? "products" : myTable;
  this.searchField = (mySearchField === undefined) ? "item_id" : mySearchField;

  this.connection = mysql.createConnection(dbconf.credentials);
  
  // NOTE: Before running queries we must connect to the database first. We have this function so we can initiate a connection
  // through the constructor object before trying to run any queries. 
  this.connect = function(debug=false){
    var that = this;
    this.connection.connect(function(error){
      if(error) throw error;
      if(debug) console.log("Connected as id " + that.connection.threadId);
    });
  };

  // NOTE: If we close the connection in each query function we can't run anymore queries. 
  // So this function was created so we can close the connection through the constructor object when we are done. 
  this.end = function(){
    this.connection.end();
  };
  
  //===========================[ CREATE ]===========================================
  this.create = function(fieldsKeyVal, cb = this.loopObject){
    if(typeof(fieldsKeyVal) != 'object' ){ return; } // GTFO

    var that = this;
    var query = this.connection.query(
      "INSERT INTO " + this.dbTable + " SET ?",
      fieldsKeyVal,
      function(error, results){
        if(error) throw error;

        console.log(results.affectedRows + " " + that.dbTable + " inserted!\r\n");
        cb(results);
      }
    );

    console.log(query.sql);
  };

  //===========================[ READ ]=============================================
  // NOTE: to access any of these query functions we must call connect() through the constructor object
  // Then we must close the connection when we are done with end();
  this.query = function(sql){
    if(sql === undefined){ return; } // GTFO

    this.connection.query(sql, function(error, results, fields){
      if(error) throw error;
    
      console.log("\r\n"+sql);
      console.log(results.length + " affected rows!");
      console.log("_".repeat(sql.length));

      var top_row = [];
      var rows = [];

      for (var i=0; i < results.length; i++){
        var cells = [];

        for(var property in results[i]){
          if(results[i].hasOwnProperty(property)){
            // console.log(property + ": " + results[i][property]);

            if(top_row === undefined || top_row.length < Object.keys(results[i]).length ){
              top_row.push(property.red);
            }
            cells.push(results[i][property].toString().green);
          }
        }

        // console.log("_".repeat(sql.length));
        rows.push(cells);  
      }

      var Table = new PrettyTable({
        head: top_row,
      });
      
      for(var r=0; r < rows.length; r++){
        Table.push(rows[r]);
      }
  
      console.log(Table.toString());
    });
  };
  
  // Query multiple records
  this.querySelect = function(sql, callback = this.loopArrayObject){
    if(sql === undefined){ return; } // GTFO
    var results_arr = [];
    
    this.connection.query(sql, function(error, results){
      if(error) throw error;

      console.log("\r\n"+sql);
      console.log("Selected " + results.length + " number of rows.");
      console.log("_".repeat(sql.length));
      
      for (var i=0; i < results.length; i++){
        var row = [];
        for(var property in results[i]){
          if(results[i].hasOwnProperty(property)){
            row[property]=results[i][property];
          }
        }
        results_arr.push(row);
      }

      // console.log("RESULTS",results_arr);
      return callback(results_arr);
    });
  };
  
  // Query a single record
  this.querySingleRec = function(sql, callback = this.loopObject){
    if(sql === undefined){ return; } // GTFO
    
    this.connection.query(sql, function(error, results){
      if(error) throw error;
      
      console.log("\r\n"+sql);
      console.log("Selected " + results.length + " number of rows.");
      console.log("_".repeat(sql.length));
      
      for (var i=0; i < results.length; i++){
        var row = [];
        for(var property in results[i]){
          if(results[i].hasOwnProperty(property)){
            row[property]=results[i][property];
          }
        }

        // console.log("ROW",row);
        return callback(row);
      }
    });
  };

  //===========================[ UPDATE ]===========================================
  this.updateFields = function(fieldsKeyVal, whereKeyVal, cb = this.loopObject){
    if( typeof(fieldsKeyVal) != 'object' || typeof(whereKeyVal) != 'object' ){ return; } // GTFO

    var that = this;
    var query = this.connection.query(
      "UPDATE " + this.dbTable + " SET ? WHERE ?",
      [fieldsKeyVal , whereKeyVal],
      function(error, results){
        if(error) throw error;

        console.log(results.affectedRows + " " + that.dbTable + " updated!\r\n");
        cb(results);
      }
    );

    console.log(query.sql);
  };

  //===========================[ DELETE ]===========================================
  this.delete = function(whereKeyVal, cb = this.loopObject){
    if(typeof(whereKeyVal) != 'object' ){ return; } // GTFO

    var that = this;
    var query = this.connection.query(
      "DELETE FROM " + this.dbTable + " WHERE ?",
      whereKeyVal,
      function(error, results){
        if(error) throw error;

        console.log(results.affectedRows + " " + that.dbTable + " deleted!\r\n");
        cb(results);
      }
    );

    console.log(query.sql);
  };

  //===========================[ Default Callbacks ]=================================
  // Loop through an array of objects
  this.loopArrayObject = function (resultsArray){
    var top_row = [];
    var rows = [];

    for(var i=0; i < resultsArray.length; i++){
      var cells = [];

      for(var property in resultsArray[i]){
        if(resultsArray[i].hasOwnProperty(property)){
          // console.log(property + ": " + resultsArray[i][property]);
          if(top_row === undefined || top_row.length < Object.keys(resultsArray[i]).length ){
            top_row.push(property.red);
          }
          cells.push(resultsArray[i][property].toString().green);
        }
      }

      // console.log("_______________________________________");
      rows.push(cells);    
    }
    
    var Table = new PrettyTable({
      head: top_row,
    });
    
    for(var r=0; r < rows.length; r++){
      Table.push(rows[r]);
    }

    console.log(Table.toString());
  };

  // Loop through an object
  this.loopObject = function(resultsObject){
    var top_row = [];
    var rows = [];
    var cells = [];

    for(var property in resultsObject){

      if(resultsObject.hasOwnProperty(property)){
        // console.log(property + ": " + resultsObject[property]);
        if(top_row === undefined || top_row.length < Object.keys(resultsObject).length){
          top_row.push(property.red);
        }
        cells.push(resultsObject[property].toString().green);
      }
    }

    rows.push(cells);

    var Table = new PrettyTable({
      head: top_row,
    });
    
    for(var r=0; r < rows.length; r++){
      Table.push(rows[r]);
    }

    console.log(Table.toString());
  };

  // Just return the results
  this.returnResults = function(data){ return data; };

  // Do nothing function is just used as a dummy callback.
  this.emptyFunction = function(data){ return; }

  //===========================[ Helpers ]=================================
  this.fetchRow = function(id){
    if(id === undefined){ return; } // GTFO
    var q = "SELECT * FROM " + this.dbTable + " WHERE " + this.searchField + " = '" + id + "';";
    return this.querySingleRec(q);
  }

  this.fetchRows = function(id){
    if(id === undefined){ return; } // GTFO
    var q = "SELECT * FROM " + this.dbTable + " WHERE " + this.searchField + " = '" + id + "';";
    return this.querySelect(q);
  }

  this.fetchRowsLike = function(id){
    if(id === undefined){ return; } // GTFO
    var q = "SELECT * FROM " + this.dbTable + " WHERE " + this.searchField + " LIKE '%" + id + "%';";
    return this.querySelect(q);
  }

  this.fetchValue = function(id,field){
    if(id === undefined || field === undefined){ return; } // GTFO
    var q = "SELECT " + field + " FROM " + this.dbTable + " WHERE " + this.searchField + " = '" + id + "';";
    return this.querySingleRec(q);
  }

  this.fetchFields = function(id, fields){
    if(id === undefined || fields === undefined){ return; } // GTFO

    var fieldNames = "`";
    if(fields instanceof Array && typeof (fields) == 'object'){
      fieldNames += fields.join("`,`");
    }else{
      fieldNames += fields 
    }
    fieldNames += "`";

    var q = "SELECT " + fieldNames + " FROM " + this.dbTable + " WHERE " + this.searchField + " = '" + id + "';";
    return this.querySingleRec(q);
  }

  this.fetchIDArray = function (idsArray){
    var queryANDstring = "";
    var queryORstring = "";

    if(idsArray instanceof Array && typeof(idsArray) == 'object'){
      for(var a in idsArray){
        queryANDstring += "`" + this.searchField + "` LIKE '%" + idsArray[a] + "%' AND "; 
        queryORstring += "`" + this.searchField + "` LIKE '%" + idsArray[a] + "%' OR ";
      }

      queryANDstring = queryANDstring.replace(/ AND +$/, "");
      queryORstring = queryORstring.replace(/ OR +$/, "");

    }else{
      return this.fetchRowsLike(idsArray);
    }

    // BUILD THE QUERY
    var qAND = "SELECT * FROM " + this.dbTable + " WHERE " + queryANDstring + ";";
    var qOR = "SELECT * FROM " + this.dbTable + " WHERE " + queryORstring + ";";

    var that = this;
    var tryQOR = function(results){
      if(results.length === 0 ){
        var dummyObject = new Mydb(that.dbTable, that.searchField);
        dummyObject.connect();
        dummyObject.querySelect(qOR);
        dummyObject.end();
        return;
      }

      return that.loopArrayObject(results);
    };

    return this.querySelect(qAND, tryQOR);
  };

  this.countByID = function(id){
    var q = "SELECT COUNT(*) as `count` FROM " + this.dbTable + " WHERE " + this.searchField + " = '" + id + "';";
    return this.querySingleRec(q);
  };

  this.getColumns = function(table){
    if(table === undefined){
      table = this.dbTable;
    }

    var justColumns = function(results){
      var rows = [];

      for(var i=0; i < results.length; i++){
        var cells = [];

        for(var property in results[i]){
          if(property === "Field"){
            // console.log(results[i][property]);
            cells.push(results[i][property].toString().green);
          }
        }

        rows.push(cells);   
      }

      var Table = new PrettyTable({
        head: ["Field".red],
      });
      
      for(var r=0; r < rows.length; r++){
        Table.push(rows[r]);
      }
  
      console.log(Table.toString());
    };

    return this.querySelect("DESCRIBE " + table, justColumns);
  };

  this.columnExists = function(col, table){
    if(table === undefined){
      table = this.dbTable;
    }

    var columnFound = function(results){
      for(var i=0; i < results.length; i++){
        for(var property in results[i]){
          if(property === "Field"){
            if(results[i][property] == col){
              console.log(true);
              return;
            }
          }
        }
      }

      console.log(false);
      return;
    };

    return this.querySelect("DESCRIBE " + table, columnFound);
  };

}; // END Mydb

module.exports = Mydb;