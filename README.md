Web Annotator

Author: Tushar kumar gautam

Abstract:
The Web Annotator Chrome extension aims to enhance users' interaction with web content through powerful annotation tools. This extension allows users to highlight text on any webpage using customizable, color-coded highlights, enabling efficient categorization and organization of significant sections. Users can also attach contextual notes to highlighted content, facilitating the addition of personal insights, comments, or supplementary information for future reference. One of the key features of this extension is the persistence of annotations across browser sessions, ensuring that users can revisit annotated pages with their highlights and notes intact even after closing and reopening the browser. This project report provides an overview of the project’s architecture, features, implementation details, and the technologies used. It highlights the motivation behind the project, the challenges addressed, the novelty and application innovation, as well as the future directions for development. This extension has a variety of applications, including teaching sessions, personal notes, and providing meaningful explanations to others. I've tried my best to make it robust and functional across all systems, screen sizes, and resolutions.

Table of Contents
1.Introduction
2.How a Chrome Extension is Created?
3.Implementation
4.Concluding Remarks
Introduction:
What is a Web Annotator?
In this context, a web annotator is a Chrome extension that enhances user engagement with online content by offering tools for highlighting and annotating text on any webpage. It allows users to mark key sections with customizable color-coded highlights and add personal notes for additional context. These annotations are saved and persist across browser sessions, ensuring users can access their work anytime. The extension also provides features like keyboard shortcuts and a responsive design for optimal use on various devices. It aims to boost efficiency and organization for researchers, students, and professionals.

Motivation for the Project:
When Tinkering Labs released this project, I saw an opportunity to gain hands-on experience in web development, which I had not tried before. It was an enjoyable task that taught me many things throughout its execution. This project is particularly useful for teachers and students to explain and understand online concepts effectively. I also aimed to enhance my JavaScript skills by implementing a variety of functions, which this project allowed. Having never developed a Chrome extension before, I was excited to undertake this project.

Application Domains:
Education: Enhancing the learning experience for students and educators by allowing them to highlight and annotate online course materials, academic papers, and e-books.

Research: Assisting researchers in efficiently marking and taking notes on online journals, articles, and other digital resources, facilitating better organization and retrieval of information.

Professional Use: Helping professionals in various fields to annotate and review online reports, documents, and resources, improving productivity and collaboration.

Personal Knowledge Management: Aiding individuals in bookmarking, highlighting, and annotating web content for personal projects, interests, or daily reading, promoting better knowledge retention and organization.

Collaborative Work: Supporting collaborative annotation and sharing among teams, enabling better communication and idea exchange in academic, professional, and personal contexts.

How a Chrome Extension is Created:
Manifest File (manifest.json)
The manifest file is a JSON file that provides essential information about the extension. It includes details such as the extension’s name, version, description, permissions (e.g., access to tabs, storage, and web requests), content scripts, background scripts, icons, and more. It serves as the roadmap for Chrome to understand how the extension should behave and what resources it requires. Therefore, it is the first file created when making an extension.

Background Script (background.js):
The background script runs in the background and manages the extension’s core functionality. It is specified in the manifest file under the “background” key. This script can listen for events such as tab changes, browser actions, and network requests. It also maintains the extension’s state and handles tasks that do not require user interaction.

Content Script (content.js):
Content scripts are injected into web pages based on specified URL patterns defined in the manifest file. These scripts can interact with the DOM of the web page, modify its content, and communicate with the background script using message passing. Content scripts are often used to enhance or modify the behavior of specific web pages to provide additional functionality.

Popup HTML (popup.html) and Popup Script (popup.js):
If your extension has a browser action or page action that displays a popup when clicked, you will need a popup.html file to define the structure of the popup and a popup.js file to handle its logic. The popup can contain UI elements such as buttons, input fields, or other interactive components. The popup script can interact with the background script and perform actions based on user input.

Icons and Other Assets:
Icons are crucial for representing the extension in the Chrome Web Store and in the browser toolbar. The manifest file specifies various icon sizes for different use cases. Additionally, you may include other assets such as images or CSS files for styling your extension’s UI.

The interaction between the components of a Chrome extension is essential for its seamless operation. Figures 1 and 2 in the original document visually demonstrate how a Chrome extension works, providing a clearer understanding.

Implementation
This project uses the following tech stacks:

HTML: Utilized for creating the structure and layout of the buttons and containers.

CSS: Employed for styling the buttons, containers, and defining their appearance, including hover and active states.

JavaScript: Instrumental in implementing the functionality of the buttons, such as pen drawing, text highlighting, undoing actions, and saving.

This is the default color picker of HTML. It has a wide range of colors for user convenienced.

Functionality Implementation:
Pen Functionality: The 'pen' class is utilized for styling the button representing the pen tool. The pen functionality in this project is implemented through a series of JavaScript functions and event listeners that enable drawing on the canvas using the mouse.

Event Listeners:

canvas.addEventListener('mousedown', startDrawing): This event listener triggers the startDrawing function when the mouse button is pressed down on the canvas, signaling the beginning of a drawing action.
canvas.addEventListener('mousemove', draw): When the mouse is moved over the canvas, the draw function is called to update the drawing based on the current mouse position.
canvas.addEventListener('mouseup', stopDrawing): This event listener detects when the mouse button is released, indicating the end of drawing, and calls the stopDrawing function.
canvas.addEventListener('mouseout', stopDrawing): If the mouse moves out of the canvas area, the stopDrawing function is triggered to ensure drawing stops even if the mouse leaves the canvas.
Drawing Functions:

startDrawing(event): This function is called when the mouse button is pressed down on the canvas. It initializes the drawing process by setting up the initial coordinates for drawing.
draw(event): The draw function is responsible for updating the drawing based on the current position of the mouse. It connects the previous and current mouse positions to create a continuous line as the mouse moves.
stopDrawing(): When the mouse button is released or moves out of the canvas, the stopDrawing function is called to end the drawing action.
Within the draw function, various properties of the 2D rendering context (ctx) are utilized to implement the drawing functionality, such as setting the stroke color, line width, and drawing paths using methods like beginPath, moveTo, lineTo, and stroke. Combining these elements, the pen functionality is achieved by capturing mouse events and updating the canvas based on mouse movement, resulting in a smooth drawing experience.


Text Highlighter Functionality: The 'highlight-btn' class defines the styling of the button representing the text highlighter tool. JavaScript is utilized to implement the text highlighting functionality by detecting user text selection and applying a background color to the selected text or a specific area on a webpage.
![Screenshot 2024-06-10 002540](https://github.com/Tuiitr/w3/assets/172133997/53513f6d-1e76-46d1-b213-0ff7b4526ae6)


Function highlightSelection:

The function starts with a conditional check to ensure that the current tool is set to 'text-highlighter'. If it's not, the function returns early, indicating that the text highlighting functionality should not be executed with a different tool.
The function retrieves the current selection within the document using window.getSelection(). This selection represents the text range that the user has highlighted.
The function checks if the selection is collapsed (i.e., empty or not highlighting any text). If the selection is collapsed, the highlighting process is not initiated.
If the selection is not collapsed, the function proceeds to create a new span element, which will be used to wrap the highlighted text. The span element's background color is set to the current color (currentColor) associated with the highlighting tool.
The function then extracts the contents of the selected range using range.extractContents() and appends them inside the newly created span element. This effectively wraps the highlighted text within the span element.
Once the highlighting is applied, the function removes the selection range using selection.removeAllRanges() to clear the user's selection.
Additionally, it adds an annotation object to an annotations array, containing information about the highlighted text, such as the tool used ('text-highlighter'), the HTML representation of the highlighted span, the XPath of its parent element, and a unique ID for the span.
Function getXPath:

The getXPath function is used to generate an XPath expression for a given DOM element. It handles cases where an element has an ID or needs to be located based on its position within its parent's children. Overall, this implementation captures user-selected text, wraps it in a span element with a specified background color, and stores annotation data for future reference. This allows users to visually highlight and annotate text within the document

Saving Functionality: The saving feature is implemented by writing separate functions for saving and loading annotations. The annotations are stored using the Chrome Storage API, specifically chrome.storage.local. When annotations are saved, they are stored as an object with keys 'annotations' and 'highlights'. The data is saved locally within the extension’s sandboxed storage area, ensuring that the annotations persist even if the user closes or refreshes the webpage. By storing annotations locally, they can be retrieved and displayed whenever needed, providing a seamless user experience in accessing previously made annotations on webpages. However, if the user switches to a different device or clears their browsing data, they will lose all their saved annotations.

Function saveAnnotations:

This function is responsible for saving the annotations array to the local storage. It uses chrome.storage.local.set() to store the annotations.
If an error occurs during the saving process, it logs the error and sends a response indicating the failure.
If the annotations are saved successfully, it logs a success message and sends a response indicating success.
Function loadAnnotations:

This function is used to load the saved annotations from local storage. It retrieves the annotations using chrome.storage.local.get('annotations').
If annotations are successfully loaded, it assigns the retrieved data to the annotations variable and calls a redraw() function (not provided in the code snippet).
Message Listener for Saving and Loading Annotations:

The chrome.runtime.onMessage.addListener() function listens for messages from the content script or other parts of the extension.
If the message action is "saveAnnotation", it saves both annotations and highlights to local storage using chrome.storage.local.set().
If the message action is "loadAnnotations", it retrieves both annotations and highlights from local storage using chrome.storage.local.get(['annotations', 'highlights']) and sends them as a response.


Adding Notes Functionality: This feature allows users to add notes corresponding to any highlighted text. The note becomes visible once you click the highlighted text. The "adding notes" feature works by leveraging event listeners to detect text selection, prompting the user to enter a note, and wrapping the selected text in a span element. This span element stores the highlight color and a unique identifier, allowing for the retrieval and display of notes when the highlighted text is clicked. This functionality is crucial for creating an interactive and informative user experience.

Event Listener Setup:

An event listener is added to the document, specifically listening for click events. This allows for interaction with highlighted text spans.
Checking Target Element:

When a click event occurs, the target element (the element clicked on) is examined. The code checks if the clicked element is a span and has the attribute 'highlight-id', indicating it's a highlighted text span.
Retrieving Highlight ID:

If the clicked element is a highlighted text span, its 'highlight-id' attribute value is retrieved. This ID serves as a unique identifier for the highlighted text.
Finding Highlight Object:

Using the retrieved highlight ID, the code searches for the corresponding highlight object in the highlights array. The highlight object contains information about the highlighted text, including any associated notes.
Displaying the Note:

If a highlight object is found and it has a note associated with it, an alert message is displayed. The alert message shows the note associated with the highlighted text.

Concluding Remarks:

Starting this project as a newbie in web development has been quite a journey. Creating a web annotator Chrome extension has been a mix of learning and experimentation. Even though I'm still learning, building this extension has been a lot of fun. The idea behind the extension is to provide a handy tool for organizing online research. It has features like drawing on web pages, highlighting text, jotting down notes, and saving useful information. The current version of the extension has a few bugs and glitches that might cause issues on certain devices. However, I am working hard to resolve these issues and make it run smoother.

One challenge has been that the extension only uses JavaScript for its backend, without an external database to store and retrieve data, which could limit future capabilities. I am looking into ways to improve this and make the extension even better.

Overall, this project has been a journey of learning and growth. With each bug fixed and feature added, I am getting closer to creating something truly useful.








