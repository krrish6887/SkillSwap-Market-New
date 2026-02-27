// ==================== backend/models/Review.js ====================
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews for same session
reviewSchema.index({ sessionId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);