// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Web Annotator Extension installed");
  });
  
  // Listener for messages from other parts of the extension (e.g., content scripts or popup)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeData") {
      // Attempt to save notes and highlights to local storage
      try {
        chrome.storage.local.set(
          { notes: message.notesContent, highlights: message.highlightContent },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Error storing data:", chrome.runtime.lastError);
              sendResponse({ status: "failure", message: chrome.runtime.lastError });
            } else {
              console.log("Data stored successfully");
              sendResponse({ status: "success" });
            }
          }
        );
      } catch (error) {
        console.error("Error storing data:", error);
        sendResponse({ status: "failure", message: error.message });
      }
      return true; // Indicates that sendResponse will be called asynchronously
    } else if (message.action === "retrieveData") {
      // Load notes and highlights from local storage
      chrome.storage.local.get(['notes', 'highlights'], (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error retrieving data:", chrome.runtime.lastError);
          sendResponse({ status: "failure", message: chrome.runtime.lastError });
        } else {
          sendResponse({ status: "success", notes: result.notes, highlights: result.highlights });
        }
      });
      return true; // Indicates that sendResponse will be called asynchronously
    }
  });