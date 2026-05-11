const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    Tname: { type: String, required: true },
    Tdetails: { type: String },
    checking: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);