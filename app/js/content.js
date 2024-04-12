

function scrape() {
    if(document.getElementById("count_number")) {
        return;
    }

    let count = 0;
    let elements = document;

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

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "analyze_site") {
      scrape();
    } else if (request.message === "open_popup") {
      let element = document.getElementById("count_number");
      if (element) {
        sendNumber(element.value);
      }
    }
  });