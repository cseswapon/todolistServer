const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri =
  "mongodb+srv://swaponsaha94:6sM50eC5HiD9Q8wW@cluster0.i9ewzjh.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let database, todo;

async function run() {
  try {
    await client.connect();
    database = client.db("ToDoList");
    todo = database.collection("todo");
    console.log("DataBase Connected");
  } finally {
    // Note: We're not closing the client here to keep the connection open for the server.
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ message: "Server Side is running" });
});

app.get("/todo", async (req, res) => {
  const cursor = todo.find({});
  const results = await cursor.toArray();
  res.send(results);
});

app.post("/todo", async (req, res) => {
  const newTask = req.body;
  try {
    const result = await todo.insert(newTask);
    res.status(201).send(result.ops[0]);
  } catch (error) {
    res.status(500).send({ message: "Failed to create task" });
  }
});

app.put("/todo/:id", async (req, res) => {
  const id = req.params.id;
  const attach = req.query.attach;
  console.log(attach);
  try {
    const filter = { _id: new ObjectId(id) };
    // return console.log(filter);
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        attach: Number(attach),
      },
    };
    const result = await todo.updateOne(filter, updateDoc, options);
    res.json(result);
  } catch (error) {
    res.send({message:'Something went wrong'})
  }
});

app.listen(port, () => {
  console.log("Server is listening on port", port);
});
