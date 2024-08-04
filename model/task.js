const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A task must have a name'],
        trim: true,
        maxlength: [20, "Task name should be less than 20 characters"]
    },
    difficulty: {
        type: String,
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Please choose a level of difficulty"
        }
    },
    priority: {
        type: String,
        min: 1,
        max: 5
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    steps: String

});
const Task = mongoose.Model('Task', taskSchema);

module.exports = Task