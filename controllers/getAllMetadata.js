// importing models
const puppeteer = require("puppeteer")
const cheerio = require("cheerio");

// used to show console logs
const showLog = (message) => {
    console.log(message);
};

// launches the browser and gets the rendered html content
const getHTMLContent = async (songId) => {

    // launching browser instance
    const browser = await puppeteer.launch({
        headless: false
    });
    // opening new tab in browser
    const page = await browser.newPage();
    // navigating to the required page
    await page.goto('https://m.resso.app/' + songId + '/', {
        waitUntil: 'networkidle2'
    });

    // getting the htmlContent
    const htmlContent = await page.content();

    // closing browser
    await browser.close();

    // returning data
    return htmlContent;

};

// method to get all fetchable song data from the resso app
module.exports.getAllMetadataFun = async (req, res) => {

    try {

        // getting the song id passed
        const songId = req.params.songId;
        showLog("Got Song ID: " + songId);

        // getting html content of the page
        const htmlContent = await getHTMLContent(songId);
        showLog("Got HTML Content");
        

        // sending data to cheerio to be processed


    } catch (error) {
        res.send({
            status: false,
            error: error
        });
    }

};