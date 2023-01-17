"use strict";
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    name:{type:String,required:true}
});

userSchema.pre('save',function(next){
    let user = this;
    if(!user.isModified("password")){
        next();
    }else{
        bcrypt.genSalt(10,function(err,salt){
            if(err) return next(err)
            bcrypt.hash(user.password,salt,function(err,hash){
                if(!err){
                    user.password = hash;
                    next();
                }
            });

        })
    }
});

const User = mongoose.model('user',userSchema);
module.exports = User;