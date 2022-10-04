const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "5Zll62b8t71YHFGGPUkdpaSmx",
    consumer_secret: "hpNgCOpOqlvQk0HXM25LoTSU9OhpEfCOsNqQ0ltCnrC3y5dNfW",
    access_token: "1541616438687023105-OOnR2dTBDgNqri7U0238fOHku1ThFw",
    access_token_secret: "o6CLF7RKMFE6fjyaHVlBj7RJzwegVyjeRmM6QWGUJQXrE"
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