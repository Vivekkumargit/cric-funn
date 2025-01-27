import firebase from 'firebase';
import moment from 'moment';

import kkrLogo from './images/kkr.png';
import rcbLogo from './images/rcb.png';
import srhLogo from './images/srh.png';
import cskLogo from './images/csk.png';
import dcLogo from './images/dc.png';
import rrLogo from './images/rr.png';
import miLogo from './images/mi.png';
import pkLogo from './images/pk.png';
import lsgLogo from './images/lsg.png';
import gtLogo from './images/gt.png';

const firebaseConfig = {
    apiKey: "AIzaSyBFK-Ls496ycWWk5LCbxsN_CrEc234uJWc",
    authDomain: "cric-funn.firebaseapp.com",
    projectId: "cric-funn",
    storageBucket: "cric-funn.appspot.com",
    messagingSenderId: "54598212608",
    appId: "1:54598212608:web:0d61ca8fc4d6e511b1cce5",
    measurementId: "G-TCZ62L5GHP"
};

let app;
if(firebase.apps.length) {
    app = firebase.app();
} else {
    app = firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const logger = firebase.analytics(app);
logger.setAnalyticsCollectionEnabled(true);

let themeColor = "#4B0082";
const loaderHeight = 100;
const loaderWidth = 250;
const DEFAULT_START_POINTS = 2000;
const DEFAULT_PROFILE_IMAGE = "https://firebasestorage.googleapis.com/v0/b/cric-funn.appspot.com/o/defaultImages%2Fdefault.png?alt=media&token=9ccd045b-3ece-4d06-babf-04c267c38d40";
    

function getTeamLogo(teamAbbreviation) {
    if(teamAbbreviation == "SRH") return srhLogo;
    else if(teamAbbreviation == "KKR") return kkrLogo;
    else if(teamAbbreviation == "DC") return dcLogo;
    else if(teamAbbreviation == "CSK") return cskLogo;
    else if(teamAbbreviation == "MI") return miLogo;
    else if(teamAbbreviation == "PBKS") return pkLogo;
    else if(teamAbbreviation == "RCB") return rcbLogo;
    else if(teamAbbreviation == "LSG") return lsgLogo;
    else if(teamAbbreviation == "GT") return gtLogo;
    else return rrLogo;
}

const teamNames = ["Chennai Super Kings", "Delhi Capitals", "Kolkata Knight Riders", "Sunrisers Hyderabad",
    "Mumbai Indians", "Rajasthan Royals", "Gujarat Titans", "Lucknow Super Giants", "Punjab Kings", 
    "Royal Challengers Bangalore", "No Betting Done."
]

const fontVariant = "button";
const matchHeadingFontSize = 20;

function getFormattedTimeISOString(date) {
    return moment(date).format("lll");
}

function getMsgForUpcomingBets(startTime, endTime) {
    return (`Betting for this match will be OPENED from - ${startTime.format("LLL")} TO ${endTime.format("LLL")}`);
}

function getMsgForOpenBets(endTime) {
    return (`Betting is OPENED TILL - ${endTime.format("LLL")}.`);
}

function getMsgForInProgressBets(points, team) {
    return (`You've bet ${points} POINTS on this match. Betting Team: ${team}`);
}

function getMsgForNoResultBets(points, team) {
    return (`Betting is CLOSED. Match ended in NO RESULT. You've recieved ${points} POINTS on this match. Betting Team: ${team}`);
}

function getMsgForClosedBets() {
    return (`Betting for this match is CLOSED. You DID NOT bet.`);
}

function getMsgForWonBets(points, team) {
    return (`Betting CLOSED. You WON ${points} POINTS on this match. Betting Team: ${team}`);
}

function getMsgForLostBets(points, team) {
    return (`Betting CLOSED. You LOST ${points} POINTS on this match. Betting Team: ${team}`);
}

function getFormattedFirebaseTime(firebaseTime) {
    return firebaseTime ? moment.unix(firebaseTime.seconds).format("LLL") : "NA";
}

const iplMatches = JSON.parse('[{"dateTimeGMT":"2023-03-31T14:00:00Z","id":"c8742d20-c3cb-4423-aea1-b436f3ac65c3","team1Abbreviation":"GT","team2Abbreviation":"CSK","team1":"Gujarat Titans","team2":"Chennai Super Kings"},{"dateTimeGMT":"2023-04-01T10:00:00Z","id":"99c2990f-3e53-4cfa-8697-ab3d92b19f35","team1Abbreviation":"PBKS","team2Abbreviation":"KKR","team1":"Punjab Kings","team2":"Kolkata Knight Riders"},{"dateTimeGMT":"2023-04-01T14:00:00Z","id":"4608a16f-c556-4f0d-acc3-63dda814fba8","team1Abbreviation":"LSG","team2Abbreviation":"DC","team1":"Lucknow Super Giants","team2":"Delhi Capitals"},{"dateTimeGMT":"2023-04-02T10:00:00Z","id":"7535d936-2907-4b02-b68a-3e7465595e0a","team1Abbreviation":"SRH","team2Abbreviation":"RR","team1":"Sunrisers Hyderabad","team2":"Rajasthan Royals"},{"dateTimeGMT":"2023-04-02T14:00:00Z","id":"e99467c0-dcbb-498e-8aaa-19b88f3a3029","team1Abbreviation":"RCB","team2Abbreviation":"MI","team1":"Royal Challengers Bangalore","team2":"Mumbai Indians"},{"dateTimeGMT":"2023-04-03T14:00:00Z","id":"0bfed52d-36e4-406f-9458-9f3ce533398c","team1Abbreviation":"CSK","team2Abbreviation":"LSG","team1":"Chennai Super Kings","team2":"Lucknow Super Giants"},{"dateTimeGMT":"2023-04-04T14:00:00Z","id":"7aa61b66-0f3c-4a50-8eab-e9e23e7c4fcd","team1Abbreviation":"DC","team2Abbreviation":"GT","team1":"Delhi Capitals","team2":"Gujarat Titans"},{"dateTimeGMT":"2023-04-05T14:00:00Z","id":"91ba8452-eb44-464d-8eae-6a53ed46f00a","team1Abbreviation":"RR","team2Abbreviation":"PBKS","team1":"Rajasthan Royals","team2":"Punjab Kings"},{"dateTimeGMT":"2023-04-06T14:00:00Z","id":"63179b6c-0560-45cc-a984-9ad0459c7542","team1Abbreviation":"KKR","team2Abbreviation":"RCB","team1":"Kolkata Knight Riders","team2":"Royal Challengers Bangalore"},{"dateTimeGMT":"2023-04-07T14:00:00Z","id":"a92711fa-55d1-42a1-8cd7-571a0f9fb614","team1Abbreviation":"LSG","team2Abbreviation":"SRH","team1":"Lucknow Super Giants","team2":"Sunrisers Hyderabad"},{"dateTimeGMT":"2023-04-08T10:00:00Z","id":"7f6df32a-e505-495f-9121-c6aca6235306","team1Abbreviation":"RR","team2Abbreviation":"DC","team1":"Rajasthan Royals","team2":"Delhi Capitals"},{"dateTimeGMT":"2023-04-08T14:00:00Z","id":"ae24cc6a-8e37-4fd1-bb18-638b56ec4989","team1Abbreviation":"MI","team2Abbreviation":"CSK","team1":"Mumbai Indians","team2":"Chennai Super Kings"},{"dateTimeGMT":"2023-04-09T10:00:00Z","id":"9d22f5ad-e9bc-4a66-82d5-03acfc599434","team1Abbreviation":"GT","team2Abbreviation":"KKR","team1":"Gujarat Titans","team2":"Kolkata Knight Riders"},{"dateTimeGMT":"2023-04-09T14:00:00Z","id":"0b8981a3-9ae5-442d-ad1a-baab2efbd9e3","team1Abbreviation":"SRH","team2Abbreviation":"PBKS","team1":"Sunrisers Hyderabad","team2":"Punjab Kings"},{"dateTimeGMT":"2023-04-10T14:00:00Z","id":"a1f790e6-59c9-4c63-8b30-6b629531253d","team1Abbreviation":"RCB","team2Abbreviation":"LSG","team1":"Royal Challengers Bangalore","team2":"Lucknow Super Giants"},{"dateTimeGMT":"2023-04-11T14:00:00Z","id":"cc301267-8a6c-4840-87ff-b7c43ce10bc4","team1Abbreviation":"DC","team2Abbreviation":"MI","team1":"Delhi Capitals","team2":"Mumbai Indians"},{"dateTimeGMT":"2023-04-12T14:00:00Z","id":"5c496668-8076-4d58-a72a-105e1aeca978","team1Abbreviation":"CSK","team2Abbreviation":"RR","team1":"Chennai Super Kings","team2":"Rajasthan Royals"},{"dateTimeGMT":"2023-04-13T14:00:00Z","id":"c4774b4c-c2f8-434f-8ee6-0bf8e2c02a99","team1Abbreviation":"PBKS","team2Abbreviation":"GT","team1":"Punjab Kings","team2":"Gujarat Titans"},{"dateTimeGMT":"2023-04-14T14:00:00Z","id":"90118c8b-c48a-4eb1-bf1e-8a2ba119e0ea","team1Abbreviation":"KKR","team2Abbreviation":"SRH","team1":"Kolkata Knight Riders","team2":"Sunrisers Hyderabad"},{"dateTimeGMT":"2023-04-15T10:00:00Z","id":"f29a4077-8f04-4cba-90e4-e117b8a10f05","team1Abbreviation":"RCB","team2Abbreviation":"DC","team1":"Royal Challengers Bangalore","team2":"Delhi Capitals"},{"dateTimeGMT":"2023-04-15T14:00:00Z","id":"0c25b28c-6099-486a-ab6f-704b3415728d","team1Abbreviation":"LSG","team2Abbreviation":"PBKS","team1":"Lucknow Super Giants","team2":"Punjab Kings"},{"dateTimeGMT":"2023-04-16T10:00:00Z","id":"18fd94bb-5218-4845-80c8-bb8400a40c24","team1Abbreviation":"MI","team2Abbreviation":"KKR","team1":"Mumbai Indians","team2":"Kolkata Knight Riders"},{"dateTimeGMT":"2023-04-16T14:00:00Z","id":"f0b02afb-7bab-4fad-8724-bf6735b23d32","team1Abbreviation":"GT","team2Abbreviation":"RR","team1":"Gujarat Titans","team2":"Rajasthan Royals"},{"dateTimeGMT":"2023-04-17T14:00:00Z","id":"7630f8ed-d96f-4ac5-adc9-8c3703c059a0","team1Abbreviation":"RCB","team2Abbreviation":"CSK","team1":"Royal Challengers Bangalore","team2":"Chennai Super Kings"},{"dateTimeGMT":"2023-04-18T14:00:00Z","id":"fce9c228-f766-4018-b7fc-31484106ebce","team1Abbreviation":"SRH","team2Abbreviation":"MI","team1":"Sunrisers Hyderabad","team2":"Mumbai Indians"},{"dateTimeGMT":"2023-04-19T14:00:00Z","id":"31075544-43d6-47a6-afd9-5467a06c6ca2","team1Abbreviation":"RR","team2Abbreviation":"LSG","team1":"Rajasthan Royals","team2":"Lucknow Super Giants"},{"dateTimeGMT":"2023-04-20T10:00:00Z","id":"10dd76d8-8343-4c72-8447-8bf6e37b609f","team1Abbreviation":"PBKS","team2Abbreviation":"RCB","team1":"Punjab Kings","team2":"Royal Challengers Bangalore"},{"dateTimeGMT":"2023-04-20T14:00:00Z","id":"aeaac025-dd19-4033-a5db-8b93106f75d4","team1Abbreviation":"DC","team2Abbreviation":"KKR","team1":"Delhi Capitals","team2":"Kolkata Knight Riders"},{"dateTimeGMT":"2023-04-21T14:00:00Z","id":"80efa6af-240d-400c-893b-898152949a4c","team1Abbreviation":"CSK","team2Abbreviation":"SRH","team1":"Chennai Super Kings","team2":"Sunrisers Hyderabad"},{"dateTimeGMT":"2023-04-22T10:00:00Z","id":"c5299187-f030-4727-98e1-0667f4626ae5","team1Abbreviation":"LSG","team2Abbreviation":"GT","team1":"Lucknow Super Giants","team2":"Gujarat Titans"},{"dateTimeGMT":"2023-04-22T14:00:00Z","id":"b3216931-c54b-482f-94e6-5d803cc3199e","team1Abbreviation":"MI","team2Abbreviation":"PBKS","team1":"Mumbai Indians","team2":"Punjab Kings"},{"dateTimeGMT":"2023-04-23T10:00:00Z","id":"aa0bc972-2377-4407-9bc2-75e0c83c225d","team1Abbreviation":"RCB","team2Abbreviation":"RR","team1":"Royal Challengers Bangalore","team2":"Rajasthan Royals"},{"dateTimeGMT":"2023-04-23T14:00:00Z","id":"018878c0-36df-4634-9cc3-5c5ea02378b2","team1Abbreviation":"KKR","team2Abbreviation":"CSK","team1":"Kolkata Knight Riders","team2":"Chennai Super Kings"},{"dateTimeGMT":"2023-04-24T14:00:00Z","id":"065089a4-5ba8-4276-9d89-83079af4541c","team1Abbreviation":"SRH","team2Abbreviation":"DC","team1":"Sunrisers Hyderabad","team2":"Delhi Capitals"},{"dateTimeGMT":"2023-04-25T14:00:00Z","id":"b72aa256-3a2f-4536-bb4f-59cdebf04557","team1Abbreviation":"GT","team2Abbreviation":"MI","team1":"Gujarat Titans","team2":"Mumbai Indians"},{"dateTimeGMT":"2023-04-26T14:00:00Z","id":"9513145b-b401-4e72-a898-a4bd7c688be8","team1Abbreviation":"RCB","team2Abbreviation":"KKR","team1":"Royal Challengers Bangalore","team2":"Kolkata Knight Riders"},{"dateTimeGMT":"2023-04-27T14:00:00Z","id":"86a12373-e6e4-4315-8da5-73781ef289e2","team1Abbreviation":"RR","team2Abbreviation":"CSK","team1":"Rajasthan Royals","team2":"Chennai Super Kings"},{"dateTimeGMT":"2023-04-28T14:00:00Z","id":"043b41db-1968-46c1-997d-4f92833c5a5b","team1Abbreviation":"PBKS","team2Abbreviation":"LSG","team1":"Punjab Kings","team2":"Lucknow Super Giants"},{"dateTimeGMT":"2023-04-29T10:00:00Z","id":"8325cb10-1f7b-48f8-a41f-2f63799f8177","team1Abbreviation":"KKR","team2Abbreviation":"GT","team1":"Kolkata Knight Riders","team2":"Gujarat Titans"},{"dateTimeGMT":"2023-04-29T14:00:00Z","id":"f2b8aa8a-f24c-40b4-99bb-4e6a222a1614","team1Abbreviation":"DC","team2Abbreviation":"SRH","team1":"Delhi Capitals","team2":"Sunrisers Hyderabad"},{"dateTimeGMT":"2023-04-30T10:00:00Z","id":"97f38e12-a13c-4f3d-876f-89abc5da7fdd","team1Abbreviation":"CSK","team2Abbreviation":"PBKS","team1":"Chennai Super Kings","team2":"Punjab Kings"},{"dateTimeGMT":"2023-04-30T14:00:00Z","id":"6b9daa07-a9f3-46d2-a26a-cd9fde9dcb35","team1Abbreviation":"MI","team2Abbreviation":"RR","team1":"Mumbai Indians","team2":"Rajasthan Royals"},{"dateTimeGMT":"2023-05-01T14:00:00Z","id":"40d33ba3-ac37-4d8b-a45c-d738167a8a39","team1Abbreviation":"LSG","team2Abbreviation":"RCB","team1":"Lucknow Super Giants","team2":"Royal Challengers Bangalore"},{"dateTimeGMT":"2023-05-02T14:00:00Z","id":"494e1d55-324c-42ee-850b-8de25f27f547","team1Abbreviation":"GT","team2Abbreviation":"DC","team1":"Gujarat Titans","team2":"Delhi Capitals"},{"dateTimeGMT":"2023-05-03T14:00:00Z","id":"2f9ce8ba-4c85-4e90-8140-d632037d35db","team1Abbreviation":"PBKS","team2Abbreviation":"MI","team1":"Punjab Kings","team2":"Mumbai Indians"},{"dateTimeGMT":"2023-05-04T10:00:00Z","id":"08629a55-7d6e-4b82-8157-10c1d1eb4d02","team1Abbreviation":"LSG","team2Abbreviation":"CSK","team1":"Lucknow Super Giants","team2":"Chennai Super Kings"},{"dateTimeGMT":"2023-05-04T14:00:00Z","id":"70b387b7-be48-491b-b58f-12b329867124","team1Abbreviation":"SRH","team2Abbreviation":"KKR","team1":"Sunrisers Hyderabad","team2":"Kolkata Knight Riders"},{"dateTimeGMT":"2023-05-05T14:00:00Z","id":"e8d137eb-0133-4b8b-92df-c573f3308e7a","team1Abbreviation":"RR","team2Abbreviation":"GT","team1":"Rajasthan Royals","team2":"Gujarat Titans"},{"dateTimeGMT":"2023-05-06T10:00:00Z","id":"bd011ee1-febe-454f-a038-46ef7bc66575","team1Abbreviation":"CSK","team2Abbreviation":"MI","team1":"Chennai Super Kings","team2":"Mumbai Indians"},{"dateTimeGMT":"2023-05-06T14:00:00Z","id":"114b5c32-f7bd-4486-b638-c513bdf80fc5","team1Abbreviation":"DC","team2Abbreviation":"RCB","team1":"Delhi Capitals","team2":"Royal Challengers Bangalore"},{"dateTimeGMT":"2023-05-07T10:00:00Z","id":"3ed57184-bfde-4cd9-9c2e-6214dc12baae","team1Abbreviation":"GT","team2Abbreviation":"LSG","team1":"Gujarat Titans","team2":"Lucknow Super Giants"},{"dateTimeGMT":"2023-05-07T14:00:00Z","id":"d4100a0f-2edb-49d4-a66f-cb5f6695f295","team1Abbreviation":"RR","team2Abbreviation":"SRH","team1":"Rajasthan Royals","team2":"Sunrisers Hyderabad"},{"dateTimeGMT":"2023-05-08T14:00:00Z","id":"5db8818a-6291-4b65-a5aa-43cfe66da805","team1Abbreviation":"KKR","team2Abbreviation":"PBKS","team1":"Kolkata Knight Riders","team2":"Punjab Kings"},{"dateTimeGMT":"2023-05-09T14:00:00Z","id":"26bb0e29-afe8-413f-8a43-53af922e4240","team1Abbreviation":"MI","team2Abbreviation":"RCB","team1":"Mumbai Indians","team2":"Royal Challengers Bangalore"},{"dateTimeGMT":"2023-05-10T14:00:00Z","id":"8e3d0b98-0b9b-491b-bbf4-d455303aa020","team1Abbreviation":"CSK","team2Abbreviation":"DC","team1":"Chennai Super Kings","team2":"Delhi Capitals"},{"dateTimeGMT":"2023-05-11T14:00:00Z","id":"35198e8a-10d5-45fd-85f6-25c9ed0943f1","team1Abbreviation":"KKR","team2Abbreviation":"RR","team1":"Kolkata Knight Riders","team2":"Rajasthan Royals"},{"dateTimeGMT":"2023-05-12T14:00:00Z","id":"6b34ffab-0b70-41aa-a56d-70d4eb607e24","team1Abbreviation":"MI","team2Abbreviation":"GT","team1":"Mumbai Indians","team2":"Gujarat Titans"},{"dateTimeGMT":"2023-05-13T10:00:00Z","id":"d96cb055-6050-44b5-88e0-d52eb0314dce","team1Abbreviation":"SRH","team2Abbreviation":"LSG","team1":"Sunrisers Hyderabad","team2":"Lucknow Super Giants"},{"dateTimeGMT":"2023-05-13T14:00:00Z","id":"b5df4a10-5ec6-4ae1-aa4f-812730191195","team1Abbreviation":"DC","team2Abbreviation":"PBKS","team1":"Delhi Capitals","team2":"Punjab Kings"},{"dateTimeGMT":"2023-05-14T10:00:00Z","id":"db9dca42-5673-4129-a726-de77b6394437","team1Abbreviation":"RR","team2Abbreviation":"RCB","team1":"Rajasthan Royals","team2":"Royal Challengers Bangalore"},{"dateTimeGMT":"2023-05-14T14:00:00Z","id":"4fcb6fb2-b3d4-4eb6-889c-02a82c46719e","team1Abbreviation":"CSK","team2Abbreviation":"KKR","team1":"Chennai Super Kings","team2":"Kolkata Knight Riders"},{"dateTimeGMT":"2023-05-15T14:00:00Z","id":"54425cd2-cf17-4736-9de0-1fec8dd7daf0","team1Abbreviation":"GT","team2Abbreviation":"SRH","team1":"Gujarat Titans","team2":"Sunrisers Hyderabad"},{"dateTimeGMT":"2023-05-16T14:00:00Z","id":"d0c09198-be2f-4aea-9e9a-9e5a7fb3c532","team1Abbreviation":"LSG","team2Abbreviation":"MI","team1":"Lucknow Super Giants","team2":"Mumbai Indians"},{"dateTimeGMT":"2023-05-17T14:00:00Z","id":"cdf73c94-909e-40a3-917e-54908b3edb9b","team1Abbreviation":"PBKS","team2Abbreviation":"DC","team1":"Punjab Kings","team2":"Delhi Capitals"},{"dateTimeGMT":"2023-05-18T14:00:00Z","id":"a266639f-01f4-4ec0-a09c-cee5dca38e74","team1Abbreviation":"SRH","team2Abbreviation":"RCB","team1":"Sunrisers Hyderabad","team2":"Royal Challengers Bangalore"},{"dateTimeGMT":"2023-05-19T14:00:00Z","id":"048d4bdf-88de-4981-b330-03ceb18eb6a1","team1Abbreviation":"PBKS","team2Abbreviation":"RR","team1":"Punjab Kings","team2":"Rajasthan Royals"},{"dateTimeGMT":"2023-05-20T10:00:00Z","id":"ab52f012-34b7-4a68-a1af-b95668255a40","team1Abbreviation":"DC","team2Abbreviation":"CSK","team1":"Delhi Capitals","team2":"Chennai Super Kings"},{"dateTimeGMT":"2023-05-20T14:00:00Z","id":"034ccab8-50ac-4dc4-affb-38c73cca0a49","team1Abbreviation":"KKR","team2Abbreviation":"LSG","team1":"Kolkata Knight Riders","team2":"Lucknow Super Giants"},{"dateTimeGMT":"2023-05-21T10:00:00Z","id":"6e853a67-5625-434f-babd-5702dcd846a9","team1Abbreviation":"MI","team2Abbreviation":"SRH","team1":"Mumbai Indians","team2":"Sunrisers Hyderabad"},{"dateTimeGMT":"2023-05-21T14:00:00Z","id":"9759d12a-14a6-42c2-bbe2-833c6f612ceb","team1Abbreviation":"RCB","team2Abbreviation":"GT","team1":"Royal Challengers Bangalore","team2":"Gujarat Titans"}]');

const matchImgs = {"c8742d20-c3cb-4423-aea1-b436f3ac65c3":"IPL-Match-29-GT-vs-CSK-768x360.jpg",
"99c2990f-3e53-4cfa-8697-ab3d92b19f35":"IPL-Match-8-KKR-vs-PK-768x360.jpg",
"4608a16f-c556-4f0d-acc3-63dda814fba8":"IPL-Match-15-LSG-vs-DC-768x360.jpg",
"7535d936-2907-4b02-b68a-3e7465595e0a":"IPL-Match-5-SH-vs-RR-768x360.jpg",
"e99467c0-dcbb-498e-8aaa-19b88f3a3029":"IPL-Match-18-RCB-vs-MI-768x360.jpg",
"0bfed52d-36e4-406f-9458-9f3ce533398c":"IPL-Match-7-LSG-vs-CSK-768x360.jpg",
"7aa61b66-0f3c-4a50-8eab-e9e23e7c4fcd":"IPL-Match-10-GT-vs-DC-768x360.jpg",
"91ba8452-eb44-464d-8eae-6a53ed46f00a":"IPL-Match-52-PK-vs-RR-768x360.jpg",
"63179b6c-0560-45cc-a984-9ad0459c7542":"IPL-Match-6-RCB-vs-KKR-768x360.jpg",
"a92711fa-55d1-42a1-8cd7-571a0f9fb614":"IPL-Match-12-SH-vs-LSG-768x360.jpg",
"7f6df32a-e505-495f-9121-c6aca6235306":"IPL-Match-58-RR-vs-DC-768x360.jpg",
"ae24cc6a-8e37-4fd1-bb18-638b56ec4989":"IPL-Match-33-MI-vs-CSK-768x360.jpg",
"9d22f5ad-e9bc-4a66-82d5-03acfc599434":"IPL-Match-35-KKR-vs-GT-768x360.jpg",
"0b8981a3-9ae5-442d-ad1a-baab2efbd9e3":"IPL-Match-70-SH-vs-PK-768x360.jpg",
"a1f790e6-59c9-4c63-8b30-6b629531253d":"IPL-Match-31-LSG-vs-RCB-768x360.jpg",
"cc301267-8a6c-4840-87ff-b7c43ce10bc4":"IPL-Match-2-DC-vs-MI.jpg",
"5c496668-8076-4d58-a72a-105e1aeca978":"IPL-Match-68-RR-vs-CSK-768x360.jpg",
"c4774b4c-c2f8-434f-8ee6-0bf8e2c02a99":"IPL-Match-16-PK-vs-GT-768x360.jpg",
"90118c8b-c48a-4eb1-bf1e-8a2ba119e0ea":"IPL-Match-61-KKR-vs-SH-768x360.jpg",
"f29a4077-8f04-4cba-90e4-e117b8a10f05":"IPL-Match-27-DC-vs-RCB-768x360.jpg",
"0c25b28c-6099-486a-ab6f-704b3415728d":"IPL-Match-42-PK-vs-LSG-768x360.jpg",
"18fd94bb-5218-4845-80c8-bb8400a40c24":"IPL-Match-56-MI-vs-KKR-768x360.jpg",
"f0b02afb-7bab-4fad-8724-bf6735b23d32":"IPL-Match-24-RR-vs-GT-768x360.jpg",
"7630f8ed-d96f-4ac5-adc9-8c3703c059a0":"IPL-Match-49-RCB-vs-CSK-768x360.jpg",
"fce9c228-f766-4018-b7fc-31484106ebce":"IPL-Match-65-MI-vs-SH-768x360.jpg",
"31075544-43d6-47a6-afd9-5467a06c6ca2":"IPL-Match-20-RR-vs-LSG-768x360.jpg",
"10dd76d8-8343-4c72-8447-8bf6e37b609f":"IPL-Match-3-PK-vs-RCB-768x360.jpg",
"aeaac025-dd19-4033-a5db-8b93106f75d4":"IPL-Match-41-DC-vs-KKR-768x360.jpg",
"80efa6af-240d-400c-893b-898152949a4c":"IPL-Match-17-CSK-vs-SH-768x360.jpg",
"c5299187-f030-4727-98e1-0667f4626ae5":"IPL-Match-57-LSG-vs-GT-768x360.jpg",
"b3216931-c54b-482f-94e6-5d803cc3199e":"IPL-Match-23-MI-vs-PK-768x360.jpg",
"aa0bc972-2377-4407-9bc2-75e0c83c225d":"IPL-Match-39-RCB-vs-RR-768x360.jpg",
"018878c0-36df-4634-9cc3-5c5ea02378b2":"IPL-Match-1-CSK-vs-KKR.jpg",
"065089a4-5ba8-4276-9d89-83079af4541c":"IPL-Match-50-DC-vs-SH-768x360.jpg",
"b72aa256-3a2f-4536-bb4f-59cdebf04557":"IPL-Match-51-GT-vs-MI-768x360.jpg",
"9513145b-b401-4e72-a898-a4bd7c688be8":"IPL-Match-6-RCB-vs-KKR-768x360.jpg",
"86a12373-e6e4-4315-8da5-73781ef289e2":"IPL-Match-68-RR-vs-CSK-768x360.jpg",
"043b41db-1968-46c1-997d-4f92833c5a5b":"IPL-Match-42-PK-vs-LSG-768x360.jpg",
"8325cb10-1f7b-48f8-a41f-2f63799f8177":"IPL-Match-35-KKR-vs-GT-768x360.jpg",
"f2b8aa8a-f24c-40b4-99bb-4e6a222a1614":"IPL-Match-50-DC-vs-SH-768x360.jpg",
"97f38e12-a13c-4f3d-876f-89abc5da7fdd":"IPL-Match-11-CSK-vs-PK-768x360.jpg",
"6b9daa07-a9f3-46d2-a26a-cd9fde9dcb35":"IPL-Match-9-MI-vs-RR-768x360",
"40d33ba3-ac37-4d8b-a45c-d738167a8a39":"IPL-Match-31-LSG-vs-RCB-768x360.jpg",
"494e1d55-324c-42ee-850b-8de25f27f547":"IPL-Match-10-GT-vs-DC-768x360.jpg",
"2f9ce8ba-4c85-4e90-8140-d632037d35db":"IPL-Match-23-MI-vs-PK-768x360.jpg",
"08629a55-7d6e-4b82-8157-10c1d1eb4d02":"IPL-Match-7-LSG-vs-CSK-768x360.jpg",
"70b387b7-be48-491b-b58f-12b329867124":"IPL-Match-25-SH-vs-KKR-768x360.jpg",
"e8d137eb-0133-4b8b-92df-c573f3308e7a":"IPL-Match-24-RR-vs-GT-768x360.jpg",
"bd011ee1-febe-454f-a038-46ef7bc66575":"IPL-Match-59-CSK-vs-MI-768x360.jpg",
"114b5c32-f7bd-4486-b638-c513bdf80fc5":"IPL-Match-27-DC-vs-RCB-768x360.jpg",
"3ed57184-bfde-4cd9-9c2e-6214dc12baae":"IPL-Match-4-GT-vs-LSG-768x360.jpg",
"d4100a0f-2edb-49d4-a66f-cb5f6695f295":"IPL-Match-5-SH-vs-RR-768x360.jpg",
"5db8818a-6291-4b65-a5aa-43cfe66da805":"IPL-Match-8-KKR-vs-PK-768x360.jpg",
"26bb0e29-afe8-413f-8a43-53af922e4240":"IPL-Match-18-RCB-vs-MI-768x360.jpg",
"8e3d0b98-0b9b-491b-bbf4-d455303aa020":"IPL-Match-55-CSK-vs-DC-768x360.jpg",
"35198e8a-10d5-45fd-85f6-25c9ed0943f1":"IPL-Match-47-KKR-vs-RR-768x360.jpg",
"6b34ffab-0b70-41aa-a56d-70d4eb607e24":"IPL-Match-51-GT-vs-MI-768x360.jpg",
"d96cb055-6050-44b5-88e0-d52eb0314dce":"IPL-Match-12-SH-vs-LSG-768x360.jpg",
"b5df4a10-5ec6-4ae1-aa4f-812730191195":"IPL-Match-32-DC-vs-PK-768x360.jpg",
"db9dca42-5673-4129-a726-de77b6394437":"IPL-Match-13-RR-vs-RCB-768x360.jpg",
"4fcb6fb2-b3d4-4eb6-889c-02a82c46719e":"IPL-Match-1-CSK-vs-KKR.jpg",
"54425cd2-cf17-4736-9de0-1fec8dd7daf0":"IPL-Match-40-GT-vs-SH-768x360.jpg",
"d0c09198-be2f-4aea-9e9a-9e5a7fb3c532":"IPL-Match-37-LSG-vs-MI-768x360.jpg",
"cdf73c94-909e-40a3-917e-54908b3edb9b":"IPL-Match-64-PK-vs-DC-768x360.jpg",
"a266639f-01f4-4ec0-a09c-cee5dca38e74":"IPL-Match-54-SH-vs-RCB-768x360.jpg",
"048d4bdf-88de-4981-b330-03ceb18eb6a1":"IPL-Match-52-PK-vs-RR-768x360.jpg",
"ab52f012-34b7-4a68-a1af-b95668255a40":"IPL-Match-55-CSK-vs-DC-768x360.jpg",
"034ccab8-50ac-4dc4-affb-38c73cca0a49":"IPL-Match-66-KKR-vs-LSG-768x360.jpg",
"6e853a67-5625-434f-babd-5702dcd846a9":"IPL-Match-65-MI-vs-SH-768x360.jpg",
"9759d12a-14a6-42c2-bbe2-833c6f612ceb":"IPL-Match-67-RCB-vs-GT-768x360.jpg"};

const dimModePalette = {
    backgroundColor: "slategray",
    headerBackgroundColor: "#24033c",
    tableBackgroundImage: "linear-gradient(to right,rgba(255, 225, 0, 0.1),rgb(120 239 20) 4%,rgba(255, 225, 0, 0.3))",
    tableRankOneBackgroundColor: "#d08f0c",
    tableRankTwoBackgroundColor: "#628f07",
    tableRankOthersBackgroundColor: "#85a937",
    tableBodyTextColor: "aliceblue",
    tableCaptionBackgroundColor: "darkslateblue"
}

// themeColor = dimModePalette.headerBackgroundColor //normal_mode - don't assign again

export { 
    db, 
    auth,
    storage,
    iplMatches,
    themeColor,
    loaderHeight,
    loaderWidth,
    matchHeadingFontSize,
    fontVariant,
    logger,
    teamNames,
    DEFAULT_START_POINTS,
    DEFAULT_PROFILE_IMAGE,
    firebase,
    matchImgs,
    dimModePalette,

    getTeamLogo,
    getFormattedTimeISOString,
    getMsgForUpcomingBets,
    getMsgForLostBets, 
    getMsgForWonBets, 
    getMsgForClosedBets, 
    getMsgForNoResultBets, 
    getMsgForInProgressBets, 
    getMsgForOpenBets,
    getFormattedFirebaseTime
}