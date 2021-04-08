const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId  = require('mongodb').ObjectId;
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 6066;

app.use(cors());
app.use(bodyParser.json());



// console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1fla.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log('connection err', err)
const bookCollection = client.db("bookStore").collection("book");
const ordersCollection = client.db("bookStore").collection("orders");


app.get('/orders', (req, res) => {
  console.log(req.query.email);
  ordersCollection.find({email: req.query.email})
  .toArray((err, items) => {
    console.log(err, items);
      res.send(items);
  })
})
app.post('/addOrder', (req, res) => {
  const order = req.body;
  // console.log('adding new book:', order) 
  ordersCollection.insertOne(order)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})
app.get('/books', (req, res) => {
      bookCollection.find({})
      .toArray((err, items) => {
        console.log(err, items);
          res.send(items);
      })
  })
  app.get('/book/:id', (req, res) => {
      bookCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, items) => {
        // console.log(err, items);
          res.send(items[0]);
      })
  })

app.post('/addBook', (req, res) => {
    const newBook = req.body;
    console.log('adding new book:', newBook)
    bookCollection.insertOne(newBook)
    .then(result => {
        // console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.delete('/deleteBook/:id' , (req,res)=>{
  const id = ObjectId(req.params.id)
  bookCollection.findOneAndDelete({_id: id})
  .then((err,items)=>{
    res.send(items.deleteCount > 0)
  })
})

//   client.close();
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})