const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./krisma_tweet');
const {Pool} = require("pg");
const chrome = require("selenium-webdriver/chrome");
const webdriver = require("selenium-webdriver");
const pool = new Pool({
    connectionString: "postgres://hicqtfqt:O8O43l-oGpzGyRFi0iQ6Ih2MDKGD3ZWd@jelani.db.elephantsql.com/hicqtfqt",
    ssl: {
        rejectUnauthorized: false
    }
});

const nifties = [
];
let currentItem =  nifties.length-1;
let isPolling = false;
function pollSuperRareAndNifty() {
    setInterval(function () {
        if (!isPolling) {
            if (!nifties[currentItem].isSR) {
                pollNiftyGateway(nifties[currentItem].url, currentItem + 1, nifties[currentItem].image, nifties[currentItem].name);
            } else {
                pollSuperrare(nifties[currentItem].url, currentItem + 1, nifties[currentItem].image, nifties[currentItem].name);
            }
        }
    }, 500000);
}

function pollOpenSea() {
    var lastSaleTime = cache.get('lastSaleTimeKarisma-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(5, 'h').unix();
        cache.set('lastSaleTimeKarisma-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            asset_contract_address: '0x5c4bdcd881bbaea858a37065689512fec173f70e',
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
                console.log(moment(created).unix());
                console.log(lastSaleTime);
                tweets.push(format.formatTweetOpenSea(event));

                cache.set('lastSaleTimeKarisma-OPENSEA', moment(created).unix());
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
    pollSuperRareAndNifty,pollOpenSea
}