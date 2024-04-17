const bcrypt = require("bcrypt");
const session = require("express-session");
const employee = require("../models/employee");
const fs = require("fs");
const path = require("path");
const { log } = require("console");
const employeeservices = require("../services/employeeservices");

const renderHome = async (req, res) => {
  try {
    res.render("index.ejs", {});
  } catch (err) {
    console.log(err);
  }
};

const viewUser = async (req, res) => {
  res.render("view.ejs");
};

//Logging out the user
const logOut = (req, res) => {
  res.clearCookie("token");
  req = {
    type: "success",
    info: "You are successfully loged out",
  };
  return res.redirect("/user/login");
};



// Function to get all employees search

const getAllUsers = async (req, res) => {
  let perPage = req.query.limit || 5;
  let page = req.query.page || 1;
  console.log(perPage);
  console.log(page);
  // console.log(req.body.payload);
  let payload = req.body.payload
  try {
    const pipeLine = [
      {
        $facet: {
          totalUsers: [
            {
              $count: "count",
            },
          ],

          data: [
        
            { $sort: { updatedAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: Number(perPage) },
          ],
          search : [
            {$match: {
              $or: [
                { firstName: { $regex: new RegExp("^" + payload + ".*", "i") } },
                { lastName: { $regex: new RegExp("^" + payload + ".*", "i") } },
                { phone: { $regex: new RegExp("^" + payload + ".*", "i") } },
                { email: { $regex: new RegExp("^" + payload + ".*", "i") } },
              ],
            }},
          ]
        },
      },
    ];

    const result = await employeeservices.getAllUsers(pipeLine);
    // const result = await employee.aggregate(pipeLine);
if(result){
  console.log(result);
    res.status(200).json({
      status: "Success",
      data: result[0].data,
      count: result[0].totalUsers,
      search: result[0].search
    });
}
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "Failed",
      message: "server error",
    });
  }
};

// ..........................

// add employee.................

const addUser = async (req, res) => {
  // console.log(req.body);
  // console.log(req.params);

  try {
    const newEmployee = {
      salutation: req.body.salutation,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      qualifications: req.body.qualifications,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      pin: req.body.pin,
    };

    let result = await employeeservices.addUser(newEmployee);

    // await newEmployee.save();
    if (result) {
      console.log("in if ");
      res.status(201).json({
        status: "success",
        data: result.id,
        message: "Employee creation successful",
      });
    }
  } catch (err) {
    console.log("in catch");
    console.error(err);
    res.status(400).json({
      status: "failed",
      message: "Employee creation failed",
    });
  }
};

// ..................................

// image posting....

const Avatar = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const emp = await employee.findById(id);

  const { avatar } = emp;

  console.log(emp);
  console.log(avatar);
  try {
    await employee.updateOne({ _id: id }, { avatar: `${req.file.filename}` });
  } catch (err) {
    console.log(err);
  }
};

// ....................

//Getting employee by id

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const editEmployee = await employeeservices.getUser(id)
    if(editEmployee) res.status(200).json({ status: "Success",data: editEmployee});     
  } catch (err) {
    console.log(err);
    res.status(400).json({status: "Failed",message: "Employee not found"});
  }
};

// .......................

// Edit

const editUser = async (req, res) => {
  const id = req.params.id;

  try {
    await employee.findByIdAndUpdate(id, {
      salutation: req.body.salutation,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      qualifications: req.body.qualifications,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      pin: req.body.pin,
      updatedAt: Date.now(),
    });

    res.status(201).json({
      status: "employee updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "Failed",
    });
  }
};

// ........................

// delete....................

const deleteUser = async (req, res) => {
  const id = req.params.id;
  let query = {_id : id}
  try {
    const emp = await employeeservices.deleteUser(query);
    if(emp){
    res.status(204).json({
      status: "Success",
      message: "Employee deleted successfully",
    });      
    }

  } catch (err) {
    res.status(401).json({
      status: "Failed",
      message: "Employee not found",
    });

    console.log(err);
  }
};

// .....................

module.exports = {
  renderHome,
  addUser,
  getAllUsers,
  logOut,
  Avatar,
  getUser,
  editUser,
  deleteUser,
  viewUser,
};
