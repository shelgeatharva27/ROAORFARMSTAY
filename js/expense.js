// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGkVfqx2uClDamQ1wll_jjeRn3teFLcpM",
    authDomain: "roaor-48fbf.firebaseapp.com",
    databaseURL: "https://roaor-48fbf-default-rtdb.firebaseio.com",
    projectId: "roaor-48fbf",
    storageBucket: "roaor-48fbf.appspot.com",
    messagingSenderId: "156225634410",
    appId: "1:156225634410:web:1e9b225d5665a0d7628a13",
    measurementId: "G-H05Y2091YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// References
const expensesRef = ref(database, "expenses");
const tableBody = document.querySelector("#expense-table tbody");
const totalExpenseElement = document.getElementById("total-expense");
const summaryTableBody = document.querySelector("#summary-table tbody");
const addExpenseButton = document.getElementById("add-expense-button");
const expenseFormContainer = document.getElementById("expense-form-container");
const cancelButton = document.getElementById("cancel-button");
const expenseForm = document.getElementById("expense-form");
const expenseNameSelect = document.getElementById("expense-name");
const otherExpenseNameContainer = document.getElementById("other-expense-name-container");
const salaryExpenseNameContainer = document.getElementById("salary-expense-name-container");
const monthSelect = document.getElementById("month-select");

// Populate the month dropdown
const populateMonths = () => {
    const currentYear = new Date().getFullYear();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    months.forEach((month, index) => {
        const option = document.createElement("option");
        option.value = `${currentYear}-${String(index + 1).padStart(2, "0")}`;
        option.textContent = `${month} ${currentYear}`;
        monthSelect.appendChild(option);
    });

    // Set the current month as the default value
    const currentMonth = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    monthSelect.value = currentMonth;
};

// Fetch and display expenses for the selected month
const fetchExpensesByMonth = (month) => {
    onValue(ref(database, `expenses/${month}`), (snapshot) => {
        tableBody.innerHTML = ""; // Clear the table before repopulating
        summaryTableBody.innerHTML = ""; // Clear the summary table
        let totalExpense = 0; // Initialize the total expense sum
        const summaryData = {}; // Object to store summary data by expense type

        snapshot.forEach((childSnapshot) => {
            const expense = childSnapshot.val();

            // Update total expenses
            totalExpense += parseFloat(expense.value) || 0;

            // Update summary data
            if (!summaryData[expense.name]) {
                summaryData[expense.name] = 0;
            }
            summaryData[expense.name] += parseFloat(expense.value) || 0;

            // Create a new row for the table
            const row = document.createElement("tr");

            // Create cells for the row
            const nameCell = document.createElement("td");
            nameCell.textContent = expense.name;

            const valueCell = document.createElement("td");
            valueCell.textContent = expense.value;

            const actionsCell = document.createElement("td");
            actionsCell.textContent = "Edit/Delete"; // Placeholder for future functionality

            // Append cells to the row
            row.appendChild(nameCell);
            row.appendChild(valueCell);
            row.appendChild(actionsCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });

        // Update the total expenses displayed
        totalExpenseElement.textContent = totalExpense.toFixed(2);

        // Populate the summary table
        for (const [expenseName, totalValue] of Object.entries(summaryData)) {
            const summaryRow = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = expenseName;

            const valueCell = document.createElement("td");
            valueCell.textContent = totalValue.toFixed(2);

            summaryRow.appendChild(nameCell);
            summaryRow.appendChild(valueCell);

            summaryTableBody.appendChild(summaryRow);
        }
    });
};

// Handle expense form submission
expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get the selected month and form data
    const selectedMonth = monthSelect.value;
    const expenseName = (expenseNameSelect.value === "others" || expenseNameSelect.value === "salary")
        ? (expenseNameSelect.value === "others"
            ? document.getElementById("other-expense-name").value
            : document.getElementById("salary-expense-name").value)
        : expenseNameSelect.value;
    const expenseValue = document.getElementById("expense-value").value;

    // Add the new expense under the selected month
    const newExpenseRef = ref(database, `expenses/${selectedMonth}/${Date.now()}`);
    set(newExpenseRef, {
        name: expenseName,
        value: expenseValue
    });

    // Close the form and reset inputs
    expenseFormContainer.style.display = "none";
    expenseForm.reset();
});

// Show or hide custom input fields based on the dropdown selection
expenseNameSelect.addEventListener("change", () => {
    if (expenseNameSelect.value === "others") {
        otherExpenseNameContainer.style.display = "block";
        salaryExpenseNameContainer.style.display = "none";
    } else if (expenseNameSelect.value === "salary") {
        salaryExpenseNameContainer.style.display = "block";
        otherExpenseNameContainer.style.display = "none";
    } else {
        otherExpenseNameContainer.style.display = "none";
        salaryExpenseNameContainer.style.display = "none";
    }
});

// Show the form when the "Add Expense" button is clicked
addExpenseButton.addEventListener("click", () => {
    expenseFormContainer.style.display = "block";
});

// Hide the form when the "Cancel" button is clicked
cancelButton.addEventListener("click", () => {
    expenseFormContainer.style.display = "none";
});

// Initialize the app
populateMonths();
fetchExpensesByMonth(monthSelect.value);

// Listen for month changes
monthSelect.addEventListener("change", () => {
    fetchExpensesByMonth(monthSelect.value);
});
