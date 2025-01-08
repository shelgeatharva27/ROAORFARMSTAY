// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_mJlHNsp4G7HetpJhohFyV7suepDbnNg",
    authDomain: "roaor-d7968.firebaseapp.com",
    projectId: "roaor-d7968",
    storageBucket: "roaor-d7968.firebasestorage.app",
    messagingSenderId: "711990211481",
    appId: "1:711990211481:web:6acc19b2d1230dcc785908",
    measurementId: "G-BWBBRB7CPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const bookingsRef = ref(database, "bookings");

// Add Booking to Database
const form = document.getElementById("add-booking-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Collect form data
    const booking = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        members: document.getElementById("members").value,
        checkin: document.getElementById("checkin").value,
        checkout: document.getElementById("checkout").value,
        advance: document.getElementById("advance").value,
        balance: document.getElementById("balance").value,
        total: document.getElementById("total").value,
    };

    // Push the data to Firebase
    push(bookingsRef, booking);

    // Reset the form
    form.reset();
});

// Display Bookings
const bookingsTable = document.getElementById("bookings-table");
onValue(bookingsRef, (snapshot) => {
    bookingsTable.innerHTML = ""; // Clear existing table rows
    snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        const row = `
            <tr>
                <td>${booking.name}</td>
                <td>${booking.phone}</td>
                <td>${booking.address}</td>
                <td>${booking.members}</td>
                <td>${booking.checkin}</td>
                <td>${booking.checkout}</td>
                <td>${booking.advance}</td>
                <td>${booking.balance}</td>
                <td>${booking.total}</td>
            </tr>
        `;
        bookingsTable.innerHTML += row;
    });
});
