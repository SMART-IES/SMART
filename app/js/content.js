

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
    body: JSON.stringify(data)
  });
  const result = await response.json();
  return result.prediction;
}

function highlightTextElements(element) {
  element.style.backgroundColor = 'yellow';
  let e = document.getElementById("count_number");
  e.value++;
}

function highlightprice(element) {
  element.style.backgroundColor = 'red';
  let e = document.getElementById("count_number");
  e.value++;
}

function darkPatternIdentification() {
  let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td, a, label');
  let allTexts = [];

  if (!document.getElementById("count_number")) {
    let g = document.createElement("div");
    g.id = "count_number";
    g.value = 0;
    g.style.opacity = 0;
    g.style.position = "fixed";
    document.body.appendChild(g);
  } else {
    let e = document.getElementById("count_number");
    e.value = 0;
  }


  //recup all elements 
  textElements.forEach(element => {
    if (element.childNodes.length == 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      let textContent = element.textContent.trim();
      let elementType = element.tagName;

      if (textContent.length > 0) {
        allTexts.push(textContent);
        // prix barre
        if (element.className.includes("strike")) {
          console.log("Prix barré");
          highlightprice(element);
        }
      
        //dark pattern or not 
        predictWithModel({ text: textContent }).then(result => {
          //(display of process on consol)

          console.log(`Balise: ${elementType}, Texte: "${textContent}", Résultat de la prédiction: ${result}`);
          if (result === "1") {
            //highlight if yes
            console.log("surligné");

            highlightTextElements(element)
          }
        });
        
      }
    }

  });


  return allTexts;
}


chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "analyze_site") {
    darkPatternIdentification()
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "number") {

    let e = document.getElementById("count_number");
    sendNumber(e.value);
  }
}
);





