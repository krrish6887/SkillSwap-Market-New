// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    type: {
        type: String,
        enum: ['session_earn', 'session_spend', 'admin_adjust'],
        default: 'session_earn'
    },
    description: {
        type: String,
        default: 'Session transaction'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);