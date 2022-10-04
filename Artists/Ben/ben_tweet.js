const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "GYi0Xr75MFicRT6f7QI43h6i1", //process.env.CONSUMER_KEY, 
    consumer_secret: "yhB9YBw3dk7yU50ZoNae9CLRvGyJwmRTNnnnUAxgSfRmhG0IzE",//process.env.CONSUMER_SECRET, 
    access_token: "1559289865153310721-9TnvHjBDylqqmTRy5Xg10wttuWQlXN",//process.env.ACCESS_TOKEN_KEY, 
    access_token_secret: "H8ZRG8yaai9F1fNsNBZ1yjrabNeCIeTZcVmd9A7CLepSs"//process.env.ACCESS_TOKEN_SECRET,
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

async function retweeter(tweetId) {
    // Format our image to base64
    // Upload the item's image from OpenSea to Twitter & retrieve a reference to it
    twitterClient.post('statuses/retweet/' + tweetId, { }, (response) => {
        console.log(response);
    });
}

module.exports = {
    tweet: tweet,
    tweetWithImage: tweetWithImage,
    retweeter: retweeter
};