// Firebase استيراد مكتبات 
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import {
    getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzP4OtoiS454f7W9x21QGTDQRixryt6Dg",
    authDomain: "fattarney.firebaseapp.com",
    projectId: "fattarney",
    storageBucket: "fattarney.appspot.com",
    messagingSenderId: "318340301705",
    appId: "1:318340301705:web:4913c2acbaf6b8509758",
    measurementId: "G-RSF806GJYJ"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// بريد الأدمن الأساسي
const ADMIN_EMAIL = "admin@hussein77.com";

// قائمة الأصناف الافتراضية
const fallbackItems = [
    {name: 'بطاطس سلطه وطحينه', id: 'potato_salata_tahina', price: 14},
    {name: 'بطاطس توابل  سادة', id: 'potato_tawabel_plain', price: 14},
    {name: 'بطاطس توابل وطحينه', id: 'potato_tawabel_tahina', price: 14},
    {name: 'بطاطس رومي', id: 'potato_romi', price: 25},
    {name: 'فول حار', id: 'foul_hot', price: 12},
    {name: 'فول ساده', id: 'foul_plain', price: 10},
    {name: 'فول سلطه', id: 'foul_salata', price: 10},
    {name: 'فول اسكندراني', id: 'foul_iskandrani', price: 12},
    {name: 'طعميه', id: 'ta3miya', price: 10},
    {name: 'طعميه محشيه', id: 'ta3miya_ma7shya', price: 12},
    {name: 'قرص محشيه 5', id: 'koras_ma7shya_5', price: 5},
    {name: 'بابا غنوج', id: 'baba_ganoug', price: 12},
    {name: 'خدمة توصيل', id: 'delivery', price: 22, disabled: true}
];

// ============ دالة الأرشفة التلقائية باستخدام توقيت مصر ============
// دالة لإعطاء تاريخ اليوم بتوقيت مصر (UTC+2)
function getEgyptDateString() {
    // get current UTC time
    const now = new Date();
    // Egypt is UTC+2 year round
    const egyptOffset = 2 * 60; // 2 hours in minutes
    // get UTC time in ms, then add 2 hours
    const egyptTime = new Date(now.getTime() + (egyptOffset - now.getTimezoneOffset()) * 60000);
    return egyptTime.toISOString().split('T')[0];
}

async function autoArchiveOldOrders() {
    const today = getEgyptDateString(); // استخدم تاريخ اليوم بتوقيت مصر
    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (!data.createdAt) return;
        // createdAt قد يكون بتوقيت UTC، نحتاج تحويله لمصر عند المقارنة
        const orderDate = (() => {
            const d = new Date(data.createdAt);
            // تحويل توقيت الطلب لتوقيت مصر
            const egyptOffset = 2 * 60;
            const egyptTime = new Date(d.getTime() + (egyptOffset - d.getTimezoneOffset()) * 60000);
            return egyptTime.toISOString().split('T')[0];
        })();
        if (orderDate !== today && !data.archived) {
            try {
                await updateDoc(doc.ref, { archived: true });
            } catch (e) {}
        }
    });
}

// تحميل الأصناف
let itemsList = [];
async function loadItems() {
    try {
        const itemsSnapshot = await getDocs(collection(db, "items"));
        itemsList = [];
        itemsSnapshot.forEach(doc => {
            let data = doc.data();
            if (typeof data.price === "undefined") data.price = 0;
            itemsList.push({ id: doc.id, ...data });
        });
        if (itemsList.length === 0) itemsList = fallbackItems;
    } catch (e) {
        itemsList = fallbackItems;
    }
    fillItemsSelect();
}

function fillItemsSelect() {
    const select = document.getElementById('itemSelect');
    select.innerHTML = `<option disabled selected value="">اختر الصنف</option>`;
    itemsList.forEach(item => {
        if (item.id === 'delivery' || item.disabled) {
            select.innerHTML += `<option value="${item.id}" data-price="${item.price}" disabled style="color:#888;">${item.name} (${item.price} جنيه) - غير متاح للاختيار</option>`;
        } else {
            select.innerHTML += `<option value="${item.id}" data-price="${item.price}">${item.name} (${item.price} جنيه)</option>`;
        }
    });
}

let currentOrder = [];
let editingIndex = null;

function updateOrderItemsList() {
    const list = document.getElementById('orderItemsList');
    if (!list) return;
    list.innerHTML = '';
    currentOrder.forEach((item, i) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ${item.quantity} × ${item.price} جنيه = <strong>${item.quantity * item.price} جنيه</strong>
            <button class="edit-item" onclick="window.editOrderItem(${i})">تعديل</button>
            <button class="delete-item" onclick="window.deleteOrderItem(${i})">حذف</button>
        `;
        list.appendChild(li);
    });
}

window.editOrderItem = function(index) {
    const item = currentOrder[index];
    document.getElementById('itemSelect').value = item.id;
    document.getElementById('quantityInput').value = item.quantity;
    editingIndex = index;
    currentOrder.splice(index, 1);
    showCurrentOrder();
};

window.deleteOrderItem = function(index) {
    currentOrder.splice(index, 1);
    showCurrentOrder();
};

function showCurrentOrder() {
    const section = document.getElementById('currentOrder');
    if (currentOrder.length > 0) {
        updateOrderItemsList();
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
    }
}

// التحقق من الاسم إجباري قبل إضافة صنف أو عرض ملخص الطلب
function isNameValid() {
    const nameInput = document.getElementById('nameInput');
    const nameMsg = document.getElementById('nameRequiredMsg');
    if (!nameInput.value.trim()) {
        nameMsg.style.display = 'block';
        nameInput.classList.add('name-error');
        nameInput.focus();
        return false;
    } else {
        nameMsg.style.display = 'none';
        nameInput.classList.remove('name-error');
        return true;
    }
}

document.getElementById('addItemButton').onclick = function() {
    if (!isNameValid()) return;
    const select = document.getElementById('itemSelect');
    const quantityInput = document.getElementById('quantityInput');
    const itemId = select.value;
    const quantity = parseInt(quantityInput.value);

    if (!itemId) {
        alert("يرجى اختيار الصنف أولاً");
        return;
    }
    if (itemId === 'delivery') {
        alert("لا يمكنك اختيار خدمة التوصيل بشكل مباشر.");
        return;
    }
    if (!quantity || quantity < 1) {
        alert("يرجى إدخال كمية صحيحة (لا تقل عن 1)");
        return;
    }
    const itemObj = itemsList.find(x => x.id === itemId);

    if (editingIndex === null && currentOrder.find(x => x.id === itemId)) {
        alert("تمت إضافة هذا الصنف بالفعل! يمكنك تعديله من ملخص الطلب.");
        return;
    }

    const orderItem = {
        id: itemId,
        name: itemObj ? itemObj.name : itemId,
        quantity: quantity,
        price: itemObj ? itemObj.price : 0
    };

    if (editingIndex !== null) {
        currentOrder.splice(editingIndex, 0, orderItem);
        editingIndex = null;
    } else {
        currentOrder.push(orderItem);
    }

    document.getElementById('itemSelect').selectedIndex = 0;
    document.getElementById('quantityInput').value = 1;
    showCurrentOrder();
};

document.getElementById('submitOrderButton').onclick = function() {
    if (!isNameValid()) return;
    if (currentOrder.length === 0) {
        alert("يرجى إضافة صنف واحد على الأقل.");
        return;
    }
    showSummary();
};

function showSummary() {
    const summarySection = document.getElementById('orderSummary');
    const summaryList = document.getElementById('summaryList');
    summaryList.innerHTML = '';
    let total = 0;
    currentOrder.forEach(item => {
        const row = document.createElement('tr');
        let rowTotal = item.quantity * item.price;
        total += rowTotal;
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${rowTotal}</td>
        `;
        summaryList.appendChild(row);
    });
    document.getElementById('orderTotal').textContent = total;
    summarySection.style.display = 'block';
    document.getElementById('currentOrder').style.display = 'none';
}

document.getElementById('editSummaryButton').onclick = function() {
    document.getElementById('orderSummary').style.display = 'none';
    showCurrentOrder();
};

document.getElementById('confirmOrderButton').onclick = submitOrder;

async function submitOrder() {
    if (!isNameValid()) return;
    const name = document.getElementById("nameInput").value.trim();
    if (!name) {
        document.getElementById('nameRequiredMsg').style.display = 'block';
        document.getElementById('nameInput').focus();
        return;
    }
    if (currentOrder.length === 0) {
        alert("الطلب فارغ. أضف أصناف أولاً.");
        return;
    }
    let orderObj = { name };
    currentOrder.forEach(item => {
        orderObj[item.id] = item.quantity;
        orderObj[`${item.id}_price`] = item.price;
    });
    orderObj["orderTotal"] = currentOrder.reduce((acc, item) => acc + item.price * item.quantity, 0);
    orderObj["createdAt"] = new Date().toISOString();
    try {
        await addDoc(collection(db, "orders"), orderObj);
        alert("تم إرسال الطلب بنجاح!");
        currentOrder = [];
        showCurrentOrder();
        document.getElementById('orderSummary').style.display = 'none';
        clearInputs();
    } catch (e) {
        alert("حدث خطأ أثناء إرسال الطلب.");
    }
}

document.getElementById('itemSelect').onchange = function() {
    const select = document.getElementById('itemSelect');
    const unitPriceHint = document.getElementById('unitPriceHint');
    const price = select.options[select.selectedIndex]?.getAttribute('data-price');
    if (price && price !== "undefined") {
        unitPriceHint.textContent = `سعر الوحدة: ${price} جنيه`;
    } else {
        unitPriceHint.textContent = "";
    }
}

document.getElementById('nameInput').addEventListener('input', function() {
    isNameValid();
});

function clearInputs() {
    document.getElementById('nameInput').value = '';
    document.getElementById('itemSelect').selectedIndex = 0;
    document.getElementById('quantityInput').value = 1;
    document.getElementById('unitPriceHint').textContent = '';
    document.getElementById('nameRequiredMsg').style.display = 'none';
    document.getElementById('nameInput').classList.remove('name-error');
}

// =========== دالة تنسيق الأرقام ===========
function formatNumber(num) {
    if (Number.isInteger(num)) return num;
    return Number(num).toFixed(2).replace(/\.?0+$/, '');
}

// ==================== عرض الطلب المجمع مع القيم ====================
async function displayOrders() {
    const ordersTableBody = document.getElementById("ordersTableBody");
    ordersTableBody.innerHTML = '';
    let totalQuantities = {};
    let totalValues = {};
    let totalSum = 0;
    let totalSandwiches = 0;
    let customersCount = 0;

    itemsList.forEach(item => {
        totalQuantities[item.id] = 0;
        totalValues[item.id] = 0;
    });

    const querySnapshot = await getDocs(collection(db, "orders"));
    let found = false;
    querySnapshot.forEach(doc => {
        const order = doc.data();
        if (order.archived) return;
        found = true;
        customersCount++;
        itemsList.forEach(item => {
            const q = parseInt(order[item.id] || 0);
            if (!isNaN(q) && q > 0) {
                totalQuantities[item.id] += q;
                totalValues[item.id] += q * (order[`${item.id}_price`] || item.price || 0);
                if (item.id !== 'delivery') totalSandwiches += q;
            }
        });
    });

    if (!found) {
        ordersTableBody.innerHTML = '<tr><td colspan="4">لا توجد طلبات حالياً.</td></tr>';
        document.getElementById("totalOrderValueRow")?.remove();
        document.getElementById("totalQuantityRow")?.remove();
        return;
    }

    itemsList.forEach(item => {
        if (totalQuantities[item.id] > 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${totalQuantities[item.id]}</td>
                <td>${item.price} جنيه</td>
                <td>${totalValues[item.id]} جنيه</td>
            `;
            ordersTableBody.appendChild(row);
            if (item.id !== 'delivery')
                totalSum += totalValues[item.id];
        }
    });

    let deliveryTotal = 0;
    const deliveryItem = itemsList.find(x => x.id === 'delivery');
    if (deliveryItem && deliveryItem.price && totalSandwiches > 0) {
        deliveryTotal = deliveryItem.price;
        totalSum += deliveryTotal;
        const deliveryRow = document.createElement("tr");
        deliveryRow.innerHTML = `
            <td>خدمة توصيل</td>
            <td colspan="2"></td>
            <td>${deliveryTotal} جنيه</td>
        `;
        ordersTableBody.appendChild(deliveryRow);
    }

    // ========== إضافة إجمالي الكمية ==========
    let totalQuantity = 0;
    itemsList.forEach(item => {
        if (item.id !== 'delivery') {
            totalQuantity += totalQuantities[item.id];
        }
    });

    let totalQuantityRow = document.getElementById("totalQuantityRow");
    if (!totalQuantityRow) {
        totalQuantityRow = document.createElement("tr");
        totalQuantityRow.id = "totalQuantityRow";
        // سيتم إضافته قبل الإجمالي الكلي المطلوب دفعه
        // سنضيفه مؤقتا في نهاية الجدول ثم ننقله بعد قليل
        ordersTableBody.parentElement.appendChild(totalQuantityRow);
    }
    totalQuantityRow.innerHTML = `
        <td colspan="3" style="font-weight:bold; text-align:right;">إجمالي الكمية:</td>
        <td style="font-weight:bold; color:#8a2be2;">${totalQuantity}</td>
    `;

    // ========== الإجمالي الكلي المطلوب دفعه ==========
    let totalRow = document.getElementById("totalOrderValueRow");
    if (!totalRow) {
        totalRow = document.createElement("tr");
        totalRow.id = "totalOrderValueRow";
        ordersTableBody.parentElement.appendChild(totalRow);
    }
    totalRow.innerHTML = `
        <td colspan="3" style="font-weight:bold; text-align:right;">الإجمالي الكلي المطلوب دفعه${customersCount > 1 ? " (" + customersCount + " عملاء)" : ""}:</td>
        <td style="font-weight:bold; color:#1a7b3e;">${totalSum} جنيه</td>
    `;

    // ترتيب الصفوف: إجمالي الكمية ثم الإجمالي الكلي
    // لو لم يكنوا مرتبين بهذا الترتيب، قم بنقلهم
    if (totalRow && totalQuantityRow) {
        const tbody = ordersTableBody.parentElement;
        // احذفهم مؤقتاً لو كانوا موجودين
        if (totalQuantityRow.parentElement === tbody) tbody.removeChild(totalQuantityRow);
        if (totalRow.parentElement === tbody) tbody.removeChild(totalRow);
        // أضف إجمالي الكمية أولاً
        tbody.appendChild(totalQuantityRow);
        // ثم الإجمالي الكلي المطلوب دفعه
        tbody.appendChild(totalRow);
    }

    const usersOutput = document.getElementById("usersOutput");
    usersOutput.innerHTML = '';
    querySnapshot.forEach(doc => {
        const order = doc.data();
        if (order.archived) return;
        const userDiv = document.createElement("div");
        userDiv.textContent = order.name;
        usersOutput.appendChild(userDiv);
    });
}

async function displayIndividualOrders() {
    const individualOrdersOutput = document.getElementById("individualOrdersOutput");
    individualOrdersOutput.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, "orders"));
    if (querySnapshot.empty) {
        individualOrdersOutput.innerHTML = '<p>لا توجد طلبات حالياً.</p>';
        return;
    }

    let userSandwichCount = {};
    let totalSandwiches = 0;
    let users = [];
    let userDocs = {};

    querySnapshot.forEach(doc => {
        const order = doc.data();
        if (order.archived) return;
        let sandwichCount = 0;
        fallbackItems.forEach(item => {
            if (item.id !== 'delivery' && order[item.id]) {
                sandwichCount += Number(order[item.id]) || 0;
            }
        });
        userSandwichCount[order.name] = sandwichCount;
        totalSandwiches += sandwichCount;
        if (!users.includes(order.name)) users.push(order.name);
        userDocs[order.name] = order;
    });

    const deliveryItem = fallbackItems.find(x => x.id === 'delivery');
    const deliveryValue = deliveryItem ? deliveryItem.price : 0;

    let deliveryDistribution = {};
    if (totalSandwiches > 0) {
        users.forEach(name => {
            const userCount = userSandwichCount[name] || 0;
            const share = Math.round((userCount / totalSandwiches) * deliveryValue * 100) / 100;
            deliveryDistribution[name] = share;
        });
    }
    let table = document.createElement('table');
    table.className = "delivery-table";
    table.innerHTML = `
        <colgroup>
            <col class="name-col">
            <col class="details-col">
            <col class="count-col">
            <col class="share-col">
            <col class="total-col">
        </colgroup>
        <thead>
            <tr>
                <th>الاسم</th>
                <th>تفاصيل الطلب</th>
                <th>عدد السندوتشات</th>
                <th>نصيبه من التوصيل (جنيه)</th>
                <th>الإجمالي بعد التوصيل (جنيه)</th>
            </tr>
        </thead>
        <tbody id="individualOrdersTableBody"></tbody>
    `;
    individualOrdersOutput.appendChild(table);

    const tbody = document.getElementById("individualOrdersTableBody");
    users.forEach(name => {
        const order = userDocs[name];
        let orderDetails = '';
        let orderTotal = 0;
        let sandwichCount = 0;
        itemsList.forEach(item => {
            if (order[item.id] > 0) {
                let price = order[`${item.id}_price`] || item.price || 0;
                let quantity = order[item.id];
                orderTotal += price * quantity;
                if (item.id !== 'delivery') sandwichCount += quantity;
                orderDetails += `<div>${item.name}: ${quantity} × ${price} = <b>${quantity * price}</b> جنيه</div>`;
            }
        });
        let delivery = 0;
        if (deliveryDistribution && typeof deliveryDistribution[name] !== "undefined") {
            delivery = deliveryDistribution[name];
            orderDetails += `<div style="color:#125d99;"><b>خدمة توصيل:</b> ${formatNumber(delivery)} جنيه</div>`;
            orderTotal += delivery;
        }
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${name}</td>
            <td>${orderDetails}</td>
            <td style="text-align:center;">${formatNumber(sandwichCount)}</td>
            <td style="text-align:center;">${formatNumber(delivery)}</td>
            <td style="font-weight:bold;text-align:center;color:#1a7b3e;">${formatNumber(orderTotal)}</td>
        `;
        tbody.appendChild(tr);
    });

    let totalDelivery = 0;
    let grandTotal = 0;
    users.forEach(name => {
        const order = userDocs[name];
        let orderTotal = 0;
        itemsList.forEach(item => {
            if (order[item.id] > 0) {
                let price = order[`${item.id}_price`] || item.price || 0;
                let quantity = order[item.id];
                orderTotal += price * quantity;
            }
        });
        let delivery = deliveryDistribution[name] || 0;
        totalDelivery += delivery;
        grandTotal += orderTotal + delivery;
    });
    let tfoot = document.createElement('tfoot');
    tfoot.innerHTML = `
        <tr>
            <td colspan="3" style="text-align:right;font-weight:bold;">المجموع الكلي بخدمة التوصيل</td>
            <td style="text-align:center;font-weight:bold;">${formatNumber(totalDelivery)}</td>
            <td style="text-align:center;font-weight:bold;">${formatNumber(grandTotal)}</td>
        </tr>
    `;
    table.appendChild(tfoot);
}

function toggleSections(sectionToShow) {
    const sections = ["ordersSection", "individualOrdersSection"];
    sections.forEach(section => {
        document.getElementById(section).style.display = (section === sectionToShow) ? 'block' : 'none';
    });
}

document.getElementById("viewOrdersButton").onclick = () => {
    toggleSections("ordersSection");
    displayOrders();
};
document.getElementById("viewIndividualOrdersButton").onclick = () => {
    toggleSections("individualOrdersSection");
    displayIndividualOrders();
};

function updateAdminUI(user) {
    const addBtn = document.getElementById('openAddItemModal');
    const loginBtn = document.getElementById('adminLoginBtn');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    const viewOrdersBtn = document.getElementById('viewOrdersButton');
    const clearBtn = document.getElementById('clearAllOrdersButton');

    if (user && user.email === ADMIN_EMAIL) {
        addBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
        loginBtn.style.display = 'none';
        viewOrdersBtn.style.display = 'inline-block';
        clearBtn.style.display = 'inline-block';
    } else {
        addBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        viewOrdersBtn.style.display = 'none';
        clearBtn.style.display = 'none';
    }
}

onAuthStateChanged(auth, (user) => {
    updateAdminUI(user);
});

window.onload = async function() {
    document.getElementById('adminLoginBtn').onclick = function() {
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminLoginMsg').textContent = '';
        document.getElementById('adminLoginModal').style.display = 'flex';
    };
    document.getElementById('adminLoginCancelBtn').onclick = function() {
        document.getElementById('adminLoginModal').style.display = 'none';
    };
    document.getElementById('adminLoginConfirmBtn').onclick = async function() {
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;
        const msg = document.getElementById('adminLoginMsg');
        msg.textContent = '';
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            if (cred.user.email !== ADMIN_EMAIL) {
                await signOut(auth);
                msg.textContent = 'ليس لديك صلاحية الأدمن!';
            } else {
                document.getElementById('adminLoginModal').style.display = 'none';
            }
        } catch (e) {
            msg.textContent = 'بيانات الدخول خطأ!';
        }
    };
    document.getElementById('adminLogoutBtn').onclick = function() {
        signOut(auth);
    };

    document.getElementById('openAddItemModal').onclick = function() {
        document.getElementById('modalItemName').value = '';
        document.getElementById('modalItemPrice').value = '';
        document.getElementById('modalAddItemMsg').textContent = '';
        document.getElementById('addItemModal').style.display = 'flex';
    };
    document.getElementById('closeAddItemModal').onclick = function() {
        document.getElementById('addItemModal').style.display = 'none';
    };

    document.getElementById('confirmAddItem').onclick = async function() {
        const name = document.getElementById('modalItemName').value.trim();
        const price = parseFloat(document.getElementById('modalItemPrice').value);
        const msg = document.getElementById('modalAddItemMsg');
        msg.style.color = "red";
        if (!name || isNaN(price) || price < 1) {
            msg.textContent = 'أدخل اسم وسعر صحيحين';
            return;
        }
        const normalized = (s) => s.replace(/\s+/g,'').toLowerCase();
        if (
          itemsList.some(i => normalized(i.name) === normalized(name)) ||
          fallbackItems.some(i => normalized(i.name) === normalized(name))
        ) {
            msg.textContent = 'الصنف موجود بالفعل';
            return;
        }
        try {
            await addDoc(collection(db, "items"), { name, price });
            msg.style.color = 'green';
            msg.textContent = 'تمت إضافة الصنف بنجاح';
            await loadItems();
            setTimeout(()=>{
                document.getElementById('addItemModal').style.display = 'none';
                msg.style.color = 'red';
            }, 900);
        } catch (e) {
            msg.style.color = 'red';
            msg.textContent = 'حدث خطأ أثناء الإضافة!';
        }
    };

    document.getElementById('clearAllOrdersButton').onclick = async function() {
        if (!confirm("هل أنت متأكد أنك تريد حذف جميع الطلبات بشكل يدوي؟ لا يمكن التراجع!")) return;
        const password = prompt("يرجى إدخال كلمة السر للتأكيد:");
        if (password !== "king777") {
            alert("كلمة السر غير صحيحة.");
            return;
        }
        const querySnapshot = await getDocs(collection(db, "orders"));
        let count = 0;
        for (const docu of querySnapshot.docs) {
            try {
                await deleteDoc(docu.ref);
                count++;
            } catch(e){}
        }
        alert("تم حذف جميع الطلبات (" + count + ") بنجاح.");
        displayOrders();
        displayIndividualOrders();
        document.getElementById("usersOutput").innerHTML = '';
    };

    await autoArchiveOldOrders();
    await loadItems();
    clearInputs();
    currentOrder = [];
    showCurrentOrder();
};
