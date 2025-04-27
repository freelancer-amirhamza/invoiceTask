const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 4000;


app.get("/", (req, res)=> {
    res.send(`<center><h1>Welcome to the Deshi Motors server site</h1></center>`)
})


  
app.listen(PORT,(req, res)=>{
    console.log(`Server is running on http://localhost:${PORT}`);

})