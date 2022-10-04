const moment = require('moment');
const axios = require('axios');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./tjo_tweet');
const _ = require("lodash");

function pollOpenSeaBySlug() {
    var lastSaleTime = cache.get('lastSaleTimeTjo-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeTjo-OPENSEA', lastSaleTime);
    }
    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            collection_slug: 'one-night-only-by-tjo',
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
                
                cache.set('lastSaleTimeTjo-OPENSEA', moment(created).unix());
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

function pollOpenSeaByContractAddress() {
    var lastSaleTime = cache.get('lastSaleTimeTjo-OPENSEA2', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeTjo-OPENSEA2', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            asset_contract_address: '0x2ff5556f0084bd6e7a267db17d788d3c00670c74',
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
                
                cache.set('lastSaleTimeTjo-OPENSEA2', moment(created).unix());
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
    pollOpenSeaByContractAddress,pollOpenSeaBySlug
}