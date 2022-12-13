require('dotenv').config({path: __dirname + '/../.env'});
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyparser = require('body-parser');
var session = require('express-session');
var http = require('http');
var socketIO = require('socket.io');
var hbs = require('hbs');
var multer = require('multer');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var {User} = require('./models/User.js');
var {mongoose} = require('./connection/mongoose.js');
var {Product} = require('./models/Product.js');
var upload = multer({dest : 'server/Images'});
var {authenticate} = require('./middleware/authenticate.js');
var {authenticateAJAX} = require('./middleware/authenticateAJAX.js');
var {Category} = require('./models/Category.js');
var {saleDetail} = require('./models/SaleDetails.js');

hbs.registerPartials(__dirname + '/../ui/views');
app.use(express.static(__dirname + '/static/About'));
app.use(express.static(__dirname + '/static/Images'));
app.use(express.static(__dirname + '/static/support-us'));
app.use(express.static(__dirname + '/static/animated icon'));
app.use(express.static(__dirname + '/Images'));
app.set('view engine','hbs');
app.set('views',path.join(__dirname,'../ui/views'));
app.use(morgan('combined'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));
app.use(session({

    secret : 'vamefa00',
    cookie : {maxage : 30*24*60*60*1000},
    resave : false,
    saveUninitialized : true
}));

hbs.registerHelper('display',(data,template) => {

    var ret = "<div class='row rowModify'>";

    for(let i=0;i < data.length;i++){

        if((i+1) % 3 === 0){

            ret += template.fn(data[i]);
            ret += "</div><div class='row rowModify'>"

        }else{

            ret += template.fn(data[i]);

        }
    }

    ret += "</div>"

    return ret;

});

io.on('connection',(socket) => {

  socket.on('joinChatRoom',(data) => {

    socket.join('customercare');

  });

  socket.on('newMessage',(message) => {

    socket.broadcast.to('customercare').emit("serverMessage",message);

  });

  socket.on('disconnect',() => {

    socket.leave('customercare');

  });

});

app.get("/",(req,res) => {

    req.session.lvpage = {src : "categories.html"};
    res.status(200).sendFile(path.join(__dirname,'../ui','home.html'));

});

app.get("/home.html",(req,res) => {

    req.session.lvpage = {src : "categories.html"};
    res.status(200).sendFile(path.join(__dirname,'../ui','home.html'));

});

app.get("/favicon.ico",(req,res) => {

  res.status(200).sendFile(path.join(__dirname,'favicon.ico'));

});

app.get("/embed.html",(req,res) => {

    res.status(200).sendFile(path.join(__dirname,'../ui','embed.html'));

});

app.get("/embed1.html",(req,res) => {

    res.status(200).sendFile(path.join(__dirname,'../ui','embed1.html'));

});

app.get("/responsive.html",(req,res) => {

    res.status(200).sendFile(path.join(__dirname,'../ui','responsive.html'));

});

app.get("/responsive1.html",(req,res) => {

    res.status(200).sendFile(path.join(__dirname,'../ui','responsive1.html'));

});

app.get("/shopregister.html",(req,res) => {

    res.status(200).sendFile(path.join(__dirname,'../ui','shopregister.html'));

});

app.get("/userregister.html",(req,res) => {

    res.status(200).sendFile(path.join(__dirname,'../ui','userregister.html'));

});

app.get("/login.html",(req,res) => {

  res.status(200).sendFile(path.join(__dirname,'../ui','login.html'));

});

app.get("/newProduct.html",(req,res) => {

  req.session.lvpage = {src : "newProduct.html"};
  res.status(200).sendFile(path.join(__dirname,'../ui','newProduct.html'));

});

app.get("/jquery.min.js",(req,res) => {

  res.status(200).sendFile(path.join(__dirname,'../jquery.min.js'));

});

app.post('/register-user',(req,res) => {

  var userObject = {

    name : req.body.name,
    mailid : req.body.mailid,
    password : req.body.password,
    phone : req.body.phone,
    address : req.body.address

  };

  var user = new User(userObject);

  user.save().then(() => {

      user.generateAuthToken().then((token) => {

          req.session.auth = {sessionId : token};
          let obj = {source:req.session.lvpage.src};
          res.status(200).send(obj);

      }).catch((err) => {

          res.status(403).send("Failure");

      });

  }).catch((err) => {

      res.status(403).send("Failure");

  });

});

app.post("/login",(req,res) => {

  var mailid = req.body.mailid;
  var password = req.body.password;

  User.findByCredentials(mailid,password).then((user) => {

    user.generateAuthToken().then((token) => {

      req.session.auth = {sessionId : token};
      let obj = {source : req.session.lvpage.src}
      res.status(200).send(obj);

    }).catch((err) => {

        res.status(403).send("Failure");

    });

  }).catch((err) => {

      res.status(403).send("Failure");

  });

});

app.get("/check-login",authenticateAJAX,(req,res) => {

  res.status(200).send("Logged in");

});

app.get("/categories.html",(req,res) => {

  req.session.lvpage = {src : "categories.html"};
  Category.find({}).then((categories) => {

    if(categories.length === 0){

      res.status(403).render('errorFile',{errorMessage : "The products are not available right now. Visit again later."});

    }else{

      res.status(200).render('category',{categories});

    }

  }).catch((err) => {

    res.status(500).render('errorFile',{errorMessage : "Some error occurred at the server end. Sorry for the inconvenience."});

  });

});

app.get("/logout.html",(req,res) => {

  var token = req.session.auth.sessionId;

  User.findByToken(token).then((user) => {

    user.tokens = [];
    user.save().then(() => {

      res.status(200).render('logout');

    }).catch((err) => {

      return Promise.reject();

    });

  }).catch((err) => {

    res.status(403).render('errorFile',{errorMessage:"You could not be logged out right now."});

  });

});

app.get("/product",(req,res) => {

  var id = req.query.id;
  req.session.lvpage = {src : "product?id=" + id };
  Product.findById(id).then((product) => {

    if(!product){

      res.status(403).render('errorFile',{errorMessage : "The products are not available right now. Visit again later."});

    }else{

      res.status(200).render('productDesc',product);

    }

  }).catch((err) => {

    res.status(500).render('errorFile',{errorMessage : "Some error occurred at the server end. Sorry for the inconvenience."});

  });


});



app.get("/:category",(req,res) => {

    let category = req.params.category;
    req.session.lvpage = {src : category};
    Product.find({category}).then((products) => {

      if(products.length === 0){

        res.status(403).render('errorFile',{errorMessage : "The products are not available right now. Visit again later."});

      }else{

        res.status(200).render('productList',{products});

      }

    }).catch((err) => {

      res.status(500).render('errorFile',{errorMessage : "Some error occurred at the server end. Sorry for the inconvenience."});

    });

});

app.post("/check-valid-category",(req,res) => {

  let category = req.body.category;

  Category.findOne({category}).then((doc) => {

    res.status(200).send();

  }).catch((err) => {

    res.status(404).send();

  });

});

app.post("/add-product",authenticateAJAX,upload.single('productImage'),(req,res) => {

  var productObject = {

    name : req.body.name,
    category : req.body.category,
    owner : req.user.name,
    description : req.body.description,
    rent : req.body.rent,
    period : req.body.period,
    ImgPath : req.file.filename

  };

  var product = new Product(productObject);

  product.save().then(() => {

    res.status(200).send("Success");

  }).catch((err) => {

    res.status(403).send("Failure");

  });


});

app.post("/rent-product",authenticate,(req,res) => {

  let rent = parseInt(req.body.rent);

  var cost = rent + (0.12 * rent);

  var obj = {

    productName : req.body.productname,
    userName : req.user.name,
    cost ,
    period : req.body.period

  };

  var sale = new saleDetail(obj);

  sale.save().then(() => {

    Product.findByIdAndRemove(req.body.id).then((product) => {

      res.status(200).render('saleSuccess',obj);

    }).catch((err) =>{

      // Do Nothing

    });

  }).catch((err) => {

    res.status(403).render('errorFile',{errorMessage : "The sale could not be made right now. Sorry for the inconvenience."});

  });

});


var port = process.env.PORT || 8000;

server.listen(port , function(){

   console.log("Server listening at port " + port);

});