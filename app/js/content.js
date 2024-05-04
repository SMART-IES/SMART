var cpt_urgency = 0;
var cpt_obstruction = 0;
var cpt_sneaking = 0;
var cpt_scarcity = 0;
var cpt_misdirection = 0;
var cpt_social = 0;


function sendNumber(countDarkPatterns, countPrice, countAction, countUrgency, countObs, countSneak, countScar, countMisdir, countSocial) {
  chrome.runtime.sendMessage({ message: "update_number", 
  countDarkPatterns: countDarkPatterns, 
  countPrice: countPrice, 
  countAction: countAction, 
  countUrgency: countUrgency,
  countObs: countObs,
  countSneak: countSneak,
  countScar: countScar,
  countMisdir: countMisdir,
  countSocial: countSocial
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
  //element.style.backgroundColor = 'yellow';
  if (category === "Urgency") {
    element.style.backgroundColor = "#FB9CFC";
    cpt_urgency++;
    console.log("cpt urgency : ", cpt_urgency);
    let f = document.getElementById("count_urgency");
    f.value++;
    console.log("f value : ", f.value);
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
  console.log("End of detection");

  // Send message to update number
  let e1 = document.getElementById("count_number_DarkPatterns");
  let e2 = document.getElementById("count_number_Price");
  let e3 = document.getElementById("count_number_Action");
  //let e4 = document.getElementById("count_urgency");
  sendNumber(e1.value, e2.value, e3.value, (cpt_urgency + e2.value), cpt_obstruction, cpt_sneaking, cpt_scarcity, cpt_misdirection, cpt_social);
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
      console.log("Prix barré");
      highlightprice(element);
    }

    for (let i = 0; i < element.attributes.length; i++) {
      const attributeName = element.attributes[i].name;
      if (attributeName.includes("strike")) {
        console.log("Prix barré");
        highlightprice(element);
      }
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
      console.log(`Balise: ${elementType}, Texte: "${elementsArray[index].text}", Résultat de la prédiction: ${prediction}, Catégorie: ${category}`);

      highlightTextElements(element, category);
    }
  });
}

async function getForcedActionPrediction(url){
  const isThereForcedAction = await predictForcedAction(url);
}

//---When analyze button pressed---// 
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "analyze_site") {
    cpt_urgency = 0;
    cpt_obstruction = 0;
    cpt_sneaking = 0;
    cpt_scarcity = 0;
    cpt_misdirection = 0;
    cpt_social = 0;
    darkPatternIdentification(request.url)
  }
});

//---When get numbers button pressed---// 
/*chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "number") {

    let e1 = document.getElementById("count_number_DarkPatterns");
    let e2 = document.getElementById("count_number_Price");
    let e3 = document.getElementById("count_number_Action");
    let e4 = document.getElementById("count_urgency");
    sendNumber(e1.value, e2.value, e3.value, cpt_urgency, cpt_obstruction, cpt_sneaking, cpt_scarcity, cpt_misdirection, cpt_social);//e4.value
  }
}
);*/

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.message === "check") {
    console.log("request.input : ", request);
    const result = await checkDarkPattern(request.input);

    chrome.runtime.sendMessage({ message: "check_complete",  category: result.category, prediction: result.prediction});

  }
}
);





