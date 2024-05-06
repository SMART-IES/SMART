var cpt_urgency = 0;
var cpt_obstruction = 0;
var cpt_sneaking = 0;
var cpt_scarcity = 0;
var cpt_misdirection = 0;
var cpt_social = 0;
var forcedActionString = "if you see me, there is likely an error";

const darknessThreshold = 100;

// Function to calculate brightness from RGB values
function calculateBrightness(rgb) {
    // Convert RGB values to brightness using the formula: (R * 299 + G * 587 + B * 114) / 1000
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}

function addInfoIcon(element, category) {
  // Create information icon element
  const infoIcon = document.createElement('span');
  infoIcon.className = 'info-icon';
  infoIcon.innerHTML = "i";

  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.style.display = 'flex';

  // Create logomini
  var miniLogo = document.createElement("img");
  miniLogo.src = chrome.runtime.getURL("app/popup/logo_mini.png"); // current dir racine projet, logo extention if not categorized

  console.log(chrome.runtime.getURL("app/popup/logo_mini.png"));
  if (category === "Urgency") {
    miniLogo.src = chrome.runtime.getURL("app/popup/urgency.png");
    tooltip.style.backgroundColor = "#FB9CFC";
  }
  if (category === "Obstruction") {
    miniLogo.src = chrome.runtime.getURL("bmmcgdnpcbkobimloobmmljjgjgcnmoh/app/popup/obstruction.png");
    tooltip.style.backgroundColor = "#FCD69C";
  }
  if (category === "Sneaking") {
    miniLogo.src = chrome.runtime.getURL("app/popup/sneaking.png");
    tooltip.style.backgroundColor = "#FCF99C";
  }
  if (category === "Scarcity") {
    miniLogo.src = "app/popup/scarcity.png";
    tooltip.style.backgroundColor = "#83C9FC";
  }
  if (category === "Misdirection") {
    miniLogo.src = "app/popup/misdirection.png";
    tooltip.style.backgroundColor = "#9583FC";
  }
  if (category === "Social Proof") {
    miniLogo.src = "app/popup/social_proof.png";
    tooltip.style.backgroundColor = "#FB9CFC";
  }

  // Create textDiv
  var textDiv = document.createElement("div");
  textDiv.className = 'text-tooltip';

  // Create texte
  var desc = document.createTextNode("Type : "+ category);
  textDiv.appendChild(desc);

  tooltip.appendChild(miniLogo);
  tooltip.appendChild(textDiv);

  element.appendChild(infoIcon);
  element.appendChild(tooltip);

  infoIcon.addEventListener('mouseenter', () => {
      tooltip.style.visibility = 'visible';
  });

  infoIcon.addEventListener('mouseleave', () => {
      tooltip.style.visibility = 'hidden';
  });
}

function sendNumber(countDarkPatterns, countPrice, countAction, countUrgency, countObs, countSneak, countScar, countMisdir, countSocial, forcedActionMessage) {
  chrome.runtime.sendMessage({ message: "update_number", 
  countDarkPatterns: countDarkPatterns, 
  countPrice: countPrice, 
  countAction: countAction, 
  countUrgency: countUrgency,
  countObs: countObs,
  countSneak: countSneak,
  countScar: countScar,
  countMisdir: countMisdir,
  countSocial: countSocial,
  forcedActionString: forcedActionMessage
});
}

//---Request on AI python API server.py---// 
async function predictDPWithTextModel(data) {
  const response = await fetch('http://localhost:5000/predictText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}

async function checkDarkPattern(input) {
  
  const response = await fetch('http://localhost:5000/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });
  const result = await response.json();
  return result;
}

async function predictForcedAction(input) {
  
  const response = await fetch('http://localhost:5000/predictForcedAction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });
  const result = await response.json();
  return result;
}

//---Highligh text elements---// 
function highlightTextElements(element, category) {
  if (category === "Urgency") {
    element.style.backgroundColor = "#FB9CFC";
    cpt_urgency++;
    /*let f = document.getElementById("count_urgency");
    f.value++;*/
  }
  if (category === "Obstruction") {
    element.style.backgroundColor = "#FCD69C";
    cpt_obstruction++;
  }
  if (category === "Sneaking") {
    element.style.backgroundColor = "#FCF99C";
    cpt_sneaking++;
  }
  if (category === "Scarcity") {
    element.style.backgroundColor = "#83C9FC";
    cpt_scarcity++;
  }
  if (category === "Misdirection") {
    element.style.backgroundColor = "#9583FC";
    cpt_misdirection++;
  }
  if (category === "Social Proof") {
    element.style.backgroundColor = "#FB9CFC";
    cpt_social++;
  }
  

  element.style.borderColor = 'black';
  element.style.borderWidth = '2px';

  let e = document.getElementById("count_number_DarkPatterns");
  e.value++;

  // Add info icon with description on hover
  addInfoIcon(element, category);
}

//---Highligh price elements---// 
function highlightprice(element) {
  element.style.backgroundColor = "#FC6969";
  element.style.borderColor = 'black';
  element.style.borderWidth = '2px';
  let e = document.getElementById("count_number_Price");
  e.value++;
}

function highlightAction(element) {
  if (element && element.id === "count_number_Action") {
    element.style.backgroundColor = 'green';
    element.style.borderColor = 'black';
    element.style.borderWidth = '2px';
    element.value++;
  }
}


async function darkPatternIdentification(url) {
  init_counters();

  makePageGrey();

  await getTextPrediction(url);

  await getForcedActionPrediction(url);

  updateContent();
}

function updateContent() {
  // Update UI or send message to background script
  chrome.runtime.sendMessage({ message: "tasks_complete" });
  //console.log("End of detection");

  // Send message to update number
  let e1 = document.getElementById("count_number_DarkPatterns");
  let e2 = document.getElementById("count_number_Price");
  let e3 = document.getElementById("count_number_Action");
  //let e4 = document.getElementById("count_urgency");
  sendNumber(e1.value, e2.value, e3.value, (cpt_urgency + e2.value), cpt_obstruction, cpt_sneaking, cpt_scarcity, cpt_misdirection, cpt_social, forcedActionString);
}

function makePageGrey() {
  var images = document.getElementsByTagName('img');
  for (var i = 0; i < images.length; i++) {
    images[i].style.filter = 'grayscale(1)';
  }
}

function init_counters() {
  if (!document.getElementById("count_number_DarkPatterns")) {
    let g = document.createElement("div");
    g.id = "count_number_DarkPatterns";
    g.value = 0;
    g.style.opacity = 0;
    g.style.position = "fixed";
    document.body.appendChild(g);
  } else {
    let e = document.getElementById("count_number_DarkPatterns");
    e.value = 0;
  }

  if (!document.getElementById("count_number_Price")) {
    let g = document.createElement("div");
    g.id = "count_number_Price";
    g.value = 0;
    g.style.opacity = 0;
    g.style.position = "fixed";
    document.body.appendChild(g);
  } else {
    let e = document.getElementById("count_number_Price");
    e.value = 0;
  }

  if (!document.getElementById("count_number_Action")) {
    let g = document.createElement("div");
    g.id = "count_number_Action";
    g.value = 0;
    g.style.opacity = 0;
    g.style.position = "fixed";
    document.body.appendChild(g);
  } else {
    let e = document.getElementById("count_number_Action");
    e.value = 0;
  }

  if (!document.getElementById("count_urgency")) {
    let g = document.createElement("div");
    g.id = "count_urgency";
    g.value = 0;
    g.style.opacity = 0;
    g.style.position = "fixed";
    document.body.appendChild(g);
  } else {
    let e = document.getElementById("count_urgency");
    e.value = 0;
  }
}

function scrapTextElements() {
  let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td, a, label');
  let allTexts = [];
  let elementsArray = [];
  let elementsSelectorArray = [];

  textElements.forEach(element => {
    if (element.className.includes("strike") || element.style.textDecoration.includes("line-through")) {
      //console.log("Prix barré");
      highlightprice(element);
    }
    /*else
    {
      element.style.filter = 'grayscale(1)';
    }*/

    for (let i = 0; i < element.attributes.length; i++) {
      const attributeName = element.attributes[i].name;
      if (attributeName.includes("strike")) {
        //console.log("Prix barré");
        highlightprice(element);
      }
      /*else
      {
        element.style.filter = 'grayscale(1)';
      }*/
    }

    if (element.childNodes.length == 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      let textContent = element.textContent.trim();
      let elementType = element.tagName;

      if (textContent.length > 0) {
        allTexts.push(textContent);

        // Store element details
        elementsArray.push({ text: textContent, tag: elementType });
        elementsSelectorArray.push(element);
      }
    }
  });
  return { elementsArray, elementsSelectorArray };
}

async function getTextPrediction(url) {
  // Create arrays to store element details
  let { elementsArray, elementsSelectorArray } = scrapTextElements();

  // Send array of element details to server and retrieve response
  const textResponse = await predictDPWithTextModel({ texts: elementsArray, url: url });

  // Process the response
  textResponse.forEach((result, index) => {
    element = elementsSelectorArray[index];
    elementType = elementsArray[index].tag;
    let category = result.category[0];
    let prediction = result.prediction;

    if (prediction === "1") {
      if (category.length > 0 && category === "Not Dark Pattern") {
        category = "Failed to categorize";
      }
      //console.log(`Balise: ${elementType}, Texte: "${elementsArray[index].text}", Résultat de la prédiction: ${prediction}, Catégorie: ${category}`);

      highlightTextElements(element, category);
    }
    else
    {
      if (element.childNodes.length == 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
        let textContent = element.textContent.trim();
        let elementType = element.tagName;
        console.log(elementType);
  
        if (textContent.length > 0) {
          element.style.filter = 'grayscale(1)';
        }
        
      }

      if(elementType.toLowerCase() == 'button' || elementType == 'img'){
        element.style.filter = 'grayscale(1)';
      }
    }

  });
}

async function getForcedActionPrediction(url){
  const isThereForcedActionPredictionArray = await predictForcedAction(url);
  //console.log(isThereForcedActionPredictionArray);
  
  isThereForcedAction = isThereForcedActionPredictionArray[0];
  confidence = isThereForcedActionPredictionArray[1].toFixed(2);

  switch(isThereForcedAction){
    case "present":
      forcedActionString = "PopUp Analyse : This website is likely to have a forced action with a confidence of " + confidence + "%";
      break;
    case "absent":
      forcedActionString = "PopUp Analyse : This website does not seem to have a forced action with a confidence of " + confidence + "%";
      break;
  }
}

//---When analyze button pressed---// 
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "analyze_site") {
    /*cpt_urgency = 0;
    cpt_obstruction = 0;
    cpt_sneaking = 0;
    cpt_scarcity = 0;
    cpt_misdirection = 0;
    cpt_social = 0;*/
    darkPatternIdentification(request.url)
  }
});

//---When get numbers button pressed---// 
/*chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "number") {
    console.log("request.input : ", request);
    let e1 = document.getElementById("count_number_DarkPatterns");
    let e2 = document.getElementById("count_number_Price");
    let e3 = document.getElementById("count_number_Action");
    //let e4 = document.getElementById("count_urgency");
    sendNumber(e1.value, e2.value, e3.value, cpt_urgency, cpt_obstruction, cpt_sneaking, cpt_scarcity, cpt_misdirection, cpt_social);//e4.value
  }
}
);*/

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.message === "check") {
    //console.log("request.input : ", request);
    const result = await checkDarkPattern(request.input);

    chrome.runtime.sendMessage({ message: "check_complete",  category: result.category, prediction: result.prediction});

  }
}
);
