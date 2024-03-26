const express = require ("express");
const app = express();
const medicalRoutes = require("./routes/medicalRoutes.js");
const cors = require("cors");
require("dotenv").config();

PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/",medicalRoutes);

// app.use("/", (req, res)=>{
//     res.send("connected !")
// })

app.listen(PORT,()=>{
    console.log(`server running at PORT :  ${PORT}`);
});