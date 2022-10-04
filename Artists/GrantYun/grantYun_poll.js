const moment = require('moment');
const axios = require('axios');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./grantYun_tweet');
const _ = require("lodash");

function pollOpenSea1() {
    var lastSaleTime = cache.get('lastSaleTimeGrantYun-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeGrantYun-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            collection_slug: 'lifeinjapaneditions',
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
                cache.set('lastSaleTimeGrantYun-OPENSEA', moment(created).unix());
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
    var lastSaleTime = cache.get('lastSaleTimeGrantYun2-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeGrantYun2-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            collection_slug: 'grant-riven-yun-early-works',
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
                
                cache.set('lastSaleTimeGrantYun2-OPENSEA', moment(created).unix());
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
function pollOpenSea3() {
    var lastSaleTime = cache.get('lastSaleTimeGrantYun3-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeGrantYun3-OPENSEA', lastSaleTime);
    }

    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            collection_slug: 'cozyhomes',
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
                
                cache.set('lastSaleTimeGrantYun3-OPENSEA', moment(created).unix());
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
function pollOpenSea4() {
    var lastSaleTime = cache.get('lastSaleTimeGrantYun4-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeGrantYun4-OPENSEA', lastSaleTime);
    }
    axios.get('https://api.opensea.io/api/v1/events', {
        headers: {
            'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
        },
        params: {
            collection_slug: 'foundationsofstudy',
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
                
                cache.set('lastSaleTimeGrantYun4-OPENSEA', moment(created).unix());
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
    var recentRT = cache.get("GrantYun_recentRT",null);
    if(typeof(recentRT) === "undefined") {
        recentRT = "1526712071030771713;1526644031949774853;";
        cache.set("GrantYun_recentRT", recentRT);
    }
    var url ="https://api.twitter.com/2/tweets/search/recent?query=from%3ASuperRareBot%20grantyun2";
    const options = {
        headers: {
            Authorization: "Bearer AAAAAAAAAAAAAAAAAAAAAGUAcwEAAAAAOK7r4UniI8GHiHumb%2BmouRMhyv8%3DEqd38FemntwG4VgKe2AS9ZsnoHqgHqMOrReNI81zbG0HHZhpZv"
        }
    };
    try {
        axios.get(url, options)
            .then((res) => {
                var data = _.get(res, ['data']);
                _.each(data, (tweets) => {
                    _.each(tweets, (t) => {
                        var tweetId = _.get(t, 'id');
                        if (typeof (tweetId) !== "undefined") {
                            if (!recentRT.includes((tweetId + ";"))) {
                                recentRT += (tweetId + ";");
                                cache.set("GrantYun_recentRT", recentRT);
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
    pollOpenSea1,pollOpenSea2,pollOpenSea3,pollOpenSea4,getTweetsSuperRare
}