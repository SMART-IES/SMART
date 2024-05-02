
var cpt_urgency = 0;

function sendNumber(countDarkPatterns, countPrice, countAction, countUrgency) {
  chrome.runtime.sendMessage({ message: "update_number", countDarkPatterns: countDarkPatterns, countPrice: countPrice, countAction: countAction});
}

//---Request on AI python API server.py---// 
async function predictWithModel(data) {
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result;
}


//---Highligh text elements---// 
function highlightTextElements(element, category) {
  element.style.backgroundColor = 'yellow';
  element.style.borderColor = 'black';
  element.style.borderWidth = '2px';

  let e = document.getElementById("count_number_DarkPatterns");
  e.value++;
  console.log("category ", category);
  if (category ==='Urgency') {
    cpt_urgency++;
  }
}

//---Highligh price elements---// 
function highlightprice(element) {
  element.style.backgroundColor = 'red';
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


async function darkPatternIdentification() {
  let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td, a, label');
  let allTexts = [];

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
    let f = document.getElementById("urgency"); 
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


  // Create arrays to store element details
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

        if (textContent.includes("email") || textContent.includes("Email") || textContent.includes("e-mail") || textContent.includes("E-mail") || textContent.includes("mail") || textContent.includes("Mail") || textContent.includes("contact") || textContent.includes("Contact") || textContent.includes("phone") || textContent.includes("Phone") || textContent.includes("telephone") || textContent.includes("Telephone") || textContent.includes("Téléphone") || textContent.includes("téléphone")) {
          highlightAction(element);
          console.log("Forced action");
        }

        // Store element details
        elementsArray.push({ text: textContent, tag: elementType });
        elementsSelectorArray.push(element)
      }
    }
  });

  // Send array of element details to server
  const response = await predictWithModel({ texts: elementsArray });

  // Process the response
  response.forEach((result, index) => {
    element = elementsSelectorArray[index];
    elementType = elementsArray[index].tag;

    let category = result.category[0];
    let prediction = result.prediction;
    
    if (prediction === "1") {
      if (category.length > 0 && category === "Not Dark Pattern") {
        category = "Failed to categorize";
      }
      console.log(`Balise: ${elementType}, Texte: "${elementsArray[index].text}", Résultat de la prédiction: ${prediction}, Catégorie: ${category}`);
      
      highlightTextElements(element);
    }

  });

  // Update UI or send message to background script
  chrome.runtime.sendMessage({ message: "tasks_complete" });
  console.log("End of detection");
}


//---When analyze button pressed---// 
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "analyze_site") {
    darkPatternIdentification()
  }
});

//---When get numbers button pressed---// 
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "number") {

    let e1 = document.getElementById("count_number_DarkPatterns");
    let e2 = document.getElementById("count_number_Price");
    let e3 = document.getElementById("count_number_Action");
    let e4 = document.getElementById("count_urgency");
    sendNumber(e1.value, e2.value, e3.value, e4.value);
  }
}
);





