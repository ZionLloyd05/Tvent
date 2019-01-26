const User = require('../models/user');

module.exports = {
    isEmailExist : (req, res)=> {

        return new Promise((resolve, reject)=> {
            User.findOne({'email': req.params.email}, (err, user)=> {
                if(err)
                    reject(err);
                if(user)
                    resolve(true);
                else
                    resolve(false);
            })
        }).then((response)=>{
            res.send(response);
        }).catch((response)=>{
            res.send(response);
        })
    }
}