let activeTool = null;
let selectedColor = 'yellow';
let drawingRecords = [];
let notes = [];
let canvasElement, canvasContext, isDrawingActive = false, startX, startY, currentPath = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pen") {
    activatePen();
  } else if (message.action === "highlight-btn") {
    selectedColor = message.color || 'yellow';
    activateHighlighter();
  } else if (message.action === "undo-btn") {
    undoLastAction();
  } else if (message.action === "save-btn") {
    saveDrawings();
  } else if (message.action === "save-note") {
    saveNoteContent(message.content, sendResponse);
  }
  return true;
});

function saveNoteContent(content, sendResponse) {
  notes.push(content);
  chrome.storage.local.set({ notes: notes }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving note:", chrome.runtime.lastError);
      sendResponse({ status: "failure" });
    } else {
      sendResponse({ status: "success" });
    }
  });
}

function activatePen() {
  activeTool = 'pen';
  if (!canvasElement) {
    createCanvasElement();
  }
}

function deleteCanvasElement() {
  if (canvasElement) {
    canvasElement.parentNode.removeChild(canvasElement);
    canvasElement.removeEventListener('mousedown', initiateDrawing);
    canvasElement.removeEventListener('mousemove', drawOnCanvas);
    canvasElement.removeEventListener('mouseup', endDrawing);
    canvasElement.removeEventListener('mouseout', endDrawing);
    canvasElement = null;
    canvasContext = null;
    drawingRecords = [];
  }
}

function activateHighlighter() {
  deleteCanvasElement();
  activeTool = 'text-highlighter';
  document.addEventListener('mouseup', applyHighlight);
}

function createCanvasElement() {
  canvasElement = document.createElement('canvas');
  canvasElement.style.position = 'absolute';
  canvasElement.style.top = '0';
  canvasElement.style.left = '0';
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  document.body.appendChild(canvasElement);
  canvasContext = canvasElement.getContext('2d');

  canvasElement.addEventListener('mousedown', initiateDrawing);
  canvasElement.addEventListener('mousemove', drawOnCanvas);
  canvasElement.addEventListener('mouseup', endDrawing);
  canvasElement.addEventListener('mouseout', endDrawing);

  loadDrawings();
}

function initiateDrawing(e) {
  if (activeTool !== 'pen') return;
  isDrawingActive = true;
  startX = e.clientX;
  startY = e.clientY;
  currentPath = [{ x: startX, y: startY }];
}

function drawOnCanvas(e) {
  if (!isDrawingActive) return;

  canvasContext.strokeStyle = selectedColor;
  canvasContext.lineWidth = 2;
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";

  const x = e.clientX;
  const y = e.clientY;
  canvasContext.beginPath();
  canvasContext.moveTo(startX, startY);
  canvasContext.lineTo(x, y);
  canvasContext.stroke();
  canvasContext.closePath();

  startX = x;
  startY = y;
  currentPath.push({ x: startX, y: startY });
}

function endDrawing() {
  if (!isDrawingActive) return;
  isDrawingActive = false;
  drawingRecords.push(currentPath);
  currentPath = [];
}

function applyHighlight() {
  if (activeTool !== 'text-highlighter') return;

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  // Check if the range contains only text nodes
  const containsOnlyText = range.cloneContents().querySelectorAll(':not(text)').length === 0;

  if (!containsOnlyText) {
    console.error("Error: Range contains non-text nodes.");
    return;
  }

  const highlightSpan = document.createElement('span');
  highlightSpan.style.backgroundColor = selectedColor;

  try {
    range.surroundContents(highlightSpan);
    selection.removeAllRanges();

    // Store the highlight information for undo purposes
    const parentXPath = generateXPath(range.commonAncestorContainer);
    drawingRecords.push({ tool: 'text-highlighter', color: selectedColor, parentXPath, html: highlightSpan.outerHTML });
  } catch (error) {
    console.error("Error applying highlight:", error);
  }
}

function generateXPath(element) {
  if (element.id !== '') return 'id("' + element.id + '")';
  if (element === document.body) return element.tagName;
  let index = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) return generateXPath(element.parentNode) + '/' + element.tagName + '[' + (index + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) index++;
  }
}

function undoLastAction() {
  if (drawingRecords.length > 0) {
    const lastDrawing = drawingRecords.pop();
    redrawCanvas();
    if (lastDrawing.tool === 'text-highlighter') {
      const parent = document.evaluate(lastDrawing.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (parent) {
        const spans = parent.querySelectorAll(`span[style="background-color: ${lastDrawing.color};"]`);
        spans.forEach(span => {
          const text = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(text, span);
        });
      }
    }
  }
}

function redrawCanvas() {
  if (canvasContext) {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    drawingRecords.forEach(drawing => {
      if (drawing.tool === 'pen') {
        canvasContext.strokeStyle = selectedColor;
        canvasContext.lineWidth = 2;
        canvasContext.globalAlpha = 1.0;
        canvasContext.beginPath();
        canvasContext.moveTo(drawing.startX, drawing.startY);
        canvasContext.lineTo(drawing.endX, drawing.endY);
        canvasContext.stroke();
      } else if (drawing.tool === 'text-highlighter') {
        const parent = document.evaluate(drawing.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (parent) {
          const span = document.createElement('span');
          span.style.backgroundColor = drawing.color;
          span.innerHTML = drawing.html;
          parent.appendChild(span);
        }
      }
    });
  }
}

function saveDrawings() {
  chrome.storage.local.set({ drawingRecords: drawingRecords }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving drawings:", chrome.runtime.lastError);
    } else {
      console.log("Drawings saved successfully.");
    }
  });
}

function loadDrawings() {
  chrome.storage.local.get('drawingRecords', (result) => {
    if (result.drawingRecords) {
      drawingRecords = result.drawingRecords;
      redrawCanvas();
    }
  });
}