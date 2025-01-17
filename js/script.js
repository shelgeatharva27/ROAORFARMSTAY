// Function to get the proper suffix for a date (1st, 2nd, 3rd, etc.)
function getDateSuffix(day) {
  if (day > 3 && day < 21) {
    return 'th'; // For 11th, 12th, 13th... etc.
  }
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Array of month names
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Get current date details
const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Reference to calendar and dropdown
const calendarContainer = document.getElementById('calendar');
const monthSelector = document.getElementById('monthSelector');

// Populate the dropdown with month options
monthNames.forEach((month, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = `${month} ${currentYear}`;
  if (index === currentMonth) {
    option.selected = true; // Select the current month by default
  }
  monthSelector.appendChild(option);
});

// Function to render the calendar for the selected month and year
function renderCalendar(month, year) {
  // Clear the existing calendar
  calendarContainer.innerHTML = '';

  // Get the number of days in the selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create the columns for each day with proper date suffix
  for (let day = 1; day <= daysInMonth; day++) {
    const column = document.createElement('div');
    column.classList.add('day-column');

    // Get the date suffix (1st, 2nd, 3rd, etc.)
    const dayWithSuffix = day + getDateSuffix(day);

    // Create heading for the date (e.g., "1st", "2nd", etc.)
    const heading = document.createElement('h3');
    heading.textContent = dayWithSuffix;
    column.appendChild(heading);

    // Create checkboxes for huts
    const checkboxGroup = document.createElement('div');
    checkboxGroup.classList.add('checkbox-group');

    for (let hut = 1; hut <= 4; hut++) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `day${day}-hut${hut}-month${month}-year${year}`;
      checkbox.name = `day${day}-hut${hut}-month${month}-year${year}`;

      // Set the checkbox state from localStorage (if available)
      checkbox.checked = loadCheckboxState(day, hut, month, year);

      // Event listener to save the state when the checkbox is changed
      checkbox.addEventListener('change', function () {
        saveCheckboxState(day, hut, month, year, checkbox.checked);
      });

      const label = document.createElement('label');
      label.setAttribute('for', checkbox.id);
      label.textContent = `Hut ${hut}`;

      checkboxGroup.appendChild(checkbox);
      checkboxGroup.appendChild(label);
    }

    column.appendChild(checkboxGroup);
    calendarContainer.appendChild(column);
  }
}

// Function to save the checkbox state to localStorage
function saveCheckboxState(day, hut, month, year, state) {
  const key = `day${day}-hut${hut}-month${month}-year${year}`;
  localStorage.setItem(key, state); // Save the checkbox state (true/false)
}

// Function to load the checkbox state from localStorage
function loadCheckboxState(day, hut, month, year) {
  const key = `day${day}-hut${hut}-month${month}-year${year}`;
  return localStorage.getItem(key) === 'true'; // Retrieve the saved state
}

// Event listener for dropdown change
monthSelector.addEventListener('change', function () {
  currentMonth = parseInt(this.value);
  renderCalendar(currentMonth, currentYear);
});

// Initial rendering of the calendar
renderCalendar(currentMonth, currentYear);
