const mongoose = require("mongoose") ;

const connectUserDb1 = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("User Database is conected") ;
  }
  catch(err) {
    console.log(err) ;
    process.exit(1)
  }
}




module.exports = {connectUserDb1} ;