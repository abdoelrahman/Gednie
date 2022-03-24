const express = require('express');
const {insertFoundPerson, insertMissedPerson} = require('./db');

const app = express();
app.use(express.json());

const port = process.env.port || 300;
app.post('/found',(req,res)=>{
    const person = req.body;
    //console.log(person);
    insertFoundPerson(person)
    res.send("done ✌");
    
});
app.use('/missed',(req,res)=>{
    res.send("welcome in gednie");
});
app.use('/',(req,res)=>{
    res.send("welcome in gednie");
});

app.listen(port,()=>{
    console.log("runing in port" + port);
})
