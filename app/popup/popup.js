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

      // Create a new image element for the loading GIF
      var loadingImage = document.createElement("img");
      loadingImage.src = "load.gif";
      loadingImage.id = "loading-image"; // Set the ID here


      // Append the image just below the button
      var button = document.getElementsByClassName("analyze-button")[0];
      button.parentNode.insertBefore(loadingImage, button.nextSibling);

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
