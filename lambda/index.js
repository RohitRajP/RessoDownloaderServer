const cheerio = require("cheerio");


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
        audio: streamingUrl,
        visual: audioVideoUrl,
        isImage: isImage
    };

};


exports.handler = async (event) => {

    // getting html content
    const htmlContent = JSON.parse(event.body);

    if (htmlContent != null) {

        // sending data to cheerio to be processed
        const reqContent = fetchContentFromHTML(htmlContent);

        // sending respose with content
        return {
            status: true,
            data: reqContent
        };
    } else {
        // returning error message
        return {
            status: false,
            message: "No HTML content found"
        };
    }
};