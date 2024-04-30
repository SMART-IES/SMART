window.onload = function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "open_popup" });
    });
  
    document.getElementsByClassName("analyze-button")[0].onclick = function () {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
      });
    };

    document.getElementsByClassName("number-button")[0].onclick = function () {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "number" });
      });
    };

  };
  
chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "update_number") {
      document.getElementsByClassName("numberDarkPatterns")[0].textContent = request.countDarkPatterns;
      document.getElementsByClassName("numberPrice")[0].textContent = request.countPrice;
      document.getElementsByClassName("numberAction")[0].textContent = request.countAction;
    }
  });