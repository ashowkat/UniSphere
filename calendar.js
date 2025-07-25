//@author Amy Siby
//@author Aleezah Showkat

//javascript file for calendar 
// calendar.js

(() => {
  const calendarGrid = document.getElementById('calendarGrid');
  const monthYearLabel = document.getElementById('monthYear');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const eventTitleInput = document.getElementById('eventTitle');
  const eventColorInput = document.getElementById('eventColor');
  const addEventBtn = document.getElementById('addEventBtn');
  const undoBtn = document.getElementById('undoBtn');

  let currentDate = new Date();
  let events = JSON.parse(localStorage.getItem('uniSphereEvents')) || {};
  let lastDeletedEvent = null; // Store last deleted event for undo

  // Save events to localStorage
  function saveEventsToStorage() {
    localStorage.setItem('uniSphereEvents', JSON.stringify(events));
  }

  // Format date as yyyy-mm-dd string key
  function formatDateKey(date) {
    return date.toISOString().split('T')[0];
  }

  // Render the calendar grid for given year and month
  function renderCalendar(year, month) {
    // Clear existing date cells (but keep day names)
    calendarGrid.querySelectorAll('.date-cell').forEach(cell => cell.remove());

    monthYearLabel.textContent = currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay(); // Sunday=0 ... Saturday=6
    const totalDays = lastDayOfMonth.getDate();

    // Previous month days to fill grid
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    // Add previous month inactive days
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDate - i;
      const cell = createDateCell(new Date(year, month - 1, dayNum), true);
      calendarGrid.appendChild(cell);
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const cell = createDateCell(new Date(year, month, day), false);
      calendarGrid.appendChild(cell);
    }

    // Fill remaining cells to complete 42 (6 weeks)
    let totalCells = startDay + totalDays;
    let nextMonthDay = 1;
    while (totalCells < 42) {
      const cell = createDateCell(new Date(year, month + 1, nextMonthDay), true);
      calendarGrid.appendChild(cell);
      totalCells++;
      nextMonthDay++;
    }
  }

  // Create a date cell with events and click handlers
  function createDateCell(date, inactive) {
    const dateKey = formatDateKey(date);
    const cell = document.createElement('div');
    cell.classList.add('date-cell');
    if (inactive) cell.classList.add('inactive');

    // Date number at top
    const dateNumber = document.createElement('div');
    dateNumber.classList.add('date-number');
    dateNumber.textContent = date.getDate();
    cell.appendChild(dateNumber);

    // Container for events
    const eventsContainer = document.createElement('div');
    eventsContainer.classList.add('events');

    // Add event tags if any
    if (events[dateKey]) {
      events[dateKey].forEach(event => {
        const tag = document.createElement('span');
        tag.classList.add('event-tag');
        tag.style.backgroundColor = event.color;
        tag.textContent = event.title;

        // Add delete button inside event tag
        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.title = 'Delete event';
        delBtn.classList.add('event-delete-btn');
        delBtn.style.marginLeft = '6px';
        delBtn.style.border = 'none';
        delBtn.style.background = 'transparent';
        delBtn.style.color = '#f4e4ff';
        delBtn.style.cursor = 'pointer';
        delBtn.style.fontWeight = 'bold';

        delBtn.addEventListener('click', e => {
          e.stopPropagation();
          deleteEvent(dateKey, event.id);
        });

        tag.appendChild(delBtn);
        eventsContainer.appendChild(tag);
      });
    }

    cell.appendChild(eventsContainer);

    // Clicking date cell sets date in form input for adding event
    if (!inactive) {
      cell.addEventListener('click', () => {
        const formattedDate = dateKey;
        document.getElementById('eventDate').value = formattedDate;
        eventTitleInput.focus();
      });
    }

    return cell;
  }

  // Add new event from form
  function addEvent() {
    const title = eventTitleInput.value.trim();
    const color = eventColorInput.value;
    const date = document.getElementById('eventDate').value;

    if (!title || !date) {
      alert('Please enter a date and event title.');
      return;
    }

    if (!events[date]) events[date] = [];

    events[date].push({
      id: Date.now().toString(),
      title,
      color
    });

    saveEventsToStorage();
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());

    // Clear form fields
    eventTitleInput.value = '';
    document.getElementById('eventDate').value = '';

    // Clear undo history since this is a new addition
    lastDeletedEvent = null;
    undoBtn.disabled = true;
  }

  // Delete event and save for undo
  function deleteEvent(dateKey, eventId) {
    const eventIndex = events[dateKey].findIndex(ev => ev.id === eventId);
    if (eventIndex !== -1) {
      lastDeletedEvent = {
        ...events[dateKey][eventIndex],
        date: dateKey
      };

      events[dateKey].splice(eventIndex, 1);
      if (events[dateKey].length === 0) {
        delete events[dateKey];
      }

      saveEventsToStorage();
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
      undoBtn.disabled = false; // Enable Undo button
    }
  }

  // Undo last delete event
  function undoDelete() {
    if (lastDeletedEvent) {
      const { date, title, color } = lastDeletedEvent;

      if (!events[date]) events[date] = [];

      events[date].push({
        id: Date.now().toString(),
        title,
        color
      });

      saveEventsToStorage();
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
      lastDeletedEvent = null;
      undoBtn.disabled = true;
    }
  }

  // Event listeners
  addEventBtn.addEventListener('click', addEvent);
  undoBtn.addEventListener('click', undoDelete);
  undoBtn.disabled = true;

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });

  // Initial render
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
})();


/*

const monthYearLabel = document.getElementById("monthYear");
const calendarGrid = document.getElementById("calendarGrid");
const eventForm = document.getElementById("eventForm");
const eventTitleInput = document.getElementById("eventTitle");
const eventDateInput = document.getElementById("eventDate");
const eventColorInput = document.getElementById("eventColor");
let lastEvent = null;


let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("uniSphereEvents")) || {}; // key: yyyy-mm-dd

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

function saveEvents() {
  localStorage.setItem("uniSphereEvents", JSON.stringify(events));
}

function renderCalendar(year, month) {
  calendarGrid.innerHTML = "";

  // Add day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day-name";
    dayDiv.textContent = day;
    calendarGrid.appendChild(dayDiv);
  });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  // Calculate how many blank cells needed before and after
  const totalCells = 42;
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // Previous month filler
  for (let i = startDay - 1; i >= 0; i--) {
    const cell = createDateCell(new Date(year, month - 1, prevMonthLastDate - i), true);
    calendarGrid.appendChild(cell);
  }

  // Current month dates
  for (let i = 1; i <= totalDays; i++) {
    const cell = createDateCell(new Date(year, month, i));
    calendarGrid.appendChild(cell);
  }

  // Fill remaining cells
  const filled = startDay + totalDays;
  const nextFill = totalCells - filled;
  for (let i = 1; i <= nextFill; i++) {
    const cell = createDateCell(new Date(year, month + 1, i), true);
    calendarGrid.appendChild(cell);
  }

  monthYearLabel.textContent = firstDay.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}

function createDateCell(date, inactive = false) {
  const dateKey = formatDateKey(date);
  const cell = document.createElement("div");
  cell.className = "date-cell";
  if (inactive) cell.classList.add("inactive");

  const numDiv = document.createElement("div");
  numDiv.className = "date-number";
  numDiv.textContent = date.getDate();
  cell.appendChild(numDiv);

  const eventsContainer = document.createElement("div");
  eventsContainer.className = "events";

  if (events[dateKey]) {
    events[dateKey].forEach((ev, index) => {
      const tag = document.createElement("span");
      tag.className = "event-tag";
      tag.style.backgroundColor = ev.color;

      const textSpan = document.createElement("span");
      textSpan.textContent = ev.title;
      tag.appendChild(textSpan);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✕";
      deleteBtn.className = "delete-event";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        events[dateKey].splice(index, 1);
        if (events[dateKey].length === 0) delete events[dateKey];
        saveEvents();
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
      };

      tag.appendChild(deleteBtn);
      eventsContainer.appendChild(tag);
    });
  }

  cell.appendChild(eventsContainer);
  return cell;
}

// Event form logic
eventForm.addEventListener("submit", e => {
  e.preventDefault();
  const title = eventTitleInput.value.trim();
  const date = eventDateInput.value;
  const color = eventColorInput.value;

  if (!title || !date) return;

  if (!events[date]) events[date] = [];
  events[date].push({ title, color });

  saveEvents();
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
  eventForm.reset();
  eventColorInput.value = "#7e22a2"; // default again
});

// Navigation buttons
document.getElementById("prevMonthBtn").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById("nextMonthBtn").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

// Initial render
renderCalendar(currentDate.getFullYear(), currentDate.getMonth());



document.getElementById("undoBtn").addEventListener("click", undo);

function undo() {
  if (!lastEvent) return;

  const { date, id } = lastEvent;

  if (events[date]) {
    events[date] = events[date].filter(ev => ev.id !== id);
    if (events[date].length === 0) delete events[date];
  }

  lastEvent = null;
  saveEventsToStorage();
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
}
*/