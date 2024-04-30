//---Send current number of dark patterns and price tags---// 
function sendNumber(countDarkPatterns, countPrice) {
  chrome.runtime.sendMessage({ message: "update_number", countDarkPatterns: countDarkPatterns, countPrice: countPrice });
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
  return result.prediction;
}

//---Highligh text elements---// 
function highlightTextElements(element) {
  element.style.backgroundColor = 'yellow';
  element.style.borderColor = 'black';
  element.style.borderWidth = '2px';
  let e = document.getElementById("count_number_DarkPatterns");
  e.value++;
}

//---Highligh price elements---// 
function highlightprice(element) {
  element.style.backgroundColor = 'red';
  element.style.borderColor = 'black';
  element.style.borderWidth = '2px';
  let e = document.getElementById("count_number_Price");
  e.value++;
}

//---Identify dark patterns with the model---// 
function darkPatternIdentification() {
  let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td, a, label');
  let allTexts = [];

  // Create a Promise that resolves when all predictions are complete
  const predictionPromises = [];

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



  //recup all elements 
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
        // prix barre


        //dark pattern or not 
        // Create a Promise for each prediction
        const predictionPromise = predictWithModel({ text: textContent }).then(result => {
          //(display of process on consol)
          console.log(`Balise: ${elementType}, Texte: "${textContent}", Résultat de la prédiction: ${result}`);
          if (result === "1") {
            //highlight if yes
            console.log("surligné");

            highlightTextElements(element)
          }
        });
        predictionPromises.push(predictionPromise);
      }
    }

  });


  return Promise.all(predictionPromises).then(() => {
    
    chrome.runtime.sendMessage({ message: "tasks_complete" });
    console.log("End of detection");
    return allTexts;
});
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
    sendNumber(e1.value, e2.value);
  }
}
);





