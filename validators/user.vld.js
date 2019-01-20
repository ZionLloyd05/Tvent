const joi = require('joi')

exports.schema = joi.object().keys({
    firstname: joi.string().min(3).max(30).required().error(new Error('Invalid Firstname')),
    lastname: joi.string().min(3).max(30).required().error(new Error('Invalid Lastname')),
    email:  joi.string().required().email({ minDomainAtoms: 2 }).error(new Error('Invalid Email')),
    password: joi.string().min(5).required().error(new Error('Invalid Password'))
})