// ====== 2. الطقس في القاهرة ======
const WEATHER_API_KEY = "7510143ffde743d520303604ed5ac07f"; // استخدم مفتاح مجاني من openweathermap.org
async function updateWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Cairo,EG&appid=${WEATHER_API_KEY}&units=metric&lang=ar`;
    const res = await fetch(url);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    document.getElementById('weatherLive').innerHTML =
      `<img src="${iconUrl}" alt="طقس" style="vertical-align:middle;width:28px;"> 
      ${desc} <b>${temp}°</b>`;
  } catch {
    document.getElementById('weatherLive').textContent = 'تعذر جلب الطقس';
  }
}

// تحديث تلقائي كل ساعة
setInterval(updateWeather, 60 * 60 * 1000); // كل ساعة

// أول تحميل
updateWeather();
