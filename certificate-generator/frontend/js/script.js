document.addEventListener("DOMContentLoaded", () => {
  loadMenubar();
  loadDesigns();
  loadTemplates();
});

// Function to load the dashboard
function loadMenubar() {
  fetch("menubar.html")
    .then((response) => response.text())
    .then((data) => {
      // Inject the dashboard into the designated container
      document.getElementById("menubar-container").innerHTML = data;
    })
    .catch((error) => console.error("Error loading sidebar:", error));
}

function loadTemplates() {
  fetch("http://localhost:5000/templates")
    .then((response) => response.json())
    .then((templates) => {
      const container = document.getElementById("templates-container");
      container.innerHTML = ""; // Clear existing content

      templates.forEach((template) => {
        // Create a card for each template
        const card = document.createElement("div");
        card.classList.add("template-card");

        // Add template name
        const name = document.createElement("h3");
        name.textContent = template.template_name;
        card.appendChild(name);

        // Create a canvas for the thumbnail
        const canvas = document.createElement("canvas");
        canvas.id = `canvas-${template.id}`;
        canvas.classList.add("thumbnail");
        card.appendChild(canvas);

        // Add click event to redirect to editor with template ID
        card.onclick = () => {
          window.location.href = `editor.html?id=${template.id}`;
        };

        // Append the card to the container
        container.appendChild(card);

        // Render the template preview on the canvas
        renderTemplatePreview(canvas, template.template_data);
      });
    })
    .catch((error) => console.error("Error loading templates:", error));
}

function loadDesigns() {
  fetch("http://localhost:5000/designs")
    .then((response) => response.json())
    .then((designs) => {
      const container = document.getElementById("designs-container");
      container.innerHTML = ""; // Clear existing content

      designs.forEach((design) => {
        // Create a card for each design
        const card = document.createElement("div");
        card.classList.add("design-card");

        // Add design name
        const name = document.createElement("h3");
        name.textContent = design.design_name;
        card.appendChild(name);

        // Create a canvas for the thumbnail
        const canvas = document.createElement("canvas");
        canvas.id = `canvas-${design.id}`;
        canvas.classList.add("thumbnail");
        card.appendChild(canvas);

        // Add click event to redirect to editor with design ID
        card.onclick = () => {
          window.location.href = `editor.html?id=${design.id}`;
        };

        // Append the card to the container
        container.appendChild(card);

        // Render the design preview on the canvas
        renderDesignPreview(canvas, design.design_data);
      });
    })
    .catch((error) => console.error("Error loading templates:", error));
}

function renderTemplatePreview(canvasElement, templateData) {
  // Initialize a Fabric.js canvas for the thumbnail
  const previewCanvas = new fabric.Canvas(canvasElement, {
    width: 220, // Thumbnail width
    height: 136, // Thumbnail height
    backgroundColor: "#fff", // White background
  });

  // Parse the template data and render it on the canvas
  const data = JSON.parse(templateData);
  previewCanvas.loadFromJSON(data, () => {
    previewCanvas.renderAll();

    // Scale down the preview to fit the thumbnail
    const scale = Math.min(
      50 / previewCanvas.getWidth(),
      28 / previewCanvas.getHeight()
    );
    previewCanvas.setZoom(scale);
    previewCanvas.renderAll();
  });
}

function renderDesignPreview(canvasElement, designData) {
  // Initialize a Fabric.js canvas for the thumbnail
  const previewCanvas = new fabric.Canvas(canvasElement, {
    width: 250, // Thumbnail width
    height: 141, // Thumbnail height
    backgroundColor: "#fff", // White background
  });

  // Parse the design data and render it on the canvas
  const data = JSON.parse(designData);
  previewCanvas.loadFromJSON(data, () => {
    previewCanvas.renderAll();

    // Scale down the preview to fit the thumbnail
    const scale = Math.min(
      280 / previewCanvas.getWidth(),
      28 / previewCanvas.getHeight()
    );
    previewCanvas.setZoom(scale);
    previewCanvas.renderAll();
  });
}

function createNewDesign() {
  window.location.href = "editor.html";
}

function showDesigns() {}

function showTemplates() {}

function showTrash() {}

function showSettings() {
  window.location.href = "settings.html";
}
