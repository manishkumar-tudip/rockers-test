var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var router = express.Router();
var _ = require('lodash');
var path = require('path');
require('dotenv').config()

// Create the application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST);
mongoose.connection.once('open', function() {

  // Load the models.
  var models = require('./models/index');

  function updateText(searchText, result, placeHolder) {
    var replaceText = placeHolder === 'bold' ? "<b>"+result.replace(" ", "%")+"</b>" : "<i>"+result.replace(" ", "%")+"</i>";
      return _.replace(searchText, new RegExp(result, "gi"), replaceText);
  };

  router.get('/search', function(req, res) {
    var searchString = req.query.search;

    var searchKeys = searchString.split(' ');
    searchKeys.forEach(function(key, index){
      searchKeys[index] = new RegExp(key, "i");
    });
    models.brand.where('brand').in(searchKeys).exec(function(err, brands){
      if(err) {
        console.log(err);
      }
      if(brands.length) {
        brands.sort(function(a, b){ return b.brand.length - a.brand.length });

        brands.forEach(function(brand, index){
          searchString = updateText(searchString, brand.brand, 'bold');
        });
      }

      models.cloth.where('cloth').in(searchKeys).exec(function(err, cloths){
        if(err) {
          console.log(err);
        }
        if(cloths.length){
          cloths.sort(function(a, b){ return b.cloth.length - a.cloth.length });

          cloths.forEach(function(cloth, index){
            searchString = updateText(searchString, cloth.cloth, 'italic');
          });
        }
        res.send(searchString);
      });
    });
  });

  app.use('/api', router);
  app.use('/static', express.static(path.join(__dirname, 'public')));
  app.listen(process.env.PORT);
});
