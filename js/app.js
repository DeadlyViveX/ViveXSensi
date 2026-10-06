// ==========================================
// ViveX Sensi - Main JavaScript
// ==========================================


// ==========================================
// APPS SCRIPT WEB APP URL
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzrRRiwN1uYSzAaSy9fQ6WM7b4XOcxbZGyX5JWsIyF91-fjWgi0sdMDXi-BKrWQrqmm2A/exec";


// ==========================================
// MOBILE CHECK
// ==========================================

function isMobileDevice(){

  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    window.opera;

  return /android|iphone|ipad|ipod|mobile/i.test(
    userAgent
  );
}

const IS_MOBILE = isMobileDevice();

if(!IS_MOBILE){

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      const block =
        document.getElementById("desktopBlock");

      if(block){
        block.style.display = "flex";
      }

      document.body.style.overflow = "hidden";
    }
  );
}


// ==========================================
// SHORT SELECTOR
// ==========================================

function $(id){
  return document.getElementById(id);
}


// ==========================================
// DEVICE / USER STATE
// ==========================================

const state = {

  brand:"",
  ram:"",
  storage:"",

  density:0,

  screenWidth:0,
  screenHeight:0,

  dpr:1

};


// ==========================================
// BRANDS
// ==========================================

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


// ==========================================
// BRAND FACTOR
// ==========================================

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


// ==========================================
// RAM FACTOR
// Lower RAM = Higher Sensitivity
// ==========================================

const RAM_FACTOR = {

  "4 GB":5,
  "6 GB":3,
  "8 GB":1,
  "12 GB":-1,
  "16 GB":-3,
  "24 GB":-5

};


// ==========================================
// STORAGE FACTOR
// Lower Storage = Higher Sensitivity
// ==========================================

const STORAGE_FACTOR = {

  "32 GB":5,
  "64 GB":3,
  "128 GB":1,
  "256 GB":-1,
  "512 GB":-3,
  "1 TB":-5

};


// ==========================================
// DEVICE ID
// ==========================================
//
// Browser-generated ID.
// It is stored in localStorage so the same
// browser/device can reuse the same ID.
//
// IMPORTANT:
// This is NOT a permanent hardware ID.
// Clearing browser data can create a new ID.
//

function getDeviceId(){

  const STORAGE_KEY =
    "vivex_device_id";

  let deviceId =
    localStorage.getItem(STORAGE_KEY);

  if(deviceId){
    return deviceId;
  }

  const randomPart =
    Math.random()
      .toString(36)
      .substring(2,10)
      .toUpperCase();

  const timePart =
    Date.now()
      .toString(36)
      .toUpperCase();

  deviceId =
    "VXDEV-" +
    timePart +
    "-" +
    randomPart;

  localStorage.setItem(
    STORAGE_KEY,
    deviceId
  );

  return deviceId;
}


// Create device ID immediately
const DEVICE_ID = getDeviceId();


// ==========================================
// NAVIGATION
// ==========================================

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

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


// ==========================================
// INITIALIZE
// ==========================================

function init(){

  const brandGrid =
    $("brandGrid");

  if(brandGrid){

    brandGrid.innerHTML = "";

    BRANDS.forEach(brand => {

      const button =
        document.createElement("button");

      button.className =
        "brand-card";

      button.type =
        "button";

      button.textContent =
        brand;

      button.onclick = () =>
        selectBrand(brand);

      brandGrid.appendChild(button);

    });

  }

}


// ==========================================
// BRAND SELECTION
// ==========================================

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

  const selectedBrand =
    $("selectedBrand");

  if(selectedBrand){

    selectedBrand.textContent =
      brand;

  }

  updateNext();

}


// ==========================================
// OPEN DEVICE STEP
// ==========================================

function openDeviceStep(){

  if(!state.brand){
    return;
  }

  const selectedBrand =
    $("selectedBrand");

  if(selectedBrand){

    selectedBrand.textContent =
      state.brand;

  }

  goTo("device");

}


// ==========================================
// SCAN PIXEL DENSITY
// ==========================================

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


  const densityText =
    $("densityText");

  if(densityText){

    densityText.textContent =
      `Detected • ${width} × ${height} • ${dpr.toFixed(2)}x • ~${ppi} PPI`;

  }

  updateNext();

}


// ==========================================
// CHECK NEXT BUTTON
// ==========================================

function updateNext(){

  const brandNext =
    $("brandNext");

  if(brandNext){

    brandNext.disabled =
      !state.brand;

  }


  const ram =
    $("ramSelect")
      ? $("ramSelect").value
      : "";

  const storage =
    $("storageSelect")
      ? $("storageSelect").value
      : "";


  state.ram =
    ram;

  state.storage =
    storage;


  const deviceNext =
    $("deviceNext");

  if(deviceNext){

    deviceNext.disabled =
      !(
        state.brand &&
        state.ram &&
        state.storage &&
        state.density
      );

  }

}


// ==========================================
// OPEN VERIFICATION
// ==========================================

function openVerification(){

  goTo("verification");

}


// ==========================================
// OPEN PAYMENT
// ==========================================

function openPayment(){

  goTo("payment");

}


// ==========================================
// OPEN CONFIRMATION
// ==========================================

function openConfirmation(){

  goTo("confirmation");

}


// ==========================================
// UNIQUE CODE VERIFICATION
// ==========================================
//
// Code is checked through Google Apps Script.
//
// First successful verification:
//     Code + Device ID saved in Google Sheet.
//
// Same device later:
//     Allowed.
//
// Different device:
//     Blocked.
//

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


  // Prevent multiple requests
  const verifyButton =
    document.querySelector(
      '#verification .primary'
    );

  if(verifyButton){

    verifyButton.disabled =
      true;

    verifyButton.textContent =
      "Checking...";

  }


  const callbackName =
    "vivexCallback_" +
    Date.now();


  window[callbackName] =
    function(result){

      try{

        if(
          result &&
          result.success
        ){

          showResult();

        }
        else{

          showErrorPopup(
            result &&
            result.message
              ? result.message
              : "Invalid verification code."
          );

        }

      }
      catch(error){

        showErrorPopup(
          "Verification failed. Please try again."
        );

      }


      if(verifyButton){

        verifyButton.disabled =
          false;

        verifyButton.innerHTML =
          'Verify <b>✓</b>';

      }


      try{

        delete window[callbackName];

      }
      catch(e){}

    };


  const script =
    document.createElement("script");


  const params =
    new URLSearchParams({

      code:code,

      device:deviceId,

      callback:callbackName

    });


  script.src =
    API_URL +
    "?" +
    params.toString();


  script.onerror =
    function(){

      showErrorPopup(
        "Unable to connect to verification server. Please try again."
      );


      if(verifyButton){

        verifyButton.disabled =
          false;

        verifyButton.innerHTML =
          'Verify <b>✓</b>';

      }


      try{

        delete window[callbackName];

      }
      catch(e){}

    };


  document.body.appendChild(script);


  // Cleanup script after request
  setTimeout(() => {

    try{

      script.remove();

    }
    catch(e){}

  },10000);

}


// ==========================================
// ERROR POPUP
// ==========================================

function showErrorPopup(message){

  const popupMessage =
    $("popupMessage");

  if(popupMessage){

    popupMessage.textContent =
      message;

  }


  const popup =
    $("customPopup");

  if(popup){

    popup.classList.add("show");

  }

}


// ==========================================
// CLOSE ERROR POPUP
// ==========================================

function closeErrorPopup(){

  const popup =
    $("customPopup");

  if(popup){

    popup.classList.remove("show");

  }

}


// ==========================================
// CALCULATE DEVICE FACTOR
// ==========================================

function calculateDeviceFactor(){

  let factor = 0;


  // Resolution effect
  if(
    state.screenWidth &&
    state.screenHeight
  ){

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

  }


  // PPI effect
  if(state.density){

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

  }


  // DPR effect
  if(state.dpr){

    if(state.dpr >= 4){
      factor += 3;
    }
    else if(state.dpr >= 3){
      factor += 2;
    }
    else if(state.dpr >= 2){
      factor += 1;
    }

  }


  return Math.min(
    factor,
    11
  );

}


// ==========================================
// CALCULATE SENSITIVITY
// ==========================================

function calculateSettings(){

  const brandFactor =
    BRAND_FACTOR[state.brand] || 0;


  const ramEffect =
    RAM_FACTOR[state.ram] || 0;


  const storageEffect =
    STORAGE_FACTOR[state.storage] || 0;


  const deviceFactor =
    calculateDeviceFactor();


  const totalFactor =
    brandFactor +
    ramEffect +
    storageEffect +
    deviceFactor;


  // Base sensitivity
  const base =
    145 +
    totalFactor;


  const general =
    clamp(
      base + 15,
      100,
      200
    );


  const redDot =
    clamp(
      base + 8,
      90,
      195
    );


  const twoX =
    clamp(
      base,
      80,
      190
    );


  const fourX =
    clamp(
      base - 12,
      70,
      180
    );


  const sniper =
    clamp(
      base - 45,
      40,
      140
    );


  const freeLook =
    clamp(
      base + 4,
      90,
      195
    );


  const fireButton =
    clamp(
      48 +
      Math.round(
        totalFactor / 2
      ),
      45,
      55
    );


  // DPI recommendation
  const dpi =
    clamp(
      Math.round(
        380 +
        (
          state.density - 320
        ) * 1.2 +
        deviceFactor * 5 +
        ramEffect * 3 +
        storageEffect * 2
      ),
      320,
      560
    );


  return {

    general,
    redDot,
    twoX,
    fourX,
    sniper,
    freeLook,

    fireButton,

    dpi

  };

}


// ==========================================
// CLAMP
// ==========================================

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


// ==========================================
// SHOW RESULT
// ==========================================

function showResult(){

  const settings =
    calculateSettings();


  // Brand
  if($("resultBrand")){

    $("resultBrand").textContent =
      state.brand;

  }


  // RAM
  if($("resultRam")){

    $("resultRam").textContent =
      state.ram;

  }


  // Storage
  if($("resultStorage")){

    $("resultStorage").textContent =
      state.storage;

  }


  // Density
  if($("resultDensity")){

    $("resultDensity").textContent =
      `~${state.density} PPI`;

  }


  // Settings grid
  const grid =
    $("settingsGrid");


  if(grid){

    grid.innerHTML = "";


    const settingsList = [

      [
        "GENERAL",
        settings.general
      ],

      [
        "RED DOT",
        settings.redDot
      ],

      [
        "2X SCOPE",
        settings.twoX
      ],

      [
        "4X SCOPE",
        settings.fourX
      ],

      [
        "SNIPER",
        settings.sniper
      ],

      [
        "FREE LOOK",
        settings.freeLook
      ]

    ];


    settingsList.forEach(
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


  // Fire button
  if($("fireButton")){

    $("fireButton").textContent =
      `${settings.fireButton}%`;

  }


  // DPI
  if($("dpi")){

    $("dpi").textContent =
      settings.dpi;

  }


  goTo("result");

}


// ==========================================
// RESTART
// ==========================================

function restart(){

  state.brand = "";
  state.ram = "";
  state.storage = "";

  state.density = 0;

  state.screenWidth = 0;
  state.screenHeight = 0;

  state.dpr = 1;


  // Reset brand selection
  document
    .querySelectorAll(".brand-card")
    .forEach(card => {

      card.classList.remove(
        "selected"
      );

    });


  // Reset RAM
  if($("ramSelect")){

    $("ramSelect").value =
      "";

  }


  // Reset Storage
  if($("storageSelect")){

    $("storageSelect").value =
      "";

  }


  // Reset density
  if($("densityText")){

    $("densityText").textContent =
      "Not scanned yet";

  }


  // Reset verification input
  if($("verificationCode")){

    $("verificationCode").value =
      "";

  }


  updateNext();

  goTo("home");

}


// ==========================================
// CLOSE POPUP WHEN CLICKING OUTSIDE
// ==========================================

document.addEventListener(
  "click",
  function(event){

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


// ==========================================
// START APP
// ==========================================

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
