const express = require('express');
const { Model } = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AutheRouter');
const {saveForm, getAdmin,getStud,StoreNotification,fetchStudent} = require('./Controllers/Fetch');
const {getApplications,getApplicationsEmail,getQr} = require('./Controllers/Fetching');
const PORT =5000;

app.get('/ping',(req,res)=>res.send("Pong"));


app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.get('/getAdmin',getAdmin);
app.get('/getStud',getStud);
app.get('/Student',fetchStudent);
app.get('/getApplications',getApplications)
app.get('/getApplicationsEmail',getApplicationsEmail)

app.get('/getQr',getQr);

app.listen(PORT,()=>{
    console.log('Server is running on',PORT)
});