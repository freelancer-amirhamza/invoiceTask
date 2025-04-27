const mongoose = require("mongoose");
require("dotenv").config();


    mongoose.connect(process.env.MONGODB_URL) 
    .then(()=> console.log("MongoDB is successfully connected"))
    .catch((error)=> {
        console.log(error.message);
        process.exit(1)
    })