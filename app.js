const orders = []; // تعريف المتغير orders في النطاق العالمي

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

    // إضافة الطلبات إلى المصفوفة وعرضها
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
    orders.forEach(order => {
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

// إضافة أحداث للأزرار
document.getElementById("submit-btn").addEventListener("click", submitOrder);
document.getElementById("display-orders-btn").addEventListener("click", displayOrders);
