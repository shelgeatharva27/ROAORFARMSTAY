// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const bookingsRef = ref(database, "bookings");

// References to DOM elements
const tableBody = document.querySelector("#income-table tbody");
const sumTotalElement = document.getElementById("sum-total");
const sumCashElement = document.getElementById("sum-cash");
const sumUpiElement = document.getElementById("sum-upi");
const sumMonthlyTotalElement = document.getElementById("sum-monthly-total");
const dateFilter = document.getElementById("date-filter");
const monthFilter = document.getElementById("month-filter");

// Store bookings data globally
let bookings = [];

// Listen for data changes in the Firebase database
onValue(bookingsRef, (snapshot) => {
    bookings = [];
    snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        booking.id = childSnapshot.key;
        bookings.push(booking);
    });

    // Sort the bookings by checkout date in ascending order
    bookings.sort((a, b) => new Date(a.checkoutDate) - new Date(b.checkoutDate));

    // Function to update the table based on date and month filters
    const updateTable = (filteredBookings) => {
        tableBody.innerHTML = "";
        let sumTotal = 0;
        let sumCash = 0;
        let sumUpi = 0;

        filteredBookings.forEach(booking => {
            const row = document.createElement("tr");

            // Calculate the total using advance, balance, and discount
            const total = (parseFloat(booking.advance) + parseFloat(booking.balance) - parseFloat(booking.discount)).toFixed(2);
            booking.total = total; // Update total field

            // Create cells for each booking
            row.innerHTML = `
                <td>${booking.name || "N/A"}</td>
                <td>${booking.advance || "0"}</td>
                <td>${booking.balance || "0"}</td>
                <td>${booking.discount || "0"}</td>
                <td>${total}</td>
                <td>${booking.paymentMethod || "N/A"}</td>
                <td>${booking.checkoutDate || "N/A"}</td>
                <td><button class="edit-button" data-id="${booking.id}">Edit</button></td>
            `;
            tableBody.appendChild(row);

            // Update sums
            sumTotal += parseFloat(total) || 0;
            if (booking.paymentMethod === "cash") sumCash += parseFloat(total) || 0;
            if (booking.paymentMethod === "upi") sumUpi += parseFloat(total) || 0;
        });

        // Update sum elements
        sumTotalElement.textContent = sumTotal.toFixed(2);
        sumCashElement.textContent = sumCash.toFixed(2);
        sumUpiElement.textContent = sumUpi.toFixed(2);
    };

    // Show all bookings initially
    updateTable(bookings);

    // Filter bookings based on selected date
    dateFilter.addEventListener("change", (event) => {
        const selectedDate = event.target.value;
        const filteredBookings = selectedDate
            ? bookings.filter(booking => booking.checkoutDate === selectedDate)
            : bookings;
        updateTable(filteredBookings);
    });

    // Calculate and display total income for the selected month
    const updateMonthlyTotal = (month) => {
        const monthBookings = bookings.filter(booking => booking.checkoutDate.startsWith(month));
        let monthlyTotal = 0;

        monthBookings.forEach(booking => {
            const total = (parseFloat(booking.advance) + parseFloat(booking.balance) - parseFloat(booking.discount)).toFixed(2);
            monthlyTotal += parseFloat(total);
        });

        sumMonthlyTotalElement.textContent = monthlyTotal.toFixed(2);
    };

    // Filter bookings based on selected month
    monthFilter.addEventListener("change", (event) => {
        const selectedMonth = event.target.value;
        updateMonthlyTotal(selectedMonth);
    });
});

// Function to open the edit form
function openEditForm(bookingId, booking) {
    // Create a form element
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");

    const form = document.createElement("form");
    form.innerHTML = `
        <label for="editName">Name:</label>
        <input type="text" id="editName" value="${booking.name || ""}" required>
        
        <label for="editAdvance">Advance Paid:</label>
        <input type="number" id="editAdvance" value="${booking.advance || 0}" required>
        
        <label for="editBalance">Balance:</label>
        <input type="number" id="editBalance" value="${booking.balance || 0}" required>
        
        <label for="editDiscount">Discount:</label>
        <input type="number" id="editDiscount" value="${booking.discount || 0}" required>
        
        <label for="editTotal">Total:</label>
        <input type="number" id="editTotal" value="${booking.total || 0}" required readonly>
        
        <label for="editPaymentMethod">Payment Method:</label>
        <select id="editPaymentMethod">
            <option value="cash" ${booking.paymentMethod === 'cash' ? 'selected' : ''}>Cash</option>
            <option value="upi" ${booking.paymentMethod === 'upi' ? 'selected' : ''}>UPI</option>
        </select>
        
        <label for="editCheckoutDate">Checkout Date:</label>
        <input type="date" id="editCheckoutDate" value="${booking.checkoutDate || ""}" required>
        
        <button type="submit">Save</button>
        <button type="button" id="cancelEdit">Cancel</button>
    `;

    // Recalculate total whenever any of the fields change
    const updateTotal = () => {
        const advance = parseFloat(document.getElementById("editAdvance").value) || 0;
        const balance = parseFloat(document.getElementById("editBalance").value) || 0;
        const discount = parseFloat(document.getElementById("editDiscount").value) || 0;
        const total = (advance + balance - discount).toFixed(2);
        document.getElementById("editTotal").value = total;
    };

    // Add event listeners to update the total as fields change
    form.querySelector("#editAdvance").addEventListener("input", updateTotal);
    form.querySelector("#editBalance").addEventListener("input", updateTotal);
    form.querySelector("#editDiscount").addEventListener("input", updateTotal);

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get updated values
        const updatedName = document.getElementById("editName").value;
        const updatedAdvance = document.getElementById("editAdvance").value;
        const updatedBalance = document.getElementById("editBalance").value;
        const updatedDiscount = document.getElementById("editDiscount").value;
        const updatedTotal = document.getElementById("editTotal").value; // Get the dynamically updated total
        const updatedPaymentMethod = document.getElementById("editPaymentMethod").value;
        const updatedCheckoutDate = document.getElementById("editCheckoutDate").value;

        // Update Firebase
        update(ref(database, `bookings/${bookingId}`), {
            name: updatedName,
            advance: updatedAdvance,
            balance: updatedBalance,
            discount: updatedDiscount,
            total: updatedTotal,
            paymentMethod: updatedPaymentMethod,
            checkoutDate: updatedCheckoutDate
        });

        // Remove the form
        document.body.removeChild(formContainer);
    });

    // Handle cancel button
    form.querySelector("#cancelEdit").addEventListener("click", () => {
        document.body.removeChild(formContainer);
    });

    formContainer.appendChild(form);
    document.body.appendChild(formContainer);
}

// Listen for edit button clicks
tableBody.addEventListener("click", (event) => {
    if (event.target && event.target.matches("button.edit-button")) {
        const bookingId = event.target.dataset.id;
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) openEditForm(bookingId, booking);
    }
});
