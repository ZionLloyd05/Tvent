const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema;

var eventSchema = new Schema({
    user:  {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category: {
        type: String,
    },
    reference: {
        type: String,
        unique: true
    },
    link: {
        type: String
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
    starttime: {
        type: String
    },
    end: {
        type: Date,
        required: true
    },
    endtime: {
        type: String
    },
    posterUrl: {
        type: String,
        default: 'event.png'
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate'
    }
});

eventSchema.methods.compareRef = (rf) => {
    return (this.reference === rf)
}

eventSchema.methods.encryptRef = function(ref){
    return bcrypt.hashSync(ref, bcrypt.genSaltSync(5), null);
};

eventSchema.methods.validRef = function(reference){
    return bcrypt.compareSync(reference, this.reference);
};

module.exports = mongoose.model('Event', eventSchema);