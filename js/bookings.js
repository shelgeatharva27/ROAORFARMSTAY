// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGkVfqx2uClDamQ1wll_jjeRn3teFLcpM",
    authDomain: "roaor-48fbf.firebaseapp.com",
    databaseURL: "https://roaor-48fbf-default-rtdb.firebaseio.com",
    projectId: "roaor-48fbf",
    storageBucket: "roaor-48fbf.firebasestorage.app",
    messagingSenderId: "156225634410",
    appId: "1:156225634410:web:1e9b225d5665a0d7628a13",
    measurementId: "G-H05Y2091YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const bookingsRef = ref(database, "bookings");

// Dynamic total members calculation
const adultsInput = document.getElementById("adults");
const under12Input = document.getElementById("under-12");
const under5Input = document.getElementById("under-5");
const totalMembersInput = document.getElementById("total-members");

function calculateTotalMembers() {
    const adults = parseInt(adultsInput.value) || 0;
    const under12 = parseInt(under12Input.value) || 0;
    const under5 = parseInt(under5Input.value) || 0;
    totalMembersInput.value = adults + under12 + under5;
}

// Attach event listeners to member inputs
adultsInput.addEventListener("input", calculateTotalMembers);
under12Input.addEventListener("input", calculateTotalMembers);
under5Input.addEventListener("input", calculateTotalMembers);

// Add Booking
const form = document.getElementById("add-booking-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Collect form data
    const booking = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        members: {
            adults: parseInt(adultsInput.value) || 0,
            under12: parseInt(under12Input.value) || 0,
            under5: parseInt(under5Input.value) || 0,
            total: parseInt(totalMembersInput.value) || 0
        },
        checkin: document.getElementById("checkin").value,
        checkout: document.getElementById("checkout").value,
        advance: parseInt(document.getElementById("advance").value) || 0,
        balance: parseInt(document.getElementById("balance").value) || 0,
        total: parseInt(document.getElementById("total").value) || 0,
    };

    // Push data to Firebase
    push(bookingsRef, booking);

    // Reset the form
    form.reset();
    totalMembersInput.value = 0;
});

// Display Bookings
const bookingsTable = document.getElementById("bookings-table");
onValue(bookingsRef, (snapshot) => {
    bookingsTable.innerHTML = ""; // Clear existing rows
    snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();
        const row = `
            <tr>
                <td>${booking.name}</td>
                <td>${booking.phone}</td>
                <td>${booking.address}</td>
                <td>Adults: ${booking.members.adults}, Under 12: ${booking.members.under12}, Under 5: ${booking.members.under5}, Total: ${booking.members.total}</td>
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
