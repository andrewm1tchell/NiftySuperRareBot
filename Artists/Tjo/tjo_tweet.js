const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "T4vZsAmK346ox4ilOXdLTPhSk",
    consumer_secret: "G8G5IG1dd8TRBloqzeaxXYX1IHzZ5R0ZlZoRWeLZlaymALdQhS", 
    access_token: "1523476368142606336-zC3KxaOX0JLVDXGmwJaYhQ6uckkbIV", 
    access_token_secret: "wfsrSdopb4B95kOlAng2HSJmEuJmfNYG74uesYq81sYbz"
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