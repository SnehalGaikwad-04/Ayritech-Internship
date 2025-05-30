document.addEventListener("DOMContentLoaded", () => {
  loadMenubar();
  loadDesigns();
  loadTemplates();
  loadTrashedTemplates();
  loadTrashedDesigns();
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

        // Create a delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        // Delete event handler
        deleteButton.onclick = (event) => {
          event.stopPropagation(); // Prevent redirect when clicking delete
          deleteTemplate(template.id, card);
        };

        card.appendChild(deleteButton);
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

        // Create a delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        // Delete event handler
        deleteButton.onclick = (event) => {
          event.stopPropagation(); // Prevent redirect when clicking delete
          deleteDesign(design.id, card);
        };

        card.appendChild(deleteButton);
        container.appendChild(card);

        // Render the design preview on the canvas
        renderDesignPreview(canvas, design.design_data);
      });
    })
    .catch((error) => console.error("Error loading designs:", error));
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

//trash functionality
function moveToTrash() {
  window.location.href = "trash.html";
}

function deleteTemplate(templateId, cardElement) {
  fetch(`http://localhost:5000/templates/${templateId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Template moved to trash:", data);
      cardElement.remove(); // Remove from UI
    })
    .catch((error) => console.error("Error moving template to trash:", error));
}

function deleteDesign(designId, cardElement) {
  fetch(`http://localhost:5000/designs/${designId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Design moved to trash:", data);
      cardElement.remove(); // Remove from UI
    })
    .catch((error) => console.error("Error moving design to trash:", error));
}

function loadTrashedTemplates() {
  fetch("http://localhost:5000/trashed-templates")
    .then((response) => response.json())
    .then((templates) => {
      const container = document.getElementById("trash-templates-container");
      container.innerHTML = "";

      templates.forEach((template) => {
        const card = document.createElement("div");
        card.classList.add("template-card");

        const name = document.createElement("h3");
        name.textContent = template.template_name;
        card.appendChild(name);

        // Restore Button
        const restoreButton = document.createElement("button");
        restoreButton.textContent = "Restore";
        restoreButton.onclick = () => restoreTemplate(template.id, card);

        card.appendChild(restoreButton);
        container.appendChild(card);
      });
    })
    .catch((error) => console.error("Error loading trashed templates:", error));
}

function loadTrashedDesigns() {
  fetch("http://localhost:5000/trashed-designs")
    .then((response) => response.json())
    .then((designs) => {
      const container = document.getElementById("trash-designs-container");
      container.innerHTML = "";

      designs.forEach((design) => {
        const card = document.createElement("div");
        card.classList.add("design-card");

        const name = document.createElement("h3");
        name.textContent = design.design_name;
        card.appendChild(name);

        // Restore Button
        const restoreButton = document.createElement("button");
        restoreButton.textContent = "Restore";
        restoreButton.onclick = () => restoreDesign(design.id, card);

        card.appendChild(restoreButton);
        container.appendChild(card);
      });
    })
    .catch((error) => console.error("Error loading trashed designs:", error));
}

function restoreTemplate(templateId, cardElement) {
  fetch(`http://localhost:5000/restore-template/${templateId}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Template restored:", data);
      cardElement.remove(); // Remove from trash UI
    })
    .catch((error) => console.error("Error restoring template:", error));
}

function restoreDesign(designId, cardElement) {
  fetch(`http://localhost:5000/restore-design/${designId}`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Design restored:", data);
      cardElement.remove(); // Remove from trash UI
    })
    .catch((error) => console.error("Error restoring design:", error));
}
