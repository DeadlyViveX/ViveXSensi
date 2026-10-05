const state = {
  brand: "",
  ram: "",
  storage: "",
  density: 0,
  screenWidth: 0,
  screenHeight: 0,
  dpr: 1
};

const $ = (id) => document.getElementById(id);


/* ================================
   PHONE BRANDS
================================ */

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


/* ================================
   BRAND TUNING
   Small adjustment only
================================ */

const BRAND_FACTOR = {
  "Samsung": 0,
  "Realme": 2,
  "Vivo": 2,
  "OPPO": 1,
  "Xiaomi": 3,
  "OnePlus": 4,
  "Motorola": 0,
  "Infinix": 3,
  "Tecno": 3,
  "iQOO": 5,
  "Apple": -3,
  "POCO": 4,
  "Nothing": 1,
  "Honor": 1,
  "Google Pixel": -2
};


/* ================================
   NAVIGATION
================================ */

function goTo(id) {

  document
    .querySelectorAll(".screen")
    .forEach((screen) => {
      screen.classList.remove("active");
    });

  $(id).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* ================================
   LOAD BRANDS
================================ */

function init() {

  $("brandGrid").innerHTML = BRANDS
    .map((brand) => `
      <button
        class="brand"
        onclick="selectBrand('${brand}', this)"
      >
        ${brand}
      </button>
    `)
    .join("");
}


/* ================================
   SELECT BRAND
================================ */

function selectBrand(brand, element) {

  state.brand = brand;

  $("brandNext").disabled = false;

  document
    .querySelectorAll(".brand")
    .forEach((item) => {
      item.classList.remove("selected");
    });

  element.classList.add("selected");
}


/* ================================
   DEVICE PAGE
================================ */

function openDeviceStep() {

  $("selectedBrand").textContent =
    state.brand;

  $("ramSelect").value = "";
  $("storageSelect").value = "";

  state.ram = "";
  state.storage = "";
  state.density = 0;
  state.screenWidth = 0;
  state.screenHeight = 0;
  state.dpr = 1;

  $("densityText").textContent =
    "Not scanned yet";

  $("deviceNext").disabled = true;

  goTo("device");
}


/* ================================
   SCREEN / DENSITY SCAN
================================ */

function scanDensity() {

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
    Browser exact Android system DPI
    reliably detect nahi kar sakta.

    Isliye DPR based estimated PPI.
  */

  const ppi =
    Math.round(160 * dpr);


  state.density = ppi;
  state.screenWidth = width;
  state.screenHeight = height;
  state.dpr = dpr;


  $("densityText").textContent =
    `Detected • ${width} × ${height} • ${dpr.toFixed(2)}x • ~${ppi} PPI`;


  updateNext();
}


/* ================================
   CHECK DEVICE BUTTON
================================ */

function updateNext() {

  $("deviceNext").disabled = !(
    state.ram &&
    state.storage &&
    state.density
  );
}


/* ================================
   RAM
================================ */

function getRam() {

  return parseInt(state.ram) || 4;

}


/* ================================
   STORAGE
================================ */

function getStorage() {

  if (!state.storage) {
    return 64;
  }

  if (state.storage.includes("TB")) {

    const tb =
      parseFloat(
        state.storage
      );

    return tb * 1024;
  }

  return parseInt(
    state.storage
  ) || 64;
}


/* ================================
   DEVICE PROFILE
================================ */

function getDeviceProfile() {

  const ram =
    getRam();

  const storage =
    getStorage();

  const ppi =
    state.density || 320;

  const dpr =
    state.dpr || 1;


  /*
    --------------------------------
    RAM FACTOR
    --------------------------------

    RAM ka effect intentionally small
    rakha gaya hai.

    4GB  = 0
    6GB  = +1
    8GB  = +2
    12GB = +3
    16GB = +4
    24GB = +5
  */

  let ramFactor = 0;

  if (ram >= 6) {
    ramFactor += 1;
  }

  if (ram >= 8) {
    ramFactor += 1;
  }

  if (ram >= 12) {
    ramFactor += 1;
  }

  if (ram >= 16) {
    ramFactor += 1;
  }

  if (ram >= 24) {
    ramFactor += 1;
  }


  /*
    --------------------------------
    STORAGE FACTOR
    --------------------------------

    Storage ka effect bahut small hai.
  */

  let storageFactor = 0;

  if (storage >= 128) {
    storageFactor += 1;
  }

  if (storage >= 256) {
    storageFactor += 1;
  }

  if (storage >= 512) {
    storageFactor += 1;
  }

  if (storage >= 1024) {
    storageFactor += 1;
  }


  /*
    --------------------------------
    SCREEN RESOLUTION
    --------------------------------
  */

  const pixels =
    state.screenWidth *
    state.screenHeight;


  let resolutionFactor = 0;

  if (pixels >= 2000000) {
    resolutionFactor += 1;
  }

  if (pixels >= 2500000) {
    resolutionFactor += 1;
  }

  if (pixels >= 3000000) {
    resolutionFactor += 1;
  }

  if (pixels >= 4000000) {
    resolutionFactor += 1;
  }


  /*
    --------------------------------
    PPI
    --------------------------------
  */

  let ppiFactor = 0;

  if (ppi >= 350) {
    ppiFactor += 1;
  }

  if (ppi >= 400) {
    ppiFactor += 1;
  }

  if (ppi >= 450) {
    ppiFactor += 1;
  }

  if (ppi >= 500) {
    ppiFactor += 1;
  }


  /*
    --------------------------------
    DPR
    --------------------------------
  */

  let dprFactor = 0;

  if (dpr >= 2.5) {
    dprFactor += 1;
  }

  if (dpr >= 3) {
    dprFactor += 1;
  }

  if (dpr >= 3.5) {
    dprFactor += 1;
  }


  /*
    BRAND
  */

  const brandFactor =
    BRAND_FACTOR[state.brand] || 0;


  /*
    TOTAL DEVICE FACTOR
  */

  const totalFactor =
    ramFactor +
    storageFactor +
    resolutionFactor +
    ppiFactor +
    dprFactor +
    brandFactor;


  return {
    ram,
    storage,
    ppi,
    dpr,
    ramFactor,
    storageFactor,
    resolutionFactor,
    ppiFactor,
    dprFactor,
    brandFactor,
    totalFactor
  };
}


/* ================================
   GENERATE SENSITIVITY
================================ */

function generateSensitivity() {

  const profile =
    getDeviceProfile();


  /*
    BASE

    Device factor ke saath
    sensitivity gradually change hogi.
  */

  const base =
    145 +
    profile.totalFactor;


  /*
    GENERAL
  */

  const general =
    clamp(
      base + 15,
      100,
      200
    );


  /*
    RED DOT
  */

  const redDot =
    clamp(
      base + 8,
      90,
      195
    );


  /*
    2X
  */

  const scope2x =
    clamp(
      base,
      80,
      190
    );


  /*
    4X
  */

  const scope4x =
    clamp(
      base - 12,
      70,
      180
    );


  /*
    SNIPER
  */

  const sniper =
    clamp(
      base - 45,
      40,
      140
    );


  /*
    FREE LOOK
  */

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


/* ================================
   CLAMP
================================ */

function clamp(value, min, max) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}


/* ================================
   SHOW RESULT
================================ */

function showResult() {

  const profile =
    getDeviceProfile();

  const sensi =
    generateSensitivity();


  /*
    DEVICE INFO
  */

  $("resultBrand").textContent =
    state.brand;

  $("resultRam").textContent =
    state.ram;

  $("resultStorage").textContent =
    state.storage;

  $("resultDensity").textContent =
    `~${profile.ppi} PPI`;


  /*
    SENSITIVITY CARDS
  */

  const settings = [

    ["General", sensi.general],

    ["Red Dot", sensi.redDot],

    ["2X Scope", sensi.scope2x],

    ["4X Scope", sensi.scope4x],

    ["Sniper Scope", sensi.sniper],

    ["Free Look", sensi.freeLook]

  ];


  $("settingsGrid").innerHTML =
    settings
      .map(
        ([name, value]) => `
          <div class="setting">
            <small>${name}</small>
            <strong>${value}</strong>
          </div>
        `
      )
      .join("");


  /*
    FIRE BUTTON

    Device performance ke according
    small adjustment.
  */

  let fireButton =
    48 +
    Math.round(
      profile.totalFactor / 2
    );


  fireButton =
    clamp(
      fireButton,
      45,
      55
    );


  $("fireButton").textContent =
    `${fireButton}%`;


  /*
    RECOMMENDED DPI

    Ye actual Android system DPI nahi hai.
    Recommendation hai.
  */

  let recommendedDpi =
    380 +
    (
      profile.ppi - 320
    ) * 1.2 +
    profile.totalFactor * 5;


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


  $("dpi").textContent =
    recommendedDpi;


  goTo("result");
}


/* ================================
   RESTART
================================ */

function restart() {

  state.brand = "";
  state.ram = "";
  state.storage = "";
  state.density = 0;
  state.screenWidth = 0;
  state.screenHeight = 0;
  state.dpr = 1;


  $("brandNext").disabled = true;


  document
    .querySelectorAll(".brand")
    .forEach((item) => {
      item.classList.remove("selected");
    });


  goTo("home");
}


/* ================================
   START
================================ */

init();
