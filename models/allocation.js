var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var allocationSchema = new Schema({
    event: {
        ref: 'Event',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})