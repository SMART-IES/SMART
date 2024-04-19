let bob = 0

//---Test : count text elements number---// 
function scrape() {
    if(document.getElementById("count_number")) {
        return;
    }

    let count = 0;
    let elements = document.getElementsByTagName("div");

    for (let i = 0; i < elements.length; i++) {
        count += 1; 
    }

    let g = document.createElement("div");
    g.id = "count_number";
    g.value = count;
    g.style.opacity = 0;
    g.style.position = "fixed";
    document.body.appendChild(g);
    sendNumber(g.value);
    }

function sendNumber(count) {
    chrome.runtime.sendMessage({ message: "update_number", count: count });
}

//---Request on AI python API server.py---// 
async function predictWithModel(data) {
  const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)  // Les données à envoyer au serveur
  });
  const result = await response.json();  // Récupérer les résultats de la prédiction
  return result.prediction;
}

function highlightTextElements(element) {
      element.style.backgroundColor = 'yellow';
}

function darkPatternIdentification() {
  let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td, a');
  let allTexts = [];

  //recup all elements 
  textElements.forEach(element => {
      let textContent = element.textContent.trim();
      if (textContent.length > 0) {
          allTexts.push(textContent);

          //dark pattern or not 
          predictWithModel({texte: textContent}).then(prediction => {
            if(prediction[0] == "Yes" ){
              //highlight if yes
              highlightTextElements(element)
            }
          });
      }
  });

  return allTexts;
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "analyze_site") {
      scrape();
      darkPatternIdentification()
    } else if (request.message === "open_popup") {
      let element = document.getElementById("count_number");
      if (element) {
        sendNumber(element.value);
      }
    }
  });