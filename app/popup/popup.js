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
      while (divOuverture.firstChild) {
        divOuverture.removeChild(divOuverture.firstChild);
      }

      // Create a new image element for the loading GIF
      var loadingImage = document.createElement("img");
      loadingImage.src = "load.gif";
      loadingImage.classList.add('center-img');
      loadingImage.id = "loading-image"; // Set the ID here

      // Create div
      var divLogo = document.createElement("div");
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
      
      //Hide buttons
      //button.setAttribute("style", "text-align: center; display: none;")
      

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
      document.getElementById("count_urgency").textContent = countUrgency;
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
        finishImage.src = "finish.gif";
        finishImage.id = "finish-image"; // Set the ID here


        // Append the image just below the button
        loadingImage.parentNode.insertBefore(finishImage, loadingImage.nextSibling);
        loadingImage.parentNode.removeChild(loadingImage);
    }
  }

});

function info(){
  //var el = document.getElementById();
}
