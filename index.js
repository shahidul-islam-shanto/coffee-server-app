const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Simple CRUD IS RUNNING");
});

// name: coffee-app
// password: XA1yxKfL8kp9WXyU
console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion } = require("mongodb");
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("simple crud operation in running", port);
});
