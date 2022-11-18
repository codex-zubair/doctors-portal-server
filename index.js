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
        const appointmentOptionCollection = client.db("doctors-portal").collection("appointmentOption");

        // Booking collection data base.
        const bookingCollection = client.db('doctors-portal').collection("bookings");

        // const doc = {
        //     title: "Record of a Shriveled Datum",
        //     content: "No bytes, no problem. Just insert a document, in MongoDB",
        // }
        // const result = await collection.insertOne(doc);
        // console.log(result);



        // * Test Running Display
        app.get('/', (req, res) => {
            res.send("i'm working fine :)")
        })




        // !Getting data from the server side for client side
        app.get('/appointment', async (req, res) => {
            // Getting all data from data base
            const query = {}
            const options = await appointmentOptionCollection.find(query).toArray();


            // Filtering data from option
            const date = req.query.date;
            const dateQuery = { date: date }
            const bookedOption = await bookingCollection.find(dateQuery).toArray();
            // Give me the value which are already booked


            options.forEach(option => {
                optionBooked = bookedOption.filter(book => book.treatment === option.name);
                bookedSlots = optionBooked.map(book => book.slot);
                // const remainingSlots = option.slots.filter(slot=> !bookedSlots.includes(slot))
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
                // console.log(date,option.name , bookedSlots);
                option.slots = remainingSlots;

            })


            res.send(options);



        })







        // ! Posting Data 
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })




    }
    finally {
        console.log("Working fine")
    }
}


run().catch(error => console.log(error))




app.listen(port, () => {
    console.log("running port", port)
})