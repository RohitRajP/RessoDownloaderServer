"use strict";

// importing required modules
const express = require("express");

// declaring middleware
const app = express();

// getting routes
const fetchMetadataRoutes = require("./routes/fetchMetadata");

// assinging request handlers
app.use("/getdata", fetchMetadataRoutes);

// default request handler
app.use("/", (req, res) => {
    res.send("Welcome to Resso Download Server");
});

// starting listening of server
app.listen(process.env.PORT || 6000, () => {
    console.log(`Server is running on ${process.env.PORT || 6000}!`);
});