const axios = require('axios');
const _ = require('lodash');
const {Pool} = require("pg");
const pool = new Pool({
    connectionString: "postgres://hicqtfqt:O8O43l-oGpzGyRFi0iQ6Ih2MDKGD3ZWd@jelani.db.elephantsql.com/hicqtfqt",
    ssl: {
        rejectUnauthorized: false
    }
});
const karismaTweet = require("./Artists/krisma_tweet");
const azekwohTweet = require("./Artists/azekowh_tweet");
const benTweet = require("./Artists/ben_tweet");
const coryTweet = require("./Artists/cory_tweet");
const andrewTweet = require("./Artists/andrewMitchell_tweet");
const postWookTweet = require("./Artists/postwook_tweet");
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const nifties = [
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xeccb6e6837fdb43f1ff14db95e666ca0c00f3b07/1",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1668843261/test-media-manager/richcaldwell/956/2409/TouchGrass.png",
        name: "Touch Grass",
        isSR: false,
        bot: "ANDREWMITCHELL"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xeccb6e6837fdb43f1ff14db95e666ca0c00f3b07/2",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1668842864/test-media-manager/richcaldwell/956/1952/Fortress_2.png",
        name: "Fortress",
        isSR: false,
        bot: "ANDREWMITCHELL"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xeccb6e6837fdb43f1ff14db95e666ca0c00f3b07/3",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1668067247/test-media-manager/richcaldwell/956/1950/Hiding%20Place_3.png",
        name: "Hiding Place",
        isSR: false,
        bot: "ANDREWMITCHELL"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xeccb6e6837fdb43f1ff14db95e666ca0c00f3b07/4",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1668067311/test-media-manager/richcaldwell/956/1951/Sleep_4.png",
        name: "Sleep",
        isSR: false,
        bot: "ANDREWMITCHELL"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xeccb6e6837fdb43f1ff14db95e666ca0c00f3b07/5",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1668067115/test-media-manager/richcaldwell/956/1948/Charm_1.png",
        name: "Charm",
        isSR: false,
        bot: "ANDREWMITCHELL"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xeccb6e6837fdb43f1ff14db95e666ca0c00f3b07/6",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1668067173/test-media-manager/richcaldwell/956/1949/Mother_2.png",
        name: "Mother",
        isSR: false,
        bot: "ANDREWMITCHELL"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/blue-muse,-2022-11",
        "image": "https://ipfs.pixura.io/ipfs/QmNht7BAHBbjVY6JTi686BMACpWdPHPHcaPfAFY3nqSvwc/blue-muse-2022.jpg",
        "name": "Blue Muse 2022",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/sky-glory,-2020-10",
        "image": "https://ipfs.pixura.io/ipfs/Qmf77m2Q2Y17fRK2CgjHDh1mfjzZo5Pa3CRAkyCKJwofe5/sky-glory-2020.jpg",
        "name": "Sky Glory, 2020",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/loose-ends,-2021-9",
        "image": "https://ipfs.pixura.io/ipfs/QmRNioZDSLJjFcUVAygURG83XUu1e93YMGvxKVhCcG4khA/loose-ends-2021.jpg",
        "name": "Loose Ends",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/keep-the-silence,-2021-8",
        "image": "https://ipfs.pixura.io/ipfs/QmcVbwj6ms3juAxBUdCmX1j7VrDyS6dVAu64L5cg3z9cKJ/keep-the-silence-2021.jpg",
        "name": "Keep the Silence",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/changes,-2022-7",
        "image": "https://ipfs.pixura.io/ipfs/QmUSxmxoCZbhrVYXSXRVNHeej3rnu85jtbgx6hD7ek6CqJ/Changes2022.JPG",
        "name": "Changes",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/liminal,-2022-6",
        "image": "https://ipfs.pixura.io/ipfs/Qmc1Jhbi2142WZa9GEMW2TEiVY8vcTHRJpR3Aaq2dmS2FL/liminal-2022.jpg",
        "name": "Liminal",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/emerald-pools,-2021-5",
        "image": "https://ipfs.pixura.io/ipfs/QmZUHuzZsGH91xQbyB5wPMUgFdKcCSqpTx3yBMQ8gbiEjq/emerald-pools-2021.jpg",
        "name": "Emerald Pools",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/bali-blues,-2022-4",
        "image": "https://ipfs.pixura.io/ipfs/QmXjwZsYLM3SDDC3Kmj8yL4YzUDERr27tuUbFASarYXsdM/bali-blues-2022.jpg",
        "name": "Bali Blues",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/acidic-landscape,-2022-3",
        "image": "https://ipfs.pixura.io/ipfs/QmRYioknNMVNnfRhEx6hboJvszg3UE6K3do5w5JkR7nPGt/acidic-landscape-2022.jpg",
        "name": "Acidic Landscape",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/the-moors,-2020-2",
        "image": "https://ipfs.pixura.io/ipfs/QmTXScdqyhDWwTUsXMgZeNwcgFeY2JtEyeU2dXx7e6NSop/the-moors-2020.jpg",
        "name": "The Moors",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/futuristic-nostalgia,-2022-1",
        "image": "https://ipfs.pixura.io/ipfs/Qme6bPTYpiyH8aM1i8X6KsDjHhtCTDuLgCKMDG5vYDWRfy/futuristic-nostalgia-2022.jpg",
        "name": "Futuristic Nostalgia",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0xa9cf3fb2c4538ac95e0c822758ec745fcfed8360/in-the-bush,-2022-79",
        "image": "https://ipfs.pixura.io/ipfs/QmQeduruwC1EVTKadQbDkFbLGn7kxBiszrug9tVZgX79KN/in-the-bush-2022.jpg",
        "name": "In The Bush",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x96bd48df606c8a241c263c72d57244272d079b38/random-desert,-2022-12",
        "image": "https://ipfs.pixura.io/ipfs/QmYXpygrqfyTMZCmo1ajekpv9bR9S6s8S2wmmHWu2HQKMa/random-desert-2022.jpg",
        "name": "Random Desert",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0xa9cf3fb2c4538ac95e0c822758ec745fcfed8360/pink-postcard,-2021-42",
        "image": "https://ipfs.pixura.io/ipfs/QmXNhcpRLzsGd8vpYdJB6s6Yqjo3cAQL5cQZhzh6SbBU4e/pink-postcard-2021.jpg",
        "name": "Pink Postcard",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0xa9cf3fb2c4538ac95e0c822758ec745fcfed8360/self-explained,-2022-40",
        "image": "https://ipfs.pixura.io/ipfs/QmfBkkfDRNRdtgLXWw5EmyfE4tCZPmUhtANofGkGrjDEcz/self-explained-2022.jpg",
        "name": "Self Explained",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/artwork-v2/dangerous,-2022-32140",
        "image": "https://ipfs.pixura.io/ipfs/Qma61ceFRj6K6M5Eoq3moSMRxYxhuZjiF7C7ss4EhC7n96/dangerous-2022.jpg",
        "name": "Dangerous",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/artwork-v2/lunar-highway,-2022-32043",
        "image": "https://ipfs.pixura.io/ipfs/QmRkF58hXymd9pseHhVNG2cmWjevGRzbbatqno8tDHJUXB/lunar-highway-2022.jpg",
        "name": "Lunar Highway",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/artwork-v2/midnight-flare,-2021-31946",
        "image": "https://ipfs.pixura.io/ipfs/QmQbc1ZZJQnRRt4y5BZWeT5rQxZgfF3bSrTwZr5ESpih7N/midnight-flare-2021.jpg",
        "name": "Midnight Flare",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/artwork-v2/dehydration,-2021-31309",
        "image": "https://ipfs.pixura.io/ipfs/Qmdj7PKngnAvQYoyLQJY1pqYimuzn8tC5EsQ6PWSEkdXJG/dehydration-2021.jpg",
        "name": "Dehydration",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/artwork-v2/parallel-ecosystems,-2021-30860",
        "image": "https://ipfs.pixura.io/ipfs/QmTE4eNqKvaS4wUnKF2Q9S6F4VJod2kGKhy1p9aeKCkVPj/parallel-ecosystems-2021.jpg",
        "name": "Parallel Ecosystems",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x0db72acc0d49413e1b016ddfd4664919981b34a2/a-timeless-flight-5",
        "image": "https://ipfs.pixura.io/ipfs/QmekZP7x2Apb1KS1iwbecjBvQ748MARgrHQqC1zYRfS6o9/a-timeless-flight.jpg",
        "name": "A Timeless Flight",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x0db72acc0d49413e1b016ddfd4664919981b34a2/the-final-hour,-2022-4",
        "image": "https://ipfs.pixura.io/ipfs/QmW4DYBcQbL8SvMy9YRPB2UP9mLtrdCgroaKtcwwf7A6i1/the-final-hour-2022.jpg",
        "name": "The Final Hour",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x0db72acc0d49413e1b016ddfd4664919981b34a2/atomization,-2022-3",
        "image": "https://ipfs.pixura.io/ipfs/QmVhc67APiFugKVHbb3cU2KdyTS65LKfRcuy2iCvK5AraW/atomization-2022.jpg",
        "name": "Atomization",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x0db72acc0d49413e1b016ddfd4664919981b34a2/upside-down-canyon,-2020-2",
        "image": "https://ipfs.pixura.io/ipfs/QmP1WqsdeuyV5PZYaxU24J46ePJqd1gUthz7J6y23qofYh/upside-down-canyon-2020.jpg",
        "name": "Upside Down Canyon",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        "url": "https://superrare.com/0x0db72acc0d49413e1b016ddfd4664919981b34a2/sedona-rising,-2022-1",
        "image": "https://ipfs.pixura.io/ipfs/QmSAnN2bWzcLe7Zfq5uDnNF16ebhyVSsZxkKvY1Etjmbwh/sedona-rising-2022.jpg",
        "name": "Sedona Rising",
        "isSR": true,
        "bot": "POSTWOOK"
    },
    {
        url: "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/scenic-views,-2022-12",
        image: "https://ipfs.pixura.io/ipfs/QmUV8kuV7LBzAy4YQ3YsjwkX4Aj2KfyLuv5LfAmA3xGpbT/scenic-views-2022.jpg",
        name: "Scenic Views, 2022",
        isSR: true,
        bot: "POSTWOOK"
    }, {
        url: "https://superrare.com/0x4b64125c8c5c25e3e75ed85850845d5e2be397a7/views-from-alpha-centauri-c,-2022-13",
        image: "https://ipfs.pixura.io/ipfs/QmVicHCoyhwAHefBwAjmHznqknd6WpnFjiNRok6VC6xoVi/views-from-alpha-centauri-c-2022.jpg",
        name: "Views From Alpha Centauri C, 2022",
        isSR: true,
        bot: "POSTWOOK"
    },
    {
        url: "https://superrare.com/0x1fe86fad00974751f13deea47387a425766b9c28/everything-always,-2022-1",
        image: "https://ipfs.pixura.io/ipfs/QmNoQrmjqXJY1afyiVRFX29UWCYUvHQsWfLaSuFMqGrduv/everything-always-2022.jpg",
        name: "Everything Always",
        isSR: true,
        bot: "POSTWOOK"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x74a60c50e53d4fff27275407ee0c0300ea211145/1",
        image: "https://i.imgur.com/UZ1OYOJ.gif",
        name: "[phase three]",
        isSR: false,
        bot: "CORYVANLEW"
    },
    {
    url: "https://www.niftygateway.com/marketplace/collection/0x746fb94befd3435358847228f111dde8dea91ef5/1",
    image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730040/Julian/KarismaAug16/The_dead_waltz_through_the_streets_t1nmzl.png",
    name: "The dead waltz through the streets",
    isSR: false,
    bot: "KARISMA"
},
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/1",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730015/Julian/KarismaAug16/we_ll_never_kiss_again_mtme0r.png",
        name: "We will never kiss again"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/2",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660055805/Julian/KarismaAug16/deep_in_my_body_i_felt_you_and_i_felt_you_leave_fixed_sch7vc.png",
        name: "Deep in my body I felt you, And I felt you leave"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/3",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660055791/Julian/KarismaAug16/i_am_my_enemy_e5r5q8.png",
        name: "I am my enemy"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/4",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730079/Julian/KarismaAug16/Primadonna_gcqyc5.png",
        name: "Primadonna"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/5",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1659730165/Julian/KarismaAug16/don_t_turn_back_ypeyay.png",
        name: "Don’t turn back"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/6",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730067/Julian/KarismaAug16/my_lies_cured_her_smile_yfdkms.png",
        name: "My lies cured her smile"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/7",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660055986/Julian/KarismaAug16/the_hedgehog_s_dilemma_l9zb0f.png",
        name: "The hedgehog’s dilemma"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/8",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1660056050/Julian/KarismaAug16/tidalwave_fshgxh.png",
        name: "Tidal Wave"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/9",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730157/Julian/KarismaAug16/she_kisses_me_like_someone_she_hates_euubco.png",
        name: "She kisses me like someone she hates"
        ,isSR: false, bot: "KARISMA"
    },{
        url: "https://www.niftygateway.com/marketplace/collection/0xd895790b60ddc7a7f8fb1fe748b7b3d1c182ce55/10",
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500,c_limit/v1659730156/Julian/KarismaAug16/You_make_me_sick_pcd1ba.png",
        name: "You make me sick"
        ,isSR: false, bot: "KARISMA"
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/dishonesty-binds-me-to-you-2",
        image: "https://ipfs.pixura.io/ipfs/QmWSHLLzgxnnykNpjFHktSZc2WHbhgA1ALts6ai5hQBxaS/dishonesty-binds-me-to-you.png",
        name: "Dishonesty binds me to you",
        isSR: true, bot: "KARISMA"
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/3",
        image: "https://ipfs.pixura.io/ipfs/Qme6RNCQEhYNfY4KmbVFA5s15SgJGvCeCjjxtMWbg9sDdg/in-hope-that-you-may-drown.png",
        name: "In Hope That You May Drown",
        isSR: true, bot: "KARISMA"
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/kimono-1",
        image: "https://ipfs.pixura.io/ipfs/QmWg6QrBzAT1T9XVEHheeS595gCkgtL31T3R9CCYNCb2Ea/kimono.png",
        name: "Kimono",
        isSR: true, bot: "KARISMA"
    },
    {
        url: "https://superrare.com/0x5472a4f88233146a2dcbee5a365a05f97129b78f/we-were-infinite-for-a-moment-4",
        image: "https://i.imgur.com/1tpFFd9.jpeg",
        name: "We were infinite for a moment",
        isSR: true, bot: "KARISMA"
    },
    {   url:"https://www.niftygateway.com/marketplace/item/0x285da03cca96ea38c07c97d2d34caefee62adc3d/12000030003",
        collectionId : 1,
        image:"https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1632917959/ADaniel/AnthonyAzekwoh/Earth_qbbilk.jpg",
        name:"Earth",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x285da03cca96ea38c07c97d2d34caefee62adc3d/2",
        collectionId: 2,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1632917950/ADaniel/AnthonyAzekwoh/Water2_1_oklvpg.jpg",
        name: "Water",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url:"https://www.niftygateway.com/marketplace/collection/0x285da03cca96ea38c07c97d2d34caefee62adc3d/1",
        collectionId: 3,
        image:"https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1632917962/ADaniel/AnthonyAzekwoh/Fire_qlnrrg.jpg",
        name:"Fire",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xe8099e7490d79539c3c63525f3c3f393fa4a4170/1",
        collectionId:  4,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1640882747/ADaniel/AnthonyAzekwoh/22.1.6/Air_-_Anthony_Azekwoh_brvrso.jpg",
        name: "Air",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xe8099e7490d79539c3c63525f3c3f393fa4a4170/3",
        collectionId: 5,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1640882759/ADaniel/AnthonyAzekwoh/22.1.6/Solomon_Study_x_-_Anthony_Azekwoh_dcoesd.jpg",
        name: "Study of Solomon X",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0xe8099e7490d79539c3c63525f3c3f393fa4a4170/2",
        collectionId: 6,
        image: "https://media.niftygateway.com/image/upload/q_auto:best,w_1600,c_limit/v1640882752/ADaniel/AnthonyAzekwoh/22.1.6/Solomon_Study_1_-_Anthony_Azekwoh_obdzob.jpg",
        name: "Study of Solomon 1",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x9c620b9e8fc4421b8eeb607d8e5611197867c4a5/1",
        collectionId: 6,
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1664138632/test-media-manager/AAStudios/UNITY%202.jpg",
        name: "Unity",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x9c620b9e8fc4421b8eeb607d8e5611197867c4a5/2",
        collectionId: 6,
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1664138260/test-media-manager/AAStudios/Anyanwu.jpg",
        name: "Anyanwu",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x9c620b9e8fc4421b8eeb607d8e5611197867c4a5/3",
        collectionId: 6,
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1664228600/test-media-manager/AAStudios/SEEKER.jpg",
        name: "Seeker",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x9c620b9e8fc4421b8eeb607d8e5611197867c4a5/4",
        collectionId: 6,
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1664028616/test-media-manager/AAStudios/Ihuoma.png",
        name: "Ihuoma",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://www.niftygateway.com/marketplace/collection/0x9c620b9e8fc4421b8eeb607d8e5611197867c4a5/5",
        collectionId: 6,
        image: "https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1664138426/test-media-manager/AAStudios/amala.jpg",
        name: "Distinguished of Amala Date",
        isSR: false,
        bot: "AZEKWOH"
    },
    {
        url: "https://superrare.com/artwork-v2/%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%BE%E0%A4%A3-prana-35976",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qmcv5WA3HQWMdEc5DEmNThdNwJXdzJmR5Zw71WGurfgb8a/-prana.png",
        item: "प्राण Prana",
        id: 1
        ,useImage: false, bot: "BEN"
    },
    {
        url: "https://superrare.com/artwork-v2/not-just-a-building-35723",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmW2osJNnMrCYKRV9Zmf8EBXvxR7jpFaBwcyu2Yrt88pBQ/not-just-a-building.jpg",
        item: "NOT JUST A BUILDING",
        id: 2
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/0x4664fc6ca054e3ddb7b800cfc8657f66114c298e/micronauts-3",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmXJMwP44TQWXPsYNPHZpUUusxSfyLrLGJfQd8T517C14o/micronauts.jpg",
        item: "Micronauts",
        id: 3
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/0x475c9197e47a5510b16c702fefdd2a39becd0c49/for-the-love-of-the-game-5",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmXoB4SvD7KEFgZyJMr41H1m41Gb2CA4W6dh75qQAf4V9B/for-the-love-of-the-game.jpg",
        item: "For the Love of the Game",
        id: 4
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/learn-adieu-34231",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmTbnrEZcspgZzuTbzDu5koUwctb6gArYa8U8eMXV2e7AU/learn-adieu.jpg",
        item: "Learn Adieu",
        id: 5
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/you%E2%80%99ll-never-know-33735",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmX7Uk1uMbaiG2w9cPiDHGfWxKuTgwPVLMSDuCpfiLwTcF/you-ll-never-know.jpg",
        item: "You’ll Never Know",
        id: 6
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/the-banker,-33606",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmNPvNC3nSWkowmw5uUSumfkpR4CngDNrT91EekPuR9EgG/the-banker-.png",
        item: "The Banker,",
        id: 7
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/push-of-a-button-33564",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmYMz8f6cf3MGkNJN6vKAQyxy2s9txHQvA9kQWggnm6NZB/push-of-a-button.mp4",
        item: "Push of a Button",
        id: 8
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/0x9f65f845d85132eafa36332fe88f34cc8c5a1e68/itaka-72",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmfM6kGvPw456E14ixdvrqAYhxmAHvvuUWfmN5iYoF1vpY/itaka.png",
        item: "Itaka",
        id: 9
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/dark-sky-33367",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmNwaBvspgFdMmexesajGxX5feVRuoRZLahAt4gMubdHcS/dark-sky.png",
        item: "Dark Sky",
        id: 10
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/about-zero-33304",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qmcn66jVNxrta2G2e5WK9eykyTybi9koWJ9vpGK7qGEQBx/about-zero.jpg",
        item: "About Zero",
        id: 11
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/stay-soft-33230",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmUirG5DMFriYDMCNqRvQHuks75SgNsgxj1MMT34APBUMJ/stay-soft.jpg",
        item: "STAY SOFT",
        id: 12
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/like-you,-but-different-33020",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmXJYRa7JfvkjHqdHmjuirJH5JwLQiffFA1zDQDYc8aUZw/like-you-but-different.jpg",
        item: "Like you, but different",
        id: 13
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/0x4dc022f731f78cdade2791f7e3750fc630ca3100/lost-in-melancholia-iv-4",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmQ1mrchxpgCV8GNuom6HgSskeEvPEXTHP7kc7XKzRfJ2r/lost-in-melancholia-iv.png",
        item: "Lost in Melancholia IV",
        id: 14
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/tennis-court-32981",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmV8QcQAdUBSpqw5JuKWHoFXooPCHPv4j5MdCdFgGKrTNg/tennis-court.jpg",
        item: "Tennis Court",
        id: 15
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/take-a-break-32620",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmVUxScHgHPPNaGMkkgyHuNiMTcijxBk2odvAy9AjKviKK/take-a-break.jpg",
        item: "Take a break",
        id: 16
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/wow-now-32550",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmQ5JpxQ2q1uSmVjq4CErt59hW1yqspUcPEAeXb6gYWnU9/wow-now.jpg",
        item: "WOW NOW",
        id: 17
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/the-year-factory-32177",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmQmCxDyZGcx6oZUZfs8qbEPwzkT6ajBikQvE7iMzYrUJh/the-year-factory.mp4",
        item: "The Year Factory",
        id: 18
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/m-i-r-a-a-32092",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmdPWE7Xoim666jmskJxpRc24ef2bnxEmEFnPCobsnNeDh/m-i-r-a-a.mp4",
        item: "M I R A A",
        id: 19
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/another-sector-31887",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmRDpyDMXJxvXrc8DGnuznNKNbWSQUB6AvUijd5SDfumAY/another-sector.jpg",
        item: "Another Sector",
        id: 20
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/gm-gm-gm-31251",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmdExMMdkTPNunyoKJfaA1jiskjVDFRUCoT1zh9fCUTvAx/gm-gm-gm.mp4",
        item: "GM GM GM",
        id: 21
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/10-pieds-sous-ton-masque-31043",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmXDcWVJY9e1FsAYnCi7ez6cPeHhhTykAQs3gvTYEZyX19/10-pieds-sous-ton-masque.jpg",
        item: "10 pieds sous ton masque",
        id: 22
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/cross-adieu-30639",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmZuURCWtqHxpC2pKf2kQ5Hp347ST6ZD854sq5mii1e1rt/cross-adieu.jpg",
        item: "Cross Adieu",
        id: 23
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/untitled-30290",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmdZNY8h5K4vpc2GCRWcLMhwWqwhWjLcsUpoYZzNtF3WHo/untitled.jpg",
        item: "Untitled",
        id: 24
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/they-talked--talked-about,-30271",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmbSoyN7Bn1eWBZHSz3Tz6nQw23K9h3xE5x9nTxp5LWuXP/they-talked-talked-about-.jpg",
        item: "They talked & talked about,",
        id: 25
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/remembering-30166",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmNf5ukSbVqBZg3daHyaW58WnGortq4p9HzhfaMGJH4Abb/remembering.jpg",
        item: "Remembering",
        id: 26
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/strange-hours-29146",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmZjv8Uf6s5YAMUDVSdquSS8gtqWmogrB8aHptkJaWmc1k/strange-hours.jpg",
        item: "Strange Hours",
        id: 27
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/corruptible-truth-seeker-29060",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qmb5u7gimUz3V54Q5zTtWqPj527ZqfqSEcpnJjNGgwybA4/corruptible-truth-seeker.png",
        item: "Corruptible Truth Seeker",
        id: 28
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/new-soho-29033",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmREgUcExN8JcKRgVyFLXpkR2QdYdYR8EcGi6morYoPoSr/new-soho.mp4",
        item: "New Soho",
        id: 29
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/the-day-i-felt-god-28486",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qmawmh9vLD9e7GzMTP748is9cwXigXsDGqTF3cJapj2wJv/the-day-i-felt-god.jpg",
        item: "The Day I Felt God",
        id: 30
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/spirit-of-conviction-28379",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmeTRfw8y4si9WNdr9CSpvPokW7X7DQe4qhEmqUBhDjx9t/spirit-of-conviction.jpg",
        item: "Spirit of Conviction",
        id: 31
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/le-poids-de-l'[eau]-27806",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmQg4LYT8RNcyihzSG2TnjxZkSmXg37Pzw6zt5F9zAzqPk/le-poids-de-l-eau-.jpg",
        item: "le poids de l'[eau]",
        id: 32
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/gr-ape-27770",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmZouxdXVV3x1W7pUeSb3mASamiwGqA8rryjpbiL32wu17/gr-ape.jpg",
        item: "GR-APE",
        id: 33
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/childhood's-remark-26074",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmdqB3p5QfHZDrn2f2qrVSnjwsL12Anw7DGqbRettcDLAn/childhood-s-remark.jpg",
        item: "CHILDHOOD's REMARK",
        id: 34
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/ultraviolet-24807",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmRAqUmDut7LR6WPNwjuMeGPG74SEET9VmghTX7ZRNDcay/ultraviolet.jpg",
        item: "Ultraviolet",
        id: 35
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/vivido-24063",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmXiCy7HgNEJPY5oYtimQicGz99xcEahkv7YhJZZpNBemU/vivido.mp4",
        item: "Vivido",
        id: 36
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/j'adoor-24055",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmWiHPe4q7FfULeKof1ZQZNai9raNv7JkeEqWmUqmy1vdn/j-adoor.png",
        item: "J'ADOOR",
        id: 37
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/terminal-23922",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmPfB7fbDDtBvGBjnWqdqWvpS4HSi4mCp2npG5rVvYRbC7/terminal.mp4",
        item: "Terminal",
        id: 38
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/first-23742",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmUtim319GHo9JL15AKvvkarpvjjDoeW1GVk4pfJGSUSk2/first.png",
        item: "FIRST",
        id: 39
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/golden-gate-city,-2300-23436",
        imageUrl: "https://f8n-production-collection-assets.imgix.net/0xb932a70A57673d89f4acfFBE830E8ed7f75Fb9e0/23436/nft.jpg?q=30&auto=format%2Ccompress&cs=srgb&max-w=500&max-h=500",
        item: "Golden Gate City, 2300",
        useImage: false, bot: "BEN",
        id: 40
        ,useImage: true },
    {
        url: "https://superrare.com/artwork-v2/consolation-23113",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmP6FTNuH6cCTjjnSG3gxqNJkxjBv5QkUG93uiJxrzEUdv/consolation.jpg",
        item: "Consolation",
        id: 41
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/catsophrenia-22003",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qmauz3fEyXMwidaS1SbreaNGYijsCsgqBbq4uoZRAS4CoK/catsophrenia.mp4",
        item: "Catsophrenia",
        id: 42
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/pneuma-21886",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qmauz3fEyXMwidaS1SbreaNGYijsCsgqBbq4uoZRAS4CoK/catsophrenia.mp4",
        item: "Pneuma",
        id: 43
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/ether-of-the-wilds-21346",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qme47N61hZsKRyV1ZBJKyFcNoRv97mvHpyK4coFAsFSm4c/ether-of-the-wilds.jpg",
        item: "Ether of the Wilds",
        id: 44
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/acid-trip-21117",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmdzMGAHZjesUgbM52mYHKXmAtVUhHwuTGSXy4sLMEFHNK/acid-trip.png",
        item: "Acid Trip",
        id: 45
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/lugares-20075",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmRnajQAqm5kJYtqJru4LWtrafbizyLmEjXEoi85e2uKxK/lugares.png",
        item: "Lugares",
        id: 46
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/teenage-dreams-19935",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmTSRBJZL8ZmLLyVFrNEcBtP1fzF6FemCX4LAegmR1M5oD/teenage-dreams.png",
        item: "TEENAGE DREAMS",
        id: 47
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/dreamworld-19924",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmeJ2gqnkzt5ZQ1XQdRpLnXCtFebdZqNMUDxNhBSKkvHJo/dreamworld.jpg",
        item: "DREAMWORLD",
        id: 48
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/creative-workaholic-19626",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmTRqusgXDww9BdDpTsfazCgY8PkeyB52HDpz9bJmuqRTG/creative-workaholic.jpg",
        item: "CREATIVE WORKAHOLIC",
        id: 49
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/the-fish-of-ether-19331",
        imageUrl: "https://ipfs.pixura.io/ipfs/QmQw2nWmRZyC5fjkw5nCpbbJnSCeeGENoizb7e4F6LPwYZ/the-fish-of-ether.jpg",
        item: "The Fish Of Ether",
        id: 50
        ,useImage: false, bot: "BEN" },
    {
        url: "https://superrare.com/artwork-v2/running-tracks-18141",
        imageUrl: "https://ipfs.pixura.io/ipfs/Qma1ZkdkL4NEW3pjw1ajnatZvae9vKgRonMgDFgN1iUGaw/running-tracks.png",
        item: "Running Tracks",
        id: 51
        ,useImage: false, bot: "BEN" }
];

let currentItem =  null;
let isPolling = false;
setInterval(function () {
    if(!isPolling) {
        if(currentItem === null) {
            pool.query("SELECT VALUE FROM CURRENTITEM WHERE ID = 1;", (err, res) => {
                if (err) {
                } else {
                    currentItem = res.rows[0].value;
                    let current = nifties[currentItem];

                    if (current.bot === "BEN") {
                        pollSuperRareBen(current.url, current.imageUrl, current.item, current.useImage);
                    } else if(current.bot === "AZEKWOH") {
                        pollNiftyGatewayAzekwoh(current.url,current.collectionId,current.image,current.name);
                    } else if(current.bot === "KARISMA") {
                        if (!current.isSR) {
                            pollNiftyGatewayKarisma(current.url, currentItem + 1, current.image,current.name);
                        } else {
                            pollSuperrareKarisma(current.url,currentItem+1,current.image,current.name);
                        }
                    } else if(current.bot === "CORYVANLEW") {
                        pollNiftyGatewayCoryVanLew(current.url, currentItem + 1, current.image,current.name);
                    } else if(current.bot === "POSTWOOK") {
                        pollSuperRarePostWook(current.url, current.image, current.item);
                    } else if(current.bot === "ANDREWMITCHELL") {
                        pollNiftyGatewayAndrewMitchell(current.url, currentItem + 1, current.image,current.name);
                    } 
                }
            });
        } else {
            let current = nifties[currentItem];
            console.log(current);
            if (current.bot === "BEN") {
                pollSuperRareBen(current.url, current.imageUrl, current.item, current.useImage);
            } else if(current.bot === "AZEKWOH") {
                pollNiftyGatewayAzekwoh(current.url,current.collectionId,current.image,current.name);
            } else if (current.bot === "KARISMA") {
                if (!current.isSR) {
                    pollNiftyGatewayKarisma(current.url, currentItem + 1, current.image, current.name);
                } else {
                    pollSuperrareKarisma(current.url, currentItem + 1, current.image, current.name);
                }
            } else if(current.bot === "CORYVANLEW") {
                pollNiftyGatewayCoryVanLew(current.url, currentItem + 1, current.image,current.name);
            } else if(current.bot === "POSTWOOK") {
                pollSuperRarePostWook(current.url, current.image, current.name);
            } else if(current.bot === "ANDREWMITCHELL") {
                pollNiftyGatewayAndrewMitchell(current.url, currentItem + 1, current.image,current.name);
            }
        }
    }
}, 60000);

function pollNiftyGatewayKarisma(url, collectionId, imageUrl, item) {
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
                
                await driver.sleep(15000);
                //Click History
                await driver.findElement(webdriver.By.xpath("" +
                    "//html/body/div[1]/div/div[2]/div[1]/div[4]/div/div/div/button[2]")).click();
                await driver.sleep(15000);

                //Click Sales Only
                await driver.findElement(webdriver.By.xpath("" +
                    "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[1]/label/span[1]/span[1]/input")).click();
                await driver.sleep(15000);
                
                for (let i = 1; i < 10; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        let price, eventText;

                        eventText = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[2]/p")).getText();
                        price = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[3]/span")).getText();
                        let originalEventText = eventText;
                        const myArray = eventText.split("from");
                        if (myArray.length > 1) {
                            eventText = item + "\n\n" + myArray[0] + "from" + myArray[1].substring(0, myArray[1].length - 1) + " for " + price + "\n\n" + url;
                            let tweetey = {
                                text: eventText,
                                url: imageUrl
                            };
                            let qry = "SELECT * FROM TWEETS WHERE BOTFROM = 'KARISMA' AND VALUE LIKE '%"+originalEventText+"%';";
                            pool.query(qry, (err,res) => {
                                if (err) {
                                   // console.log(err);
                                } else {
                                   // console.log(res.rowCount);
                                    if(res.rowCount > 0) {

                                    } else {
                                        pool.query("INSERT INTO TWEETS(VALUE, BOTFROM, URL) VALUES($1, $2, $3);", [originalEventText, "KARISMA", url], (err, res) => {
                                            if (err) {

                                            } else {
                                                karismaTweet.tweetWithImage(scrubTextForAt(tweetey.text), tweetey.url);
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
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                } catch (e) {
               //     console.log(e);
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    }
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                }
            }
        } catch (e) {
        //    console.log(e);
            currentItem++;
            if(currentItem >= nifties.length)
            {
                currentItem = 0;
            }
            pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                if (err) {

                } else {
                }
            });
            isPolling = false;
        }
    })()
}

function pollSuperrareKarisma(url, collectionId, imageUrl, item) {
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
              
                await driver.sleep(30000); //5 seconds works fine for wait time
                for(let i = 0; i < 30; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        var text = await driver.findElement(webdriver.By.xpath("//html/body/div[2]/div/div/div[2]/div/section/div[5]/div[" + i + "]/div/div[2]/p")).getText();
                        if (text.includes("accepted an offer") || text.includes("won auction")) {
                            console.log(text);
                            let tweetey = {
                                text : item + "\n\n" + text + "\n\n" + url,
                                url : imageUrl
                            }
                            pool.query("INSERT INTO TWEETS(VALUE, BOTFROM, URL) VALUES($1, $2, $3);", [tweetey.text, "KARISMA", url], (err, res) => {
                                if (err) {

                                } else {
                                    karismaTweet.tweetWithImage(scrubTextForAt(tweetey.text), tweetey.url);
                                }
                            });
                        }
                    } catch(e) {

                    }
                }
            } catch (e) {
                //console.log(e);
            } finally {
                try {
                    await driver.quit();
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    }
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                } catch (e) {
                    console.log(e);
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    }
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
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
            pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                if (err) {

                } else {
                }
            });
            isPolling = false;
        }
    })()
}

function pollNiftyGatewayAzekwoh(url, collectionId, imageUrl, item) {
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

                if (collectionId === 0) {
                    await driver.sleep(20000);
                    //Click History
                    ///html/body/div[1]/div/div[2]/div/div[5]/div/div/div[1]/div/div[2]/div/button[2]
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div/div[5]/div/div/div[1]/div/div[2]/div/button[2]")).click();
                    await driver.sleep(15000);

                    //Click Sales Only
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div/div[5]/div/div/div[2]/div[2]/div[1]/label/span[1]/span[1]/input")).click();
                    await driver.sleep(15000);
                } else if (collectionId > 0) {
                    await driver.sleep(15000);
                    //Click History
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div[1]/div[4]/div/div/div/button[2]")).click();
                    await driver.sleep(15000);

                    //Click Sales Only
                    await driver.findElement(webdriver.By.xpath("" +
                        "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[1]/label/span[1]/span[1]/input")).click();
                    await driver.sleep(15000);
                }
                for (let i = 1; i < 10; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        let price, eventText;
                        if (collectionId === 0) {
                            eventText = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div/div[5]/div/div/div[2]/div[2]/div[2]/div[1]/table/tbody/tr[" + i + "]/td[2]/p")).getText();
                            price = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div/div[5]/div/div/div[2]/div[2]/div[2]/div[1]/table/tbody/tr[" + i + "]/td[3]/span")).getText();
                        } else if (collectionId > 0) {
                            eventText = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[2]/p")).getText();
                            price = await driver.findElement(webdriver.By.xpath("" +
                                "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[3]/span")).getText();
                        }
                        let originalEventText = eventText;
                        const myArray = eventText.split("from");
                        if (myArray.length > 1) {
                            eventText = item + "\n\n" + myArray[0] + "from" + myArray[1].substring(0, myArray[1].length - 1) + " for " + price + "\n\n" + url;
                            let tweetey = {
                                text: eventText,
                                url: imageUrl
                            };
                            let qry = "SELECT * FROM TWEETS WHERE BOTFROM = 'AZEKWOH' AND VALUE LIKE '%"+originalEventText+"%';";
                            pool.query(qry, (err,res) => {
                                if (err) {
                                } else {
                                    if(res.rowCount > 0) {

                                    } else {
                                        pool.query("INSERT INTO TWEETS(VALUE, BOTFROM, URL) VALUES($1, $2, $3);", [originalEventText, "AZEKWOH", url], (err, res) => {
                                            if (err) {

                                            } else {
                                                azekwohTweet.tweetWithImage(scrubTextForAt(tweets[i].text), tweetey.url);
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
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                } catch (e) {
                    console.log(e);
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    } 
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
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
            pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                if (err) {

                } else {
                }
            });
            isPolling = false;
        }
    })()
}

function pollSuperRareBen(url, imageUrl, item, useImage) {
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
              
                await driver.sleep(20000); //5 seconds works fine for wait time
                for (let i = 1; i < 100; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        var text = await driver.findElement(webdriver.By
                            .xpath("//html/body/div[2]/div/div/div[2]/div/section/div[5]/div[" + i + "]/div/div[2]/p")).getText();
                        if (text.includes("transferred to @ben_vault")) {
                            break;
                            //Here you would check if the offer is more recent than the last saved offer time.
                            //If it is, overwrite your last offer time and then tweet about this offer.
                        } else {
                            var artistname = "";
                            try {
                                artistname = await driver.findElement(webdriver.By.xpath("//html/body/div[1]/div/div/div[3]/div/section/div[3]/div[1]/a[2]/div/span[2]")).getText();
                            } catch (e) {

                            }
                            if (!useImage) {
                                imageUrl = await driver.findElement(webdriver.By.xpath("//html/body/div[1]/div/div/div[3]/div/section/div[1]/button/img")).getAttribute("src");
                            }
                            let tweetText = item + "\n\n" + text + "\n\n" + url;
                            let artistText = (artistname !== "" ? " by " + artistname : "");
                            let tweetText2 = "" + item + artistText + "\n\n" + text + "\n\n" + url;
                            if(text.length > 1) {
                                pool.query("INSERT INTO TWEETS(VALUE, BOTFROM, URL) VALUES($1, $2, $3);", [tweetText, "BEN", url], (err, res) => {
                                    if (err) {
                                    } else {
                                        tweets.push({text: tweetText2, imageUrl});
                                    }
                                });
                            }
                        }
                    } catch (e) {
                        //   console.log("error " + item)
                    }
                }
            } finally {
                currentItem++;
                if (currentItem >= nifties.length) {
                    currentItem = 0;
                }
                pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                    if (err) {

                    } else {
                    }
                });
                isPolling = false;
                await driver.quit();
                for (let i = 0; i < tweets.length; i++) {
                     await benTweet.tweetWithImage(scrubTextForAt(tweets[i].text), tweets[i].imageUrl);
                }
            }
        } catch(e) {
            currentItem++;
            if(currentItem >= nifties.length)
            {
                currentItem = 0;
            }
            pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                if (err) {

                } else {
                }
            });
            isPolling = false;
        }
    })()
}

function pollSuperRarePostWook(url, imageUrl, item) {
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

                await driver.sleep(20000); //5 seconds works fine for wait time
                for (let i = 1; i < 100; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        var text = await driver.findElement(webdriver.By
                            .xpath("//html/body/div[2]/div/div/div[2]/div/section/div[5]/div[" + i + "]/div/div[2]/p")).getText();
                        if (text.includes("transferred")) {
                            // break;
                            //Here you would check if the offer is more recent than the last saved offer time.
                            //If it is, overwrite your last offer time and then tweet about this offer.
                        } else {
                            let tweetText = item + "\n\n" + text + "\n\n" + url;
                            let tweetText2 = "" + item + "\n\n" + text + "\n\n" + url;
                            if(text.length > 1) {
                                pool.query("INSERT INTO TWEETS(VALUE, BOTFROM, URL) VALUES($1, $2, $3);", [tweetText, "POSTWOOK", url], (err, res) => {
                                    if (err) {
                                      //  console.log(err);
                                    } else {
                                        tweets.push({text: tweetText2, imageUrl});
                                    }
                                });
                            }
                        }
                    } catch (e) {
                       // console.log("error " + item)
                    }
                }
            } finally {
                currentItem++;
                if (currentItem >= nifties.length) {
                    currentItem = 0;
                }
                pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                    if (err) {

                    } else {
                    }
                });
                isPolling = false;
                await driver.quit();
                for (let i = 0; i < tweets.length; i++) {
                    await postWookTweet.tweetWithImage(scrubTextForAt(tweets[i].text), tweets[i].imageUrl);
                }
            }
        } catch(e) {
            currentItem++;
            if(currentItem >= nifties.length)
            {
                currentItem = 0;
            }
            pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                if (err) {

                } else {
                }
            });
            isPolling = false;
        }
    })()
}

function pollNiftyGatewayCoryVanLew(url, collectionId, imageUrl, item) {
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

                await driver.sleep(15000);
                //Click History
                await driver.findElement(webdriver.By.xpath("" +
                    "//html/body/div[1]/div/div[2]/div[1]/div[4]/div/div/div/button[2]")).click();
                await driver.sleep(15000);

                //Click Sales Only
                await driver.findElement(webdriver.By.xpath("" +
                    "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[1]/label/span[1]/span[1]/input")).click();
                await driver.sleep(15000);

                for (let i = 1; i < 10; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        let price, eventText, number;

                        eventText = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[2]/p")).getText();
                        price = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[3]/span")).getText();
                        number = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr["+i+"]/td[1]/a/span/b")).getText();
                        let originalEventText = eventText;
                        number = number.substr(1);
                        const myArray = eventText.split("from");
                        if (myArray.length > 1) {
                            eventText = item + "\n\n" + myArray[0] + "from" + myArray[1].substring(0, myArray[1].length - 1) + " for " + price + "\n\n" + url;
                            let tweetey = {
                                text: eventText,
                                url: imageUrl
                            };
                            let qry = "SELECT * FROM TWEETS WHERE BOTFROM = 'CORYVANLEW' AND VALUE LIKE '%"+originalEventText+"%';";
                            pool.query(qry, (err,res) => {
                                if (err) {
                                 //   console.log(err);
                                } else {
                                    console.log(res.rowCount)
                                    if(res.rowCount > 0) {

                                    } else {
                                        axios.get('https://api.opensea.io/api/v1/assets', {
                                            headers: {
                                                'X-API-KEY': "b31749eab7c44d49a19010375d934d55"
                                            },
                                            params: {
                                                collection_slug: 'cory-van-lew-phase-three-open-edition',
                                                token_ids: number,
                                                order_direction: 'desc'
                                            }
                                        }).then((response) => {
                                            const assets = _.get(response, ['data', 'assets']);
                                            imageUrl = "";
                                            _.each(assets, (asset) => {
                                                imageUrl = _.get(asset, 'image_url');
                                            });
                                            tweetey.url = imageUrl;
                                            
                                            pool.query("INSERT INTO TWEETS(VALUE, BOTFROM, URL) VALUES($1, $2, $3);", [originalEventText, "CORYVANLEW", url], (err, res) => {
                                                if (err) {

                                                } else {
                                                    coryTweet.tweetWithImage(scrubTextForAt(tweetey.text), tweetey.url);
                                                }
                                            });
                                            
                                        }).catch((error) => {
                                            console.error(error);
                                        });
                                    }
                                }
                            });


                        }
                    } catch (e) {
                        //console.log("");
                    }
                    await driver.sleep(1000);
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
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                } catch (e) {
                 //   console.log(e);
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    }
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                }
            }
        } catch (e) {
           // console.log(e);
            currentItem++;
            if(currentItem >= nifties.length)
            {
                currentItem = 0;
            }
            pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                if (err) {

                } else {
                }
            });
            isPolling = false;
        }
    })()
}
function pollNiftyGatewayAndrewMitchell(url, collectionId, imageUrl, item) {
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

                await driver.sleep(15000);
                //Click History
                await driver.findElement(webdriver.By.xpath("" +
                    "//html/body/div[1]/div/div[2]/div[1]/div[4]/div/div/div/button[2]")).click();
                await driver.sleep(15000);

                //Click Sales Only
                await driver.findElement(webdriver.By.xpath("" +
                    "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[1]/label/span[1]/span[1]/input")).click();
                await driver.sleep(15000);

                for (let i = 1; i < 10; i++) { //Only works for items with < 100 offers this can be increased to 1000 though that is unrealistic
                    try {
                        let price, eventText, number;
                        eventText = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[2]/p")).getText();
                        price = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr[" + i + "]/td[3]/span")).getText();
                        number = await driver.findElement(webdriver.By.xpath("" +
                            "//html/body/div[1]/div/div[2]/div[1]/div[6]/div[2]/div/div/div[2]/div/div[2]/div[1]/table/tbody/tr["+i+"]/td[1]/a/span/b")).getText();
                        let originalEventText = eventText;
                        console.log(originalEventText);
                        number = number.substr(1);
                        const myArray = eventText.split("from");
                        if (myArray.length > 1) {
                            eventText = item + "\n\n" + originalEventText + "\n\nPrice:" + price + "\n\n" + url;
                            let tweetey = {
                                text: eventText,
                                url: imageUrl
                            };
                            let qry = "SELECT * FROM TWEETS WHERE BOTFROM = 'ANDREWMITCHELL' AND VALUE LIKE '%"+originalEventText+"%';";
                            pool.query(qry, (err,res) => {
                                if (err) {
                                    //   console.log(err);
                                } else {
                                    console.log(res.rowCount)
                                    if(res.rowCount > 0) {

                                    } else {
                                        pool.query("INSERT INTO TWEETS(VALUE, BOTFROM, URL) VALUES($1, $2, $3);", [originalEventText, "ANDREWMITCHELL", url], (err, res) => {
                                            if (err) {
    
                                            } else {
                                                andrewTweet.tweetWithImage(scrubTextForAt(tweetey.text), tweetey.url);
                                            }
                                        });
                                    }
                                }
                            });


                        }
                    } catch (e) {
                        //console.log("");
                    }
                    await driver.sleep(1000);
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
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                } catch (e) {
                    //   console.log(e);
                    currentItem++;
                    if(currentItem >= nifties.length)
                    {
                        currentItem = 0;
                    }
                    pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                        if (err) {

                        } else {
                        }
                    });
                    isPolling = false;
                }
            }
        } catch (e) {
            // console.log(e);
            currentItem++;
            if(currentItem >= nifties.length)
            {
                currentItem = 0;
            }
            pool.query("UPDATE CURRENTITEM SET VALUE = "+currentItem+"  WHERE ID = 1;", (err, res) => {
                if (err) {

                } else {
                }
            });
            isPolling = false;
        }
    })()
}

function scrubTextForAt(text){
    while(text.indexOf("@") >= 0) {
        text = text.replace("@", "");
    }
    return text;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
