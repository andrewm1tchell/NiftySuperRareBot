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
    {   url:"https://www.niftygateway.com/marketplace/item/0x285da03cca96ea38c07c97d2d34caefee62adc3d/12000030003",
        collectionId : 1,
        image:"https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1632917959/ADaniel/AnthonyAzekwoh/Earth_qbbilk.jpg",
        name:"Earth",
        isSR: false
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x285da03cca96ea38c07c97d2d34caefee62adc3d/2",
        collectionId: 2,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1632917950/ADaniel/AnthonyAzekwoh/Water2_1_oklvpg.jpg",
        name: "Water",
        isSR: false
    },
    {
        url:"https://www.niftygateway.com/marketplace/collection/0x285da03cca96ea38c07c97d2d34caefee62adc3d/1",
        collectionId: 3,
        image:"https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1632917962/ADaniel/AnthonyAzekwoh/Fire_qlnrrg.jpg",
        name:"Fire",
        isSR: false
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xe8099e7490d79539c3c63525f3c3f393fa4a4170/1",
        collectionId:  4,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1640882747/ADaniel/AnthonyAzekwoh/22.1.6/Air_-_Anthony_Azekwoh_brvrso.jpg",
        name: "Air",
        isSR: false
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xe8099e7490d79539c3c63525f3c3f393fa4a4170/3",
        collectionId: 5,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1640882759/ADaniel/AnthonyAzekwoh/22.1.6/Solomon_Study_x_-_Anthony_Azekwoh_dcoesd.jpg",
        name: "Study of Solomon X",
        isSR: false
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xe8099e7490d79539c3c63525f3c3f393fa4a4170/2",
        collectionId: 6,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1640882752/ADaniel/AnthonyAzekwoh/22.1.6/Solomon_Study_1_-_Anthony_Azekwoh_obdzob.jpg",
        name: "Study of Solomon 1",
        isSR: false
    }
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

function pollNiftyGateway(url, collectionId, imageUrl, item) {
    isPolling = true;
    console.log("Searching item:" + url);
    let tweets = [];

    (async function goToNiftyUrl() {
        try {
            const webdriver = require('selenium-webdriver');
            require('chromedriver');
            const chrome = require('selenium-webdriver/chrome');

            let options = new chrome.Options();
            options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);

            //Don't forget to add these for heroku
            options.addArguments("--headless");
            options.addArguments("--disable-gpu");
            options.addArguments("--no-sandbox");
            options.addArguments("enable-automation");
            options.addArguments("--disable-infobars");
            options.addArguments("--disable-dev-shm-usage");
            let driver = new webdriver.Builder()
                .forBrowser("chrome")
                .setChromeOptions(options)
                .build();
            try {
                await driver.get(url);
                driver.wait(function () {
                    return driver.executeScript('return document.readyState').then(function (readyState) {
                        return readyState === 'complete';
                    });
                });
                if (collectionId === 0) {
                    await driver.sleep(20000);
                    //Click History
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div/div[4]/div/div/div[1]/div/div[2]/div/button[2]")).click();
                    await driver.sleep(10000);

                    //Click Sales Only
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div/div[4]/div/div/div[2]/div[2]/div[1]/label")).click();
                    await driver.sleep(10000);
                } else if (collectionId > 0) {
                    await driver.sleep(10000);
                    //Click History
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div[1]/div[3]/div/div/div/button[2]")).click();
                    await driver.sleep(10000);

                    //Click Sales Only
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div[1]/div[5]/div[2]/div/div/div[2]/div/div[1]/label")).click();
                    await driver.sleep(10000);
                }
                for (let i = 1; i < 10; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        let price, eventText;
                        if (collectionId === 0) {
                            eventText = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div/div[4]/div/div/div[2]/div[2]/div[2]/div[1]/table/tbody/tr[" + i + "]/td[2]/p")).getText();
                            price = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div/div[4]/div/div/div[2]/div[2]/div[2]/div[1]/table/tbody/tr[" + i + "]/td[3]/span")).getText();
                        } else if (collectionId > 0) {
                            eventText = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div[1]/div[5]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[2]/p")).getText();
                            price = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div[1]/div[5]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[3]/span")).getText();
                        }
                        let originalEventText = eventText;
                        const myArray = eventText.split("from");
                        if (myArray.length > 1) {
                            eventText = item + "\n\n" + myArray[0] + "from" + myArray[1].substring(0, myArray[1].length - 1) + " for " + price + "\n\n" + url;
                            let tweetey = {
                                text: eventText,
                                url: imageUrl
                            };
                            let qry = "SELECT * FROM TWEETS WHERE FROMBOT = 'AZEKWOH' AND VALUE LIKE '%"+originalEventText+"%';";
                            pool.query(qry, (err,res) => {
                                if (err) {
                                } else {
                                    if(res.rowCount > 0) {

                                    } else {
                                        pool.query("INSERT INTO TWEETS(VALUE, FROMBOT) VALUES($1, $2);", [originalEventText, "AZEKWOH"], (err, res) => {
                                            if (err) {

                                            } else {
                                              //  tweet.tweetWithImage(tweetey.text, tweetey.url);
                                            }
                                        });
                                    }
                                }
                            });


                        }
                    } catch (e) {
                        //console.log("");
                    }
                }
            } catch (e) {
                // console.log(e);
            } finally {
                try {
                    await driver.quit();
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    }
                    isPolling = false;
                } catch (e) {
                    console.log(e);
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    }
                    isPolling = false;
                }
            }
        } catch (e) {
            console.log(e);
            currentItem++;
            if(currentItem >= nifties.length)
            {
                currentItem = 0;
            }
            isPolling = false;
        }
    })()
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