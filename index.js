const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//:::::::::middlewares::::::::::

app.use(cors());
app.use(express.json());



//::::::::::mongodb:::::::::::

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqiwocl.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();
        // Send a ping to confirm a successful connection

        const toysdataapi = client.db('toysdata').collection('alltoys');



        // :::::::::post toy data::::::::::

        app.post("/toysdata", async (req, res) => {
            const body = req.body;
            console.log(body);
            const result = await toysdataapi.insertOne(body)
            res.send(result)

        })


        // :::::::::get toy data::::::::::

        app.get("/alltoys", async (req, res) => {
            const queryMail = req.query.email
            const querySort = req.query.sort
            console.log(queryMail, querySort);
            if (queryMail) {
                if (querySort) {
                    const toys = await toysdataapi.find({ "email": `${queryMail}` }).sort({ "price": -1 }).toArray();
                    res.send(toys);
                } else {
                    const toys = await toysdataapi.find({ "email": `${queryMail}` }).toArray();
                    res.send(toys);
                }
            } else {
                const toys = await toysdataapi.find({}).toArray();
                res.send(toys);
            }
        })

        // ::::::::::: get query dat by ascending order :::::::::::::

        app.get("/alltoys", async (req, res) => {
            const query = req.query.email
            console.log(query);
            if (query) {
                const toys = await toysdataapi.find({ "email": `${query}` }).sort({ "price": -1 }).toArray();
                res.send(toys);
            } else {
                const toys = await toysdataapi.find({}).toArray();
                res.send(toys);
            }
        })

        // ::::::::::: get gotg data :::::::::::

        app.get("/alltoys/subcatrgory/gotg", async (req, res) => {
            const query = { "subCategory": "Guardians of the Galaxy" };
            const gotgToys = await toysdataapi.find(query).toArray();
            res.send(gotgToys)
        })

        // ::::::::::: get thor data :::::::::::::

        app.get("/alltoys/subcatrgory/thor", async (req, res) => {
            const query = { "subCategory": "Thor" };
            const thorToys = await toysdataapi.find(query).toArray();
            res.send(thorToys);
        })

        // ::::::::::::: get black panther data ::::::::::::::::

        app.get("/alltoys/subcatrgory/blackpanther", async (req, res) => {
            const query = { "subCategory": "Black Panther" };
            const blackPantherToys = await toysdataapi.find(query).toArray();
            res.send(blackPantherToys);
        })

        // ::::::::::::: get Iron Man data ::::::::::::::::

        app.get("/alltoys/subcatrgory/ironman", async (req, res) => {
            const query = { "subCategory": "Iron Man" };
            const ironManToys = await toysdataapi.find(query).toArray();
            res.send(ironManToys);
        })


        // ::::::::::::: get single data ::::::::::::::

        app.get("/alltoys/toys/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toysdataapi.findOne(query);
            res.send(result)
        })


        // ::::::::::::: delete single data ::::::::::::::

        app.delete("/alltoys/toys/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toysdataapi.deleteOne(query);
            res.send(result)
        })


        // :::::::::::::update data by id::::::::::::::

        app.put("/update/:id", async (req, res) => {
            const id = req.params.id
            const body = req.body
            console.log(body);
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    price: body.price,
                    quantity: body.quantity,
                    description: body.description,
                },
            };
            const result = await toysdataapi.updateOne(filter, updateDoc);
            res.send(result)
        })

        // ::::::::::::::::: search product by name ::::::::::::::::

        app.get("/alltoys/search/:name", async (req, res) => {
            const name = req.params.name;
            console.log(name);
            const query = { "name": { $regex: name, $options: 'i' } }
            const result = await toysdataapi.find(query).toArray();
            res.send(result)
        })



        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.json({ status: "server started" })
})





app.listen(port, () => {
    console.log(`server is running on ${port}`);
})