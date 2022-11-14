const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "cPh8YxdbDXdccWfShrWtzGTsO",
    consumer_secret: "JoaG53vmsQBpO0A0qJxOZRekb5VjqrztdTehHi83se6yFN3z0Y",
    access_token: "1589778310585729024-YWZp6Urdxstjg00yqZStm4QrNsSvtw",
    access_token_secret: "tWKVwEZftBlQV1rpkFMoX6DC3zQubDezJXoMpj30ojcxj"
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
    console.log("Prepared Tweet" + tweetText + "Image:" + imageUrl);

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