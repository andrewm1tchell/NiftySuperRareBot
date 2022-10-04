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

//This function looks at a superrare url, and tweets all the offers ever made on it.
module.exports = {
    pollSuperRare
}