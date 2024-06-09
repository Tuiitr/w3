let annotCanvas = null;
let annotCtx = null;
let annotations = [];
let currentTool = null;
let isDrawing = false;
let path = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pen-tool") {
    activateMarker();
  } else if (message.action === "highlighter-btn") {
    currentColor = message.color || 'yellow';
    activateHighlighter();
  } else if (message.action === "undo-action-btn") {
    undoLastAction();
  } else if (message.action === "save-action-btn") {
    console.log("Saving annotations");
    saveAnnotations();
  }
});

function activateMarker() {
  currentTool = 'pen-tool';
  if (!annotCanvas) {
    createCanvas();
  }
}

function deleteCanvas() {
  if (annotCanvas) {
    annotCanvas.parentNode.removeChild(annotCanvas);
    annotCanvas.removeEventListener('mousedown', startDrawing);
    annotCanvas.removeEventListener('mousemove', draw);
    annotCanvas.removeEventListener('mouseup', stopDrawing);
    annotCanvas.removeEventListener('mouseout', stopDrawing);
    annotCanvas = null;
    annotCtx = null;
    annotations = [];
  }
}

function activateHighlighter() {
  deleteCanvas();
  currentTool = 'text-highlighter';
  document.addEventListener('mouseup', highlightSelection);
}

function createCanvas() {
  annotCanvas = document.createElement('canvas');
  annotCanvas.style.position = 'absolute';
  annotCanvas.style.top = '0';
  annotCanvas.style.left = '0';
  annotCanvas.width = window.innerWidth;
  annotCanvas.height = window.innerHeight;
  document.body.appendChild(annotCanvas);
  annotCtx = annotCanvas.getContext('2d');

  annotCanvas.addEventListener('mousedown', startDrawing);
  annotCanvas.addEventListener('mousemove', draw);
  annotCanvas.addEventListener('mouseup', stopDrawing);
  annotCanvas.addEventListener('mouseout', stopDrawing);

  loadAnnotations();
}

function startDrawing(e) {
  if (currentTool !== 'pen-tool') return;
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
  path = [{ x: startX, y: startY }];
}

function draw(e) {
  if (!isDrawing) return;

  annotCtx.strokeStyle = currentColor;
  annotCtx.lineWidth = 2;
  annotCtx.lineCap = 'round';
  annotCtx.globalAlpha = 1.0;

  annotCtx.beginPath();
  annotCtx.moveTo(startX, startY);
  annotCtx.lineTo(e.clientX, e.clientY);
  annotCtx.stroke();

  annotations.push({ tool: 'pen-tool', color: currentColor, startX, startY, endX: e.clientX, endY: e.clientY });

  startX = e.clientX;
  startY = e.clientY;
  path.push({ x: startX, y: startY });
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  if (path.length > 1) {
    annotations.push({ tool: currentTool, color: currentColor, path: path });
  }
}

function saveAnnotations() {
  chrome.storage.local.set({ annotations: annotations }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving annotations:", chrome.runtime.lastError);
    } else {
      console.log("Annotations saved successfully");
    }
  });
}

function loadAnnotations() {
  chrome.storage.local.get('annotations', (data) => {
    if (chrome.runtime.lastError) {
      console.error("Error loading annotations:", chrome.runtime.lastError);
    } else {
      annotations = data.annotations || [];
      redraw();
    }
  });
}

function redraw() {
  if (annotCtx) {
    annotCtx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);
    annotations.forEach(annotation => {
      if (annotation.tool === 'pen-tool') {
        annotCtx.strokeStyle = annotation.color;
        annotCtx.lineWidth = 2;
        annotCtx.globalAlpha = 1.0;
        annotCtx.beginPath();
        annotCtx.moveTo(annotation.startX, annotation.startY);
        annotCtx.lineTo(annotation.endX, annotation.endY);
        annotCtx.stroke();
      } else if (annotation.tool === 'text-highlighter') {
        // Handle text highlighting
      }
    });
  }
}

function highlightSelection() {
  if (currentTool !== 'text-highlighter') return;
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = currentColor;
    span.id = 'highlighter-' + new Date().getTime();
    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();

    annotations.push({ tool: 'text-highlighter', html: span.outerHTML, parentXPath: getXPath(span.parentNode), id: span.id });
  }
}

function getXPath(element) {
  if (element.id !== '') return 'id("' + element.id + '")';
  if (element === document.body) return element.tagName;
  let ix = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) return getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

function undoLastAction() {
  if (annotations.length > 0) {
    const lastAnnotation = annotations.pop();
    redraw();
    // Handle undo action based on the tool type
    if (lastAnnotation.tool === 'text-highlighter') {
      const parent = document.evaluate(lastAnnotation.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (parent) {
        const spans = parent.querySelectorAll(`span[id="${lastAnnotation.id}"]`);
        spans.forEach(span => {
          const text = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(text, span);
        });
      }
    }
  }
}
