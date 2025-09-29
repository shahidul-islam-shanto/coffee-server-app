const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mango.90xw8zf.mongodb.net/?retryWrites=true&w=majority&appName=mango`;
console.log(uri);

// const uri =
//   "mongodb+srv://coffee-app:XA1yxKfL8kp9WXyU@mango.90xw8zf.mongodb.net/?retryWrites=true&w=majority&appName=mango";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("user");

    /** post and create coffee start task-1 */
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });
    /** post and create coffee end task-1 */

    /** show this coffee start task-2 */
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    /** show this coffee end task-2 */

    /**  delete coffee start task-3 */
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    /**  delete coffee end task-3 */

    /** update this coffee start task-4 */
    /** coffee find start */
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    /** coffee find end */
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffees = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateCoffeeItem = {
        $set: {
          name: updatedCoffees.name,
          quantity: updatedCoffees.quantity,
          supplier: updatedCoffees.supplier,
          taste: updatedCoffees.taste,
          category: updatedCoffees.category,
          details: updatedCoffees.details,
          url: updatedCoffees.url,
        },
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updateCoffeeItem,
        option
      );
      res.send(result);
    });
    /** update this coffee end task-4 */

    /**user related apis start */
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    /**user related apis end */

    /**  show users related apis start */
    app.get("/showUsers", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
    /**  show users related apis end */
    /** delete users start */
    app.delete("/showUsers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    /** delete users end */

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("simple crud operation in running", port);
});
