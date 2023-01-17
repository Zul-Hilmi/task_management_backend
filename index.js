"use strict";
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
dotenv.config();

//connect to database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI)
 .then( _ =>{console.log("connected to database")})
 .catch( err =>{console.log(err)});

//models
const User = require('./models/user');
const Task = require('./models/task');
const Project = require('./models/project');

//routes
app.get('/',(req,res)=>{
    res.send("hi");
});

app.post('/user/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}).orFail()
    .then(user=>{
        bcrypt.compare(password,user.password)
        .then( valid =>{
            if(valid==false) res.status(404).json({error:"Wrong credentials"});
            else{
                res.json({
                    message:"Successfully login",
                    id:user._id
                });
            } 
        }).catch(err=>{res.status(500).json({error:"Something went wrong"})});
    }).catch(_=>{res.status(404).json({error:"Wrong credentials"})});
});


app.post('/user/register',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({name})
    .orFail()
    .then(_=>{res.status(403).json({error:"Name is already taken"})})
    .catch(_=>{
        new User({name,email,password}).save()
        .then(user=>{res.json({message:"Account registered"})})
        .catch(err=>{res.status(500).json({error:"Something went wrong"})});
    });
});

app.post('/task/create',(req,res)=>{
    const projectId = req.body.projectId;
    const description =req.body.description;
    const deadline = req.body.deadline;

    const task = new Task({
        description,
        status:'pending',
        deadline,
        project:projectId
    });

    task.save().then(savedTask=>{
        res.json({
            message:"Task created",
            id:savedTask._id,
        });
    }).catch(err=>{
        console.log(err);
        res.status(403).json({error:"Failed to create task"});
    });
    
});

app.get('/user/:id',(req,res)=>{
    const id = req.params.id;
    User.findById(id)
    .then(user=>{
        if(user)res.json({user});
    }).catch(err=>{res.status(400).json({error:"Invalid User"})});
});

app.put('/user/:id',(req,res)=>{
    const id = req.params.id;
    const password = req.body.password;
    User.findById(id)
    .then(user=>{
        if(user){
            user.password = password;
            user.save()
            .then(_=>{res.json({message:"Account Updated"})})
            .catch(err=>{res.status(500).json({error:"Failed to update"})});
        }
    }).catch(err=>{res.status(400).json({error:"Invalid User"})});
});


app.listen(process.env.PORT||3000,()=>{
    console.log("server started")
})