var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    event: {
        ref: 'Event',
        title: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tag', tagSchema);