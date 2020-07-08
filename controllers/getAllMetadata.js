// importing models
const puppeteer = require("puppeteer")
const cheerio = require("cheerio");
const fs = require("fs");
const {
    log
} = require("console");

// used to show console logs
const showLog = (message) => {
    console.log(message);
};

// launches the browser and gets the rendered html content
const getHTMLContent = async (songId) => {

    // launching browser instance
    const browser = await puppeteer.launch({
        headless: true
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

// used to write the data into a html file for observations
const writeHTMLToFile = (htmlContent) => {

    fs.writeFile("./observation.html", htmlContent, function (err) {
        if (err) {
            return console.log("FileWriteError: " + err);
        }
        showLog("HTML content written to file");
    });

};

// parses the html and fetches required content
const fetchContentFromHTML = (htmlContent) => {

    // loading data into cheerio
    const $ = cheerio.load(htmlContent);

    // fetching the audio streaming url
    const streamingUrlHTML = $('body').find('#--mplayer--').html().toString();
    const streamingUrl = streamingUrlHTML.substring(streamingUrlHTML.indexOf("https"), streamingUrlHTML.indexOf(">") - 1);

    // fetching the audio video
    const audioVideoHTML = $('.video-area').html().toString();
    let audioVideoUrl = "";
    let isImage = false;
    // seeing if visual content is a video or image
    if (audioVideoHTML.includes("<video"))
        audioVideoUrl = audioVideoHTML.substring(audioVideoHTML.indexOf("src=") + 5, audioVideoHTML.indexOf(" loop") - 1);
    else {
        isImage = true;
        audioVideoUrl = audioVideoHTML.substring(audioVideoHTML.indexOf("https"), audioVideoHTML.indexOf(".jpg") + 4);
    }

    // returning data
    return {
        streamingUrl: streamingUrl,
        audioVideoUrl: audioVideoUrl,
        isImage: isImage
    };

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
        writeHTMLToFile(htmlContent);

        // sending data to cheerio to be processed
        const reqContent = fetchContentFromHTML(htmlContent);

        // sending respose with content
        res.send({
            status: true,
            data: reqContent
        });

    } catch (error) {
        console.log("Error Occurred: " + error);
        res.send({
            status: false,
            error: error
        });
    }

};