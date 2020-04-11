const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;

//Appointment schedule add
app.post('/add-appointments',(req,res) => {
    const schedule = req.body;
    const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointmentTime");
        collection.insert(schedule,(err,result) => {
            if (err) {
                console.log(err.message);
            }else{
                res.send(schedule);
            }
        })
        client.close();
    });
})

//Book Appointment
app.post('/book-appointment',(req,res)=>{
    const schedule = req.body;
    console.log(schedule);
    const client = new MongoClient(uri, { useNewUrlParser: true});

    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("bookAppointment");
        collection.insertOne(schedule,(err,result) => {
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            } else {
                res.send(result.ops[0]);
            }  
        })
        //Connection close after taking action
        client.close();
      });
})

//Get All appointments
app.get('/all-appointments',(req,res) => {
    const client = new MongoClient(uri,{useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointmentTime");
        collection.find().toArray((err,documents) => {
            if (err) {
                console.log(err)
            } else {
                res.send(documents)
            }
        })
        client.close();
    })
})
//Get all booked appointments
app.get('/all-booked-appointment',(req,res) => {
    const client = new MongoClient(uri,{useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("bookAppointment");
        collection.find().toArray((err,documents) => {
            if (err) {
                console.log(err)
            } else {
                res.send(documents)
            }
        })
        client.close();
    })
})

app.get('/',(req,res) => {
    res.send("Server is working")
})


const port = process.env.PORT;
app.listen(port,() => console.log("Listening from 4000"))