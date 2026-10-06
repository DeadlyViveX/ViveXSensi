const API_URL =
"https://script.google.com/macros/s/AKfycbzrRRiwN1uYSzAaSy9fQ6WM7b4XOcxbZGyX5JWsIyF91-fjWgi0sdMDXi-BKrWQrqmm2A/exec";


function $(id){
  return document.getElementById(id);
}


// ================================
// MOBILE CHECK
// ================================

function isMobileDevice(){

  const ua =
    navigator.userAgent ||
    navigator.vendor ||
    window.opera;

  return /android|iphone|ipad|ipod|mobile/i.test(ua);
}

const IS_MOBILE = isMobileDevice();

if(!IS_MOBILE){

  document.addEventListener("DOMContentLoaded", () => {

    const block = $("desktopBlock");

    if(block){
      block.style.display = "flex";
    }

    document.body.style.overflow = "hidden";

  });

}


// ================================
// STATE
// ================================

const state = {

  brand:"",
  ram:"",
  storage:"",

  density:0,

  screenWidth:0,
  screenHeight:0,

  dpr:1

};


// ================================
// BRANDS
// ================================

const BRANDS = [

  "Samsung",
  "Realme",
  "Vivo",
  "OPPO",
  "Xiaomi",
  "Redmi",
  "OnePlus",
  "Motorola",
  "Infinix",
  "Tecno",
  "iQOO",
  "Apple",
  "POCO",
  "Nothing",
  "Honor",
  "Google Pixel"

];


// ================================
// BRAND FACTOR
// ================================

const BRAND_FACTOR = {

  "Samsung":0,
  "Realme":2,
  "Vivo":2,
  "OPPO":1,
  "Xiaomi":3,
  "Redmi":3,
  "OnePlus":4,
  "Motorola":0,
  "Infinix":3,
  "Tecno":3,
  "iQOO":5,
  "Apple":-3,
  "POCO":4,
  "Nothing":1,
  "Honor":1,
  "Google Pixel":-2

};


// ================================
// RAM FACTOR
// ================================

const RAM_FACTOR = {

  "4 GB":5,
  "6 GB":3,
  "8 GB":1,
  "12 GB":-1,
  "16 GB":-3,
  "24 GB":-5

};


// ================================
// STORAGE FACTOR
// ================================

const STORAGE_FACTOR = {

  "32 GB":5,
  "64 GB":3,
  "128 GB":1,
  "256 GB":-1,
  "512 GB":-3,
  "1 TB":-5

};


// ================================
// DEVICE ID
// ================================

function getDeviceId(){

  const KEY =
    "vivex_device_id";

  let id =
    localStorage.getItem(KEY);

  if(id){
    return id;
  }

  const random =
    Math.random()
      .toString(36)
      .substring(2,10)
      .toUpperCase();

  const time =
    Date.now()
      .toString(36)
      .toUpperCase();

  id =
    "VXDEV-" +
    time +
    "-" +
    random;

  localStorage.setItem(
    KEY,
    id
  );

  return id;
}


// ================================
// NAVIGATION
// ================================

function goTo(id){

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove("active");

    });

  const target =
    $(id);

  if(target){

    target.classList.add("active");

  }

  window.scrollTo(0,0);

}


// ================================
// INITIALIZE
// ================================

function init(){

  const grid =
    $("brandGrid");

  if(!grid){
    return;
  }

  grid.innerHTML = "";

  BRANDS.forEach(brand => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "brand-card";

    button.textContent =
      brand;

    button.addEventListener(
      "click",
      () => selectBrand(brand)
    );

    grid.appendChild(button);

  });

}


// ================================
// BRAND SELECT
// ================================

function selectBrand(brand){

  state.brand =
    brand;

  document
    .querySelectorAll(".brand-card")
    .forEach(card => {

      card.classList.toggle(
        "selected",
        card.textContent === brand
      );

    });

  if($("selectedBrand")){

    $("selectedBrand").textContent =
      brand;

  }

  updateNext();

}


// ================================
// OPEN DEVICE
// ================================

function openDeviceStep(){

  if(!state.brand){
    return;
  }

  if($("selectedBrand")){

    $("selectedBrand").textContent =
      state.brand;

  }

  goTo("device");

}


// ================================
// SCAN DENSITY
// ================================

function scanDensity(){

  const dpr =
    window.devicePixelRatio || 1;

  const width =
    Math.round(
      window.screen.width * dpr
    );

  const height =
    Math.round(
      window.screen.height * dpr
    );

  const ppi =
    Math.round(
      160 * dpr
    );

  state.density =
    ppi;

  state.screenWidth =
    width;

  state.screenHeight =
    height;

  state.dpr =
    dpr;

  if($("densityText")){

    $("densityText").textContent =
      `Detected • ${width} × ${height} • ${dpr.toFixed(2)}x • ~${ppi} PPI`;

  }

  updateNext();

}


// ================================
// UPDATE BUTTONS
// ================================

function updateNext(){

  if($("brandNext")){

    $("brandNext").disabled =
      !state.brand;

  }


  if($("ramSelect")){

    state.ram =
      $("ramSelect").value;

  }


  if($("storageSelect")){

    state.storage =
      $("storageSelect").value;

  }


  if($("deviceNext")){

    $("deviceNext").disabled =
      !(
        state.brand &&
        state.ram &&
        state.storage &&
        state.density
      );

  }

}


// ================================
// PAYMENT / VERIFICATION
// ================================

function openVerification(){

  goTo("verification");

}


function openPayment(){

  goTo("payment");

}


function openConfirmation(){

  goTo("confirmation");

}


// ================================
// VERIFY CODE
// ================================

function verifyCode(){

  const input =
    $("verificationCode");

  if(!input){
    return;
  }

  const code =
    input.value
      .trim()
      .toUpperCase();

  if(!code){

    showErrorPopup(
      "Please enter your verification code."
    );

    return;

  }


  const deviceId =
    getDeviceId();


  const button =
    document.querySelector(
      "#verification .primary"
    );


  if(button){

    button.disabled =
      true;

    button.innerHTML =
      "Checking...";

  }


  const callback =
    "vivexVerify_" +
    Date.now();


  window[callback] =
    function(result){

      if(
        result &&
        result.success
      ){

        showResult();

      }
      else{

        showErrorPopup(
          result?.message ||
          "Invalid verification code."
        );

      }


      if(button){

        button.disabled =
          false;

        button.innerHTML =
          "Verify <b>✓</b>";

      }


      try{

        delete window[callback];

      }
      catch(e){}

    };


  const script =
    document.createElement("script");


  const params =
    new URLSearchParams();

  params.set(
    "code",
    code
  );

  params.set(
    "device",
    deviceId
  );

  params.set(
    "callback",
    callback
  );


  script.src =
    API_URL +
    "?" +
    params.toString();


  script.onerror =
    function(){

      showErrorPopup(
        "Connection failed. Please try again."
      );


      if(button){

        button.disabled =
          false;

        button.innerHTML =
          "Verify <b>✓</b>";

      }

    };


  document.body.appendChild(script);


  setTimeout(() => {

    try{
      script.remove();
    }
    catch(e){}

  },10000);

}


// ================================
// POPUP
// ================================

function showErrorPopup(message){

  if($("popupMessage")){

    $("popupMessage").textContent =
      message;

  }

  if($("customPopup")){

    $("customPopup")
      .classList
      .add("show");

  }

}


function closeErrorPopup(){

  if($("customPopup")){

    $("customPopup")
      .classList
      .remove("show");

  }

}


// ================================
// DEVICE FACTOR
// ================================

function calculateDeviceFactor(){

  let factor = 0;


  const pixels =
    state.screenWidth *
    state.screenHeight;


  if(pixels >= 2500000){
    factor += 4;
  }
  else if(pixels >= 2000000){
    factor += 3;
  }
  else if(pixels >= 1500000){
    factor += 2;
  }
  else if(pixels >= 1000000){
    factor += 1;
  }


  if(state.density >= 500){
    factor += 4;
  }
  else if(state.density >= 420){
    factor += 3;
  }
  else if(state.density >= 360){
    factor += 2;
  }
  else if(state.density >= 300){
    factor += 1;
  }


  if(state.dpr >= 4){
    factor += 3;
  }
  else if(state.dpr >= 3){
    factor += 2;
  }
  else if(state.dpr >= 2){
    factor += 1;
  }


  return Math.min(
    factor,
    11
  );

}


// ================================
// CLAMP
// ================================

function clamp(
  value,
  min,
  max
){

  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );

}


// ================================
// CALCULATE SETTINGS
// ================================

function calculateSettings(){

  const brand =
    BRAND_FACTOR[state.brand] || 0;

  const ram =
    RAM_FACTOR[state.ram] || 0;

  const storage =
    STORAGE_FACTOR[state.storage] || 0;

  const device =
    calculateDeviceFactor();

  const total =
    brand +
    ram +
    storage +
    device;


  const base =
    145 + total;


  return {

    general:
      clamp(
        base + 15,
        100,
        200
      ),

    redDot:
      clamp(
        base + 8,
        90,
        195
      ),

    twoX:
      clamp(
        base,
        80,
        190
      ),

    fourX:
      clamp(
        base - 12,
        70,
        180
      ),

    sniper:
      clamp(
        base - 45,
        40,
        140
      ),

    freeLook:
      clamp(
        base + 4,
        90,
        195
      ),

    fireButton:
      clamp(
        48 +
        Math.round(total / 2),
        45,
        55
      ),

    dpi:
      clamp(
        Math.round(
          380 +
          (state.density - 320) * 1.2 +
          device * 5 +
          ram * 3 +
          storage * 2
        ),
        320,
        560
      )

  };

}


// ================================
// SHOW RESULT
// ================================

function showResult(){

  const s =
    calculateSettings();


  if($("resultBrand"))
    $("resultBrand").textContent =
      state.brand;


  if($("resultRam"))
    $("resultRam").textContent =
      state.ram;


  if($("resultStorage"))
    $("resultStorage").textContent =
      state.storage;


  if($("resultDensity"))
    $("resultDensity").textContent =
      `~${state.density} PPI`;


  const grid =
    $("settingsGrid");


  if(grid){

    grid.innerHTML = "";


    const list = [

      ["GENERAL",s.general],
      ["RED DOT",s.redDot],
      ["2X SCOPE",s.twoX],
      ["4X SCOPE",s.fourX],
      ["SNIPER",s.sniper],
      ["FREE LOOK",s.freeLook]

    ];


    list.forEach(
      ([name,value]) => {

        const card =
          document.createElement("div");

        card.className =
          "setting-card";

        card.innerHTML = `
          <small>${name}</small>
          <strong>${value}</strong>
        `;

        grid.appendChild(card);

      }
    );

  }


  if($("fireButton"))
    $("fireButton").textContent =
      `${s.fireButton}%`;


  if($("dpi"))
    $("dpi").textContent =
      s.dpi;


  goTo("result");

}


// ================================
// RESTART
// ================================

function restart(){

  state.brand = "";
  state.ram = "";
  state.storage = "";

  state.density = 0;

  state.screenWidth = 0;
  state.screenHeight = 0;
  state.dpr = 1;


  document
    .querySelectorAll(".brand-card")
    .forEach(card => {

      card.classList.remove(
        "selected"
      );

    });


  if($("ramSelect"))
    $("ramSelect").value = "";


  if($("storageSelect"))
    $("storageSelect").value = "";


  if($("densityText"))
    $("densityText").textContent =
      "Not scanned yet";


  if($("verificationCode"))
    $("verificationCode").value = "";


  updateNext();

  goTo("home");

}


// ================================
// POPUP OUTSIDE CLICK
// ================================

document.addEventListener(
  "click",
  event => {

    const popup =
      $("customPopup");

    if(
      popup &&
      event.target === popup
    ){

      closeErrorPopup();

    }

  }
);


// ================================
// START
// ================================

if(
  document.readyState ===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

}
else{

  init();

}
