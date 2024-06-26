
window.onload = function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "open_popup" });
    });
  
    document.getElementsByClassName("analyze-button")[0].onclick = function () {
      // Check if a loading GIF already exists
      var existingLoadingImage = document.getElementById("loading-image");
  
      // If a loading GIF already exists, remove it
      if (existingLoadingImage) {
        existingLoadingImage.parentNode.removeChild(existingLoadingImage);
      }
  
      var divOuverture = document.getElementById("ouverture");
  
      // Remove all child elements
      /*while (divOuverture.firstChild) {
        divOuverture.removeChild(divOuverture.firstChild);
      }*/
  
      //Hide buttons
      /*var button = document.getElementsByClassName("button-container")[0];
      button.style.display = none;*/
      document.getElementsByClassName("modal-header")[0].style.display = "none";
      document.getElementsByClassName("button-container")[0].style.display = "none";
  
      document.getElementsByClassName("detection")[0].style.display = "block";
  
  
      // Create a new image element for the loading GIF
      var loadingImage = document.createElement("img");
      loadingImage.src = "loading.webp";
      loadingImage.width = 100;
      loadingImage.height = 100;
      loadingImage.classList.add('center-img');
      loadingImage.id = "loading-image"; // Set the ID here
  
      // Create div
      var divLogo = document.createElement("div");
      divLogo.id = "divLogo";
      divLogo.style.display = 'flex';
      divLogo.style.justifyContent = 'center';
  
      // Create logomini
      var miniLogo = document.createElement("img");
      miniLogo.src = "logo_mini.png";
  
      // Create textDiv
      var textDiv = document.createElement("div");
      textDiv.classList.add('text-subtitle');
  
      // Create texte
      var textLogo = document.createTextNode("LA LANTERNE");
      textDiv.appendChild(textLogo);
  
      divLogo.appendChild(miniLogo);
      divLogo.appendChild(textDiv);
  
      divOuverture.appendChild(divLogo);
  
      // Append the image just below the buttons
      divOuverture.appendChild(loadingImage);
  
  
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site", url: tabs[0].url });
      });
    };
  
    /*document.getElementsByClassName("number-button")[0].onclick = function () {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        
        chrome.tabs.sendMessage(tabs[0].id, { message: "number" });
      });
    };*/
  
    document.getElementsByClassName("check-button")[0].onclick = function () {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var input = document.getElementById("input").value;
        chrome.tabs.sendMessage(tabs[0].id, { message: "check", input: input });
      }
      );
    };
  
    //-----------------------------------------------
    // Show darks patterns definitions
    document.getElementById("urgency").addEventListener("click", function () {
      info("urgencyInfo");
    });
  
    document.getElementById("obstruction").addEventListener("click", function () {
      info("obstructionInfo");
    });
  
    document.getElementById("sneaking").addEventListener("click", function () {
      info("sneakingInfo");
    });
  
    document.getElementById("forced").addEventListener("click", function () {
      info("forcedInfo");
    });
  
    document.getElementById("scarcity").addEventListener("click", function () {
      info("scarcityInfo");
    });
  
    document.getElementById("misdirection").addEventListener("click", function () {
      info("misdirectionInfo");
    });
  
    document.getElementById("social").addEventListener("click", function () {
      info("socialInfo");
    });
  
    document.getElementById("closeIcon").addEventListener("click", function () { // marche pas encore après exécution
      document.getElementsByClassName("detection")[0].style.display = "none";
      document.getElementById("divLogo").style.display = "none";//nouvelle lanterne
      document.getElementById("loading-image").style.display = "none"; //load
  
      document.getElementsByClassName("modal-header")[0].style.display = "block";
      document.getElementsByClassName("button-container")[0].style.display = "block";
    });
};
   
chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "update_number") {
    updateNumbers(request);
    }
});
  
  // Listen for messages from background script
  
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "tasks_complete") {
      // Remove the loading GIF
      var loadingImage = document.getElementById("loading-image");
      if (loadingImage) {
        // Create a new image element for the loading GIF
        var finishImage = document.createElement("img");
        finishImage.classList.add('center-img');
        finishImage.src = "finish.gif";
        finishImage.id = "finish-image"; // Set the ID here
  
  
        // Append the image just below the button
        loadingImage.parentNode.insertBefore(finishImage, loadingImage.nextSibling);
        loadingImage.parentNode.removeChild(loadingImage);
  
      }
    }
  
  });
  
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "check_complete") {
      var result = document.getElementById("result");
      if (request.prediction === "1") {
        result.style.color = "red";
        result.textContent = "dark pattern :" + request.category;
      } else {
        result.style.color = "green";
        result.textContent = "no dark pattern detected";
      }
    }
  });
  
  
  function updateNumbers(request) {
    document.getElementsByClassName("numberDarkPatterns")[0].textContent = request.countDarkPatterns;
    document.getElementsByClassName("numberPrice")[0].textContent = request.countPrice;
    //document.getElementsByClassName("numberAction")[0].textContent = request.countAction;
    document.getElementsByClassName("forcedActionString")[0].textContent = request.forcedActionString;
    
    document.getElementsByClassName("count_forced_action")[0].textContent = request.countAction;
    document.getElementsByClassName("count_urgency")[0].textContent = request.countUrgency;
    document.getElementsByClassName("count_obstruction")[0].textContent = request.countObs;
    document.getElementsByClassName("count_sneaking")[0].textContent = request.countSneak;
    document.getElementsByClassName("count_scarcity")[0].textContent = request.countScar;
    document.getElementsByClassName("count_misdirection")[0].textContent = request.countMisdir;
    document.getElementsByClassName("count_social_proof")[0].textContent = request.countSocial;
  }
  
  
  function info(elementId){
    var x = document.getElementById(elementId);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }