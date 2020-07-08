// importing modules
const express = require("express");

// getting instance of router
const router = express.Router();

// getting controllers
const getAllMetadata = require("../controllers/getAllMetadata");

// setting router instances
router.get("/getallmetadata", getAllMetadata.getAllMetadataFun);

// exporting router
module.exports = router;