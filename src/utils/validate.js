'use strict'

const bcrypt = require('bcrypt-nodejs');

exports.encryptPassword = async(password)=>{
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.dencryptPassword = async(password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}