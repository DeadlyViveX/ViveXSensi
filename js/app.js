/* =================================
   MOBILE ONLY CHECK
================================= */

function isMobileDevice(){

  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    window.opera;


  return /android|iphone|ipad|ipod|mobile/i.test(
    userAgent
  );

}


const IS_MOBILE =
  isMobileDevice();



if(!IS_MOBILE){

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      const block =
        document.getElementById(
          "desktopBlock"
        );


      if(block){

        block.style.display =
          "flex";

      }


      document.body.style.overflow =
        "hidden";

    }
  );

}


/* =================================
   STATE
================================= */

const state = {

  brand:"",
  ram:"",
  storage:"",

  density:0,

  screenWidth:0,
  screenHeight:0,

  dpr:1

};


/* =================================
   HELPER
================================= */

const $ = (id) =>
  document.getElementById(id);


/* =================================
   PHONE BRANDS
================================= */

const BRANDS = [

  "Samsung",
  "Realme",
  "Vivo",
  "OPPO",
  "Xiaomi",
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


/* =================================
   BRAND TUNING
================================= */

const BRAND_FACTOR = {

  "Samsung":0,

  "Realme":2,

  "Vivo":2,

  "OPPO":1,

  "Xiaomi":3,

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


/* =================================
   NAVIGATION
================================= */

function goTo(id){

  document
    .querySelectorAll(".screen")
    .forEach(
      (screen) => {

        screen.classList.remove(
          "active"
        );

      }
    );


  const target =
    $(id);


  if(!target){
    return;
  }


  target.classList.add(
    "active"
  );


  window.scrollTo({

    top:0,

    behavior:"smooth"

  });

}


/* =================================
   LOAD BRANDS
================================= */

function init(){

  const brandGrid =
    $("brandGrid");


  if(!brandGrid){
    return;
  }


  brandGrid.innerHTML =
    BRANDS
      .map(
        (brand) => `

          <button
            class="brand"
            onclick="selectBrand('${brand}', this)"
          >

            ${brand}

          </button>

        `
      )
      .join("");

}


/* =================================
   SELECT BRAND
================================= */

function selectBrand(
  brand,
  element
){

  state.brand =
    brand;


  $("brandNext").disabled =
    false;


  document
    .querySelectorAll(".brand")
    .forEach(
      (item) => {

        item.classList.remove(
          "selected"
        );

      }
    );


  element.classList.add(
    "selected"
  );

}


/* =================================
   DEVICE PAGE
================================= */

function openDeviceStep(){

  $("selectedBrand")
    .textContent =
    state.brand;


  $("ramSelect").value =
    "";

  $("storageSelect").value =
    "";


  state.ram =
    "";

  state.storage =
    "";

  state.density =
    0;

  state.screenWidth =
    0;

  state.screenHeight =
    0;

  state.dpr =
    1;


  $("densityText")
    .textContent =
    "Not scanned yet";


  $("deviceNext").disabled =
    true;


  goTo("device");

}


/* =================================
   SCREEN / DENSITY SCAN
================================= */

function scanDensity(){

  const dpr =
    window.devicePixelRatio || 1;


  const width =
    Math.round(
      window.screen.width *
      dpr
    );


  const height =
    Math.round(
      window.screen.height *
      dpr
    );


  /*
    Browser actual Android
    system DPI reliably detect
    nahi kar sakta.

    Isliye DPR based
    estimated PPI.
  */


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


  $("densityText")
    .textContent =
    `Detected • ${width} × ${height} • ${dpr.toFixed(2)}x • ~${ppi} PPI`;


  updateNext();

}


/* =================================
   DEVICE BUTTON
================================= */

function updateNext(){

  $("deviceNext").disabled =
    !(
      state.ram &&
      state.storage &&
      state.density
    );

}


/* =================================
   OPEN VERIFICATION
================================= */

function openVerification(){

  goTo(
    "verification"
  );

}


/* =================================
   OPEN PAYMENT
================================= */

function openPayment(){

  goTo(
    "payment"
  );

}


/* =================================
   PAYMENT CONFIRMATION
================================= */

function openConfirmation(){

  goTo(
    "confirmation"
  );

}


/* =================================
   TEMPORARY VERIFICATION
================================= */

function verifyCode(){

  const code =
    $("verificationCode")
      .value
      .trim();


  /*
    TEMPORARY TEST CODE

    IMPORTANT:

    Ye sirf testing ke liye hai.

    Baad me Google Sheet /
    Apps Script verification
    se replace karenge.
  */


  const VALID_CODE =
    "VIVEX29";


  if(
    code === VALID_CODE
  ){

    showResult();

  }

  else{

    alert(
      "Invalid verification code."
    );

  }

}


/* =================================
   RAM
================================= */

function getRam(){

  return (

    parseInt(
      state.ram
    ) || 4

  );

}


/* =================================
   STORAGE
================================= */

function getStorage(){

  if(!state.storage){

    return 64;

  }


  if(
    state.storage.includes(
      "TB"
    )
  ){

    const tb =
      parseFloat(
        state.storage
      );


    return tb * 1024;

  }


  return (

    parseInt(
      state.storage
    ) || 64

  );

}


/* =================================
   RAM EFFECT
================================= */

function getRamEffect(ram){

  if(ram <= 4){

    return 5;

  }


  if(ram <= 6){

    return 3;

  }


  if(ram <= 8){

    return 1;

  }


  if(ram <= 12){

    return -1;

  }


  if(ram <= 16){

    return -3;

  }


  return -5;

}


/* =================================
   STORAGE EFFECT
================================= */

function getStorageEffect(
  storage
){

  if(storage <= 32){

    return 5;

  }


  if(storage <= 64){

    return 3;

  }


  if(storage <= 128){

    return 1;

  }


  if(storage <= 256){

    return -1;

  }


  if(storage <= 512){

    return -3;

  }


  return -5;

}


/* =================================
   DEVICE PROFILE
================================= */

function getDeviceProfile(){

  const ram =
    getRam();


  const storage =
    getStorage();


  const ppi =
    state.density ||
    320;


  const dpr =
    state.dpr ||
    1;


  const ramEffect =
    getRamEffect(
      ram
    );


  const storageEffect =
    getStorageEffect(
      storage
    );


  const pixels =
    state.screenWidth *
    state.screenHeight;


  let resolutionFactor =
    0;


  if(
    pixels >= 2000000
  ){

    resolutionFactor += 1;

  }


  if(
    pixels >= 2500000
  ){

    resolutionFactor += 1;

  }


  if(
    pixels >= 3000000
  ){

    resolutionFactor += 1;

  }


  if(
    pixels >= 4000000
  ){

    resolutionFactor += 1;

  }


  let ppiFactor =
    0;


  if(ppi >= 350){

    ppiFactor += 1;

  }


  if(ppi >= 400){

    ppiFactor += 1;

  }


  if(ppi >= 450){

    ppiFactor += 1;

  }


  if(ppi >= 500){

    ppiFactor += 1;

  }


  let dprFactor =
    0;


  if(dpr >= 2.5){

    dprFactor += 1;

  }


  if(dpr >= 3){

    dprFactor += 1;

  }


  if(dpr >= 3.5){

    dprFactor += 1;

  }


  const brandFactor =
    BRAND_FACTOR[
      state.brand
    ] || 0;


  const deviceFactor =
    resolutionFactor +
    ppiFactor +
    dprFactor +
    brandFactor;


  const totalFactor =
    deviceFactor +
    ramEffect +
    storageEffect;


  return {

    ram,
    storage,
    ppi,
    dpr,

    ramEffect,
    storageEffect,

    resolutionFactor,
    ppiFactor,
    dprFactor,

    brandFactor,

    deviceFactor,
    totalFactor

  };

}


/* =================================
   GENERATE SENSITIVITY
================================= */

function generateSensitivity(){

  const profile =
    getDeviceProfile();


  const base =
    145 +
    profile.totalFactor;


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


  const scope2x =
    clamp(
      base,
      80,
      190
    );


  const scope4x =
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


  return {

    general,
    redDot,
    scope2x,
    scope4x,
    sniper,
    freeLook

  };

}


/* =================================
   CLAMP
================================= */

function clamp(
  value,
  min,
  max
){

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );

}


/* =================================
   SHOW RESULT
================================= */

function showResult(){

  const profile =
    getDeviceProfile();


  const sensi =
    generateSensitivity();


  $("resultBrand")
    .textContent =
    state.brand;


  $("resultRam")
    .textContent =
    state.ram;


  $("resultStorage")
    .textContent =
    state.storage;


  $("resultDensity")
    .textContent =
    `~${profile.ppi} PPI`;


  const settings = [

    [
      "General",
      sensi.general
    ],

    [
      "Red Dot",
      sensi.redDot
    ],

    [
      "2X Scope",
      sensi.scope2x
    ],

    [
      "4X Scope",
      sensi.scope4x
    ],

    [
      "Sniper Scope",
      sensi.sniper
    ],

    [
      "Free Look",
      sensi.freeLook
    ]

  ];


  $("settingsGrid")
    .innerHTML =

    settings
      .map(
        ([name,value]) => `

          <div class="setting">

            <small>
              ${name}
            </small>

            <strong>
              ${value}
            </strong>

          </div>

        `
      )
      .join("");


  let fireButton =
    48 +
    Math.round(
      profile.totalFactor /
      2
    );


  fireButton =
    clamp(
      fireButton,
      45,
      55
    );


  $("fireButton")
    .textContent =
    `${fireButton}%`;


  let recommendedDpi =

    380 +

    (
      profile.ppi - 320
    ) * 1.2 +

    profile.deviceFactor *
    5 +

    profile.ramEffect *
    3 +

    profile.storageEffect *
    2;


  recommendedDpi =
    Math.round(
      recommendedDpi
    );


  recommendedDpi =
    clamp(
      recommendedDpi,
      320,
      560
    );


  $("dpi")
    .textContent =
    recommendedDpi;


  goTo("result");

}


/* =================================
   RESTART
================================= */

function restart(){

  state.brand =
    "";

  state.ram =
    "";

  state.storage =
    "";

  state.density =
    0;

  state.screenWidth =
    0;

  state.screenHeight =
    0;

  state.dpr =
    1;


  $("brandNext").disabled =
    true;


  document
    .querySelectorAll(".brand")
    .forEach(
      (item) => {

        item.classList.remove(
          "selected"
        );

      }
    );


  $("verificationCode")
    .value =
    "";


  goTo("home");

}


/* =================================
   START APP
================================= */

if(IS_MOBILE){

  init();

}
