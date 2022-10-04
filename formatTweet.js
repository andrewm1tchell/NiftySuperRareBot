const _ = require("lodash");
const {ethers} = require("ethers");

function formatTweetOpenSea(event) {
    const sellerName = _.get(event, ['seller', 'user', 'username']);
    const buyerName = _.get(event, ['winner_account', 'user', 'username']);
    const assetName = _.get(event, ['asset', 'name'], _.get(event, ['asset_bundle', 'name']));
    const openseaLink = _.get(event, ['asset', 'permalink'], _.get(event, ['asset_bundle', 'permalink']));

    const totalPrice = _.get(event, 'total_price');

    const tokenDecimals = _.get(event, ['payment_token', 'decimals']);
    const tokenUsdPrice = _.get(event, ['payment_token', 'usd_price']);
    const tokenEthPrice = _.get(event, ['payment_token', 'eth_price']);

    const formattedUnits = ethers.utils.formatUnits(totalPrice, tokenDecimals);
    const formattedEthPrice = formattedUnits * tokenEthPrice;
    const formattedUsdPrice = formattedUnits * tokenUsdPrice;

    const tweetText =
        `${assetName} \n\nSold from ${sellerName} to ${buyerName} for $${Number(formattedUsdPrice).toFixed(2)} (${formattedEthPrice}${ethers.constants.EtherSymbol}) \n\n${openseaLink}`;

    const imageUrl = _.get(event, ['asset', 'image_url']);

    return { text: tweetText, url: imageUrl };
}

function formatTweetXTZ(event, showUrl = false) {
    const sellerName = event.creator.alias;
    const buyerName = event.recipient.alias;

    const totalPrice = event.price;

    const tzPrice = totalPrice/ 1000000;
    const url = event.token.display_uri;
    let buySellText = "";
    console.log(sellerName,buyerName);
    if(sellerName === null && buyerName === null) {
        buySellText = `Sold from ANON to ANON for ${tzPrice} XTZ`;
    } else if(sellerName === null) {
        buySellText = `Sold from ANON to ${buyerName} for ${tzPrice} XTZ`;
    } else if(buyerName === null) {
        buySellText = `Sold from ${sellerName} to ANON for ${tzPrice} XTZ`;
    } else {
        buySellText = `Sold from ${sellerName} to ${buyerName} for ${tzPrice} XTZ`;
    }
    let objktLink = "";
    if(showUrl) {
        objktLink = "https://objkt.com/asset/hicetnunc/" + event.token.token_id;
    }
    const tweetText =
        `${event.token.name} \n\n${buySellText} \n\n${objktLink}`;

    return { text: tweetText, url: "https://ipfs.io/ipfs/"+url.substring(7) };
}

module.exports = {
    formatTweetOpenSea,formatTweetXTZ
}