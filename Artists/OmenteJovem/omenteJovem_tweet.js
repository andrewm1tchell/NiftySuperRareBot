const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "YFPLjvVV77F0LjIdOr7XJaQW8",
    consumer_secret: "ddbWpEJuDALWLHAop3gO7wIsanVPk0idtN2bedAj68sjnbuIId",
    access_token: "1514014417381466113-7DsCKiVbLhpdKieQpggR7fFfjO51HT", 
    access_token_secret: "9hENNY4jVt3PYewRVjiYfq24zXhAsqNpTX5Ax96uPO8nY"
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