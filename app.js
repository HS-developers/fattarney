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

    // عرض البيانات في الجدول
    querySnapshot.forEach(doc => {
        const order = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.name}</td>
            <td>فول</td>
            <td>${order.ful}</td>
        `;
        ordersTableBody.appendChild(row);
        
        if (order.taamiya > 0) {
            const taamiyaRow = document.createElement("tr");
            taamiyaRow.innerHTML = `<td>${order.name}</td><td>طعمية</td><td>${order.taamiya}</td>`;
            ordersTableBody.appendChild(taamiyaRow);
        }

        if (order.taamiyaMahshiya > 0) {
            const taamiyaMahshiyaRow = document.createElement("tr");
            taamiyaMahshiyaRow.innerHTML = `<td>${order.name}</td><td>طعمية محشية</td><td>${order.taamiyaMahshiya}</td>`;
            ordersTableBody.appendChild(taamiyaMahshiyaRow);
        }

        if (order.chipsy > 0) {
            const chipsyRow = document.createElement("tr");
            chipsyRow.innerHTML = `<td>${order.name}</td><td>بطاطس شيبسي</td><td>${order.chipsy}</td>`;
            ordersTableBody.appendChild(chipsyRow);
        }

        if (order.potatoTawae > 0) {
            const potatoTawaeRow = document.createElement("tr");
            potatoTawaeRow.innerHTML = `<td>${order.name}</td><td>بطاطس طوابع</td><td>${order.potatoTawae}</td>`;
            ordersTableBody.appendChild(potatoTawaeRow);
        }

        if (order.mashedPotato > 0) {
            const mashedPotatoRow = document.createElement("tr");
            mashedPotatoRow.innerHTML = `<td>${order.name}</td><td>بطاطس مهروسة</td><td>${order.mashedPotato}</td>`;
            ordersTableBody.appendChild(mashedPotatoRow);
        }

        if (order.musaqaa > 0) {
            const musaqaaRow = document.createElement("tr");
            musaqaaRow.innerHTML = `<td>${order.name}</td><td>مسقعة باذنجان</td><td>${order.musaqaa}</td>`;
            ordersTableBody.appendChild(musaqaaRow);
        }

        if (order.pickles > 0) {
            const picklesRow = document.createElement("tr");
            picklesRow.innerHTML = `<td>${order.name}</td><td>مخلل</td><td>${order.pickles}</td>`;
            ordersTableBody.appendChild(picklesRow);
        }
    });
}

// إضافة أحداث للأزرار
document.getElementById("submitOrderButton").addEventListener("click", submitOrder);
document.getElementById("viewOrdersButton").addEventListener("click", displayOrders);
