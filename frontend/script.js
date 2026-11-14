
document.addEventListener("DOMContentLoaded", () => {

  const username = document.getElementById("loginUsername");
  const password = document.getElementById("loginPassword");

  if (username) {
    username.value = "";
    username.setAttribute("autocomplete", "off");
  }

  if (password) {
    password.value = "";
    password.setAttribute("autocomplete", "new-password");
  }

});



setTimeout(() => {
  const u = document.getElementById("loginUsername");
  const p = document.getElementById("loginPassword");

  if (u) u.value = "";
  if (p) p.value = "";
}, 200);




/* ================= GLOBAL VARIABLES ================= */

let currentUser = "";
let currentUsername = "";
let materials = [];
let editIndex = -1;

const API_BASE_URL = "http://localhost:5000";


/* ================= MATERIAL STORAGE ================= */

function saveMaterials(){
  localStorage.setItem("materials", JSON.stringify(materials));
}

function loadMaterials(){
  const data = localStorage.getItem("materials");
  if(data) materials = JSON.parse(data);
}

loadMaterials();


/* ================= LOGIN FIELD RESET (FIX) ================= */

/* ✅ BEST CLEAN FUNCTION */
function clearLoginFields(){
  const username = document.getElementById("loginUsername");
  const password = document.getElementById("loginPassword");

  if(username) username.value = "";
  if(password) password.value = "";
}

/* ✅ Runs on fresh load */
window.addEventListener("load", clearLoginFields);

/* ✅ Runs on back/refresh cache restore */
window.addEventListener("pageshow", function(){
  clearLoginFields();
});

/* ✅ Extra safety */
window.addEventListener("DOMContentLoaded", clearLoginFields);


/* ================= CLOCK ================= */

setInterval(() => {
  const time = document.getElementById("time");
  if(time){
    time.innerText = new Date().toLocaleString();
  }
}, 1000);


/* ================= PAGE SWITCH ================= */

function showSignup(){
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("signupPage").classList.remove("hidden");
}

function showLogin(){
  document.getElementById("signupPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
}


/* ================= SIGNUP ================= */

function signup(){

  const name = document.getElementById("signupName").value.trim();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if(!name || !username || !password){
    alert("All Fields Required");
    return;
  }

  fetch(API_BASE_URL + "/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({name, username, password})
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    if(data.success) showLogin();
  })
  .catch(() => alert("Server Not Responding"));
}


/* ================= LOGIN ================= */

function login(){

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if(!username || !password){
    alert("Enter Username & Password");
    return;
  }

  fetch(API_BASE_URL + "/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({username, password})
  })
  .then(res => res.json())
  .then(data => {

    if(!data.success){
      alert(data.message);
      return;
    }

    currentUser = data.user.name;
    currentUsername = data.user.username;

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signupPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("welcome").innerText =
      "WELCOME " + currentUser;

    loadCriticalStocks();
  })
  .catch(() => alert("Server Not Responding"));
}


/* ================= LOGOUT ================= */

function logout(){
  fetch(API_BASE_URL + "/logout", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username: currentUsername})
  })
  .finally(() => location.reload());
}


/* ================= NAVIGATION ================= */

function openPage(page){

  ["dashboard","entry","dispatch","locator","adminPanel","loggedUsersPage"]
  .forEach(id => document.getElementById(id)?.classList.add("hidden"));

  document.getElementById(page)?.classList.remove("hidden");

  if(page === "entry") loadEntryTable();
  if(page === "dispatch") loadDispatchTable();
}

function back(){
  ["entry","dispatch","locator","adminPanel","loggedUsersPage"]
  .forEach(id => document.getElementById(id)?.classList.add("hidden"));

  document.getElementById("dashboard")?.classList.remove("hidden");
}


/* ================= MATERIAL ================= */

function submitMaterial(type){

  let name, qty, location, receiver = "-";

  if(type === "entry"){
    name = document.getElementById("entryName").value.trim();
    qty = document.getElementById("entryQty").value.trim();
    location = document.getElementById("entryLocation").value.trim();
  } else {
    name = document.getElementById("dispatchName").value.trim();
    qty = document.getElementById("dispatchQty").value.trim();
    location = document.getElementById("dispatchLocation").value.trim();
    receiver = document.getElementById("dispatchReceiver").value.trim() || "-";
  }

  if(!name || !qty || !location){
    alert("Fill all fields");
    return;
  }

  materials.push({type, name, qty, location, receiver, remarks:""});
  saveMaterials();

  loadEntryTable();
  loadDispatchTable();
  loadCriticalStocks();

  alert("Saved Successfully");
}


/* ================= TABLES ================= */

function loadEntryTable(){
  const table = document.getElementById("entryTable");
  if(!table) return;

  table.innerHTML = "";

  materials.forEach((item,index)=>{
    if(item.type !== "entry") return;

    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.location}</td>
        <td>
          <button onclick="editMaterial(${index})">✏ Edit</button>
          <button onclick="deleteMaterial(${index})">🗑 Delete</button>
        </td>
      </tr>
    `;
  });
}


function loadDispatchTable(){
  const table = document.getElementById("dispatchTable");
  if(!table) return;

  table.innerHTML = "";

  materials.forEach((item,index)=>{
    if(item.type !== "dispatch") return;

    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.location}</td>
        <td>${item.receiver}</td>
        <td>
          <button onclick="editMaterial(${index})">✏ Edit</button>
          <button onclick="deleteMaterial(${index})">🗑 Delete</button>
        </td>
      </tr>
    `;
  });
}


/* ================= CRITICAL STOCK ================= */

function loadCriticalStocks(){

  const table = document.getElementById("criticalTable");
  if(!table) return;

  table.innerHTML = "";

  materials
    .filter(i => parseInt(i.qty) <= 5)
    .forEach(i=>{
      table.innerHTML += `
        <tr>
          <td>${i.name}</td>
          <td>${i.qty}</td>
          <td>${i.location}</td>
          <td>⚠ Critical</td>
        </tr>
      `;
    });
}


/* ================= PLACEHOLDERS ================= */

function editMaterial(index){}
function deleteMaterial(index){}
function loadLoggedEmployees(){}
function changePassword(){}
function searchLocator(){}