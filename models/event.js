var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    user:  {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orgarnizer: {
        ref: 'Organizer',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category: {
        ref: 'Category',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    poster: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);