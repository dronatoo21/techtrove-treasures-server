const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcccoqk.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const productCollection = await client.db('productDB').collection('product')
    const brandCollection = await client.db('productDB').collection('brand')
    const cartCollection = await client.db('productDB').collection('cart')

    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result) 
    })

    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/cart', async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await cartCollection.insertOne(newProduct)
      res.send(result) 
    })

    app.get('/product', async (req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true};
      const updateProduct = req.body
      const Product = {
        $set: {
          imageUrl: updateProduct.imageUrl,
          name: updateProduct.name,
          price: updateProduct.price,
          type: updateProduct.type,
          brandName: updateProduct.brandName,
          ratings : updateProduct.ratings
        }
      }
      const result = await productCollection.updateOne(filter, Product, options)
      res.send(result)

    })

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    app.get('/brand', async (req, res) => {
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
        // console.log(result);
    })

   app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
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
    res.send('server is running') 
})


app.listen(port, () => {
    console.log(`server listening on port: ${port}`);
})