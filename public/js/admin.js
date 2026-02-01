const API_URL = "http://localhost:3000/api";

// Auth state
let authToken = localStorage.getItem("token");
let currentUser = null;

// Check admin access on load
document.addEventListener("DOMContentLoaded", async () => {
  if (!authToken) {
    alert("Please login first");
    window.location.href = "/";
    return;
  }

  // Verify admin role
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (!result.success || result.data.role !== "admin") {
      alert("Access denied. Admin only.");
      window.location.href = "/";
      return;
    }

    currentUser = result.data;
    loadDashboard();
  } catch (error) {
    console.error("Auth error:", error);
    window.location.href = "/";
  }
});

// Navigation
document.querySelectorAll(".admin-nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;

    // Update active nav
    document.querySelectorAll(".admin-nav-item").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Show section
    document.querySelectorAll(".admin-section").forEach((s) => s.classList.remove("active"));
    document.getElementById(`${section}Section`).classList.add("active");

    // Load data
    switch (section) {
      case "dashboard":
        loadDashboard();
        break;
      case "users":
        loadUsers();
        break;
      case "notes":
        loadNotes();
        break;
      case "categories":
        loadCategories();
        break;
      case "tags":
        loadTags();
        break;
    }
  });
});

// Logout
document.getElementById("adminLogoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  window.location.href = "/";
});

// Modal close handlers
document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modalId = btn.dataset.close;
    document.getElementById(modalId).style.display = "none";
  });
});

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", () => {
    overlay.closest(".modal").style.display = "none";
  });
});

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      const { stats, recentUsers, recentNotes } = result.data;

      // Update stats
      document.getElementById("statUsers").textContent = stats.users;
      document.getElementById("statNotes").textContent = stats.notes;
      document.getElementById("statCategories").textContent = stats.categories;
      document.getElementById("statTags").textContent = stats.tags;

      // Recent users
      document.getElementById("recentUsersList").innerHTML = recentUsers
        .map(
          (user) => `
          <div class="recent-item">
            <div class="recent-item-info">
              <span class="recent-item-title">${user.email}</span>
              <span class="recent-item-subtitle">${formatDate(user.createdAt)}</span>
            </div>
            <span class="recent-item-badge ${user.role}">${user.role}</span>
          </div>
        `
        )
        .join("");

      // Recent notes
      document.getElementById("recentNotesList").innerHTML = recentNotes
        .map(
          (note) => `
          <div class="recent-item">
            <div class="recent-item-info">
              <span class="recent-item-title">${note.title}</span>
              <span class="recent-item-subtitle">by ${note.userId?.email || "Unknown"}</span>
            </div>
            <span class="recent-item-badge">${note.category}</span>
          </div>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

// ===== USERS =====
async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      document.getElementById("usersTableBody").innerHTML = result.data
        .map(
          (user) => `
          <tr>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${user.role}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
              <div class="action-btns">
                <button class="btn-icon edit" onclick="editUser('${user._id}', '${user.email}', '${user.role}')" title="Edit">✏️</button>
                <button class="btn-icon delete" onclick="deleteUser('${user._id}')" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

function editUser(id, email, role) {
  document.getElementById("editUserId").value = id;
  document.getElementById("editUserEmail").value = email;
  document.getElementById("editUserRole").value = role;
  document.getElementById("editUserModal").style.display = "block";
}

document.getElementById("editUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editUserId").value;
  const email = document.getElementById("editUserEmail").value;
  const role = document.getElementById("editUserRole").value;

  try {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email, role }),
    });
    const result = await response.json();

    if (result.success) {
      document.getElementById("editUserModal").style.display = "none";
      loadUsers();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
});

async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user? All their notes will also be deleted.")) return;

  try {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      loadUsers();
      loadDashboard();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

// ===== NOTES =====
async function loadNotes() {
  try {
    const response = await fetch(`${API_URL}/admin/notes`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      document.getElementById("notesTableBody").innerHTML = result.data
        .map(
          (note) => `
          <tr>
            <td>${note.title}</td>
            <td>${note.userId?.email || "Unknown"}</td>
            <td>${note.category}</td>
            <td>${formatDate(note.createdAt)}</td>
            <td>
              <div class="action-btns">
                <button class="btn-icon delete" onclick="deleteNote('${note._id}')" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading notes:", error);
  }
}

async function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;

  try {
    const response = await fetch(`${API_URL}/admin/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      loadNotes();
      loadDashboard();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

// ===== CATEGORIES =====
async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      document.getElementById("categoriesTableBody").innerHTML = result.data
        .map(
          (cat) => `
          <tr>
            <td>${cat.icon || "📁"}</td>
            <td>${cat.name}</td>
            <td>${cat.description || "-"}</td>
            <td>
              <div class="color-preview">
                <span class="color-dot" style="background: ${cat.color || "#6366f1"}"></span>
                <span>${cat.color || "#6366f1"}</span>
              </div>
            </td>
            <td>
              <div class="action-btns">
                <button class="btn-icon edit" onclick='editCategory(${JSON.stringify(cat)})' title="Edit">✏️</button>
                <button class="btn-icon delete" onclick="deleteCategory('${cat._id}')" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

document.getElementById("addCategoryBtn").addEventListener("click", () => {
  document.getElementById("categoryModalTitle").textContent = "Add Category";
  document.getElementById("categoryId").value = "";
  document.getElementById("categoryForm").reset();
  document.getElementById("categoryColor").value = "#6366f1";
  document.getElementById("categoryModal").style.display = "block";
});

function editCategory(cat) {
  document.getElementById("categoryModalTitle").textContent = "Edit Category";
  document.getElementById("categoryId").value = cat._id;
  document.getElementById("categoryName").value = cat.name;
  document.getElementById("categoryDescription").value = cat.description || "";
  document.getElementById("categoryIcon").value = cat.icon || "";
  document.getElementById("categoryColor").value = cat.color || "#6366f1";
  document.getElementById("categoryModal").style.display = "block";
}

document.getElementById("categoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("categoryId").value;
  const data = {
    name: document.getElementById("categoryName").value,
    description: document.getElementById("categoryDescription").value,
    icon: document.getElementById("categoryIcon").value,
    color: document.getElementById("categoryColor").value,
  };

  try {
    const url = id ? `${API_URL}/admin/categories/${id}` : `${API_URL}/admin/categories`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.success) {
      document.getElementById("categoryModal").style.display = "none";
      loadCategories();
      loadDashboard();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error saving category:", error);
  }
});

async function deleteCategory(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  try {
    const response = await fetch(`${API_URL}/admin/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      loadCategories();
      loadDashboard();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error deleting category:", error);
  }
}

// ===== TAGS =====
async function loadTags() {
  try {
    const response = await fetch(`${API_URL}/tags`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      document.getElementById("tagsTableBody").innerHTML = result.data
        .map(
          (tag) => `
          <tr>
            <td>${tag.name}</td>
            <td>
              <div class="color-preview">
                <span class="color-dot" style="background: ${tag.color || "#6366f1"}"></span>
                <span>${tag.color || "#6366f1"}</span>
              </div>
            </td>
            <td>
              <div class="action-btns">
                <button class="btn-icon edit" onclick='editTag(${JSON.stringify(tag)})' title="Edit">✏️</button>
                <button class="btn-icon delete" onclick="deleteTag('${tag._id}')" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading tags:", error);
  }
}

document.getElementById("addTagBtn").addEventListener("click", () => {
  document.getElementById("tagModalTitle").textContent = "Add Tag";
  document.getElementById("tagId").value = "";
  document.getElementById("tagForm").reset();
  document.getElementById("tagColor").value = "#6366f1";
  document.getElementById("tagModal").style.display = "block";
});

function editTag(tag) {
  document.getElementById("tagModalTitle").textContent = "Edit Tag";
  document.getElementById("tagId").value = tag._id;
  document.getElementById("tagName").value = tag.name;
  document.getElementById("tagColor").value = tag.color || "#6366f1";
  document.getElementById("tagModal").style.display = "block";
}

document.getElementById("tagForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("tagId").value;
  const data = {
    name: document.getElementById("tagName").value,
    color: document.getElementById("tagColor").value,
  };

  try {
    const url = id ? `${API_URL}/admin/tags/${id}` : `${API_URL}/admin/tags`;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.success) {
      document.getElementById("tagModal").style.display = "none";
      loadTags();
      loadDashboard();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error saving tag:", error);
  }
});

async function deleteTag(id) {
  if (!confirm("Are you sure you want to delete this tag?")) return;

  try {
    const response = await fetch(`${API_URL}/admin/tags/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const result = await response.json();

    if (result.success) {
      loadTags();
      loadDashboard();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error deleting tag:", error);
  }
}

// ===== HELPERS =====
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
