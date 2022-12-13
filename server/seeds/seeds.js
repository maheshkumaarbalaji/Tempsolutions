var {mongoose} = require('./../connection/mongoose.js');
var {Category} = require('./../models/Category.js');

var categories = [{

  name : "Occasion",
  description : "Find varieties of items for house hold occasions and functions",
  ImgPath : "occasion.jpg"

},{

  name : "Books",
  description : "See all kinds of educational books, novels etc.",
  ImgPath : "book.jpg"

},{

  name : "Automobiles",
  description : "View rental automobiles like car, bike etc.",
  ImgPath : "automobiles.jpg"

},{

  name : "Electronics",
  description : "Variety of electronic items for rent",
  ImgPath : "electronics.jpg"

},{

  name : "Furniture",
  description : "Teak wood and best quality furnitures for rent.",
  ImgPath : "furniture.jpg"

}];

for(let i=0;i<categories.length;++i){

  let category = new Category(categories[i]);

  category.save().then(() => {

    console.log("Inserted successfully");

  }).catch((err) => {

    console.log("Error");

  });


}
