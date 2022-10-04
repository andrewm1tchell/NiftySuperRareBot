const moment = require('moment');
const axios = require('axios');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./omenteJovem_tweet');
const _ = require("lodash");

function pollOpenSea() {
    var lastSaleTime = cache.get('lastSaleTimeOmenteJovem-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeOmenteJovem-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            asset_contract_address: '0x28a6f816eae721fea4ad34c000077b5fe525fc3c',
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
                
                cache.set('lastSaleTimeOmenteJovem-OPENSEA', moment(created).unix());
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
    var lastSaleTime = cache.get('lastSaleTimeOmenteJovem-OBJKT', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeOmenteJovem-OBJKT', lastSaleTime);
    }

    axios({
        url: 'https://data.objkt.com/v2/graphql/',
        method: 'post',
        data: {
            query: `
     query MyQuery {
  event(where: {price: {_gt: "0"},
   event_type: {_in: ["dutch_purchase", "accept_offer", "ask_purchase"]}, token: {creators: {creator_address: {_eq: "tz1Kh719XA4vZNr3wG7hod79bE9MCc5Upf2b"}}}}) {
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
                cache.set('lastSaleTimeOmenteJovem-OBJKT', moment(created).unix());
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
    pollObjkt,pollOpenSea
}