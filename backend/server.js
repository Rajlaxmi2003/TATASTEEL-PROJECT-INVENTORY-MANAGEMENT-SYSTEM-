const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const authRoutes =
require("./routes/authRoutes");

const materialRoutes =
require("./routes/materialRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req,res)=>{

  res.send("Backend Running");
});

mongoose.connect(process.env.MONGO_URL)

.then(() => {

  console.log("MongoDB Connected");
})

.catch(error => {

  console.log(error);
});

app.use("/", authRoutes);

app.use("/", materialRoutes);

app.listen(5000, () => {

  console.log(
    "Server Running On Port 5000"
  );
});