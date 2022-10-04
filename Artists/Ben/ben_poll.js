const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const cache = require('./../../cache');
const format = require('./../../formatTweet');
const tweet = require('./ben_tweet');
const {Pool} = require("pg");
const chrome = require("selenium-webdriver/chrome");
const webdriver = require("selenium-webdriver");
const pool = new Pool({
    connectionString: "postgres://hicqtfqt:O8O43l-oGpzGyRFi0iQ6Ih2MDKGD3ZWd@jelani.db.elephantsql.com/hicqtfqt",
    ssl: {
        rejectUnauthorized: false
    }
});

let bensCollection = [
    {
        "url": "https://superrare.com/artwork-v2/%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%BE%E0%A4%A3-prana-35976",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qmcv5WA3HQWMdEc5DEmNThdNwJXdzJmR5Zw71WGurfgb8a/-prana.png",
        "item": "प्राण Prana",
        "id": 1
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/not-just-a-building-35723",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmW2osJNnMrCYKRV9Zmf8EBXvxR7jpFaBwcyu2Yrt88pBQ/not-just-a-building.jpg",
        "item": "NOT JUST A BUILDING",
        "id": 2
        ,"useImage": false },
    {
        "url": "https://superrare.com/0x4664fc6ca054e3ddb7b800cfc8657f66114c298e/micronauts-3",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmXJMwP44TQWXPsYNPHZpUUusxSfyLrLGJfQd8T517C14o/micronauts.jpg",
        "item": "Micronauts",
        "id": 3
        ,"useImage": false },
    {
        "url": "https://superrare.com/0x475c9197e47a5510b16c702fefdd2a39becd0c49/for-the-love-of-the-game-5",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmXoB4SvD7KEFgZyJMr41H1m41Gb2CA4W6dh75qQAf4V9B/for-the-love-of-the-game.jpg",
        "item": "For the Love of the Game",
        "id": 4
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/learn-adieu-34231",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmTbnrEZcspgZzuTbzDu5koUwctb6gArYa8U8eMXV2e7AU/learn-adieu.jpg",
        "item": "Learn Adieu",
        "id": 5
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/you%E2%80%99ll-never-know-33735",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmX7Uk1uMbaiG2w9cPiDHGfWxKuTgwPVLMSDuCpfiLwTcF/you-ll-never-know.jpg",
        "item": "You’ll Never Know",
        "id": 6
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/the-banker,-33606",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmNPvNC3nSWkowmw5uUSumfkpR4CngDNrT91EekPuR9EgG/the-banker-.png",
        "item": "The Banker,",
        "id": 7
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/push-of-a-button-33564",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmYMz8f6cf3MGkNJN6vKAQyxy2s9txHQvA9kQWggnm6NZB/push-of-a-button.mp4",
        "item": "Push of a Button",
        "id": 8
        ,"useImage": false },
    {
        "url": "https://superrare.com/0x9f65f845d85132eafa36332fe88f34cc8c5a1e68/itaka-72",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmfM6kGvPw456E14ixdvrqAYhxmAHvvuUWfmN5iYoF1vpY/itaka.png",
        "item": "Itaka",
        "id": 9
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/dark-sky-33367",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmNwaBvspgFdMmexesajGxX5feVRuoRZLahAt4gMubdHcS/dark-sky.png",
        "item": "Dark Sky",
        "id": 10
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/about-zero-33304",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qmcn66jVNxrta2G2e5WK9eykyTybi9koWJ9vpGK7qGEQBx/about-zero.jpg",
        "item": "About Zero",
        "id": 11
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/stay-soft-33230",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmUirG5DMFriYDMCNqRvQHuks75SgNsgxj1MMT34APBUMJ/stay-soft.jpg",
        "item": "STAY SOFT",
        "id": 12
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/like-you,-but-different-33020",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmXJYRa7JfvkjHqdHmjuirJH5JwLQiffFA1zDQDYc8aUZw/like-you-but-different.jpg",
        "item": "Like you, but different",
        "id": 13
        ,"useImage": false },
    {
        "url": "https://superrare.com/0x4dc022f731f78cdade2791f7e3750fc630ca3100/lost-in-melancholia-iv-4",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmQ1mrchxpgCV8GNuom6HgSskeEvPEXTHP7kc7XKzRfJ2r/lost-in-melancholia-iv.png",
        "item": "Lost in Melancholia IV",
        "id": 14
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/tennis-court-32981",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmV8QcQAdUBSpqw5JuKWHoFXooPCHPv4j5MdCdFgGKrTNg/tennis-court.jpg",
        "item": "Tennis Court",
        "id": 15
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/take-a-break-32620",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmVUxScHgHPPNaGMkkgyHuNiMTcijxBk2odvAy9AjKviKK/take-a-break.jpg",
        "item": "Take a break",
        "id": 16
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/wow-now-32550",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmQ5JpxQ2q1uSmVjq4CErt59hW1yqspUcPEAeXb6gYWnU9/wow-now.jpg",
        "item": "WOW NOW",
        "id": 17
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/the-year-factory-32177",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmQmCxDyZGcx6oZUZfs8qbEPwzkT6ajBikQvE7iMzYrUJh/the-year-factory.mp4",
        "item": "The Year Factory",
        "id": 18
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/m-i-r-a-a-32092",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmdPWE7Xoim666jmskJxpRc24ef2bnxEmEFnPCobsnNeDh/m-i-r-a-a.mp4",
        "item": "M I R A A",
        "id": 19
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/another-sector-31887",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmRDpyDMXJxvXrc8DGnuznNKNbWSQUB6AvUijd5SDfumAY/another-sector.jpg",
        "item": "Another Sector",
        "id": 20
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/gm-gm-gm-31251",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmdExMMdkTPNunyoKJfaA1jiskjVDFRUCoT1zh9fCUTvAx/gm-gm-gm.mp4",
        "item": "GM GM GM",
        "id": 21
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/10-pieds-sous-ton-masque-31043",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmXDcWVJY9e1FsAYnCi7ez6cPeHhhTykAQs3gvTYEZyX19/10-pieds-sous-ton-masque.jpg",
        "item": "10 pieds sous ton masque",
        "id": 22
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/cross-adieu-30639",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmZuURCWtqHxpC2pKf2kQ5Hp347ST6ZD854sq5mii1e1rt/cross-adieu.jpg",
        "item": "Cross Adieu",
        "id": 23
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/untitled-30290",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmdZNY8h5K4vpc2GCRWcLMhwWqwhWjLcsUpoYZzNtF3WHo/untitled.jpg",
        "item": "Untitled",
        "id": 24
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/they-talked--talked-about,-30271",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmbSoyN7Bn1eWBZHSz3Tz6nQw23K9h3xE5x9nTxp5LWuXP/they-talked-talked-about-.jpg",
        "item": "They talked & talked about,",
        "id": 25
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/remembering-30166",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmNf5ukSbVqBZg3daHyaW58WnGortq4p9HzhfaMGJH4Abb/remembering.jpg",
        "item": "Remembering",
        "id": 26
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/strange-hours-29146",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmZjv8Uf6s5YAMUDVSdquSS8gtqWmogrB8aHptkJaWmc1k/strange-hours.jpg",
        "item": "Strange Hours",
        "id": 27
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/corruptible-truth-seeker-29060",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qmb5u7gimUz3V54Q5zTtWqPj527ZqfqSEcpnJjNGgwybA4/corruptible-truth-seeker.png",
        "item": "Corruptible Truth Seeker",
        "id": 28
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/new-soho-29033",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmREgUcExN8JcKRgVyFLXpkR2QdYdYR8EcGi6morYoPoSr/new-soho.mp4",
        "item": "New Soho",
        "id": 29
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/the-day-i-felt-god-28486",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qmawmh9vLD9e7GzMTP748is9cwXigXsDGqTF3cJapj2wJv/the-day-i-felt-god.jpg",
        "item": "The Day I Felt God",
        "id": 30
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/spirit-of-conviction-28379",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmeTRfw8y4si9WNdr9CSpvPokW7X7DQe4qhEmqUBhDjx9t/spirit-of-conviction.jpg",
        "item": "Spirit of Conviction",
        "id": 31
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/le-poids-de-l'[eau]-27806",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmQg4LYT8RNcyihzSG2TnjxZkSmXg37Pzw6zt5F9zAzqPk/le-poids-de-l-eau-.jpg",
        "item": "le poids de l'[eau]",
        "id": 32
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/gr-ape-27770",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmZouxdXVV3x1W7pUeSb3mASamiwGqA8rryjpbiL32wu17/gr-ape.jpg",
        "item": "GR-APE",
        "id": 33
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/childhood's-remark-26074",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmdqB3p5QfHZDrn2f2qrVSnjwsL12Anw7DGqbRettcDLAn/childhood-s-remark.jpg",
        "item": "CHILDHOOD's REMARK",
        "id": 34
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/ultraviolet-24807",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmRAqUmDut7LR6WPNwjuMeGPG74SEET9VmghTX7ZRNDcay/ultraviolet.jpg",
        "item": "Ultraviolet",
        "id": 35
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/vivido-24063",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmXiCy7HgNEJPY5oYtimQicGz99xcEahkv7YhJZZpNBemU/vivido.mp4",
        "item": "Vivido",
        "id": 36
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/j'adoor-24055",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmWiHPe4q7FfULeKof1ZQZNai9raNv7JkeEqWmUqmy1vdn/j-adoor.png",
        "item": "J'ADOOR",
        "id": 37
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/terminal-23922",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmPfB7fbDDtBvGBjnWqdqWvpS4HSi4mCp2npG5rVvYRbC7/terminal.mp4",
        "item": "Terminal",
        "id": 38
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/first-23742",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmUtim319GHo9JL15AKvvkarpvjjDoeW1GVk4pfJGSUSk2/first.png",
        "item": "FIRST",
        "id": 39
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/golden-gate-city,-2300-23436",
        "imageUrl": "https://f8n-production-collection-assets.imgix.net/0xb932a70A57673d89f4acfFBE830E8ed7f75Fb9e0/23436/nft.jpg?q=30&auto=format%2Ccompress&cs=srgb&max-w=500&max-h=500",
        "item": "Golden Gate City, 2300",
        "useImage": false,
        "id": 40
        ,"useImage": true },
    {
        "url": "https://superrare.com/artwork-v2/consolation-23113",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmP6FTNuH6cCTjjnSG3gxqNJkxjBv5QkUG93uiJxrzEUdv/consolation.jpg",
        "item": "Consolation",
        "id": 41
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/catsophrenia-22003",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qmauz3fEyXMwidaS1SbreaNGYijsCsgqBbq4uoZRAS4CoK/catsophrenia.mp4",
        "item": "Catsophrenia",
        "id": 42
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/pneuma-21886",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qmauz3fEyXMwidaS1SbreaNGYijsCsgqBbq4uoZRAS4CoK/catsophrenia.mp4",
        "item": "Pneuma",
        "id": 43
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/ether-of-the-wilds-21346",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qme47N61hZsKRyV1ZBJKyFcNoRv97mvHpyK4coFAsFSm4c/ether-of-the-wilds.jpg",
        "item": "Ether of the Wilds",
        "id": 44
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/acid-trip-21117",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmdzMGAHZjesUgbM52mYHKXmAtVUhHwuTGSXy4sLMEFHNK/acid-trip.png",
        "item": "Acid Trip",
        "id": 45
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/lugares-20075",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmRnajQAqm5kJYtqJru4LWtrafbizyLmEjXEoi85e2uKxK/lugares.png",
        "item": "Lugares",
        "id": 46
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/teenage-dreams-19935",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmTSRBJZL8ZmLLyVFrNEcBtP1fzF6FemCX4LAegmR1M5oD/teenage-dreams.png",
        "item": "TEENAGE DREAMS",
        "id": 47
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/dreamworld-19924",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmeJ2gqnkzt5ZQ1XQdRpLnXCtFebdZqNMUDxNhBSKkvHJo/dreamworld.jpg",
        "item": "DREAMWORLD",
        "id": 48
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/creative-workaholic-19626",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmTRqusgXDww9BdDpTsfazCgY8PkeyB52HDpz9bJmuqRTG/creative-workaholic.jpg",
        "item": "CREATIVE WORKAHOLIC",
        "id": 49
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/the-fish-of-ether-19331",
        "imageUrl": "https://ipfs.pixura.io/ipfs/QmQw2nWmRZyC5fjkw5nCpbbJnSCeeGENoizb7e4F6LPwYZ/the-fish-of-ether.jpg",
        "item": "The Fish Of Ether",
        "id": 50
        ,"useImage": false },
    {
        "url": "https://superrare.com/artwork-v2/running-tracks-18141",
        "imageUrl": "https://ipfs.pixura.io/ipfs/Qma1ZkdkL4NEW3pjw1ajnatZvae9vKgRonMgDFgN1iUGaw/running-tracks.png",
        "item": "Running Tracks",
        "id": 51
        ,"useImage": false }
];
let isPolling = false;

let currentItem =  0;
function pollItems() {
//Poll OpenSea every 60 seconds & retrieve all sales for a given collection in either the time since the last sale OR in the last minute
    setInterval(() => {
        if (!isPolling) {
            pollSuperRare(bensCollection[currentItem].url, bensCollection[currentItem].imageUrl, bensCollection[currentItem].item, bensCollection[currentItem].id, bensCollection[currentItem].useImage);
        }
    }, 500000);
}

//This function looks at a superrare url, and tweets all the offers ever made on it.
function pollSuperRare(url, imageUrl, item, id, useImage) {
    isPolling = true;
    console.log("polling: " + url);
    (async function goToSuperRareUrl() {
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
            let tweets = [];

            try {
                await driver.get(url);
                driver.wait(function () {
                    return driver.executeScript('return document.readyState').then(function (readyState) {
                        return readyState === 'complete';
                    });
                });
                await driver.sleep(20000); //5 seconds works fine for wait time
                for (let i = 1; i < 100; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        var text = await driver.findElement(webdriver.By.xpath("//html/body/div[1]/div/div/div[2]/div/section/div[5]/div[" + i + "]/div/div[2]/div[2]")).getText();
                        console.log(text);
                        if (text.includes("transferred to @ben_vault")) {
                            break;
                            //Here you would check if the offer is more recent than the last saved offer time.
                            //If it is, overwrite your last offer time and then tweet about this offer.
                        } else {
                            var artistname = "";
                            try {
                                artistname = await driver.findElement(webdriver.By.xpath("//html/body/div[1]/div/div/div[2]/div/section/div[3]/div[1]/a[2]/div/span[2]")).getText();
                            } catch (e) {

                            }
                            if (!useImage) {
                                imageUrl = await driver.findElement(webdriver.By.xpath("//html/body/div[1]/div/div/div[2]/div/section/div[1]/button/img")).getAttribute("src");
                            }
                            let tweetText = item + "\n\n" + text + "\n\n" + url;
                            let artistText = (artistname !== "" ? " by " + artistname : "");
                            let tweetText2 = "" + item + artistText + "\n\n" + text + "\n\n" + url;
                            pool.query("INSERT INTO Tweets(VALUE, FROMBOT) VALUES($1, $2);", [tweetText, "BEN"], (err, res) => {
                                if (err) {
                                } else {
                                    tweets.push({text: tweetText2, imageUrl});
                                }
                            });
                        }
                    } catch (e) {
                        //   console.log("error " + item)
                    }
                }
            } finally {
                currentItem++;
                if (currentItem >= bensCollection.length) {
                    currentItem = 0;
                }
                isPolling = false;
                await driver.quit();
                for (let i = 0; i < tweets.length; i++) {
                    await tweet.tweetWithImage(tweets[i].text, tweets[i].imageUrl);
                }
            }
        } catch(e) {
            currentItem++;
            if(currentItem >= bensCollection.length)
            {
                currentItem = 0;
            }
            isPolling = false;
        }
    })()
}
module.exports = {
    pollItems
}