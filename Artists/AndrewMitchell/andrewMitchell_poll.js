const moment = require('moment');
const axios = require('axios');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./andrewMitchell_tweet');
const _ = require("lodash");

function pollOpenSea1() {
    var lastSaleTime = cache.get('lastSaleTimeAndrewMitchell-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeAndrewMitchell-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            asset_contract_address: '0x8452ee9a2fc4e80c53b33a2b38824c7976744521',
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
                cache.set('lastSaleTimeAndrewMitchell-OPENSEA', moment(created).unix());
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
function pollOpenSea2() {
    var lastSaleTime = cache.get('lastSaleTimeAndrewMitchell2-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeAndrewMitchell2-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            asset_contract_address: '0x1fa23513825f952afca07a603ac3f312ebee4ca9',
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
                cache.set('lastSaleTimeAndrewMitchell2-OPENSEA', moment(created).unix());
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
function pollObjkt() {
    var lastSaleTime = cache.get('lastSaleTimeAndrewMitchell-OBJKT', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeAndrewMitchell-OBJKT', lastSaleTime);
    }

    axios({
        url: 'https://data.objkt.com/v2/graphql/',
        method: 'post',
        data: {
            query: `
     query MyQuery {
  event(where: {price: {_gt: "0"},
   event_type: {_in: ["dutch_purchase", "accept_offer", "ask_purchase"]}, token: {creators: {creator_address: {_eq: "tz1YpJR4KhXSKKKBTpxauUSWn5zgjAM6uzZJ"}}}}) {
    id
    amount
    event_type
    price
    recipient {
      alias
      address
    }
    creator {
      alias
      address
    }
    token {
      artifact_uri
      display_uri
      name
      thumbnail_uri
      token_id
    }
    fa {
      token_link
    }
    timestamp
  }
}`
        }
    }).then((response) => {
        const data = _.get(response, ['data']);
        let mvent = [];
        _.forEach(data, function(events) {
            _.forEach(events, function(event) {
                mvent.push(event);
            });
        });

        let svents = [];
        const sortedEvents = _.forEach(mvent, function (event) {
            _.forEach(event, function(svent) {
                svents.push(svent);
            });
        });
        svents = _.sortBy(svents, function (event) {
            const created = _.get(event, 'timestamp');

            return new Date(created);
        });

        let tweets = [];
        _.each(svents, (event) => {
            const created = _.get(event, 'timestamp');
            let unixC = moment(created).unix();

            if(unixC > lastSaleTime) {
                tweets.push(format.formatTweetXTZ(event));
                cache.set('lastSaleTimeAndrewMitchell-OBJKT', moment(created).unix());
            }
        });

        for(let i = 0; i < tweets.length; i++) {
            tweet.tweetWithImage(tweets[i].text, tweets[i].url);
        }
    }).catch((error) => {
        console.error(error);
    });
}

module.exports = {
    pollObjkt,pollOpenSea1,pollOpenSea2
}