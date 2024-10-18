import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBzP4OtoiS454f7W9x21QGTDQRixryt6Dg",
  authDomain: "fattarney.firebaseapp.com",
  projectId: "fattarney",
  storageBucket: "fattarney.appspot.com",
  messagingSenderId: "318340301705",
  appId: "1:318340301705:web:4913c2acbafab6b8509758",
  measurementId: "G-RSF806GJYJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function submitOrder() {
  const name = document.getElementById('name').value;
  const ful = +document.getElementById('ful').value;
  const taamiya = +document.getElementById('taamiya').value;
  const taamiyaMahshiya = +document.getElementById('taamiyaMahshiya').value;
  const chipsy = +document.getElementById('chipsy').value;
  const potatoTawae = +document.getElementById('potatoTawae').value;
  const mashedPotato = +document.getElementById('mashedPotato').value;
  const musaqaa = +document.getElementById('musaqaa').value;
  const pickles = +document.getElementById('pickles').value;

  try {
    console.log("إرسال الطلب...");
    await addDoc(collection(db, "orders"), {
      name: name,
      ful: ful,
      taamiya: taamiya,
      taamiyaMahshiya: taamiyaMahshiya,
      chipsy: chipsy,
      potatoTawae: potatoTawae,
      mashedPotato: mashedPotato,
      musaqaa: musaqaa,
      pickles: pickles
    });
    alert('تم إرسال الطلب بنجاح!');
  } catch (e) {
    console.error("حدث خطأ: ", e);
    alert('حدث خطأ في إرسال الطلب');
  }
}

async function displayOrders() {
  const ordersOutput = document.getElementById('orders-output');
  ordersOutput.innerHTML = ''; // مسح المحتوى السابق

  const querySnapshot = await getDocs(collection(db, "orders"));
  let totalQuantities = {
    ful: 0,
    taamiya: 0,
    taamiyaMahshiya: 0,
    chipsy: 0,
    potatoTawae: 0,
    mashedPotato: 0,
    musaqaa: 0,
    pickles: 0
  };

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    totalQuantities.ful += data.ful;
    totalQuantities.taamiya += data.taamiya;
    totalQuantities.taamiyaMahshiya += data.taamiyaMahshiya;
    totalQuantities.chipsy += data.chipsy;
    totalQuantities.potatoTawae += data.potatoTawae;
    totalQuantities.mashedPotato += data.mashedPotato;
    totalQuantities.musaqaa += data.musaqaa;
    totalQuantities.pickles += data.pickles;
  });

  ordersOutput.innerHTML += `<h3>الطلبات المجمعة:</h3>
    <p>فول: ${totalQuantities.ful}</p>
    <p>طعمية: ${totalQuantities.taamiya}</p>
    <p>طعمية محشية: ${totalQuantities.taamiyaMahshiya}</p>
    <p>بطاطس شيبسي: ${totalQuantities.chipsy}</p>
    <p>بطاطس طوابع: ${totalQuantities.potatoTawae}</p>
    <p>بطاطس مهروسة: ${totalQuantities.mashedPotato}</p>
    <p>مسقعة باذنجان: ${totalQuantities.musaqaa}</p>
    <p>مخلل: ${totalQuantities.pickles}</p>`;
}

async function displayIndividualOrders() {
  const ordersOutput = document.getElementById('orders-output');
  ordersOutput.innerHTML = ''; // مسح المحتوى السابق

  const querySnapshot = await getDocs(collection(db, "orders"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    ordersOutput.innerHTML += `
      <h3>${data.name}:</h3>
      <p>فول: ${data.ful}</p>
      <p>طعمية: ${data.taamiya}</p>
      <p>طعمية محشية: ${data.taamiyaMahshiya}</p>
      <p>بطاطس شيبسي: ${data.chipsy}</p>
      <p>بطاطس طوابع: ${data.potatoTawae}</p>
      <p>بطاطس مهروسة: ${data.mashedPotato}</p>
      <p>مسقعة باذنجان: ${data.musaqaa}</p>
      <p>مخلل: ${data.pickles}</p>
      <hr>
    `;
  });
}
