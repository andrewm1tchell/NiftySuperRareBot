const etienneCrauss = require("./Artists/EtienneCrauss/etienneCrauss_poll");
const ometeJovem = require("./Artists/OmenteJovem/omenteJovem_poll");
const primera = require("./Artists/Primera/primera_poll");
const samCavet = require("./Artists/SamCavet/samCavet_poll");
const andrewMitchell = require("./Artists/AndrewMitchell/andrewMitchell_poll");
const grantYun = require("./Artists/GrantYun/grantYun_poll");
const tjo = require("./Artists/Tjo/tjo_poll");
const krisma = require("./Artists/Krisma/krisma_poll");
const azekwoh = require("./Artists/Azekwoh/azekwoh_poll");
const ben = require("./Artists/Ben/ben_poll");
let isPolling = false;

setInterval(() => {
   if(!isPolling) {
      poll().then(r => isPolling = false);
   }
}, 1000);//360000);
async function poll() {
   isPolling = true;
   console.log("Polling Etienne Crauss");
   etienneCrauss.pollOpenSea();
   await sleep(2000);
   etienneCrauss.pollObjkt();
   await sleep(2000);
   console.log("Polling OmenteJovem");
   ometeJovem.pollOpenSea();
   await sleep(2000);
   ometeJovem.pollObjkt();
   await sleep(2000);
   console.log("Polling Primera");
   primera.pollOpenSea();
   await sleep(2000);
   console.log("Polling Sam Cavet");
   samCavet.pollOpenSeaByContractAddress();
   await sleep(2000);
   samCavet.pollOpenSeaBySlug();
   await sleep(2000);
   console.log("Polling Andrew Mitchell");
   andrewMitchell.pollOpenSea1();
   await sleep(2000);
   andrewMitchell.pollOpenSea2();
   await sleep(2000);
   andrewMitchell.pollObjkt();
   await sleep(2000);
   console.log("Polling Grant Yun");
   grantYun.pollOpenSea1();
   await sleep(2000);
   grantYun.pollOpenSea2();
   await sleep(2000);
   grantYun.pollOpenSea3();
   await sleep(2000);
   grantYun.pollOpenSea4();
   await sleep(2000);
   grantYun.getTweetsSuperRare()
   await sleep(2000);
   console.log("Polling Tjo");
   tjo.pollOpenSeaByContractAddress();
   await sleep(2000);
   tjo.pollOpenSeaBySlug();
   await sleep(2000);
   console.log("Polling Krisma");
   krisma.pollSuperRareAndNifty();
   await sleep(2000);
   krisma.pollOpenSea();
   await sleep(2000);
   console.log("Polling Azekwoh");
   azekwoh.pollSuperRareAndNifty();
   await sleep(2000);
   azekwoh.pollOpenSea();
   await sleep(2000);
   azekwoh.getTweetsSuperRare();
   await sleep(2000);
   console.log("Polling Ben");
   ben.pollItems();
}

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}