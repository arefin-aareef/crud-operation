const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// arefinaareef
// 4uHsGMPdLqwHIYoy


const uri = "mongodb+srv://arefinaareef:4uHsGMPdLqwHIYoy@cluster0.sypbrfe.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usrCollection = client.db("usersDB").collection("users");

    app.get('/users', async(req, res) => {
      const cursor = usrCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await usrCollection.findOne(query)
      res.send(user)
    })

    app.post('/users', async(req, res) => {
        const user = req.body;
        const result = await usrCollection.insertOne(user);
        res.send(result);
    })

    app.put('/users/:id', async(req, res) => {
      const id = req.params.id;
      const user = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await usrCollection.updateOne(filter, updatedUser,options)
      res.send(result)
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      const result = await usrCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Simple crud is running...')
})

app.listen(port, () => {
    console.log(`Site is running on port, ${port}`);
})