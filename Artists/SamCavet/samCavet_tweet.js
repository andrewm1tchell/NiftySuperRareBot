const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "FYY30Oun6Q8Qk7FA8qze07Vuv",
    consumer_secret: "UM6ZruXlSeiTDNpth66TiUtGi8s2WXe8eKSEVLEkzKSU1XrDjC",
    access_token: "1564302888721125377-ghfXt01p5XvlKYfqxwTqmtmU2qdb3Y",
    access_token_secret: "DNuJodBneGxnt6hn3Mg5MpZ7aJhuGkYAAIWLz9dd5gawk"
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