const express = require('express');
const router = express.Router();
const { Token } = require("../middlewares/secureToken");
const { upload } = require("../middlewares/imageUpload");
const { 
      renderHome,
      addUser,
      getAllUsers ,
      logOut,
      Avatar,
      getUser,
      editUser,
      deleteUser,
      viewUser,
      } = require("../controllers/employeecontroller");


router.route('/dashboard').get(Token,renderHome) ;
router.route('/addUser').post(upload,addUser) ;
router.route('/employees').get(Token,getAllUsers).post(getAllUsers) ;
router.route("/logout").post(logOut);
router.route("/:id/avatar").post(upload, Avatar);
router.route("/employee/:id").get(getUser).put(editUser).delete(deleteUser);
router.route("/view").get(viewUser);




module.exports = router ;

