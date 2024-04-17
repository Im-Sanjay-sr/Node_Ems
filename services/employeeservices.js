const employee = require("../models/employee")


// .....add employee........

exports.addUser  = async (data)=>{
    const newEmployee = await new employee(data)
   let result = await newEmployee.save()
    return result;
}

// ......getUser.........

exports.getUser = async(id)=>{
    let result = await employee.findById(id);
    return result;
}

// .....deleteUser.....
exports.deleteUser = async(query)=>{
    let result =  await employee.findByIdAndDelete(query);
    return result;
}
// .....getAllUsers......
exports.getAllUsers = async(pipeLine)=>{
    let result = await employee.aggregate(pipeLine);
    return result;
}