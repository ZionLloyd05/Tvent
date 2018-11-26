var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    logo: {
        type: String
    }
})

module.exports = mongoose.model('Organizer', organizerSchema);