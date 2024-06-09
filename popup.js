document.addEventListener('DOMContentLoaded', function () {
  const highlighterBtn = document.getElementById('highlighter-btn');
  const colorPickerContainer = document.getElementById('color-picker-container');

  highlighterBtn.addEventListener('click', () => {
    colorPickerContainer.style.display = 'flex';
  });

  document.querySelectorAll('.color-selector-btn').forEach(button => {
    button.addEventListener('click', () => {
      const currentColor = button.getAttribute('data-color');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "highlighter-btn", color: currentColor }, (response) => {
          console.log("Message sent to content script");
        });
      });
    });
  });

  colorPickerContainer.addEventListener('mouseleave', () => {
    colorPickerContainer.style.display = 'none';
  });
});
