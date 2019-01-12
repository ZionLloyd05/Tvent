const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventSchema = new Schema({
    // user:  {
    //     ref: 'User',
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
    // category: {
    //     ref: 'Category',
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true
    // },
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
}, {
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate'
    }
});

eventSchema.pre('save', next => {
    //make unique reference for event
    //generate event link
    console.log(this)
    // 
    next()
})

module.exports = mongoose.model('Event', eventSchema);