//@author Amy Siby
//@author Aleezah Showkat

//javascript file for calendar page
(() => {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearLabel = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const eventModal = document.getElementById('eventModal');
    const eventForm = document.getElementById('eventForm');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventColorInput = document.getElementById('eventColor');
    const cancelBtn = document.getElementById('cancelBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    

    note.appendChild(deleteNote);
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('uniSphereEvents')) || {};
    let selectedDate = null;
    let editingEventId = null;

    function saveEventsToStorage() {
      localStorage.setItem('uniSphereEvents', JSON.stringify(events));
    }

    function formatDateKey(date) {
      return date.toISOString().split('T')[0]; // yyyy-mm-dd
    }

    function renderCalendar(year, month) {
      // Remove existing date cells before days of week
      calendarGrid.querySelectorAll('.date-cell').forEach(cell => cell.remove());

      monthYearLabel.textContent = currentDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
      });

      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      const startDay = firstDayOfMonth.getDay(); // 0 Sun ... 6 Sat
      const totalDays = lastDayOfMonth.getDate();

      // Previous month days (to fill grid)
      const prevMonthLastDate = new Date(year, month, 0).getDate();

      // Add inactive days from previous month
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

      // Fill remaining cells to complete 6 rows (42 cells total)
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
          tag.title = 'Click to edit';
          tag.addEventListener('click', e => {
            e.stopPropagation();
            openEditModal(dateKey, event.id);
          });
          eventsContainer.appendChild(tag);
        });
      }

      cell.appendChild(eventsContainer);

      if (!inactive) {
        cell.addEventListener('click', () => openAddModal(dateKey));
      }

      return cell;
    }

    function openAddModal(dateKey) {
      selectedDate = dateKey;
      editingEventId = null;
      eventForm.reset();
      eventColorInput.value = '#7e22a2';
      deleteBtn.style.display = 'none';
      document.getElementById('modalTitle').textContent = `Add Event - ${dateKey}`;
      showModal();
    }

    function openEditModal(dateKey, eventId) {
      selectedDate = dateKey;
      editingEventId = eventId;
      const eventToEdit = events[dateKey].find(ev => ev.id === eventId);
      if (!eventToEdit) return;

      eventTitleInput.value = eventToEdit.title;
      eventColorInput.value = eventToEdit.color;
      deleteBtn.style.display = 'inline-block';
      document.getElementById('modalTitle').textContent = `Edit Event - ${dateKey}`;
      showModal();
    }

    function showModal() {
      eventModal.classList.add('show');
      eventTitleInput.focus();
    }

    function closeModal() {
      eventModal.classList.remove('show');
      selectedDate = null;
      editingEventId = null;
    }

    eventForm.addEventListener('submit', e => {
      e.preventDefault();
      const title = eventTitleInput.value.trim();
      const color = eventColorInput.value;

      if (!title) return;

      if (!events[selectedDate]) {
        events[selectedDate] = [];
      }

      if (editingEventId) {
        // Edit existing event
        const eventIndex = events[selectedDate].findIndex(ev => ev.id === editingEventId);
        if (eventIndex > -1) {
          events[selectedDate][eventIndex].title = title;
          events[selectedDate][eventIndex].color = color;
        }
      } else {
        // Add new event
        const newEvent = {
          id: Date.now().toString(),
          title,
          color
        };
        events[selectedDate].push(newEvent);
      }

      saveEventsToStorage();
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
      closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);

    deleteBtn.addEventListener('click', () => {
      if (!editingEventId || !selectedDate) return;
      events[selectedDate] = events[selectedDate].filter(ev => ev.id !== editingEventId);
      if (events[selectedDate].length === 0) delete events[selectedDate];
      saveEventsToStorage();
      renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
      closeModal();
    });

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