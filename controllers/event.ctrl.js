const Event = require('../models/event')

const Joi = require('joi')
const uuidv4 = require('uuid/v4')


const eventValidation = require('../validators/event.vld')
const log = console.log

module.exports = {
    addEvent: (req) => {
        return new Promise((resolve, reject)=> {
        
            let { title, location, start, end, starttime, endtime, posterUrl, description, status, category, organizer } = req.body
            
            if(req.file)
                posterUrl = req.file.filename

                
            let {value, error} = Joi.validate({ title, location, start, end, starttime, endtime, posterUrl, description, status, category, organizer}, eventValidation.schema)
            
            if(error){
                reject(error.message)
            }else{
               
                try {
                    let obj = new Event()
                    obj = { ...value }
                    obj.user = req.session._id
                    obj.reference = uuidv4()
                    // let hashedRef = Event.encryptRef(obj.reference)
                    const hostUrl = "http://localhost:3000/events/r/"
                    const eventLink = hostUrl+obj.reference
                    obj.link = eventLink
                 
                    const event = new Event(obj).save()
                    // console.log(event)
                    resolve(event)
                } catch (error) {
                    reject(error)
                }
                
            }


        })
    },

    getEvents: () => {
        return new Promise(async(resolve, reject) => {
            try {
                const events = await Event.find()
                resolve(events)
            } catch (error) {
                reject(error)
            }
        })
    },

    getEventsForUser: (req) => {
        return new Promise(async(resolve, reject) => {
            try {
                const events = await Event.find({user : req.session._id})
                resolve(events)
            } catch (error) {
                reject(error)
            }
        })
    },

    getEventByRef: (req) => {
        return new Promise(async(resolve, reject) => {
            try {
                let evRef = req.params.ref
                const event = await Event.find({reference : evRef})
                resolve(event)
            } catch (error) {
                reject(error)
            }
        })
    }
}