//---Test : count function---// 
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

//---Scrap all text elements---// 
function getAllTextElements() {
  let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, td, a');
  let allTexts = [];

  textElements.forEach(element => {
      let textContent = element.textContent.trim();
      if (textContent.length > 0) {
          allTexts.push(textContent);
      }
  });

  return allTexts;
}

function highlightTextElements(allTexts) {
  allTexts.forEach(text => {
    let elements = document.querySelectorAll('h2');
    elements.forEach(element => {
      element.style.backgroundColor = 'yellow';
    });
  });
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "analyze_site") {
      scrape();
      let allTextElements = getAllTextElements();
      highlightTextElements(allTextElements);
    } else if (request.message === "open_popup") {
      let element = document.getElementById("count_number");
      if (element) {
        sendNumber(element.value);
      }
    }
  });