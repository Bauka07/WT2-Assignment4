const API_URL = "http://localhost:3000/api";

// DOM Elements
const noteModal = document.getElementById("noteModal");
const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");
const newNoteBtn = document.getElementById("newNoteBtn");
const closeBtn = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const categoryFilter = document.getElementById("categoryFilter");
const tagFilter = document.getElementById("tagFilter");
const showPinnedBtn = document.getElementById("showPinnedBtn");
const showAllBtn = document.getElementById("showAllBtn");
const modalTitle = document.getElementById("modalTitle");
const tagInput = document.getElementById("tagInput");
const selectedTagsContainer = document.getElementById("selectedTags");
const tagSuggestions = document.getElementById("tagSuggestions");

let currentFilter = { category: "", isPinned: null, tag: "" };
let editingNoteId = null;
let selectedTags = [];
let allTags = [];

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadNotes();
  loadAllTags();
});

newNoteBtn.addEventListener("click", () => {
  openModal();
});

closeBtn.addEventListener("click", () => {
  closeModal();
});

cancelBtn.addEventListener("click", () => {
  closeModal();
});

window.addEventListener("click", (e) => {
  if (e.target === noteModal) {
    closeModal();
  }
});

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await saveNote();
});

categoryFilter.addEventListener("change", (e) => {
  currentFilter.category = e.target.value;
  loadNotes();
});

tagFilter.addEventListener("change", (e) => {
  currentFilter.tag = e.target.value;
  loadNotes();
});

showPinnedBtn.addEventListener("click", () => {
  currentFilter.isPinned = true;
  loadNotes();
});

showAllBtn.addEventListener("click", () => {
  currentFilter.isPinned = null;
  currentFilter.category = "";
  currentFilter.tag = "";
  categoryFilter.value = "";
  tagFilter.value = "";
  loadNotes();
});

// Tag input handlers
tagInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  if (value.length > 0) {
    showTagSuggestions(value);
  } else {
    tagSuggestions.innerHTML = "";
  }
});

tagInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag(tagInput.value.trim());
  }
});

// Functions
function openModal(note = null) {
  selectedTags = [];

  if (note) {
    editingNoteId = note._id;
    modalTitle.textContent = "Edit Note";
    document.getElementById("title").value = note.title;
    document.getElementById("content").value = note.content;
    document.getElementById("category").value = note.category;
    document.getElementById("color").value = note.color;
    document.getElementById("isPinned").checked = note.isPinned;

    if (note.tags && note.tags.length > 0) {
      // Convert tag objects to tag names
      selectedTags = note.tags.map((tag) =>
        typeof tag === "string" ? tag : tag.name,
      );
      renderSelectedTags();
    }
  } else {
    editingNoteId = null;
    modalTitle.textContent = "Create New Note";
    noteForm.reset();
    document.getElementById("color").value = "#ffffff";
    renderSelectedTags();
  }
  noteModal.style.display = "block";
}

function closeModal() {
  noteModal.style.display = "none";
  noteForm.reset();
  editingNoteId = null;
  selectedTags = [];
  selectedTagsContainer.innerHTML = "";
  tagSuggestions.innerHTML = "";
}

function addTag(tagName) {
  if (!tagName) return;

  const normalizedTag = tagName.toLowerCase().trim();

  if (!selectedTags.includes(normalizedTag)) {
    selectedTags.push(normalizedTag);
    renderSelectedTags();
    createTagIfNotExists(normalizedTag);
  }

  tagInput.value = "";
  tagSuggestions.innerHTML = "";
}

function removeTag(tagName) {
  selectedTags = selectedTags.filter((tag) => tag !== tagName);
  renderSelectedTags();
}

function renderSelectedTags() {
  selectedTagsContainer.innerHTML = selectedTags
    .map(
      (tag) => `
      <span class="tag-chip">
        ${escapeHtml(tag)}
        <button type="button" class="tag-remove" onclick="removeTag('${escapeHtml(tag)}')">&times;</button>
      </span>
    `,
    )
    .join("");
}

function showTagSuggestions(searchTerm) {
  const filteredTags = allTags
    .filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchTerm) &&
        !selectedTags.includes(tag.name.toLowerCase()),
    )
    .slice(0, 5);

  if (filteredTags.length > 0) {
    tagSuggestions.innerHTML = filteredTags
      .map(
        (tag) => `
        <div class="tag-suggestion-item" onclick="addTag('${escapeHtml(tag.name)}')">
          ${escapeHtml(tag.name)}
        </div>
      `,
      )
      .join("");
  } else {
    tagSuggestions.innerHTML = `
      <div class="tag-suggestion-item">
        Press Enter to create "${escapeHtml(searchTerm)}"
      </div>
    `;
  }
}

async function loadAllTags() {
  try {
    const response = await fetch(`${API_URL}/tags`);
    const result = await response.json();

    if (result.success) {
      allTags = result.data;
      updateTagFilter();
    }
  } catch (error) {
    console.error("Error loading tags:", error);
  }
}

function updateTagFilter() {
  const currentValue = tagFilter.value;
  tagFilter.innerHTML = '<option value="">All Tags</option>';

  allTags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag.name;
    option.textContent = tag.name;
    tagFilter.appendChild(option);
  });

  tagFilter.value = currentValue;
}

async function createTagIfNotExists(tagName) {
  const tagExists = allTags.some(
    (tag) => tag.name.toLowerCase() === tagName.toLowerCase(),
  );

  if (!tagExists) {
    try {
      const response = await fetch(`${API_URL}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tagName }),
      });

      const result = await response.json();

      if (result.success) {
        allTags.push(result.data);
        updateTagFilter();
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  }
}

async function loadNotes() {
  try {
    let url = `${API_URL}/notes?`;

    if (currentFilter.category) {
      url += `category=${currentFilter.category}&`;
    }

    if (currentFilter.isPinned !== null) {
      url += `isPinned=${currentFilter.isPinned}&`;
    }

    if (currentFilter.tag) {
      url += `tag=${currentFilter.tag}&`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      displayNotes(result.data);
    } else {
      notesContainer.innerHTML =
        '<p class="error-message">Failed to load notes</p>';
    }
  } catch (error) {
    console.error("Error loading notes:", error);
    notesContainer.innerHTML =
      '<p class="error-message">Error loading notes</p>';
  }
}

function displayNotes(notes) {
  if (notes.length === 0) {
    notesContainer.innerHTML =
      '<p class="loading">No notes found. Create your first note!</p>';
    return;
  }

  notesContainer.innerHTML = notes
    .map(
      (note) => `
    <div class="note-card ${note.isPinned ? "pinned" : ""}"
         style="border-left-color: ${note.color}">
      ${note.isPinned ? '<span class="pin-badge">📌 PINNED</span>' : ""}

      <div class="note-title">${escapeHtml(note.title)}</div>

      <div class="note-meta">
        <span class="category-badge">${note.category}</span>
        <span class="note-date">${formatDate(note.createdAt)}</span>
      </div>

      ${
        note.tags && note.tags.length > 0
          ? `<div class="note-tags">
              ${note.tags
                .map((tag) => {
                  const tagName = typeof tag === "string" ? tag : tag.name;
                  return `<span class="note-tag">${escapeHtml(tagName)}</span>`;
                })
                .join("")}
             </div>`
          : ""
      }

      <div class="note-content">${escapeHtml(note.content)}</div>

      <div class="note-actions">
        <button class="btn btn-secondary" onclick="editNote('${note._id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteNote('${note._id}')">Delete</button>
      </div>
    </div>
  `,
    )
    .join("");
}

async function saveNote() {
  const noteData = {
    title: document.getElementById("title").value,
    content: document.getElementById("content").value,
    category: document.getElementById("category").value,
    color: document.getElementById("color").value,
    isPinned: document.getElementById("isPinned").checked,
    tags: selectedTags,
  };

  try {
    let response;

    if (editingNoteId) {
      response = await fetch(`${API_URL}/notes/${editingNoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
    } else {
      response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
    }

    const result = await response.json();

    if (result.success) {
      closeModal();
      loadNotes();
      loadAllTags();
    } else {
      alert(
        "Error saving note: " +
          (result.errors ? result.errors.join(", ") : result.error),
      );
    }
  } catch (error) {
    console.error("Error saving note:", error);
    alert("Error saving note. Please try again.");
  }
}

async function editNote(id) {
  try {
    const response = await fetch(`${API_URL}/notes/${id}`);
    const result = await response.json();

    if (result.success) {
      openModal(result.data);
    } else {
      alert("Error loading note");
    }
  } catch (error) {
    console.error("Error loading note:", error);
    alert("Error loading note");
  }
}

async function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      loadNotes();
    } else {
      alert("Error deleting note");
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    alert("Error deleting note");
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
