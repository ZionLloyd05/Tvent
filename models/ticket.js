var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    event: {
        ref: 'Event',
        title: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tag', tagSchema);