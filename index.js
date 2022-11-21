const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// middleware
app.use(cors());
app.use(express.json());





const url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.9zcs4sa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {

        //! Appointment database
        const appointmentOptionCollection = client.db("doctors-portal").collection("appointmentOption");

        //! Booking collection data base.
        const bookingCollection = client.db('doctors-portal').collection("bookings");


        const usersCollection = client.db('doctors-portal').collection('users');

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
            const query = {
                date: booking.date,
                treatment: booking.treatment,
                email: booking.email

            }



            const alreadyExist = await bookingCollection.find(query).toArray();

            if (alreadyExist.length) {
                const message = `you already have a booking on ${booking.date}`
                return res.send({ acknowledged: false, message })
            }


            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })



        // !Getting all booking by specific email address.
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const bookingList = await bookingCollection.find(query).toArray();
            res.send(bookingList);
        })


        // !POST Saving user into DB when user login
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);

        })



        // ! GET Getting All users email and name (Admin)
        app.get('/users', async (req, res) => {

            const query = {}
            const users = await usersCollection.find(query).toArray()
            res.send(users);


        })


        // !Delete user now
        app.delete('/user/delete/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })



        //!PUT Making some admin using  
        app.put('/user/role/:id', async (req, res) => {
            const id = req.params.id;
            const email = req.headers.email;


            // TODO filter with current email of user

            const filter = { _id: ObjectId(id) };


            // !Checking user admin or not if user admin then person can make another one admin START
            const user = await usersCollection.findOne({ email: email });
            if (user.role) {
                const option = { upsert: true }
                const role = { $set: { role: 'admin' } }
                const update = await usersCollection.updateOne(filter, role, option);
                res.send(update);
            }
            else {

                res.send({unauthorized:'you are not admin!'});
            }
            // !Checking user admin or not if user admin then person can make another one admin END
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