const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./azekowh_tweet');
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

]
let currentItem =  nifties.length-1;
let isPolling = false;
function pollSuperRareAndNifty() {
    setInterval(function () {
        if (!isPolling) {
            if (!nifties[currentItem].isSR) {
                pollNiftyGateway(nifties[currentItem].url, currentItem + 1, nifties[currentItem].image, nifties[currentItem].name);
            }
        }
    }, 500000);
}


function pollOpenSea() {
    var lastSaleTime = cache.get('lastSaleTimeAzekowha-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeAzekowha-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            asset_contract_address: '0xa06c8dbd128df8096950fe978689dfb497036ecf',
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

                cache.set('lastSaleTimeAzekowha-OPENSEA', moment(created).unix());
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

function getTweetsSuperRare(){
    let recentRT = cache.get("recentSRRTAzekowh",null);
    if(typeof(recentRT) === "undefined") {
        recentRT = "";
        cache.set("recentSRRTAzekowh", recentRT);
    }
    console.log(recentRT);
    let url ="https://api.twitter.com/2/tweets/search/recent?query=from%3ASuperRareBot%20AnthonyAzekwoh";
    const options = {
        headers: {
            Authorization: "Bearer AAAAAAAAAAAAAAAAAAAAAJRcfwEAAAAAQg4crmex4DWHv0tWMYLf7mLV%2Fs4%3DeDvaDTb8M1BkBKD1JwjWPeNL7M7cGanJjiuTzdIVAJ4lDLN3yq"
        }
    };
    try {
        axios.get(url, options)
            .then((res) => {
                let data = _.get(res, ['data']);
                _.each(data, (tweets) => {
                    _.each(tweets, (t) => {
                        let tweetId = _.get(t, 'id');
                        if (typeof (tweetId) !== "undefined") {
                            if (!recentRT.includes((tweetId + ";"))) {
                                recentRT += (tweetId + ";");
                                cache.set("recentSRRTAzekowh", recentRT);
                                tweet.retweeter(tweetId);
                            }
                        }
                    })
                });
            }).catch((error) => {
        });
    } catch(e) {
        console.log(e);
    }
}
module.exports = {
    pollSuperRareAndNifty,pollOpenSea,getTweetsSuperRare
}