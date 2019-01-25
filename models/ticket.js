var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    event: {
        ref: 'Event',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tref: {
        type: String,
        required: true
    },
    user:  {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_no: {
        type: Number,
        required: true
    },
    extra: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);