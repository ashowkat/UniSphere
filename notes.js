//@author Amy Siby
//@author Aleezah Showkat

//javascript file for notes page
const noteContainer = document.getElementById("noteContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const colorSelector = document.getElementById("noteColor");

// Load saved notes
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.forEach(({ text, color }) => createNote(text, color));
}

// Save current notes
function saveNotes() {
  const notes = [];
  document.querySelectorAll(".note").forEach(note => {
    const textarea = note.querySelector("textarea");
    notes.push({ text: textarea.value, color: note.style.backgroundColor });
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Create a new note
function createNote(text = "", color = "#f9f390") {
  const note = document.createElement("div");
  note.className = "note";
  note.style.backgroundColor = color;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.addEventListener("input", saveNotes);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "×";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => {
    note.remove();
    saveNotes();
  };

  note.appendChild(deleteBtn);
  note.appendChild(textarea);
  noteContainer.appendChild(note);
  saveNotes();
}

// Add note on button click
addNoteBtn.addEventListener("click", () => {
  const selectedColor = colorSelector.value;
  createNote("", selectedColor);
});

// Load on startup
loadNotes();
