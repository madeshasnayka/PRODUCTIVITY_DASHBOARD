const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
    durationInMinutes: { 
        type: Number, 
        required: true,
        default: 25 // Standard Pomodoro length
    },
    completedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('FocusSession', focusSessionSchema);