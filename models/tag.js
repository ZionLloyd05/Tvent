var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    event: {
        ref: 'Event',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Tag', tagSchema);