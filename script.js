// =====================================================
// Student Registration System - JavaScript (DOM + Storage)
// =====================================================

// ------- Global Variables -------

// Array to hold all student records (synced with localStorage)
let students = [];

// Stores which index is being edited.
// If null  -> we are adding a new record
// If a number -> we are updating existing record at that index
let editIndex = null;

// ------- Get DOM Elements -------

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const idInput = document.getElementById("studentId");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contact");
const errorMessage = document.getElementById("errorMessage");
const studentsBody = document.getElementById("studentsBody");
const tableWrapper = document.getElementById("tableWrapper");

// =====================================================
// 1. Load existing data from localStorage on page load
// =====================================================

window.addEventListener("DOMContentLoaded", () => {
  // Read string data stored under key "studentsData"
  const stored = localStorage.getItem("studentsData");

  // If any data is found, convert JSON string back to array
  if (stored) {
    students = JSON.parse(stored);
  }

  // Display table rows based on loaded data
  renderTable();
});

// =====================================================
// 2. Handle form submission (Add / Update student)
// =====================================================

form.addEventListener("submit", (e) => {
  // Prevent default form submission (page refresh)
  e.preventDefault();

  // Clear previous error message
  errorMessage.textContent = "";

  // Get trimmed values from input fields
  const name = nameInput.value.trim();
  const studentId = idInput.value.trim();
  const email = emailInput.value.trim();
  const contact = contactInput.value.trim();

  // ---------- Validation Section ----------

  // Check if any field is empty
  if (!name || !studentId || !email || !contact) {
    errorMessage.textContent =
      "All fields are required. Empty rows are not allowed.";
    return; // stop execution if validation fails
  }

  // Name should contain only alphabets and spaces
  if (!/^[A-Za-z\s]+$/.test(name)) {
    errorMessage.textContent =
      "Student Name must contain only letters and spaces.";
    return;
  }

  // Student ID should contain only numbers
  if (!/^[0-9]+$/.test(studentId)) {
    errorMessage.textContent = "Student ID must contain only numbers.";
    return;
  }

  // Contact: only numbers and minimum 10 digits
  if (!/^[0-9]{10,}$/.test(contact)) {
    errorMessage.textContent =
      "Contact Number must be at least 10 digits and numbers only.";
    return;
  }

  // Basic email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errorMessage.textContent = "Please enter a valid email address.";
    return;
  }

  // Create student object from form values
  const studentObj = { name, studentId, email, contact };

  // ---------- Add or Update Record ----------

  if (editIndex === null) {
    // No record is being edited -> push new object to array
    students.push(studentObj);
  } else {
    // We are editing an existing record -> replace at that index
    students[editIndex] = studentObj;
    // Reset editIndex back to null so form will add next time
    editIndex = null;
  }

  // Save changes to localStorage and refresh table display
  saveAndRender();

  // Clear form inputs after submit
  form.reset();
});

// =====================================================
// 3. Save students array to localStorage and render table
// =====================================================

function saveAndRender() {
  // Convert array to JSON string and save to localStorage
  localStorage.setItem("studentsData", JSON.stringify(students));

  // Rebuild table rows with latest data
  renderTable();
}

// =====================================================
// 4. Create table rows dynamically from students array
// =====================================================

function renderTable() {
  // Clear any old rows from <tbody>
  studentsBody.innerHTML = "";

  // Loop through each student object
  students.forEach((student, index) => {
    // Create a new table row element
    const tr = document.createElement("tr");

    // Add columns using template literal
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.studentId}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td>
        <!-- data-index attribute stores which row this button belongs to -->
        <button class="action-btn edit-btn" data-index="${index}">Edit</button>
        <button class="action-btn delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    // Append the newly created row to the table body
    studentsBody.appendChild(tr);
  });

  // Attach event listeners to Edit and Delete buttons
  attachRowEvents();

  // Handle scrollbar if table becomes long
  addVerticalScrollIfNeeded();
}

// =====================================================
// 5. Attach click events to Edit and Delete buttons
// =====================================================

function attachRowEvents() {
  // Select all buttons with class "edit-btn" and "delete-btn"
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  // Add click listener to each Edit button
  editButtons.forEach((btn) => {
    btn.addEventListener("click", handleEdit);
  });

  // Add click listener to each Delete button
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// =====================================================
// 6. Edit handler - load selected row data into form
// =====================================================

function handleEdit(e) {
  // Get index of student from button's data-index attribute
  const index = e.target.getAttribute("data-index");

  // Get the corresponding student object
  const student = students[index];

  // Fill form inputs with existing values
  nameInput.value = student.name;
  idInput.value = student.studentId;
  emailInput.value = student.email;
  contactInput.value = student.contact;

  // Set editIndex so that submit will update this record
  editIndex = Number(index);
}

// =====================================================
// 7. Delete handler - remove selected record from array
// =====================================================

function handleDelete(e) {
  // Get index of record to delete
  const index = e.target.getAttribute("data-index");

  // Remove one element at that index from students array
  students.splice(index, 1);

  // Save updated array and re-render table
  saveAndRender();
}

// =====================================================
// 8. Add vertical scrollbar when many records are present
// =====================================================

function addVerticalScrollIfNeeded() {
  // If more than 5 records, enable vertical scroll for the table area
  if (students.length > 5) {
    tableWrapper.style.maxHeight = "250px"; // fixed height
    tableWrapper.style.overflowY = "auto";  // enable vertical scroll
  } else {
    // For 5 or less records, show table with normal height
    tableWrapper.style.maxHeight = "none";
    tableWrapper.style.overflowY = "visible";
  }
}

