var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    event: {
        ref: 'Event',
        title: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        ref: 'User',
        title: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tref: {
        type: String,
        required: true
    },
    user_no: {
        type: Number,
        required: true
    },
    extra: {
        type: String
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);