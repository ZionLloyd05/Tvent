const Event = require('../models/event')
const Tag = require('../models/tag')

const Joi = require('joi')
const uuidv4 = require('uuid/v4');

const eventValidation = require('../validators/event.vld')
const log = console.log;

module.exports = {
    addEvent: (req) => {
        return new Promise((resolve, reject)=> {
        
            let { title, location, start, end, starttime, endtime, posterUrl, description, status, category } = req.body;
            
            if(req.file)
                posterUrl = req.file.filename

                console.log(req.body)
            let {value, error} = Joi.validate({ title, location, start, end, starttime, endtime, posterUrl, description, status}, eventValidation.schema);
            
            if(error){
                reject(error.message);
            }else{
                let obj = new Event();
                obj = { ...value }
                obj.user = req.session.id
                obj.reference = uuidv4();
                const hostUrl = "http://localhost:3000/";
                const eventLink = hostUrl+obj.reference;
                obj.link = eventLink;
                resolve(obj)
                // try {
                //     new Event(obj).save((err, event) => {
                //         if(err){
                //             log(err)
                //             reject(err);
                //         }else{
                //             resolve(event);
                //         }
                //     })
                // } catch (error) {
                //     reject(error);
                // }
                
            }


        })
    }
}