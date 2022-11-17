const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());



// ZhpWvHKJM68Yqx16
// doctors-portal


const url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.9zcs4sa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {

        // Appointment database
        const data = client.db("doctors-portal").collection("appointmentOption");

        // Booking collection data base.
        const bookingCollection = client.db('doctors-portal').collection("bookings");

        // const doc = {
        //     title: "Record of a Shriveled Datum",
        //     content: "No bytes, no problem. Just insert a document, in MongoDB",
        // }
        // const result = await collection.insertOne(doc);
        // console.log(result);



        // * Test Running Display
        app.get('/', (req,res)=> {
            res.send("i'm working fine :)")
        })
    



        // !Getting data from the server side for client side
        app.get('/appointment', async(req, res)=> {
            const query = {}
            const result = await data.find(query).toArray();
            res.send(result);

        })



        // ! Posting Data 
        app.post('/bookings', async(req, res)=> 
        {
            const booking = req.body;
           console.log('booking',booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result);

        })
        



    }
    finally {
        console.log("Finally connected work done")
    }
}


run().catch(error => console.log(error))




app.listen(port, () => {
    console.log("running port", port)
})