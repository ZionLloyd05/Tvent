var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var allocationSchema = new Schema({
    event: {
        ref: 'Event',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    division: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        default: 0
    },
    extra: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Allocation', allocationSchema)