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

const nifties = [{
    url: "https://www.niftygateway.com/marketplace/collection/0x746fb94befd3435358847228f111dde8dea91ef5/1",
    image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730040/Julian/KarismaAug16/The_dead_waltz_through_the_streets_t1nmzl.png",
    name: "The dead waltz through the streets"
    ,isSR: false
},
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/1",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730015/Julian/KarismaAug16/we_ll_never_kiss_again_mtme0r.png",
        name: "We’ll never kiss again"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/2",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660055805/Julian/KarismaAug16/deep_in_my_body_i_felt_you_and_i_felt_you_leave_fixed_sch7vc.png",
        name: "Deep in my body I felt you, And I felt you leave"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/3",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660055791/Julian/KarismaAug16/i_am_my_enemy_e5r5q8.png",
        name: "I am my enemy"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/4",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730079/Julian/KarismaAug16/Primadonna_gcqyc5.png",
        name: "Primadonna"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/5",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1659730165/Julian/KarismaAug16/don_t_turn_back_ypeyay.png",
        name: "Don’t turn back"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/6",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730067/Julian/KarismaAug16/my_lies_cured_her_smile_yfdkms.png",
        name: "My lies cured her smile"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/7",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660055986/Julian/KarismaAug16/the_hedgehog_s_dilemma_l9zb0f.png",
        name: "The hedgehog’s dilemma"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/8",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660056050/Julian/KarismaAug16/tidalwave_fshgxh.png",
        name: "Tidal Wave"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/9",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730157/Julian/KarismaAug16/she_kisses_me_like_someone_she_hates_euubco.png",
        name: "She kisses me like someone she hates"
        ,isSR: false
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/10",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730156/Julian/KarismaAug16/You_make_me_sick_pcd1ba.png",
        name: "You make me sick"
        ,isSR: false
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/dishonesty-binds-me-to-you-2",
        image: "https://ipfs.pixura.io/ipfs/QmWSHLLzgxnnykNpjFHktSZc2WHbhgA1ALts6ai5hQBxaS/dishonesty-binds-me-to-you.png",
        name: "Dishonesty binds me to you",
        isSR: true
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/3",
        image: "https://ipfs.pixura.io/ipfs/Qme6RNCQEhYNfY4KmbVFA5s15SgJGvCeCjjxtMWbg9sDdg/in-hope-that-you-may-drown.png",
        name: "In Hope That You May Drown",
        isSR: true
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/kimono-1",
        image: "https://ipfs.pixura.io/ipfs/QmWg6QrBzAT1T9XVEHheeS595gCkgtL31T3R9CCYNCb2Ea/kimono.png",
        name: "Kimono",
        isSR: true
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/we-were-infinite-for-a-moment-4",
        image: "https://i.imgur.com/1tpFFd9.jpeg",
        name: "We were infinite for a moment",
        isSR: true
    }
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
                            let qry = "SELECT * FROM TWEETS WHERE FROMBOT = 'KRISMA' AND VALUE LIKE '%"+originalEventText+"%';";
                            pool.query(qry, (err,res) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(res.rowCount);
                                    if(res.rowCount > 0) {

                                    } else {
                                        pool.query("INSERT INTO TWEETS(VALUE, FROMBOT) VALUES($1, $2);", [originalEventText, "KRISMA"], (err, res) => {
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

function pollSuperrare(url, collectionId, imageUrl, item) {
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
                await driver.sleep(30000); //5 seconds works fine for wait time
                for(let i = 0; i < 30; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        var text = await driver.findElement(webdriver.By.xpath("//html/body/div[1]/div/div/div[2]/div/section/div[5]/div[" + i + "]/div/div[2]/div[2]")).getText();
                        if (text.includes("accepted an offer") || text.includes("won auction")) {
                            console.log(text);
                            let tweetey = {
                                text : item + "\n\n" + text + "\n\n" + url,
                                url : imageUrl
                            }
                            pool.query("INSERT INTO TWEETS(VALUE, FROMBOT) VALUES($1, $2);", [tweetey.text, "KRISMA"], (err, res) => {
                                if (err) {

                                } else {
                                   // tweet.tweetWithImage(tweetey.text, tweetey.url);
                                }
                            });
                        }
                    } catch(e) {

                    }
                }
            } catch (e) {
                console.log(e);
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
    var lastSaleTime = cache.get('lastSaleTimeKrisma-OPENSEA', null);
    if (lastSaleTime === null || typeof(lastSaleTime) === 'undefined') {
        lastSaleTime = moment().add(3, 'h').unix();
        cache.set('lastSaleTimeKrisma-OPENSEA', lastSaleTime);
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

                cache.set('lastSaleTimeKrisma-OPENSEA', moment(created).unix());
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