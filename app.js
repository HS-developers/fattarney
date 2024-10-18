const orders = []; // تعريف المصفوفة لتخزين الطلبات

function submitOrder() {
    const name = document.getElementById("name").value;
    const ful = document.getElementById("ful").value;
    const taamiya = document.getElementById("taamiya").value;
    const taamiyaMahshiya = document.getElementById("taamiyaMahshiya").value;
    const chipsy = document.getElementById("chipsy").value;
    const potatoTawae = document.getElementById("potatoTawae").value;
    const mashedPotato = document.getElementById("mashedPotato").value;
    const musaqaa = document.getElementById("musaqaa").value;
    const pickles = document.getElementById("pickles").value;

    // إضافة الطلب إلى المصفوفة
    orders.push({
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

    // تحديث عرض الطلبات
    displayOrders();

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
}

function displayOrders() {
    const output = document.getElementById("orders-output");
    output.innerHTML = ''; // مسح المحتوى القديم

    if (orders.length === 0) {
        output.innerHTML = 'لا توجد طلبات حالياً.';
        return;
    }

    // عرض الطلبات
    const totalOrders = {};
    orders.forEach(order => {
        if (!totalOrders[order.name]) {
            totalOrders[order.name] = {
                ...order,
                total: {
                    ful: 0,
                    taamiya: 0,
                    taamiyaMahshiya: 0,
                    chipsy: 0,
                    potatoTawae: 0,
                    mashedPotato: 0,
                    musaqaa: 0,
                    pickles: 0,
                }
            };
        }
        totalOrders[order.name].total.ful += parseInt(order.ful);
        totalOrders[order.name].total.taamiya += parseInt(order.taamiya);
        totalOrders[order.name].total.taamiyaMahshiya += parseInt(order.taamiyaMahshiya);
        totalOrders[order.name].total.chipsy += parseInt(order.chipsy);
        totalOrders[order.name].total.potatoTawae += parseInt(order.potatoTawae);
        totalOrders[order.name].total.mashedPotato += parseInt(order.mashedPotato);
        totalOrders[order.name].total.musaqaa += parseInt(order.musaqaa);
        totalOrders[order.name].total.pickles += parseInt(order.pickles);
    });

    for (const name in totalOrders) {
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = `<strong>${name}</strong><br>
            فول: ${totalOrders[name].total.ful}<br>
            طعمية: ${totalOrders[name].total.taamiya}<br>
            طعمية محشية: ${totalOrders[name].total.taamiyaMahshiya}<br>
            بطاطس شيبسي: ${totalOrders[name].total.chipsy}<br>
            بطاطس طوابع: ${totalOrders[name].total.potatoTawae}<br>
            بطاطس مهروسة: ${totalOrders[name].total.mashedPotato}<br>
            مسقعة باذنجان: ${totalOrders[name].total.musaqaa}<br>
            مخلل: ${totalOrders[name].total.pickles}<br><br>`;
        output.appendChild(orderDiv);
    }
}

function displayIndividualOrders() {
    const output = document.getElementById("orders-output");
    output.innerHTML = ''; // مسح المحتوى القديم

    if (orders.length === 0) {
        output.innerHTML = 'لا توجد طلبات فردية حالياً.';
        return;
    }

    // عرض الطلبات الفردية
    const individualOrders = {};
    orders.forEach(order => {
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
