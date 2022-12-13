var {mongoose} = require('./../connection/mongoose.js');
var {Product} = require('./../models/Product.js');

var products = [{

name:"Shamyana",
category:"Occasion",
description:"Shamyana made with fine quality material and resistant to tear in strong winds.",
owner:"Mahesh kumaar",
rent:800,
period:1,
ImgPath:"samyana.jpg",

},{

name:"Serial bulb",
category:"Occasion",
description:"Serial bulb set of fine quality with high intensity of light capability.",
owner:"Harish",
rent:300,
period:1,
ImgPath:"serialset.jpg",

},{

name:"Jewellery",
category:"Occasion",
description:"Custom jewellery set suitable for wearing to marriages and functions.",
owner:"Bheema Jewellers",
rent:10000,
period:1,
ImgPath:"jewels.jpg",

},{

name:"Percy Jackson",
category:"Books",
description:"Greek Mythology by Rick Riordan.",
owner:"Gautam Ram",
rent:1500,
period:2,
ImgPath:"book1.jpg",

},{

name:"Song of Ice and Fire",
category:"Books",
description:"George RR Martins' fantasy series.",
owner:"Rushvanth",
rent:1350,
period:2,
ImgPath:"book2.jpg",

},{

name:"Divergent",
category:"Books",
description:"Veronica Roth's fantasy thriller series.",
owner:"Mahesh",
rent:1000,
period:2,
ImgPath:"book3.jpg",

},{

name:"Bike",
category:"Automobiles",
description:"KTM RC 390",
owner:"Lokeshwar",
rent:5000,
period:1,
ImgPath:"bike.jpg",

},{

name:"Cycle",
category:"Automobiles",
description:"Torado Trax Star 20TT",
owner:"Harish",
rent:3000,
period:2,
ImgPath:"cycle.jpg",

},{

name:"Car",
category:"Automobiles",
description:"BMW 5 Series Sedan",
owner:"Aashish",
rent:10000,
period:1,
ImgPath:"car.jpg",

},{

name:"Air cooler",
category:"Electronics",
description:"Bajaj PCX 25 DLX",
owner:"Karthikeyan",
rent:3500,
period:2,
ImgPath:"aircooler.jpg",

},{

name:"Air Conditioner",
category:"Electronics",
description:"Hyundai HS4G33",
owner:"Gautam Ram",
rent:12000,
period:2,
ImgPath:"ac.jpg",

},{

name:"Camera",
category:"Electronics",
description:"Canon EOS 7D Mark 2",
owner:"Lokeshwar",
rent:3000,
period:1,
ImgPath:"camera.jpg",

},{

name:"Wardrobe",
category:"Furniture",
description:"Teak wood wardrobe with 4 doors ",
owner:"Akshay",
rent:2000,
period:2,
ImgPath:"wardrobe.jpg",

},{

name:"Bed",
category:"Furniture",
description:"Queen sized bed",
owner:"Dhanush",
rent:2000,
period:3,
ImgPath:"beds.jpg",

},{

name:"Shoerack",
category:"Furniture",
description:"2 Door Shoe cabinet",
owner:"Abilash",
rent:1800,
period:2,
ImgPath:"shoerack.jpg",

}];

for(let i=0;i<products.length;++i){

  let product = new Product(products[i]);

  product.save().then(() => {

    console.log("Inserted successfully");

  }).catch((err) => {

    console.log("Error");

  });


}
// let category = "Occasion";
// Product.find({category}).then((docs) => {
//
//   console.log(docs);
// 
// }).catch((err) => {
//
//   console.log(err);
//
// });
