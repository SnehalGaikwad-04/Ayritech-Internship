// Default mode is Landscape
let certificateMode = "landscape";
let canvasHistory = [];
let historyIndex = -1;
let currentZoom = 1;

// A4 dimensions in pixels (at 96 DPI)
const A4_PORTRAIT_WIDTH = 595;
const A4_PORTRAIT_HEIGHT = 842;
const A4_LANDSCAPE_WIDTH = 842;
const A4_LANDSCAPE_HEIGHT = 595;

// Initialize Fabric.js Canvas
let canvas = new fabric.Canvas("certificateCanvas", {
  width: A4_LANDSCAPE_WIDTH,
  height: A4_LANDSCAPE_HEIGHT,
  backgroundColor: "#fff",
});

// Function to update canvas size
function updateCanvasSize(mode) {
  certificateMode = mode;
  if (mode === "portrait") {
    canvas.setWidth(A4_PORTRAIT_WIDTH);
    canvas.setHeight(A4_PORTRAIT_HEIGHT);
  } else {
    canvas.setWidth(A4_LANDSCAPE_WIDTH);
    canvas.setHeight(A4_LANDSCAPE_HEIGHT);
  }
  canvas.renderAll();
}

// Save canvas state for undo
function saveCanvasState() {
  if (historyIndex < canvasHistory.length - 1) {
    canvasHistory = canvasHistory.slice(0, historyIndex + 1);
  }
  canvasHistory.push(JSON.stringify(canvas));
  historyIndex++;
}

// Create the zoom control elements
function createZoomControls() {
  // Create container for zoom controls
  const zoomControlsContainer = document.createElement("div");
  zoomControlsContainer.className = "zoom-controls";

  // Create label
  const zoomLabel = document.createElement("span");
  zoomLabel.textContent = "Zoom: ";
  zoomControlsContainer.appendChild(zoomLabel);

  // Create zoom value display
  const zoomValue = document.createElement("span");
  zoomValue.id = "zoom-value";
  zoomValue.textContent = "100%";
  zoomControlsContainer.appendChild(zoomValue);

  // Create zoom slider
  const zoomSlider = document.createElement("input");
  zoomSlider.type = "range";
  zoomSlider.id = "zoom-slider";
  zoomSlider.min = "0.5";
  zoomSlider.max = "2";
  zoomSlider.step = "0.1";
  zoomSlider.value = "1";
  zoomControlsContainer.appendChild(zoomSlider);

  // Create zoom reset button
  const resetButton = document.createElement("button");
  resetButton.id = "zoom-reset";
  resetButton.textContent = "Reset";
  resetButton.className = "zoom-button";
  zoomControlsContainer.appendChild(resetButton);

  // Add zoom controls to the DOM
  const certificateArea = document.getElementById("certificate-area");
  certificateArea.appendChild(zoomControlsContainer);

  // Add event listeners
  zoomSlider.addEventListener("input", updateZoom);
  resetButton.addEventListener("click", resetZoom);
}

// Function to update zoom
function updateZoom() {
  const zoomSlider = document.getElementById("zoom-slider");
  const zoomValue = document.getElementById("zoom-value");

  currentZoom = parseFloat(zoomSlider.value);

  // Update the display value
  zoomValue.textContent = `${Math.round(currentZoom * 100)}%`;

  // Apply zoom to canvas container
  const canvasContainer = document.querySelector(".canvas-container");
  if (canvasContainer) {
    canvasContainer.style.transform = `scale(${currentZoom})`;
    canvasContainer.style.transformOrigin = "center top";
  }
}

// Function to reset zoom
function resetZoom() {
  const zoomSlider = document.getElementById("zoom-slider");
  zoomSlider.value = 1;
  updateZoom();
}

// Handle mode change
document
  .getElementById("certificateMode")
  .addEventListener("change", function () {
    updateCanvasSize(this.value);
  });

// Adjust canvas on window resize
window.addEventListener("resize", function () {
  updateCanvasSize(certificateMode);
  // Re-apply zoom when window is resized
  if (document.getElementById("zoom-slider")) {
    updateZoom();
  }
});

// Change Background Color
document.getElementById("bgColorPicker").addEventListener("input", function () {
  canvas.setBackgroundColor(this.value, canvas.renderAll.bind(canvas));
  saveCanvasState();
});

// Add Editable Text
document.getElementById("addText").addEventListener("click", function () {
  let textInput = document.getElementById("textInput").value || "Your Text";
  let text = new fabric.Textbox(textInput, {
    left: 100,
    top: 100,
    fontSize: parseInt(document.getElementById("fontSize").value) || 30,
    fontFamily: document.getElementById("fontSelector").value,
    fill: document.getElementById("textColorPicker").value || "black",
    editable: true,
  });

  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
  saveCanvasState();
});

// Update text properties when changed
document.getElementById("fontSize").addEventListener("input", function () {
  let obj = canvas.getActiveObject();
  if (obj && obj.type === "textbox") {
    obj.set({ fontSize: parseInt(this.value) });
    canvas.renderAll();
    saveCanvasState();
  }
});

document.getElementById("fontSelector").addEventListener("change", function () {
  let obj = canvas.getActiveObject();
  if (obj && obj.type === "textbox") {
    obj.set({ fontFamily: this.value });
    canvas.renderAll();
    saveCanvasState();
  }
});

document
  .getElementById("textColorPicker")
  .addEventListener("input", function () {
    let obj = canvas.getActiveObject();
    if (obj && obj.type === "textbox") {
      obj.set({ fill: this.value });
      canvas.renderAll();
      saveCanvasState();
    }
  });

// Upload Image
document
  .getElementById("imageUpload")
  .addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function (e) {
      fabric.Image.fromURL(e.target.result, function (img) {
        img.scaleToWidth(200);
        img.left = 50;
        img.top = 50;
        img.set({ selectable: true });
        canvas.add(img);
        canvas.renderAll();
        saveCanvasState();
      });

      // Clear the file input field after upload
      document.getElementById("imageUpload").value = "";
    };
    reader.readAsDataURL(event.target.files[0]);
  });

// DELETE Selected Textbox or Image
document.addEventListener("keydown", function (event) {
  let activeObject = canvas.getActiveObject();
  if (activeObject) {
    let isEditing = activeObject.isEditing;
    if (event.key === "Backspace" && !isEditing) {
      canvas.remove(activeObject);
      canvas.renderAll();
      saveCanvasState();
    }
  }
});

// Undo Functionality (Ctrl + Z)
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") {
    if (historyIndex > 0) {
      historyIndex--;
      canvas.loadFromJSON(canvasHistory[historyIndex], function () {
        canvas.renderAll();
      });
    }
  }
});

// Redo Functionality (Ctrl + Y)
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "y") {
    if (historyIndex < canvasHistory.length - 1) {
      historyIndex++;
      canvas.loadFromJSON(canvasHistory[historyIndex], function () {
        canvas.renderAll();
      });
    }
  }
});

// Save Table Modal Functionality
function saveTableModal() {
  document.getElementById("tableModal").style.display = "block";
}

// Save Template Table Properly
document.getElementById("templateTable").addEventListener("click", function () {
  const templateName = document.getElementById("certNameInput").value.trim();

  if (!templateName) {
    alert("Template name cannot be empty!");
    return;
  }

  // Get the canvas data as a JSON object
  const templateData = canvas.toJSON();

  // Convert the JSON object to a string
  const templateDataString = JSON.stringify(templateData);

  // Send the data to the server
  fetch("http://localhost:5000/save-template", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      template_name: templateName,
      template_data: templateDataString,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      document.getElementById("tableModal").style.display = "none"; // Close modal after saving
      window.location.href = "index.html"; // Redirect to home page
    })
    .catch((error) => {
      console.error("Error saving template:", error);
      alert("Failed to save template. Please try again.");
    });
});

// Save Design Table Properly
document.getElementById("designTable").addEventListener("click", function () {
  const designName = document.getElementById("certNameInput").value.trim();

  if (!designName) {
    alert("Certificate name cannot be empty!");
    return;
  }

  // Get the canvas data as a JSON object
  const designData = canvas.toJSON();

  // Convert the JSON object to a string
  const designDataString = JSON.stringify(designData);

  // Send the data to the server
  fetch("http://localhost:5000/save-design", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      design_name: designName,
      design_data: designDataString,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      document.getElementById("tableModal").style.display = "none"; // Close modal after saving
      window.location.href = "index.html"; // Redirect to home page
    })
    .catch((error) => {
      console.error("Error saving design:", error);
      alert("Failed to save design. Please try again.");
    });
});

// Save Modal Functionality
// function saveTemplateModal() {
//   document.getElementById("saveModal").style.display = "block";
// }

// Close Modal When Clicking Close Button
document.getElementById("cancelSave").addEventListener("click", function () {
  document.getElementById("tableModal").style.display = "none";
});

// Function to load a template by ID
function loadTemplateById(templateId) {
  fetch(`http://localhost:5000/templates/${templateId}`)
    .then((response) => response.json())
    .then((template) => {
      // Parse the template_data string into a JavaScript object
      const templateData = JSON.parse(template.template_data);

      // Debugging: Log the parsed template data
      console.log("Parsed Template Data:", templateData);

      // Load the template data into the canvas
      canvas.loadFromJSON(templateData, () => {
        // Render the canvas after loading
        canvas.renderAll();

        // Debugging: Log the canvas objects to verify they are loaded
        console.log("Canvas Objects:", canvas.getObjects());

        // Save the initial state for undo functionality
        saveCanvasState();
      });
    })
    .catch((error) => {
      console.error("Error loading template:", error);
      alert("Failed to load template. Please try again.");
    });
}

// Function to load a design by ID
function loadDesignById(designId) {
  fetch(`http://localhost:5000/templates/${designId}`)
    .then((response) => response.json())
    .then((design) => {
      // Parse the design_data string into a JavaScript object
      const designData = JSON.parse(design.design_data);

      // Debugging: Log the parsed design data
      console.log("Parsed Design Data:", designData);

      // Load the design data into the canvas
      canvas.loadFromJSON(designData, () => {
        // Render the canvas after loading
        canvas.renderAll();

        // Debugging: Log the canvas objects to verify they are loaded
        console.log("Canvas Objects:", canvas.getObjects());

        // Save the initial state for undo functionality
        saveCanvasState();
      });
    })
    .catch((error) => {
      console.error("Error loading design:", error);
      alert("Failed to load design. Please try again.");
    });
}

// Check if a certificate ID is provided in the URL
const urlParams = new URLSearchParams(window.location.search);
const certId = urlParams.get("id");

if (certId) {
  // Check if the ID exists in the templates or designs table
  fetch(`http://localhost:5000/check-id/${certId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.existsInTemplates) {
        loadTemplateById(certId);
      } else if (data.existsInDesigns) {
        loadDesignById(certId);
      } else {
        alert("ID not found in templates or designs.");
      }
    })
    .catch((error) => {
      console.error("Error checking ID:", error);
      alert("Failed to check ID. Please try again.");
    });
} else {
  // Initialize with default mode if no template ID is provided
  updateCanvasSize("portrait");
  saveCanvasState();
}

// Add Shapes Functionality
const shapes = document.querySelectorAll(".shape");
shapes.forEach((shape) => {
  shape.addEventListener("click", function () {
    const shapeType = this.getAttribute("data-shape");
    let newShape;

    switch (shapeType) {
      case "rect":
        newShape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: "#FF5733",
          left: 50,
          top: 50,
          selectable: true,
        });
        break;
      case "circle":
        newShape = new fabric.Circle({
          radius: 50,
          fill: "#33FF57",
          left: 50,
          top: 50,
          selectable: true,
        });
        break;
      case "triangle":
        newShape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: "#3357FF",
          left: 50,
          top: 50,
          selectable: true,
        });
        break;
      case "line":
        newShape = new fabric.Line([50, 50, 150, 50], {
          stroke: "#FF5733",
          strokeWidth: 2,
          selectable: true,
        });
        break;
      case "ellipse":
        newShape = new fabric.Ellipse({
          rx: 50,
          ry: 30,
          fill: "#FF5733",
          left: 50,
          top: 50,
          selectable: true,
        });
        break;
    }

    if (newShape) {
      canvas.add(newShape);
      canvas.setActiveObject(newShape);
      canvas.renderAll();
      saveCanvasState();
    }
  });
});

// Change Shape Color
document
  .getElementById("shapeColorPicker")
  .addEventListener("input", function () {
    const activeObject = canvas.getActiveObject();
    if (
      activeObject &&
      (activeObject.type === "rect" ||
        activeObject.type === "circle" ||
        activeObject.type === "triangle" ||
        activeObject.type === "ellipse")
    ) {
      activeObject.set({ fill: this.value });
      canvas.renderAll();
      saveCanvasState();
    } else if (activeObject && activeObject.type === "line") {
      activeObject.set({ stroke: this.value });
      canvas.renderAll();
      saveCanvasState();
    }
  });

// Download Modal Functionality
function downloadModal() {
  document.getElementById("downloadModal").style.display = "block";
}

// Close Download Modal
document
  .getElementById("cancelDownload")
  .addEventListener("click", function () {
    document.getElementById("downloadModal").style.display = "none";
  });

// Download as PDF
document.getElementById("downloadPdf").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF(certificateMode === "portrait" ? "p" : "l", "px", [
    A4_PORTRAIT_WIDTH,
    A4_PORTRAIT_HEIGHT,
  ]);

  // Convert canvas to image
  const imgData = canvas.toDataURL("image/png");

  // Add image to PDF
  pdf.addImage(imgData, "PNG", 0, 0, A4_PORTRAIT_WIDTH, A4_PORTRAIT_HEIGHT);

  // Download PDF
  pdf.save("certificate.pdf");
  document.getElementById("downloadModal").style.display = "none";
});

// Download as PNG
document.getElementById("downloadPng").addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "certificate.png";
  link.click();
  document.getElementById("downloadModal").style.display = "none";
});

// Download as JPG
document.getElementById("downloadJpg").addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/jpeg");
  link.download = "certificate.jpg";
  link.click();
  document.getElementById("downloadModal").style.display = "none";
});

// Initialize zoom controls after canvas is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Wait a short time for Fabric.js to initialize the canvas
  setTimeout(function () {
    createZoomControls();
    // Apply default zoom to ensure proper initialization
    setTimeout(updateZoom, 200);
  }, 500);
});
