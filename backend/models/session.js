// backend/models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: String,
        required: [true, 'Please specify the skill']
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    otp: {
        type: String,
        required: true
    },
    mentorConfirm: {
        type: Boolean,
        default: false
    },
    learnerConfirm: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate random 6-digit OTP
sessionSchema.statics.generateOTP = function() {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = mongoose.model('Session', sessionSchema);