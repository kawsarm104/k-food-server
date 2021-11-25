const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
var cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

//mongodb connection

const uri = process.env.MONGO_CONNECTION

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");
    const database = client.db("kfood");

    /* services collection */
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders");

    // get services api //
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.json(services);
    });
    // get services api //
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const allOrder = await cursor.toArray();
      res.json(allOrder);
      // console.log("got order");
      // res.send("got order");
    });
    // GET API FOR SINGLE SERVICE DETAILS
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;

      // console.log("id api hitted", id)
      const query = { _id: ObjectId(id) };
      const singleServiceDetails = await serviceCollection.findOne(query);
      res.json(singleServiceDetails);
      // res.send("id paici ")
    });
    // GET API FOR MANAGE ALL ORDERS

    //   POST API FOR SAVING DATA IN DATABASE FROM CLIENT SITE
    app.post("/services", async (req, res) => {
      console.log("hit the post api ");
      const serviceItem = req.body;

      const result = await serviceCollection.insertOne(serviceItem);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
      //   res.send("post hitted")
    });
    // POST API FOR SHIPPING /ORDERS
    app.post("/orders", async (req, res) => {
      // const order = req.body;

      const order = { ...req.body, status: "pending" };

      // console.log("orders paiciiii",order);
      const result = await orderCollection.insertOne(order);

      res.json(result);
    });
    /*


// DELETING ITEM 
    
    */

    // DELETE SINGLE DOCS
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      // console.log("deleted the id", id)
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    // DELETE SINGLE DOCS
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      // console.log("deleted the id", id)
      const result = await serviceCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
