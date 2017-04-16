var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
});

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  });

function run(){
  connection.query("SELECT * FROM products", function(err, res) {
    
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name +  " | " + res[i].price);
    };
    console.log("-----------------------------------");

    inquirer.prompt([

      {
        type:'input' ,
        message: "what is the ID number of the product you would like to buy?",
        name: "id"
      },
      {
        type: 'input',
        message: "how many would you like to buy?",
        name: "numberOf"
      },

    ]).then(function(info) {
      for (var x = 0; x < res.length; x++) {
        if (res[x].item_id == info.id){
          var amount = parseInt(info.numberOf);
          var stock = parseInt(res[x].stock_quantity);
          var price = parseFloat(res[x].price).toFixed(2);
          var final = price * amount;
          var itemId = res[x].item_id;
          inquirer.prompt([

            {
              type: "confirm",
              message: "Are you sure you want " + amount + " of " + res[x].product_name + " for a total cost of $" + final + " ?",
              name: "confirm",
              default: true
            }

          ]).then(function(info) {
               if(info.confirm === true && stock > 0){
                var newStock = stock - amount; 
                console.log(" ");
                connection.query("UPDATE products SET ? WHERE ?", [{
                   stock_quantity: newStock 
                  }, {
                  item_id: itemId
                  }], function(err, res) {
                    if (err) {
                    throw err
                    };
                  });
                console.log("Thank You, your order has been processed!")
                console.log(" ");
                run();
              };
              if (info.confirm === true && stock == 0){
                console.log("We're sorry, that Item is out of stock" );
                console.log(" ");
                run();
              };  
              if(info.confirm === false){ 
                run();
              };
          });

        };

      };

    });

  });
};

run();

// connection.end();