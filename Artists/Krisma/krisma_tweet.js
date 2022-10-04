const axios = require('axios');
const twit = require('twit');

const twitterConfig = {
    consumer_key: "qzMCcNZfyNn1B3DwCUcdOsQpK",
    consumer_secret: "9U7qdQrV92PUJ112w25xNqLFwxsMemUmGsfISmjoBxzZdGjStz", 
    access_token: "1558944561208201217-rM43gd7BwSlmHMNBFZvTdYQdnd3zJM",
    access_token_secret: "7MwFNru78jnsKvcRdF6AVWriuRdQsf4PJbdoDh5vAjre9"
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