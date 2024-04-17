const mongoose = require("mongoose") ;
const { Schema } = mongoose ;

const userSchema = new Schema({
    name: {
        type : String ,
        required : [true , "Please enter name"]
    },
    email: {
        type : String ,
        required : [true , "Please enter email"]
    },
    password: {
        type : String ,
        required : [true , "Please enter password"]
    }

})

const user = mongoose.model("userschemas" , userSchema)
module.exports = user ;