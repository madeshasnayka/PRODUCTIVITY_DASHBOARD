const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema({
    // Using a Map where the key is the index (0-13) and the value is the text
    planData: {
        type: Map,
        of: String,
        default: {}
    }
});

module.exports = mongoose.model('DayPlan', dayPlanSchema);