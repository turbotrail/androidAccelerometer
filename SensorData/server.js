const express= require('express');
const app= express();
const port =3000;
const cors=require('cors');
const bodyParser=require('body-parser');
const rateLimit = require("express-rate-limit");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.get('/', (req,res)=>{
res.send("Welcome to my sensor");
});

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 0, // start blocking after 5 requests
    message:
      "Too many accounts created from this IP, please try again after an hour"
  });

app.listen(port,()=>{
    console.log("Started sercer at "+port);
})


app.post('/data',createAccountLimiter, (req, res) => {
    console.log(req.body);
});