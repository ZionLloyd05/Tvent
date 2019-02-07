const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const joi = BaseJoi.extend(Extension);

exports.schema = joi.object().keys({
    title: joi.string().min(5).max(60).required().error(new Error("Invalid title")),
    location: joi.string().required().error(new Error("Invalid location")),
    posterUrl: joi.string().max(30),
    description: joi.string().required().min(10).max(5000).error(new Error("Invalid description")),
    status: joi.string().required(),
    start: joi.date().required().format('YYYY-MM-DD').error(new Error("Invalid start date")),
    end: joi.date().min(joi.ref('start')).required().format('YYYY-MM-DD').error(new Error("Invalid end date")),
    starttime: joi.string().regex(/^\d{2}:\d{2}/).required().error(new Error("Invalid start time")),
    endtime: joi.string().regex(/^\d{2}:\d{2}/).required().error(new Error("Invalid end time")),
    category: joi.string().required().error(new Error("Invalid category")),
    organizer: joi.string().error(new Error("Invalid organizer"))
})