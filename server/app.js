const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const invoiceRouter = require("./routers/invoice-router")
require("./config/database");



 
app.use(cors({
    origin: "http://localhost:3000",
    methods:['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization', 
        'Catch-Control',
        'Expires',
        'Pragma', 
    ],
    credentials: true,
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use("/invoice", invoiceRouter)




module.exports = app      