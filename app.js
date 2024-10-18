// تأكد من استيراد المكتبات بشكل صحيح
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

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
    const usersList = new Set(); // مجموعة لتخزين أسماء المستخدمين الفريدين

    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        ordersTableBody.innerHTML = '<tr><td colspan="2">لا توجد طلبات حالياً.</td></tr>'; // تعديل عدد الأعمدة في الجدول
        return;
    }

    // عرض البيانات في الجدول
    querySnapshot.forEach(doc => {
        const order = doc.data();
        usersList.add(order.name); // إضافة اسم العميل إلى المجموعة

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${order.ful > 0 ? 'فول' : ''}</td>
            <td>${order.ful > 0 ? order.ful : ''}</td> <!-- إضافة الكمية -->
            <td>${order.taamiya > 0 ? 'طعمية' : ''}</td>
            <td>${order.taamiya > 0 ? order.taamiya : ''}</td> <!-- إضافة الكمية -->
            <td>${order.taamiyaMahshiya > 0 ? 'طعمية محشية' : ''}</td>
            <td>${order.taamiyaMahshiya > 0 ? order.taamiyaMahshiya : ''}</td> <!-- إضافة الكمية -->
            <td>${order.chipsy > 0 ? 'بطاطس شيبسي' : ''}</td>
            <td>${order.chipsy > 0 ? order.chipsy : ''}</td> <!-- إضافة الكمية -->
            <td>${order.potatoTawae > 0 ? 'بطاطس طوابع' : ''}</td>
            <td>${order.potatoTawae > 0 ? order.potatoTawae : ''}</td> <!-- إضافة الكمية -->
            <td>${order.mashedPotato > 0 ? 'بطاطس مهروسة' : ''}</td>
            <td>${order.mashedPotato > 0 ? order.mashedPotato : ''}</td> <!-- إضافة الكمية -->
            <td>${order.musaqaa > 0 ? 'مسقعة باذنجان' : ''}</td>
            <td>${order.musaqaa > 0 ? order.musaqaa : ''}</td> <!-- إضافة الكمية -->
            <td>${order.pickles > 0 ? 'مخلل' : ''}</td>
            <td>${order.pickles > 0 ? order.pickles : ''}</td> <!-- إضافة الكمية -->
        `;
        ordersTableBody.appendChild(row);
    });

    // عرض أسماء العملاء الذين قاموا بعمل طلبات
    const usersOutput = document.getElementById("usersOutput");
    usersOutput.innerHTML = ''; // مسح المحتوى القديم
    usersList.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.textContent = user;
        usersOutput.appendChild(userDiv);
    });
}

async function clearAllOrders() {
    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach(async (doc) => {
        try {
            await deleteDoc(doc.ref); // حذف الطلب
        } catch (e) {
            console.error("حدث خطأ أثناء إلغاء الطلبات: ", e);
        }
    });
    displayOrders(); // تحديث عرض الطلبات بعد الحذف
}

// إضافة أحداث للأزرار
document.getElementById("submitOrderButton").addEventListener("click", submitOrder);
document.getElementById("viewOrdersButton").addEventListener("click", displayOrders);
document.getElementById("clearAllOrdersButton").addEventListener("click", clearAllOrders);
