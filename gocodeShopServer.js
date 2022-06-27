import * as fsp from "fs/promises";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const Product = mongoose.model("Product", {
  title: String,
  price: Number,
  description: String,
});

app.use(express.static("client/build"));

app.post("/api/products", (req, res) => {
  const { title, price, description } = req.body;
  Product.insertMany([
    {
      title,
      price,
      description,
    },
  ]).then((products) => {
    res.send(products);
  });
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  Product.findById(id)
    .then((product) => {
      res.send(product);
    })
    .catch((e) => res.send("ERROR!!!!!!!!!!!!!!!"));
});

app.get("/api/products/", (req, res) => {
  Product.find()
    .then((products) => {
      res.send(products);
    })
    .catch((e) => res.send(`ERROR! ${e}`));
});

app.patch("/api/products/:id", (req, res) => {
  const { id } = req.params;

  Product.findByIdAndUpdate(id, req.body)
    .then((products) => res.send(products))
    .catch((e) => res.send("ERRORRRRR!!!!!!"));
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  Product.findByIdAndRemove(id)
    .then((product) => res.send(product))
    .catch((e) => res.send("ERRRORRRR!"));
});

// app.get("/api/products", (req, res) => {
//   fsp.readFile("./products.json", "utf8").then((data) => res.send(data));
// });

// app.get("/api/products/:id", (req, res) => {
//   fsp.readFile("./products.json", "utf8").then((data) => {
//     // console.log(id);
//     const products = JSON.parse(data);
//     const product = products.find((product) => product.id === +req.params.id);
//     if (product) {
//       res.send(product);
//     } else {
//       res.send("Balagan");
//     }
//   });
// });

// function getMaxId(arr) {
//   const ids = arr.map((object) => {
//     return object.id;
//   });
//   const max = Math.max(...ids);
//   return max;
// }

// app.post("/api/products", (req, res) => {
//   console.log("req.body", req.body);
//   fsp.readFile("./products.json", "utf8").then((data) => {
//     const products = JSON.parse(data);
//     products.push({
//       id: getMaxId(products) + 1,
//       title: req.body.title,
//       price: req.body.price,
//       description: req.body.description,
//       category: req.body.category,
//       image: req.body.image,
//       rating: req.body.rating,
//     });
//     fsp.writeFile("./products.json", JSON.stringify(products));
//     res.send(products);
//   });
// });

// app.patch("/api/products/:id", (req, res) => {
//   const { id } = req.params;
//   // const { title } = req.body;
//   fsp.readFile("./products.json", "utf8").then((data) => {
//     if (req.body) {
//       const products = JSON.parse(data);
//       const productIndex = products.findIndex((product) => product.id === +id);
//       products[productIndex] = { ...products[productIndex], ...req.body };
//       fsp.writeFile("./products.json", JSON.stringify(products)).then(() => {
//         res.send(products);
//       });
//       console.log("req.params", req.params);
//       console.log("req.body", req.body);
//     }
//     console.log("else");
//   });
// });
// app.delete("/api/products/:id", (req, res) => {
//   const { id } = req.params;

//   fsp.readFile("./products.json", "utf8").then((data) => {
//     if (req.body) {
//       const products = JSON.parse(data);
//       const productIndex = products.findIndex((product) => product.id === +id);
//       products.splice(productIndex, 1);
//       fsp.writeFile("./products.json", JSON.stringify(products)).then(() => {
//         res.send(products);
//       });
//     }
//   });
// });

// app.get("/api/products", (req, res) => {
//   console.log("req.query", req.query);
//   fsp.readFile("./products.json", "utf8").then((data) => {
//     const products = JSON.parse(data);
//     if (req.query) {
//       const { description } = req.query;
//       const filteredProducts = products.filter((product) =>
//       product.description.toLowerCase().includes(description.toLowerCase())
//       );
//       res.send(filteredProducts);
//     } else {
//       res.send(products);
//     }
//   });
// });

// app.get("/api/products/:id", (req, res) => {
//   console.log("req.ip", req.ip);
//   const { id } = req.params;
//   console.log("id", id);
//   fsp.readFile("./products.json", "utf8").then((data) => {
//     const products = JSON.parse(data);
//     const product = products.find((product) => product.id === +id);
//     if (product) {
//       res.send(product);
//     } else {
//       res.send("Lech abaita");
//     }
//   });
// });

app.get("*", (req, res) => {
  res.sendFile("/client/build/index.html");
});

const { DB_NAME, DB_HOST, DB_USER, DB_PASS } = process.env;
const PORT = process.env.PORT || 8000;
// mongoose.connect("mongodb://localhost:27017/GoCodeShop").then(() => {
mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`)
  .then(() => {
    console.log(`Listening on port ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
