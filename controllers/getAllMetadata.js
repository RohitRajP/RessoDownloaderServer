// importing models
const puppeteer = require("puppeteer")
const cheerio = require("cheerio");

// method to get all fetchable song data from the resso app
module.exports.getAllMetadataFun = (req, res) => {
    res.send({
        status: true
    });
};