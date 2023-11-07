const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

// 2nd step code copy from mongodb drivers
// console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imaeduf.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection

    const usersCollection = client.db('quellDB').collection('users');
    const blogsCollection = client.db('quellDB').collection('blogs');
    const wishCollection = client.db('quellDB').collection('wishlist');
    //user
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    })
    // user data end 
    // all blog data start
    app.get('/blogs', async (req, res) => {
      const cursor = blogsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/blogs', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await blogsCollection.insertOne(newUser);
      res.send(result);
    })

    // all blog data end
    // wish list start
    app.get('/wishlist', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = wishCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/wishlist', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await wishCollection.insertOne(newUser);
      res.send(result);
    })
    // wish list end
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ......2nd end 

app.get('/', (res, req) => {
  res.send('server is running');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})