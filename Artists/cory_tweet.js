const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "lmgdsLaZP0EqBl3LuzdEGIJMS",
    consumer_secret: "aUg3R1bsa0dgxvLkmhMTrythPmw5m3AjVQmCRUiaoUFZVmJ4vX",
    access_token: "1574223283037392896-ZP3D9NQrWsZ1VW5NdprpGbaQTyvBax",
    access_token_secret: "W1YqM1TJTgKjVO5Sl24WwommddFWsfIEZjSkbtkriakVB"
};

const twitterClient = new twit(twitterConfig);

async function tweet(tweetText) {
    const tweet = {
        status: tweetText,
    };

    twitterClient.post('statuses/update', tweet, (error, tweet, response) => {
        if (!error) {
            console.log(`Successfully tweeted: ${tweetText}`);
        } else {
            console.error(error);
        }
    });
}

async function tweetWithImage(tweetText, imageUrl) {
    const processedImage = await getBase64(imageUrl);

    twitterClient.post('media/upload', { media_data: processedImage }, (error, media, response) => {
        if (!error) {
            const tweet = {
                status: tweetText,
                media_ids: [media.media_id_string]
            };

            twitterClient.post('statuses/update', tweet, (error, tweet, response) => {
                if (!error) {
                    console.log(`Successfully tweeted: ${tweetText}`);
                } else {
                    console.error(error);
                }
            });
        } else {
            console.error(error);
        }
    });
}

function getBase64(url) {
    return axios.get(url, { responseType: 'arraybuffer'}).then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

module.exports = {
    tweet: tweet,
    tweetWithImage: tweetWithImage
};