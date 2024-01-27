const Task = require("../models/taskModel")

module.exports.getTasks = async (req, res) => {
    const tasks = await Task.find()
    res.send(tasks);
}

module.exports.saveTask =  (req,res) => {
    const {task} =  req.body;
    Task.create({task})
    .then(data => {
        console.log("Saved successfully...");
        res.status(201).send(data)
    })
    .catch((err) =>{

        console.log(err);
       res.send({ error: err, msg: "Something went wrong!"});
   })}

module.exports.updateTask =  (req,res) => {
    const {id} =  req.params;
    const {task} = req.body;
    Task.findByIdAndUpdate(id,{task})
    .then(() => {
        res.send("Updated Successfully")
    })
    .catch((err) =>{

        console.log(err);
       res.send({ error: err, msg: "Something went wrong!"});
   })}

module.exports.deleteTask =  (req,res) => {
    const {id} =  req.params;

    Task.findByIdAndDelete(id)
    .then(() => {
        res.send("Deleted Successfully...")
    })
    .catch((err) =>{

     console.log(err);
    res.send({ error: err, msg: "Something went wrong!"});
});
};