// استيراد المكتبات اللازمة من Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// دالة إرسال الطلب
async function submitOrder() {
    try {
        const name = document.getElementById("name").value.trim();
        const ful = document.getElementById("ful").value;
        const taamiya = document.getElementById("taamiya").value;
        const taamiyaMahshiya = document.getElementById("taamiyaMahshiya").value;
        const chipsy = document.getElementById("chipsy").value;
        const potatoTawae = document.getElementById("potatoTawae").value;
        const mashedPotato = document.getElementById("mashedPotato").value;
        const musaqaa = document.getElementById("musaqaa").value;
        const pickles = document.getElementById("pickles").value;

        // تحقق من أن الاسم غير فارغ
        if (name === "") {
            alert("يرجى إدخال اسمك.");
            return; // عدم متابعة إذا كان الاسم فارغًا
        }

        // إضافة الطلب إلى قاعدة البيانات
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

        // مسح المدخلات
        document.getElementById("name").value = '';
        document.getElementById("ful").value = 0;
        document.getElementById("taamiya").value = 0;
        document.getElementById("taamiyaMahshiya").value = 0;
        document.getElementById("chipsy").value = 0;
        document.getElementById("potatoTawae").value = 0;
        document.getElementById("mashedPotato").value = 0;
        document.getElementById("musaqaa").value = 0;
        document.getElementById("pickles").value = 0;

        alert("تم إرسال الطلب بنجاح!"); // إشعار نجاح
    } catch (error) {
        console.error("خطأ في إرسال الطلب: ", error);
        alert("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى."); // إشعار الخطأ
    }
}

// دالة لعرض الطلبات
async function displayOrders() {
    const output = document.getElementById("orders-output");
    output.innerHTML = ''; // مسح المحتوى القديم

    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        output.innerHTML = 'لا توجد طلبات حالياً.';
        return;
    }

    // عرض الطلبات
    querySnapshot.forEach(doc => {
        const order = doc.data();
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = `
            <strong>${order.name}</strong><br>
            فول: ${order.ful}<br>
            طعمية: ${order.taamiya}<br>
            طعمية محشية: ${order.taamiyaMahshiya}<br>
            بطاطس شيبسي: ${order.chipsy}<br>
            بطاطس طوابع: ${order.potatoTawae}<br>
            بطاطس مهروسة: ${order.mashedPotato}<br>
            مسقعة باذنجان: ${order.musaqaa}<br>
            مخلل: ${order.pickles}<br><br>
        `;
        output.appendChild(orderDiv);
    });
}

// دالة لعرض الطلبات الفردية
async function displayIndividualOrders() {
    const output = document.getElementById("orders-output");
    output.innerHTML = ''; // مسح المحتوى القديم

    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        output.innerHTML = 'لا توجد طلبات فردية حالياً.';
        return;
    }

    // عرض الطلبات الفردية
    const individualOrders = {};
    querySnapshot.forEach(doc => {
        const order = doc.data();
        if (!individualOrders[order.name]) {
            individualOrders[order.name] = [];
        }
        individualOrders[order.name].push(order);
    });

    for (const name in individualOrders) {
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = `<strong>${name}</strong>:<br>`;
        individualOrders[name].forEach(order => {
            orderDiv.innerHTML += `
                فول: ${order.ful}, 
                طعمية: ${order.taamiya}, 
                طعمية محشية: ${order.taamiyaMahshiya}, 
                بطاطس شيبسي: ${order.chipsy}, 
                بطاطس طوابع: ${order.potatoTawae}, 
                بطاطس مهروسة: ${order.mashedPotato}, 
                مسقعة باذنجان: ${order.musaqaa}, 
                مخلل: ${order.pickles}<br>
            `;
        });
        output.appendChild(orderDiv);
    }
}

// إضافة أحداث للأزرار
document.getElementById("submit-btn").addEventListener("click", submitOrder);
document.getElementById("display-orders-btn").addEventListener("click", displayOrders);
document.getElementById("display-individual-orders-btn").addEventListener("click", displayIndividualOrders);
