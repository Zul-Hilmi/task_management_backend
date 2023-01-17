"use strict";

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        require:true,
        default:'pending'
    },
    deadline:{
        type:String,
        required:true
    },
    project:{
        type:String
    },
    // project:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     ref:'project'
    // },
    assignedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }]
});

const Task = mongoose.model('task',taskSchema);
module.exports = Task;