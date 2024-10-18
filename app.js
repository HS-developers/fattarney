document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submit-btn').addEventListener('click', submitOrder);
    document.getElementById('display-orders-btn').addEventListener('click', displayOrders);
    document.getElementById('display-individual-orders-btn').addEventListener('click', displayIndividualOrders);
});
function submitOrder() {
    const name = document.getElementById('name').value;
    const ful = parseInt(document.getElementById('ful').value);
    const taamiya = parseInt(document.getElementById('taamiya').value);
    const taamiyaMahshiya = parseInt(document.getElementById('taamiyaMahshiya').value);
    const chipsy = parseInt(document.getElementById('chipsy').value);
    const potatoTawae = parseInt(document.getElementById('potatoTawae').value);
    const mashedPotato = parseInt(document.getElementById('mashedPotato').value);
    const musaqaa = parseInt(document.getElementById('musaqaa').value);
    const pickles = parseInt(document.getElementById('pickles').value);

    const order = {
        name: name,
        ful: ful,
        taamiya: taamiya,
        taamiyaMahshiya: taamiyaMahshiya,
        chipsy: chipsy,
        potatoTawae: potatoTawae,
        mashedPotato: mashedPotato,
        musaqaa: musaqaa,
        pickles: pickles
    };

    orders.push(order);
    console.log("تم إرسال الطلب:", order);
}

function displayOrders() {
    const output = document.getElementById('orders-output');
    output.innerHTML = '';

    const groupedOrders = orders.reduce((acc, order) => {
        Object.keys(order).forEach(key => {
            if (key !== 'name' && order[key] > 0) {
                acc[key] = (acc[key] || 0) + order[key];
            }
        });
        return acc;
    }, {});

    for (const item in groupedOrders) {
        output.innerHTML += `<p>${item}: ${groupedOrders[item]}</p>`;
    }
}

function displayIndividualOrders() {
    const output = document.getElementById('orders-output');
    output.innerHTML = '';

    orders.forEach(order => {
        output.innerHTML += `<p>اسم: ${order.name}, فول: ${order.ful}, طعمية: ${order.taamiya}, طعمية محشية: ${order.taamiyaMahshiya}, بطاطس شيبسي: ${order.chipsy}, بطاطس طوابع: ${order.potatoTawae}, بطاطس مهروسة: ${order.mashedPotato}, مسقعة: ${order.musaqaa}, مخلل: ${order.pickles}</p>`;
    });
}

// ربط الأحداث
document.getElementById('submit-btn').addEventListener('click', submitOrder);
document.getElementById('display-orders-btn').addEventListener('click', displayOrders);
document.getElementById('display-individual-orders-btn').addEventListener('click', displayIndividualOrders);
