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
    appId: "1:318340301705:web:4913c2acbaf6b8509758",
    measurementId: "G-RSF806GJYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

async function submitOrder() {
    const name = document.getElementById("nameInput").value;
    if (!name) {
        alert("يرجى إدخال اسمك قبل إرسال الطلب.");
        return;
    }
    const ful = document.getElementById("foulInput").value || 0;
    const taamiya = document.getElementById("ta3miyaInput").value || 0;
    const potatoTawae = document.getElementById("batatisTawabi3Input").value || 0;
    const chipsy = document.getElementById("batatisShibsyInput").value || 0;
    const taamiyaMahshiya = document.getElementById("ta3miyaMahshyInput").value || 0;
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
        alert("تم إرسال الطلب بنجاح!"); // إظهار رسالة النجاح
        displayOrders(); // تحديث عرض الطلبات
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    // مسح المدخلات
    clearInputs();
}

function clearInputs() {
    document.getElementById("nameInput").value = '';
    document.getElementById("foulInput").value = '';         // ترك الحقول فارغة
    document.getElementById("ta3miyaInput").value = '';
    document.getElementById("batatisTawabi3Input").value = '';   
    document.getElementById("batatisShibsyInput").value = '';
    document.getElementById("ta3miyaMahshyInput").value = '';
    document.getElementById("batatisMahrousaInput").value = '';
    document.getElementById("musaqaBadhinjanInput").value = '';
    document.getElementById("makhalilInput").value = '';
}

async function displayOrders() {
    const ordersTableBody = document.getElementById("ordersTableBody");
    ordersTableBody.innerHTML = ''; // مسح المحتوى القديم
    const totalQuantities = {
        ful: 0,
        taamiya: 0,
        taamiyaMahshiya: 0,
        chipsy: 0,
        potatoTawae: 0,
        mashedPotato: 0,
        musaqaa: 0,
        pickles: 0
    };

    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        ordersTableBody.innerHTML = '<tr><td colspan="2">لا توجد طلبات حالياً.</td></tr>';
        return;
    }

    // تجميع الكميات الإجمالية لكل صنف
    querySnapshot.forEach(doc => {
        const order = doc.data();
        totalQuantities.ful += parseInt(order.ful);
        totalQuantities.taamiya += parseInt(order.taamiya);
        totalQuantities.potatoTawae += parseInt(order.potatoTawae);
        totalQuantities.chipsy += parseInt(order.chipsy);
        totalQuantities.taamiyaMahshiya += parseInt(order.taamiyaMahshiya);
        totalQuantities.mashedPotato += parseInt(order.mashedPotato);
        totalQuantities.musaqaa += parseInt(order.musaqaa);
        totalQuantities.pickles += parseInt(order.pickles);
    });

    // عرض البيانات في الجدول
    const arabicNames = {
        ful: 'فول',
        taamiya: 'طعمية',
        potatoTawae: 'بطاطس صوابع',
        chipsy: 'بطاطس شيبسي',
        taamiyaMahshiya: 'طعمية محشية',
        mashedPotato: 'بطاطس مهروسة',
        musaqaa: 'مسقعة',
        pickles: 'مخلل'
    };

    for (const [key, value] of Object.entries(totalQuantities)) {
        if (value > 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${arabicNames[key]}</td>
                <td>${value}</td>
            `;
            ordersTableBody.appendChild(row);
        }
    }

    // عرض أسماء العملاء الذين قاموا بعمل طلبات
    const usersOutput = document.getElementById("usersOutput");
    usersOutput.innerHTML = ''; // مسح المحتوى القديم
    querySnapshot.forEach(doc => {
        const order = doc.data();
        const userDiv = document.createElement("div");
        userDiv.textContent = order.name;
        usersOutput.appendChild(userDiv);
    });
}

// دالة إلغاء الطلبات
async function clearAllOrders() {
    const confirmation = confirm("هل أنت متأكد من أنك تريد إلغاء جميع الطلبات؟"); // رسالة تأكيد
    if (!confirmation) return; // إذا اختار المستخدم "إلغاء"، نخرج من الدالة

    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach(async (doc) => {
        try {
            await deleteDoc(doc.ref); // حذف الطلب
        } catch (e) {
            console.error("حدث خطأ أثناء إلغاء الطلبات: ", e);
        }
    });

    // مسح أسماء الأشخاص من العرض
    const usersOutput = document.getElementById("usersOutput");
    usersOutput.innerHTML = ''; // مسح المحتوى القديم
    
    displayOrders(); // تحديث عرض الطلبات بعد الحذف
}

// دالة عرض الطلبات المنفردة
async function displayIndividualOrders() {
    const individualOrdersOutput = document.getElementById("individualOrdersOutput");
    individualOrdersOutput.innerHTML = ''; // مسح المحتوى القديم

    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        individualOrdersOutput.innerHTML = '<p>لا توجد طلبات حالياً.</p>';
        return;
    }

    querySnapshot.forEach(doc => {
        const order = doc.data();
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = `
            <p><strong>الاسم:</strong> ${order.name}</p>
            ${order.ful > 0 ? `<p><strong>فول:</strong> ${order.ful}</p>` : ''}
            ${order.taamiya > 0 ? `<p><strong>طعمية:</strong> ${order.taamiya}</p>` : ''}
            ${order.potatoTawae > 0 ? `<p><strong>بطاطس صوابع:</strong> ${order.potatoTawae}</p>` : ''}
            ${order.chipsy > 0 ? `<p><strong>بطاطس شيبسي:</strong> ${order.chipsy}</p>` : ''}
            ${order.taamiyaMahshiya > 0 ? `<p><strong>طعمية محشية:</strong> ${order.taamiyaMahshiya}</p>` : ''}
            ${order.mashedPotato > 0 ? `<p><strong>بطاطس مهروسة:</strong> ${order.mashedPotato}</p>` : ''}
            ${order.musaqaa > 0 ? `<p><strong>مسقعة:</strong> ${order.musaqaa}</p>` : ''}
            ${order.pickles > 0 ? `<p><strong>مخلل:</strong> ${order.pickles}</p>` : ''}
            <hr>
        `;
        individualOrdersOutput.appendChild(orderDiv);
    });
}

// دالة لإخفاء وعرض الأقسام
function toggleSections(sectionToShow) {
    const sections = ["ordersSection", "individualOrdersSection"];
    sections.forEach(section => {
        document.getElementById(section).style.display = section === sectionToShow ? 'block' : 'none';
    });
}

// إضافة أحداث للأزرار
document.getElementById("submitOrderButton").addEventListener("click", submitOrder);
document.getElementById("clearOrdersButton").addEventListener("click", clearAllOrders);
document.getElementById("displayIndividualOrdersButton").addEventListener("click", () => toggleSections("individualOrdersSection"));
document.getElementById("displayOrdersButton").addEventListener("click", () => toggleSections("ordersSection"));

// التأكد من تحميل المحتوى
document.addEventListener("DOMContentLoaded", displayOrders);
