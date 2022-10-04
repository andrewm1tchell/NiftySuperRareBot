const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "neO6dpxwz3YjmWQ29waTi9fjC",
    consumer_secret: "Yd2w5ZM1R1ArNPQI7X2rwPF9UXb4Z3NgQAX0YpzMgrWkb6CfNi", 
    access_token: "1557868615399096321-s3ECHCkWfe3hQXEJKfnYOZEwlLe2Mb",
    access_token_secret: "lwiNwaHAjN3eK9QH60f37C48K2y4FEP7SO0KaVSrMqp2L"
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