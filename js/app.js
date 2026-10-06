/* =========================================================
   ViveX Sensi - app.js
   ========================================================= */

/* =========================
   MOBILE CHECK
========================= */

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


/* =========================
   HELPER
========================= */

function $(id){
  return document.getElementById(id);
}


/* =========================
   STATE
========================= */

const state = {
  brand:"",
  ram:"",
  storage:"",
  density:0,
  screenWidth:0,
  screenHeight:0,
  dpr:1
};


/* =========================
   BRANDS
========================= */

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


/* =========================
   BRAND FACTOR
   Small influence only
========================= */

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


/* =========================
   RAM FACTOR
   Lower RAM = slightly higher
   Higher RAM = slightly lower
========================= */

function getRamEffect(ram){

  const map = {
    "4 GB":5,
    "6 GB":3,
    "8 GB":1,
    "12 GB":-1,
    "16 GB":-3,
    "24 GB":-5
  };

  return map[ram] ?? 0;
}


/* =========================
   STORAGE FACTOR
========================= */

function getStorageEffect(storage){

  const map = {
    "32 GB":5,
    "64 GB":3,
    "128 GB":1,
    "256 GB":-1,
    "512 GB":-3,
    "1 TB":-5
  };

  return map[storage] ?? 0;
}


/* =========================
   DEVICE FACTOR
========================= */

function getDeviceFactor(){

  const width =
    state.screenWidth || 0;

  const height =
    state.screenHeight || 0;

  const ppi =
    state.density || 320;

  const dpr =
    state.dpr || 1;

  /*
    Resolution factor:
    Higher resolution gives a small
    sensitivity adjustment.
  */

  const resolution =
    width * height;

  let resolutionFactor = 0;

  if(resolution >= 3000000){
    resolutionFactor = 4;
  }
  else if(resolution >= 2400000){
    resolutionFactor = 3;
  }
  else if(resolution >= 1800000){
    resolutionFactor = 2;
  }
  else if(resolution >= 1200000){
    resolutionFactor = 1;
  }


  /*
    PPI factor:
    Small effect only.
  */

  let ppiFactor = 0;

  if(ppi >= 420){
    ppiFactor = 4;
  }
  else if(ppi >= 380){
    ppiFactor = 3;
  }
  else if(ppi >= 340){
    ppiFactor = 2;
  }
  else if(ppi >= 300){
    ppiFactor = 1;
  }


  /*
    DPR factor
  */

  let dprFactor = 0;

  if(dpr >= 3){
    dprFactor = 3;
  }
  else if(dpr >= 2.5){
    dprFactor = 2;
  }
  else if(dpr >= 2){
    dprFactor = 1;
  }


  return {
    resolutionFactor,
    ppiFactor,
    dprFactor
  };
}


/* =========================
   INIT BRAND GRID
========================= */

function initBrands(){

  const grid =
    $("brandGrid");

  if(!grid){
    return;
  }

  grid.innerHTML = "";

  BRANDS.forEach(
    brand => {

      const card =
        document.createElement("button");

      card.type = "button";
      card.className = "brand-card";

      card.innerHTML = `
        <span class="brand-icon">
          ${brand.charAt(0)}
        </span>
        <span>${brand}</span>
      `;

      card.onclick = () => {
        selectBrand(brand, card);
      };

      grid.appendChild(card);
    }
  );
}


/* =========================
   BRAND SELECT
========================= */

function selectBrand(
  brand,
  element
){

  state.brand = brand;

  document
    .querySelectorAll(".brand-card")
    .forEach(card => {
      card.classList.remove("selected");
    });

  if(element){
    element.classList.add("selected");
  }

  updateNext();
}


/* =========================
   OPEN DEVICE STEP
========================= */

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


/* =========================
   SCAN PIXEL DENSITY
========================= */

function scanDensity(){

  /*
    IMPORTANT:
    Browser cannot directly read
    Android's actual system DPI.

    We estimate display density using
    browser/device pixel ratio.

    Therefore UI uses "~PPI"
    instead of claiming exact PPI.
  */

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
    Browser-based estimated PPI.
  */

  const ppi =
    Math.round(160 * dpr);

  state.density = ppi;
  state.screenWidth = width;
  state.screenHeight = height;
  state.dpr = dpr;

  const densityText =
    $("densityText");

  if(densityText){

    densityText.textContent =
      `Detected • ${width} × ${height} • ` +
      `${dpr.toFixed(2)}x • ~${ppi} PPI`;
  }

  updateNext();
}


/* =========================
   NEXT BUTTON STATE
========================= */

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
        state.brand &&
        state.ram &&
        state.storage &&
        state.density
      );
  }
}


/* =========================
   NAVIGATION
========================= */

function goTo(
  screenId
){

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove(
        "active"
      );
    });

  const target =
    $(screenId);

  if(target){

    target.classList.add(
      "active"
    );
  }

  window.scrollTo(
    0,
    0
  );
}


/* =========================
   VERIFICATION
========================= */

function openVerification(){

  if(
    !state.brand ||
    !state.ram ||
    !state.storage ||
    !state.density
  ){
    return;
  }

  goTo("verification");
}


/* =========================
   PAYMENT
========================= */

function openPayment(){

  goTo("payment");
}


/* =========================
   CONFIRMATION
========================= */

function openConfirmation(){

  goTo("confirmation");
}


/* =========================
   VERIFY CODE
========================= */

function verifyCode(){

  const input =
    $("verificationCode");

  const code =
    input
      ? input.value.trim()
      : "";

  /*
    TEMPORARY TEST CODE

    IMPORTANT:
    This is NOT secure for production
    because frontend JS can be inspected.

    Later this should be replaced with
    Apps Script/backend verification.
  */

  const VALID_CODE =
    "VIVEX29";

  if(
    code &&
    code === VALID_CODE
  ){

    showResult();

  }
  else{

    showErrorPopup(
      "Invalid verification code."
    );
  }
}


/* =========================
   ERROR POPUP
========================= */

function showErrorPopup(
  message
){

  const messageBox =
    $("popupMessage");

  if(messageBox){

    messageBox.textContent =
      message;
  }

  const popup =
    $("customPopup");

  if(popup){

    popup.classList.add(
      "show"
    );
  }
}


function closeErrorPopup(){

  const popup =
    $("customPopup");

  if(popup){

    popup.classList.remove(
      "show"
    );
  }
}


/* =========================
   SENSITIVITY CALCULATION
========================= */

function calculateSensitivity(){

  const ramEffect =
    getRamEffect(
      state.ram
    );

  const storageEffect =
    getStorageEffect(
      state.storage
    );

  const device =
    getDeviceFactor();

  const brandEffect =
    BRAND_FACTOR[
      state.brand
    ] || 0;


  /*
    Device/display contribution.
    Kept controlled so RAM/storage
    don't make the result unrealistic.
  */

  const deviceEffect =
      device.resolutionFactor
    + device.ppiFactor
    + device.dprFactor;


  /*
    Combined factor.
  */

  const totalFactor =
      ramEffect
    + storageEffect
    + deviceEffect
    + brandEffect;


  /*
    Base sensitivity.
  */

  const base =
    145 + totalFactor;


  const settings = {

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

    scope2x:
      clamp(
        base,
        80,
        190
      ),

    scope4x:
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
      )
  };


  /*
    Fire button.
  */

  const fireButton =
    clamp(
      48 +
      Math.round(
        totalFactor / 2
      ),
      45,
      55
    );


  return {
    settings,
    fireButton,
    totalFactor
  };
}


/* =========================
   DPI CALCULATION
========================= */

function calculateRecommendedDPI(){

  /*
    IMPORTANT:

    This is a RECOMMENDED GAMING DPI,
    NOT a claim of the phone's actual
    Android system DPI.

    Browser cannot reliably read the
    Android system DPI.

    Intended relationship:

    LOWER PPI  → HIGHER DPI
    HIGHER PPI → LOWER DPI
  */


  const ppi =
    state.density || 320;


  /*
    Main inverse PPI relationship.

    Reference:
    273 PPI → around 500
    373 PPI → around 425

    Difference of 100 PPI produces
    approximately 75 DPI difference.
  */

  let dpi =
    500 -
    (
      (ppi - 273) * 0.75
    );


  /*
    Small hardware adjustments.

    These are deliberately weak so that
    PPI remains the main DPI factor.
  */

  const device =
    getDeviceFactor();

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


  /*
    Small adjustments only.
  */

  dpi +=
    device.resolutionFactor * 0.8;

  dpi +=
    device.dprFactor * 0.5;

  dpi +=
    ramEffect * 0.6;

  dpi +=
    storageEffect * 0.3;

  dpi +=
    brandEffect * 0.4;


  /*
    Keep recommended DPI in a
    practical gaming range.

    Minimum 400 as requested.
  */

  dpi =
    Math.round(
      clamp(
        dpi,
        400,
        550
      )
    );


  return dpi;
}


/* =========================
   SHOW RESULT
========================= */

function showResult(){

  /*
    Brand
  */

  const resultBrand =
    $("resultBrand");

  if(resultBrand){

    resultBrand.textContent =
      state.brand;
  }


  /*
    RAM
  */

  const resultRam =
    $("resultRam");

  if(resultRam){

    resultRam.textContent =
      state.ram;
  }


  /*
    Storage
  */

  const resultStorage =
    $("resultStorage");

  if(resultStorage){

    resultStorage.textContent =
      state.storage;
  }


  /*
    PPI
  */

  const resultDensity =
    $("resultDensity");

  if(resultDensity){

    resultDensity.textContent =
      `~${state.density} PPI`;
  }


  /*
    Calculate sensitivity.
  */

  const result =
    calculateSensitivity();

  const settings =
    result.settings;


  /*
    Settings cards.
  */

  const settingsGrid =
    $("settingsGrid");

  if(settingsGrid){

    settingsGrid.innerHTML = `

      <div class="setting-card">
        <small>GENERAL</small>
        <strong>${settings.general}</strong>
      </div>

      <div class="setting-card">
        <small>RED DOT</small>
        <strong>${settings.redDot}</strong>
      </div>

      <div class="setting-card">
        <small>2X SCOPE</small>
        <strong>${settings.scope2x}</strong>
      </div>

      <div class="setting-card">
        <small>4X SCOPE</small>
        <strong>${settings.scope4x}</strong>
      </div>

      <div class="setting-card">
        <small>SNIPER SCOPE</small>
        <strong>${settings.sniper}</strong>
      </div>

      <div class="setting-card">
        <small>FREE LOOK</small>
        <strong>${settings.freeLook}</strong>
      </div>

    `;
  }


  /*
    Fire button.
  */

  const fireButton =
    $("fireButton");

  if(fireButton){

    fireButton.textContent =
      `${result.fireButton}%`;
  }


  /*
    Recommended DPI.
  */

  const dpi =
    $("dpi");

  if(dpi){

    dpi.textContent =
      calculateRecommendedDPI();
  }


  /*
    Finally show result.
  */

  goTo("result");
}


/* =========================
   CLAMP
========================= */

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


/* =========================
   RESTART
========================= */

function restart(){

  state.brand = "";
  state.ram = "";
  state.storage = "";
  state.density = 0;
  state.screenWidth = 0;
  state.screenHeight = 0;
  state.dpr = 1;


  /*
    Reset brand cards.
  */

  document
    .querySelectorAll(".brand-card")
    .forEach(card => {

      card.classList.remove(
        "selected"
      );
    });


  /*
    Reset selects.
  */

  const ram =
    $("ramSelect");

  if(ram){
    ram.value = "";
  }


  const storage =
    $("storageSelect");

  if(storage){
    storage.value = "";
  }


  /*
    Reset scan text.
  */

  const densityText =
    $("densityText");

  if(densityText){

    densityText.textContent =
      "Not scanned yet";
  }


  /*
    Reset selected brand.
  */

  const selectedBrand =
    $("selectedBrand");

  if(selectedBrand){

    selectedBrand.textContent =
      "Brand";
  }


  /*
    Reset verification field.
  */

  const verificationCode =
    $("verificationCode");

  if(verificationCode){

    verificationCode.value =
      "";
  }


  updateNext();

  goTo("home");
}


/* =========================
   SELECT CHANGE LISTENERS
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initBrands();


    const ram =
      $("ramSelect");

    if(ram){

      ram.addEventListener(
        "change",
        () => {

          state.ram =
            ram.value;

          updateNext();
        }
      );
    }


    const storage =
      $("storageSelect");

    if(storage){

      storage.addEventListener(
        "change",
        () => {

          state.storage =
            storage.value;

          updateNext();
        }
      );
    }


    /*
      Initial button state.
    */

    updateNext();


    /*
      Enter key on verification.
    */

    const verificationCode =
      $("verificationCode");

    if(verificationCode){

      verificationCode.addEventListener(
        "keydown",
        event => {

          if(
            event.key === "Enter"
          ){

            verifyCode();
          }
        }
      );
    }
  }
);
