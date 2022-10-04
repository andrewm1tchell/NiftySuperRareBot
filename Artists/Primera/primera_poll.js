const moment = require('moment');
const axios = require('axios');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./primera_tweet');
const _ = require("lodash");

function pollOpenSea() {
    var lastSaleTime = cache.get('lastSaleTimePrimera-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimePrimera-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            collection_slug: "primera-by-mitchell-and-yun",//process.env.OPENSEA_COLLECTION_SLUG,
            event_type: 'successful',
            only_opensea: 'false'
        }
    }).then((response) => {
        const events = _.get(response, ['data', 'asset_events']);

        const sortedEvents = _.sortBy(events, function (event) {
            const created = _.get(event, 'created_date');

            return new Date(created);
        })
        let tweets = [];
        _.each(sortedEvents, (event) => {
            const created = _.get(event, 'created_date');
            if(moment(created).unix() > lastSaleTime) {
                tweets.push(format.formatTweetOpenSea(event));
                
                cache.set('lastSaleTimePrimera-OPENSEA', moment(created).unix());
            }
        });

        for(let i = 0; i < tweets.length; i++) {
            console.log("Prepared tweet: " + tweets[i].url + " " + tweets[i].text);
            tweet.tweetWithImage(tweets[i].text, tweets[i].url);
        }
    }).catch((error) => {
        console.error(error);
    });
}

module.exports = {
    pollOpenSea
}