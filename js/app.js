/* =========================================
   VIVEX SENSI
   MAIN APP SCRIPT
========================================= */


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const VERIFY_API =
  "https://script.google.com/macros/s/AKfycbxejo41XCZAECqxPviHVpiZnLdcLAEmVxEQ4utRRP47NAlol24sWuCbJjxeCVXMcOT3ng/exec";


/* =========================================
   BASIC HELPER
========================================= */

function $(id){
  return document.getElementById(id);
}


/* =========================================
   MOBILE CHECK
========================================= */

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
        $("desktopBlock");

      if(block){
        block.style.display = "flex";
      }

      document.body.style.overflow =
        "hidden";

    }
  );

}


/* =========================================
   DEVICE ID
========================================= */

function getDeviceId(){

  let deviceId =
    localStorage.getItem(
      "vivex_device_id"
    );

  if(!deviceId){

    if(
      window.crypto &&
      window.crypto.randomUUID
    ){

      deviceId =
        window.crypto.randomUUID();

    }
    else{

      deviceId =
        "VX-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
          .toString(36)
          .substring(2,12);

    }

    localStorage.setItem(
      "vivex_device_id",
      deviceId
    );

  }

  return deviceId;
}


/* =========================================
   APP STATE
========================================= */

const state = {

  brand:"",
  ram:"",
  storage:"",

  density:0,

  screenWidth:0,
  screenHeight:0,

  dpr:1

};


/* =========================================
   BRANDS
========================================= */

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


/* =========================================
   BRAND FACTOR
========================================= */

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


/* =========================================
   RAM EFFECT
   LOWER RAM = HIGHER SENSI
========================================= */

function getRamEffect(ram){

  const values = {

    "4 GB":5,
    "6 GB":3,
    "8 GB":1,

    "12 GB":-1,
    "16 GB":-3,
    "24 GB":-5

  };

  return values[ram] || 0;
}


/* =========================================
   STORAGE EFFECT
   LOWER STORAGE = HIGHER SENSI
========================================= */

function getStorageEffect(storage){

  const values = {

    "32 GB":5,
    "64 GB":3,
    "128 GB":1,

    "256 GB":-1,
    "512 GB":-3,
    "1 TB":-5

  };

  return values[storage] || 0;
}


/* =========================================
   NAVIGATION
========================================= */

function goTo(id){

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove(
        "active"
      );

    });


  const target =
    $(id);

  if(target){

    target.classList.add(
      "active"
    );

  }


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


/* =========================================
   INITIALIZE
========================================= */

function init(){

  const brandGrid =
    $("brandGrid");

  if(!brandGrid){
    return;
  }


  brandGrid.innerHTML = "";


  BRANDS.forEach(
    brand => {

      const button =
        document.createElement(
          "button"
        );

      button.className =
        "brand-btn";

      button.type =
        "button";

      button.textContent =
        brand;

      button.addEventListener(
        "click",
        () => {

          selectBrand(
            brand,
            button
          );

        }
      );


      brandGrid.appendChild(
        button
      );

    }
  );


  updateNext();

}


/* =========================================
   BRAND SELECTION
========================================= */

function selectBrand(
  brand,
  button
){

  state.brand =
    brand;


  document
    .querySelectorAll(
      ".brand-btn"
    )
    .forEach(btn => {

      btn.classList.remove(
        "selected"
      );

    });


  if(button){

    button.classList.add(
      "selected"
    );

  }


  updateNext();

}


/* =========================================
   OPEN DEVICE PAGE
========================================= */

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


/* =========================================
   SCAN PIXEL DENSITY
========================================= */

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


  /*
   * Browser cannot reliably read
   * actual Android system DPI.
   *
   * This is an estimated PPI.
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


  const densityText =
    $("densityText");


  if(densityText){

    densityText.textContent =
      `Detected • ${width} × ${height} • ${dpr.toFixed(2)}x • ~${ppi} PPI`;

  }


  updateNext();

}


/* =========================================
   UPDATE NEXT BUTTON
========================================= */

function updateNext(){

  const brandNext =
    $("brandNext");


  if(brandNext){

    brandNext.disabled =
      !state.brand;

  }


  const deviceNext =
    $("deviceNext");


  if(deviceNext){

    deviceNext.disabled =
      !(
        state.ram &&
        state.storage &&
        state.density
      );

  }

}


/* =========================================
   OPEN VERIFICATION
========================================= */

function openVerification(){

  if(
    !state.ram ||
    !state.storage ||
    !state.density
  ){

    return;

  }


  goTo(
    "verification"
  );

}


/* =========================================
   OPEN PAYMENT
========================================= */

function openPayment(){

  goTo(
    "payment"
  );

}


/* =========================================
   OPEN CONFIRMATION
========================================= */

function openConfirmation(){

  goTo(
    "confirmation"
  );

}


/* =========================================
   UNIQUE DEVICE VERIFICATION
========================================= */

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


  showVerificationLoading();


  verifyCodeWithServer(
    code,
    deviceId
  );

}


/* =========================================
   GOOGLE APPS SCRIPT VERIFICATION
========================================= */

function verifyCodeWithServer(
  code,
  deviceId
){

  const callbackName =
    "vivexCallback_" +
    Date.now() +
    "_" +
    Math.floor(
      Math.random() * 100000
    );


  let finished =
    false;


  const script =
    document.createElement(
      "script"
    );


  function cleanup(){

    if(script.parentNode){

      script.parentNode.removeChild(
        script
      );

    }


    try{

      delete window[
        callbackName
      ];

    }
    catch(error){

      window[
        callbackName
      ] = undefined;

    }

  }


  const timeout =
    setTimeout(
      () => {

        if(finished){
          return;
        }


        finished = true;


        cleanup();


        hideVerificationLoading();


        showErrorPopup(
          "Verification server did not respond. Please try again."
        );

      },
      15000
    );


  window[
    callbackName
  ] = function(result){

    if(finished){
      return;
    }


    finished = true;


    clearTimeout(
      timeout
    );


    cleanup();


    hideVerificationLoading();


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

  };


  const url =
    VERIFY_API +
    "?code=" +
    encodeURIComponent(code) +
    "&device=" +
    encodeURIComponent(deviceId) +
    "&callback=" +
    encodeURIComponent(
      callbackName
    );


  script.src =
    url;


  script.onerror =
    () => {

      if(finished){
        return;
      }


      finished = true;


      clearTimeout(
        timeout
      );


      cleanup();


      hideVerificationLoading();


      showErrorPopup(
        "Unable to connect to verification server."
      );

    };


  document.body.appendChild(
    script
  );

}


/* =========================================
   VERIFICATION LOADING
========================================= */

function showVerificationLoading(){

  const button =
    document.querySelector(
      '#verification .primary'
    );


  if(button){

    button.disabled =
      true;


    button.dataset.oldText =
      button.innerHTML;


    button.innerHTML =
      "Verifying...";

  }

}


/* =========================================
   HIDE VERIFICATION LOADING
========================================= */

function hideVerificationLoading(){

  const button =
    document.querySelector(
      '#verification .primary'
    );


  if(button){

    button.disabled =
      false;


    if(button.dataset.oldText){

      button.innerHTML =
        button.dataset.oldText;

    }

  }

}


/* =========================================
   ERROR POPUP
========================================= */

function showErrorPopup(
  message
){

  const popup =
    $("customPopup");


  const messageBox =
    $("popupMessage");


  if(messageBox){

    messageBox.textContent =
      message;

  }


  if(popup){

    popup.classList.add(
      "show"
    );

  }

}


/* =========================================
   CLOSE ERROR POPUP
========================================= */

function closeErrorPopup(){

  const popup =
    $("customPopup");


  if(popup){

    popup.classList.remove(
      "show"
    );

  }

}


/* =========================================
   CLOSE POPUP ON BACKDROP
========================================= */

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


/* =========================================
   CALCULATE SETTINGS
========================================= */

function calculateSettings(){

  const ramEffect =
    getRamEffect(
      state.ram
    );


  const storageEffect =
    getStorageEffect(
      state.storage
    );


  const brandEffect =
    BRAND_FACTOR[
      state.brand
    ] || 0;


  /* =====================================
     RESOLUTION FACTOR
  ===================================== */

  const resolution =
    state.screenWidth *
    state.screenHeight;


  let resolutionFactor =
    0;


  if(
    resolution >=
    2400000
  ){

    resolutionFactor =
      4;

  }
  else if(
    resolution >=
    1800000
  ){

    resolutionFactor =
      3;

  }
  else if(
    resolution >=
    1400000
  ){

    resolutionFactor =
      2;

  }
  else if(
    resolution >=
    900000
  ){

    resolutionFactor =
      1;

  }


  /* =====================================
     PPI FACTOR
  ===================================== */

  let ppiFactor =
    0;


  if(
    state.density >=
    500
  ){

    ppiFactor =
      4;

  }
  else if(
    state.density >=
    420
  ){

    ppiFactor =
      3;

  }
  else if(
    state.density >=
    350
  ){

    ppiFactor =
      2;

  }
  else if(
    state.density >=
    280
  ){

    ppiFactor =
      1;

  }


  /* =====================================
     DPR FACTOR
  ===================================== */

  let dprFactor =
    Math.round(
      (state.dpr - 1) * 2
    );


  dprFactor =
    Math.max(
      0,
      Math.min(
        3,
        dprFactor
      )
    );


  /* =====================================
     TOTAL FACTOR
  ===================================== */

  const totalFactor =
    resolutionFactor +
    ppiFactor +
    dprFactor +
    brandEffect +
    ramEffect +
    storageEffect;


  /* =====================================
     BASE SENSITIVITY
  ===================================== */

  const base =
    145 +
    totalFactor;


  const settings = {

    general:
      clamp(
        Math.round(
          base + 15
        ),
        100,
        200
      ),

    redDot:
      clamp(
        Math.round(
          base + 8
        ),
        90,
        195
      ),

    twoX:
      clamp(
        Math.round(
          base
        ),
        80,
        190
      ),

    fourX:
      clamp(
        Math.round(
          base - 12
        ),
        70,
        180
      ),

    sniper:
      clamp(
        Math.round(
          base - 45
        ),
        40,
        140
      ),

    freeLook:
      clamp(
        Math.round(
          base + 4
        ),
        90,
        195
      )

  };


  /* =====================================
     FIRE BUTTON
  ===================================== */

  const fireButton =
    clamp(
      Math.round(
        48 +
        totalFactor / 2
      ),
      45,
      55
    );


  /* =====================================
     RECOMMENDED DPI
     400 - 550
     INVERSE PPI RELATION
  ===================================== */

  const ppi =
    state.density || 320;


  /*
   * Lower PPI  = Higher DPI
   * Higher PPI = Lower DPI
   *
   * Reference:
   *
   * 273 PPI -> around 500 DPI
   * 300 PPI -> around 480 DPI
   * 350 PPI -> around 442 DPI
   * 373 PPI -> around 425 DPI
   * 400 PPI -> around 405 DPI
   */

  let dpi =
    500 -
    (
      ppi -
      273
    ) * 0.75;


  /*
   * Small device adjustments.
   *
   * These are deliberately small
   * so PPI remains the main factor.
   */

  dpi +=
    brandEffect * 2;


  dpi +=
    ramEffect * 1;


  dpi +=
    storageEffect * 0.5;


  /*
   * FINAL DPI RANGE:
   * 400 minimum
   * 550 maximum
   */

  dpi =
    clamp(
      Math.round(dpi),
      400,
      550
    );


  return {

    settings,
    fireButton,
    dpi

  };

}


/* =========================================
   CLAMP
========================================= */

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


/* =========================================
   SHOW RESULT
========================================= */

function showResult(){

  const result =
    calculateSettings();


  if($("resultBrand")){

    $("resultBrand")
      .textContent =
      state.brand;

  }


  if($("resultRam")){

    $("resultRam")
      .textContent =
      state.ram;

  }


  if($("resultStorage")){

    $("resultStorage")
      .textContent =
      state.storage;

  }


  if($("resultDensity")){

    $("resultDensity")
      .textContent =
      "~" +
      state.density +
      " PPI";

  }


  const settingsGrid =
    $("settingsGrid");


  if(settingsGrid){

    settingsGrid.innerHTML = `

      <div class="setting-card">
        <small>GENERAL</small>
        <strong>
          ${result.settings.general}
        </strong>
      </div>

      <div class="setting-card">
        <small>RED DOT</small>
        <strong>
          ${result.settings.redDot}
        </strong>
      </div>

      <div class="setting-card">
        <small>2X SCOPE</small>
        <strong>
          ${result.settings.twoX}
        </strong>
      </div>

      <div class="setting-card">
        <small>4X SCOPE</small>
        <strong>
          ${result.settings.fourX}
        </strong>
      </div>

      <div class="setting-card">
        <small>SNIPER</small>
        <strong>
          ${result.settings.sniper}
        </strong>
      </div>

      <div class="setting-card">
        <small>FREE LOOK</small>
        <strong>
          ${result.settings.freeLook}
        </strong>
      </div>

    `;

  }


  if($("fireButton")){

    $("fireButton")
      .textContent =
      result.fireButton +
      "%";

  }


  if($("dpi")){

    $("dpi")
      .textContent =
      result.dpi;

  }


  goTo(
    "result"
  );

}


/* =========================================
   RESTART
========================================= */

function restart(){

  state.brand = "";
  state.ram = "";
  state.storage = "";

  state.density = 0;

  state.screenWidth = 0;
  state.screenHeight = 0;

  state.dpr = 1;


  document
    .querySelectorAll(
      ".brand-btn"
    )
    .forEach(btn => {

      btn.classList.remove(
        "selected"
      );

    });


  if($("ramSelect")){

    $("ramSelect")
      .value = "";

  }


  if($("storageSelect")){

    $("storageSelect")
      .value = "";

  }


  if($("densityText")){

    $("densityText")
      .textContent =
      "Not scanned yet";

  }


  if($("selectedBrand")){

    $("selectedBrand")
      .textContent =
      "Brand";

  }


  if($("verificationCode")){

    $("verificationCode")
      .value = "";

  }


  updateNext();


  goTo(
    "home"
  );

}


/* =========================================
   RAM SELECT
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const ramSelect =
      $("ramSelect");


    if(ramSelect){

      ramSelect.addEventListener(
        "change",
        () => {

          state.ram =
            ramSelect.value;

          updateNext();

        }
      );

    }


    const storageSelect =
      $("storageSelect");


    if(storageSelect){

      storageSelect.addEventListener(
        "change",
        () => {

          state.storage =
            storageSelect.value;

          updateNext();

        }
      );

    }

  }
);


/* =========================================
   ENTER KEY FOR VERIFICATION
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const input =
      $("verificationCode");


    if(input){

      input.addEventListener(
        "keydown",
        event => {

          if(
            event.key ===
            "Enter"
          ){

            event.preventDefault();

            verifyCode();

          }

        }
      );

    }

  }
);


/* =========================================
   START APP
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    getDeviceId();

    init();

  }
);
