const mongoose = require("mongoose");
const { Schema } = mongoose ;

const otpSchema = new Schema ({
    otp : {
        type : String ,
        required : [true , "Please type the Otp"]
    } ,

    name : {
       type : String ,
       required : [true , "Please type your name"]
    },
    email : {
        type: String ,
        required : [true , 'Please type your emil address']
    } ,

    password : {
        type: String ,
        required :[true , 'Please type your password']
    },

    createdAt : {
        type : Date ,
        required : true
    } ,
    
    expiresAt : {
        type : Date ,
        required : true
    }
})

const otp = mongoose.model("otps" , otpSchema)
module.exports = otp ;