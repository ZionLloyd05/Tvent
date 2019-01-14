const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const joi = BaseJoi.extend(Extension);

exports.schema = joi.object().keys({
    title: joi.string().min(5).max(60).required(),
    location: joi.string().required(),
    posterUrl: joi.string().max(30),
    description: joi.string().required().min(10).max(100),
    status: joi.string().required(),
    start: joi.date().required().min('now').format('YYYY-MM-DD'),
    end: joi.date().min(joi.ref('start')).required().format('YYYY-MM-DD'),
    starttime: joi.string().regex(/^\d{2}:\d{2}/).required(),
    endtime: joi.string().regex(/^\d{2}:\d{2}/).required(),
    category: joi.string().required()
})