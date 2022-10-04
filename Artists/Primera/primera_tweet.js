const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "W9KvB0SMnurjIvNOmdQTp7BXV",
    consumer_secret: "tXJ0IAdEDK0ypJ31bro7PcFxheQ5YZ4F2PZhnEMQEVXVyadhnk",
    access_token: "1461061320208531469-bLV5KVjhRuDwATLVyqJyeaexzrMTMa",
    access_token_secret: "yd92VA4lu98yYFMqwtPqKI0T06PuIBPmrL10fbPglUtXY"
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