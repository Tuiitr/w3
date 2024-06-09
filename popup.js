document.getElementById('activate-pen').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "pen" });
    });
  });
  
  document.getElementById('activate-highlighter').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "highlight-btn" });
    });
  });
  
  document.getElementById('save-drawings').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "save-btn" });
    }); 
  }); 
  
  document.getElementById('undo-action').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "undo-btn" });
    });
  });
  
  document.getElementById('activate-highlighter').addEventListener('click', () => {
    document.getElementById('color-picker-container').style.display = 'flex';
  });
  
  document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', () => {
      const selectedColor = button.getAttribute('data-color');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "highlight-btn", color: selectedColor });
      });
    });
  });