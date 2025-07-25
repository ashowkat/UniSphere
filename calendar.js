//@author Amy Siby
//@author Aleezah Showkat

//javascript file for calendar page
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
let lastDeletedEvent = null;

// save events 
function saveEventsToStorage() {
  localStorage.setItem('uniSphereEvents', JSON.stringify(events));
}

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function renderCalendar(year, month) {
  calendarGrid.querySelectorAll('.date-cell').forEach(cell => cell.remove());

  monthYearLabel.textContent = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const prevMonthLastDate = new Date(year, month, 0).getDate();

  for (let i = startDay - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDate - i;
    const cell = createDateCell(new Date(year, month - 1, dayNum), true);
    calendarGrid.appendChild(cell);
  }
  for (let day = 1; day <= totalDays; day++) {
    const cell = createDateCell(new Date(year, month, day), false);
    calendarGrid.appendChild(cell);
  }
  let totalCells = startDay + totalDays;
  let nextMonthDay = 1;
  while (totalCells < 42) {
    const cell = createDateCell(new Date(year, month + 1, nextMonthDay), true);
    calendarGrid.appendChild(cell);
    totalCells++;
    nextMonthDay++;
  }
}

function createDateCell(date, inactive) {
  const dateKey = formatDateKey(date);
  const cell = document.createElement('div');
  cell.classList.add('date-cell');
  if (inactive) cell.classList.add('inactive');

  const dateNumber = document.createElement('div');
  dateNumber.classList.add('date-number');
  dateNumber.textContent = date.getDate();
  cell.appendChild(dateNumber);

  const eventsContainer = document.createElement('div');
  eventsContainer.classList.add('events');

  if (events[dateKey]) {
    events[dateKey].forEach(event => {
      const tag = document.createElement('span');
      tag.classList.add('event-tag');
      tag.style.backgroundColor = event.color;
      tag.textContent = event.title;
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
  if (!inactive) {
    cell.addEventListener('click', () => {
      const formattedDate = dateKey;
      document.getElementById('eventDate').value = formattedDate;
      eventTitleInput.focus();
    });
  }

  return cell;
}
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
  eventTitleInput.value = '';
  document.getElementById('eventDate').value = '';

  lastDeletedEvent = null;
  undoBtn.disabled = true;
}

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
    undoBtn.disabled = false;
  }
}

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

renderCalendar(currentDate.getFullYear(), currentDate.getMonth());