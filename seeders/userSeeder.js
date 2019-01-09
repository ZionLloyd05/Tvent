const User = require('../models/user')
const mongoose = require('mongoose')
const config = require('../config/database');
var bcrypt = require('bcrypt-nodejs');

mongoose.connect(config.database)
let pass = bcrypt.hashSync('testme', bcrypt.genSaltSync(5), null);

var users = [
    new User({
        email: 'testme@gmail.com',
        firstname: 'testme',
        lastname: 'testme',
        password: pass
    })
]

let done = 0;
for (let index = 0; index < users.length; index++) {
    bcrypt.hashSync(users[index].password, bcrypt.genSaltSync(5), null);
    users[index].save(function(err, result){
        done++
        if(done === users.length){
            exit()
        }
    })
}

function exit(){
    mongoose.disconnect(); 
}