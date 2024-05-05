// Listen for messages from background script

chrome.runtime.onMessage.addListener(function (request) {
    console.log("Dans fonction update number");
    if (request.message === "update_number") {
      console.log("Dans if fonction update number");
      document.getElementsByClassName("numberDarkPatterns")[0].textContent = request.countDarkPatterns;
      document.getElementsByClassName("numberPrice")[0].textContent = request.countPrice;
      document.getElementsByClassName("numberAction")[0].textContent = request.countAction;
  
      // Remplir counts
      console.log("Dans le if");
      document.getElementsByClassName("count_forced_action")[0].textContent = request.countAction;
      document.getElementsByClassName("count_urgency")[0].textContent = request.countUrgency;
      document.getElementsByClassName("count_obstruction")[0].textContent = request.countObs;
      document.getElementsByClassName("count_sneaking")[0].textContent = request.countSneak;
      document.getElementsByClassName("count_scarcity")[0].textContent = request.countScar;
      document.getElementsByClassName("count_misdirection")[0].textContent = request.countMisdir;
      document.getElementsByClassName("count_social_proof")[0].textContent = request.countSocial;
  
      console.log("countMisdir : ", request.countMisdir);
    
    }
  });
    
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "tasks_complete") {
      var logo2 = document.getElementById("divLogo").style.display;
      var loadIm = document.getElementById("loading-image").style.display;
      document.getElementById("ouverture").removeChild(logo2);
      document.getElementById("ouverture").removeChild(loadIm);
  
      document.getElementById("terminer").style.display = "block";
    }
  
  });
  
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "check_complete") {
      var result = document.getElementById("result");
      if(request.prediction === "1") {
        result.style.color = "red";
        result.textContent = "dark pattern :" + request.category;
      } else {
        result.style.color = "green";
        result.textContent = "no dark pattern detected";
      }
    }
  });

/*
"manifest_version": 3,
    "name": "SMART",
    "version": "1.0",
    "description": "SMART",
    "background": {
        "service_worker": "js/background-messages.js"
    },
    "action": {
        "default_popup": "popup/popup.html"
    },
*/