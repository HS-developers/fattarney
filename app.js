// تأكد من استيراد المكتبات بشكل صحيح
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzP4OtoiS454f7W9x21QGTDQRixryt6Dg",
    authDomain: "fattarney.firebaseapp.com",
    projectId: "fattarney",
    storageBucket: "fattarney.appspot.com",
    messagingSenderId: "318340301705",
    appId: "1:318340301705:web:4913c2acbafab6b8509758",
    measurementId: "G-RSF806GJYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

async function submitOrder() {
    const name = document.getElementById("nameInput").value;
    const ful = document.getElementById("foulInput").value || 0;
    const taamiya = document.getElementById("ta3miyaInput").value || 0;
    const taamiyaMahshiya = document.getElementById("ta3miyaMahshyInput").value || 0;
    const chipsy = document.getElementById("batatisShibsyInput").value || 0;
    const potatoTawae = document.getElementById("batatisTawabi3Input").value || 0;
    const mashedPotato = document.getElementById("batatisMahrousaInput").value || 0;
    const musaqaa = document.getElementById("musaqaBadhinjanInput").value || 0;
    const pickles = document.getElementById("makhalilInput").value || 0;

    // إضافة الطلب إلى Firestore
    try {
        await addDoc(collection(db, "orders"), {
            name,
            ful,
            taamiya,
            taamiyaMahshiya,
            chipsy,
            potatoTawae,
            mashedPotato,
            musaqaa,
            pickles
        });
        displayOrders(); // تحديث عرض الطلبات
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    // مسح المدخلات
    document.getElementById("nameInput").value = '';
    document.getElementById("foulInput").value = 0;
    document.getElementById("ta3miyaInput").value = 0;
    document.getElementById("ta3miyaMahshyInput").value = 0;
    document.getElementById("batatisShibsyInput").value = 0;
    document.getElementById("batatisTawabi3Input").value = 0;
    document.getElementById("batatisMahrousaInput").value = 0;
    document.getElementById("musaqaBadhinjanInput").value = 0;
    document.getElementById("makhalilInput").value = 0;
}

async function displayOrders() {
    const ordersTableBody = document.getElementById("ordersTableBody");
    ordersTableBody.innerHTML = ''; // مسح المحتوى القديم

    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        ordersTableBody.innerHTML = '<tr><td colspan="3">لا توجد طلبات حالياً.</td></tr>';
        return;
    }

    const totals = {};

    // تجميع الكميات حسب الاسم
    querySnapshot.forEach(doc => {
        const order = doc.data();
        const name = order.name;

        if (!totals[name]) {
            totals[name] = {
                ful: 0,
                taamiya: 0,
                taamiyaMahshiya: 0,
                chipsy: 0,
                potatoTawae: 0,
                mashedPotato: 0,
                musaqaa: 0,
                pickles: 0
            };
        }

        totals[name].ful += Number(order.ful);
        totals[name].taamiya += Number(order.taamiya);
        totals[name].taamiyaMahshiya += Number(order.taamiyaMahshiya);
        totals[name].chipsy += Number(order.chipsy);
        totals[name].potatoTawae += Number(order.potatoTawae);
        totals[name].mashedPotato += Number(order.mashedPotato);
        totals[name].musaqaa += Number(order.musaqaa);
        totals[name].pickles += Number(order.pickles);
    });

    // عرض البيانات في الجدول
    for (const [name, values] of Object.entries(totals)) {
        for (const [key, value] of Object.entries(values)) {
            if (value > 0) {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${name}</td><td>${key}</td><td>${value}</td>`;
                ordersTableBody.appendChild(row);
            }
        }
    }
}

async function displayIndividualOrders() {
    const output = document.getElementById("orders-output");
    output.innerHTML = ''; // مسح المحتوى القديم

    const name = document.getElementById("nameInput").value; // احصل على الاسم من المدخلات
    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        output.innerHTML = 'لا توجد طلبات فردية حالياً.';
        return;
    }

    // عرض الطلبات الفردية
    querySnapshot.forEach(doc => {
        const order = doc.data();
        if (order.name === name) {
            const orderDiv = document.createElement("div");
            orderDiv.innerHTML = `
                <strong>${order.name}</strong>:<br>
                فول: ${order.ful}, 
                طعمية: ${order.taamiya}, 
                طعمية محشية: ${order.taamiyaMahshiya}, 
                بطاطس شيبسي: ${order.chipsy}, 
                بطاطس طوابع: ${order.potatoTawae}, 
                بطاطس مهروسة: ${order.mashedPotato}, 
                مسقعة باذنجان: ${order.musaqaa}, 
                مخلل: ${order.pickles}<br>
            `;
            output.appendChild(orderDiv);
        }
    });
}

// إضافة أحداث للأزرار
document.getElementById("submitOrderButton").addEventListener("click", submitOrder);
document.getElementById("viewOrdersButton").addEventListener("click", displayOrders);
