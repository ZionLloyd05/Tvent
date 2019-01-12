const Event = require('../models/event')
const Tag = require('../models/tag')

const Joi = require('joi')
const uuidv4 = require('uuid/v4');

const eventValidation = require('../validators/event.vld')
const log = console.log;

module.exports = {
    addEvent: (req, res) => {
        return new Promise((resolve, reject)=> {
        
            let { title, location, start, end, starttime, endtime, posterUrl, description, status } = req;
            
            const {value, error} = Joi.validate({ title, location, start, end, starttime, endtime, posterUrl, description, status}, eventValidation.schema);
            
            if(error){
                reject(error.message);
            }else{
                let obj = value;
                obj.reference = uuidv4();
                const hostUrl = "http://localhost:3000/";
                const eventLink = hostUrl+obj.reference;
                obj.link = eventLink;
                try {
                    new Event(obj).save((err, event) => {
                        if(err){
                            reject(err);
                        }else{
                            resolve(event);
                        }
                    })
                } catch (error) {
                    reject(error);
                }
                
            }


        })
    }
}