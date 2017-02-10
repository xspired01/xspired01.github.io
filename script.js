//using fetch instead of $.ajax()
// using promise.all

let teamStats = [];
let teamInfo = [];
const url = `https://api.fantasydata.net/v3/nfl/scores/JSON/TeamSeasonStats/2016`;
const url2 =`https://api.fantasydata.net/v3/nfl/scores/JSON/Teams`;
const mykey1 = config.key1;

const settings = {
  "async": true,
  "crossDomain": true,
  "method": "GET",
  "headers": {
    "ocp-apim-subscription-key": mykey1,
    "cache-control": "no-cache"
  }
}

let searchForm = document.getElementById("search");
let formTag = document.getElementsByTagName('form')[0];
let tableBody = document.getElementById("table");

formTag.addEventListener('submit', function(event) {
  event.preventDefault();
  let userResponse = search.value.toLowerCase(); //gets team name, conver toLowerCase
  let normalizeResponse = modifyUserResponse(userResponse); //use lookUp object to convert to integer
  let workHorse = getPromises(url, url2, settings, normalizeResponse);
  let clear = clearSearchField();     //resets search field
  tableBody.innerHTML = ''; //clears table
}) // end of addEventListener function

function getPromises(url, url2, settings, normalizeResponse) {
  let promise1 = fetch(url, settings);
  let promise2 = fetch(url2, settings);
  let promiseKeeper = [];
  promiseKeeper.push(promise1);
  promiseKeeper.push(promise2);

  Promise.all(promiseKeeper)
  .then(function(valuesArray){
    let jsonifiedArray = [];
    for (i = 0; i< valuesArray.length; i++){
      jsonifiedArray.push(valuesArray[i].json());
    }
    return Promise.all(jsonifiedArray);
  })
  .then(function(jsonResponseArray){
    let teamStats = jsonResponseArray[0];
    let teamInfo = jsonResponseArray[1];
    let projectedWins = getTeamWins(teamStats, normalizeResponse);
    let teamName = getTeamName(teamStats, normalizeResponse);
    let logo = getLogo(teamInfo, normalizeResponse);
    let displayResults = updateTable(projectedWins, teamName, logo);
  })
}

//this function calculates team wins for next season
function getTeamWins(teamStats, normalizeResponse) {
  let pointsScored = teamStats[normalizeResponse]["Score"];
  let pointsScoredAgainst = teamStats[normalizeResponse]["OpponentScore"];
  let homeTeamScores = Math.pow(pointsScored, 1 / 2.37);
  let awayTeamScores = Math.pow(pointsScoredAgainst, 1 / 2.37)
  let teamWinPercentage = (homeTeamScores / (homeTeamScores + awayTeamScores));
  let projWins = Math.ceil(teamWinPercentage * 16);
  return projWins;
}

//determine season outcome
function seasonOutcome(projectedWins) {
  let x = projectedWins;
  let outcome1 = "Good Luck in the NFL Draft";
  let outcome2 = "Factory of Sadness";
  let outcome3 = "Mediocrity";
  let outcome4 = "Wildcard Round of Playoffs";
  let outcome5 = "Division Round of Playoffs";
  let outcome6 = "Superbowl!";
  if (x <= 4) {
    return outcome1;
  }
  else if (x >= 5 && x < 8) {
    return outcome2;
  }
  else if (x === 8) {
    return outcome3;
  }
  else if (x >= 9 && x <= 10){
    return outcome4;
  }
  else if (x >= 11 && x <= 12) {
    return outcome5;
  }
  else if (x >= 13) {
    return outcome6;
  }
}

//determine whether to buy tickets
function buyTickets(projectedWins) {
  let y = projectedWins;
  console.log(y);
  let buyChoice1 = "No";
  let buyChoice2 = "Probably Not";
  let buyChoice3 = "Yes"
  if ( y <= 7){
    return buyChoice1;
  }
  else if (y <= 8){
    return buyChoice2;
  }
  else if (y >= 9){
    return buyChoice3;
  }
}

//getting team name from the data
function getTeamName(teamStats, normalizeResponse) {
  let name = teamStats[normalizeResponse]["TeamName"];
  return name;
}

// get url to team logo
function getLogo(teamInfo, normalizeResponse) {
  let teamLogo = teamInfo[normalizeResponse]["WikipediaLogoUrl"];
  console.log(teamLogo);
  return teamLogo;
}

//displays projected results to user using a table
function updateTable(projectedWins, teamName, teamLogo) {
  let selectRow = document.createElement('tr');
  let selectRow2 = document.createElement('tr');
  let selectRow3 = document.createElement('tr');
  let selectRow4 = document.createElement('tr');
  let showName = document.createElement('td');
  let showPic = document.createElement('td');
  let selectCell = document.createElement('td');
  let showOutcome = document.createElement('td');
  let showBuyChoice = document.createElement('td');
  let purchase = buyTickets(projectedWins);
  let playoffs = seasonOutcome(projectedWins);
  showName.innerText = teamName;
  showName.width = "400";

  // adjust image
  let teamImageContainer = document.createElement("div");
  let teamImage = document.createElement("img");
  teamImage.src= teamLogo ;
  teamImage.width = "300";
  teamImage.height = "300";
  teamImageContainer.appendChild(teamImage);
  showPic.appendChild(teamImageContainer);
  //populate table
  selectCell.innerText = "The projected team wins for next season is: " + projectedWins; //refers to name in eventListener
  showOutcome.innerText = "The projected season outcome is: " + playoffs;
  showBuyChoice.innerText = "Should you buy tickets:  " + purchase;
  selectRow.appendChild(showName);
  selectRow.appendChild(showPic);
  selectRow2.appendChild(selectCell);
  selectRow3.appendChild(showOutcome);
  selectRow4.appendChild(showBuyChoice);
  tableBody.appendChild(selectRow);
  tableBody.appendChild(selectRow2);
  tableBody.appendChild(selectRow3);
  tableBody.appendChild(selectRow4);
}

// reset search field
function clearSearchField() {
  document.getElementById("inputForm").reset();
}

// convert user response with lookUp object to an integer
function modifyUserResponse(userResponse) {
  var lookUp = {
    cardinals: 0,
    arizona: 0,
    "arizona cardinals":0,
    falcons: 1,
    atlanta: 1,
    "atlanta falcons":1,
    ravens: 2,
    baltimore: 2,
    "baltimore ravens": 2,
    bills: 3,
    buffalo: 3,
    "buffalo bills":3,
    panthers: 4,
    carolina: 4,
    "carolina panthers": 4,
    bears: 5,
    chicago: 5,
    "chicago bears": 5,
    bengals: 6,
    cincinnati: 6,
    "cincinnati bengals": 6,
    browns: 7,
    cleveland: 7,
    "cleveland browns": 7,
    cowboys: 8,
    dallas: 8,
    "dallas cowboys": 8,
    broncos: 9,
    denver: 9,
    "denver broncos": 9,
    lions: 10,
    detriot: 10,
    "detroit lions": 10,
    packers: 11,
    'green bay': 11,
    "green bay packers": 11,
    texans: 12,
    houston: 12,
    "houston texans": 12,
    colts: 13,
    indianapolis: 13,
    "indianapolis colts":13,
    jaguars: 14,
    jacksonville: 14,
    "jacksonville jaguars": 14,
    chiefs: 15,
    "kansas city": 15,
    "kansas city chiefs": 15,
    kansas: 15,
    rams: 16,
    'st. louis': 16,
    'st. louis rams': 16,
    'los angeles': 16,
    'los angeles rams': 16,
    dolphins: 17,
    miami: 17,
    "miami dolphins": 17,
    vikings: 18,
    minnesota: 18,
    "minnesota vikings":18,
    patriots: 19,
    'new england': 19,
    "new england patriots":19,
    saints: 20,
    "new orleans": 20,
    "new orleans saints": 20,
    giants: 21,
    'new york': 21,
    "new york giants": 21,
    jets: 22,
    "new york": 22,
    "new york jets":22,
    raiders: 23,
    oakland: 23,
    "oakland raiders":23,
    eagles: 24,
    philadelphia: 24,
    "philadelphia eagles": 24,
    steelers: 25,
    pittsburgh: 25,
    "pittsburgh steelers":25,
    chargers: 26,
    "san diego": 26,
    "san diego chargers": 26,
    seahawks: 27,
    seattle: 27,
    "seattle seahawks":27,
    '49ers': 28,
    49: 28,
    "san francisco": 28,
    "san francisco 49ers":28,
    buccaneers: 29,
    "tampa bay": 29,
    "tampa bay buccaneers": 29,
    titans: 30,
    tennessee: 30,
    "tennessee titans": 30,
    redskins: 31,
    washington: 31,
    "washington redskins": 31
  };
  return lookUp[userResponse];
}
