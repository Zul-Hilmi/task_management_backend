"use strict";

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    administrator:{type:mongoose.Schema.Types.ObjectId},
    members:[{type:mongoose.Schema.Types.ObjectId}]
},{
    timestamps:true
});

const Project = mongoose.model('project',projectSchema);
module.exports = Project;