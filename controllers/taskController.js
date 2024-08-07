// define variables and require modules 
const Task = require('../model/taskModel');
// functions that deal with the respones
const successRespone = (res, statusCode, message, task) => {
    let resultLength;
    if (task) resultLength = task.length;
    res.status(statusCode).json({
        status: "success",
        results: resultLength,
        message,
        data: {
            task
        }
    })
}
const faildRespone = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: "Fail",
        message
    })
}
// implement all CRUD functions 
exports.createTask = async (req, res) => {
    const newTask = await Task.create({
        name: req.body.name,
        difficulty: req.body.difficulty,
        priority: req.body.priority,
        description: req.body.description,
        completed: req.body.completed,
        steps: req.body.steps,
        user: req.body.user
    })
    successRespone(res, 201, "A new task has been created", newTask);
}
exports.getTask = async (req, res) => {
    const requestedTask = await Task.findById(req.params.id);
    if (!requestedTask) faildRespone(res, 404, "Task was not found");
    successRespone(res, 200, "Task was found", requestedTask);

}
exports.getTasks = async (req, res) => {
    const tasks = await Task.find();
    successRespone(res, 200, "All tasks are retrieved", tasks);

}
exports.updateTask = async (req, res) => {

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updatedTask) return faildRespone(res, 404, "Task not found");
    //check if the user trying to update owns the task or not
    if (!req.user._idequals(updatedTask.user)) return faildRespone(res, 401, "you are not allowed to edit this");
    successRespone(res, 200, "Task updated", updatedTask);

}
exports.deleteTask = async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) faildRespone(res, 404, "Task not found")
    successRespone(res, 204);

}