window.addEventListener(

  "pageshow",

  function(){

    document.getElementById(
      "loginUsername"
    ).value = "";

    document.getElementById(
      "loginPassword"
    ).value = "";
  }
);



let currentUser = "";

let currentUsername = "";

let materials = [];



/* CLOCK */

setInterval(() => {

  const time =
  document.getElementById("time");

  if(time){

    time.innerText =
    new Date().toLocaleString();
  }

},1000);



/* SHOW SIGNUP */

function showSignup(){

  document
  .getElementById("loginBox")
  .classList.add("hidden");

  document
  .getElementById("signupBox")
  .classList.remove("hidden");
}



/* SHOW LOGIN */

function showLogin(){

  document
  .getElementById("signupBox")
  .classList.add("hidden");

  document
  .getElementById("loginBox")
  .classList.remove("hidden");
}



/* SIGNUP */

function signup(){

  const name =
  document.getElementById(
    "signupName"
  ).value.trim();

  const username =
  document.getElementById(
    "signupUsername"
  ).value.trim();

  const password =
  document.getElementById(
    "signupPassword"
  ).value.trim();

  if(!name || !username || !password){

    alert("All fields required");

    return;
  }

  fetch(
    "http://localhost:5000/register",
    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        name,
        username,
        password
      })
    }
  )

  .then(res => res.json())

  .then(data => {

    alert(data.message);

    if(data.success){

      showLogin();
    }
  });
}



/* LOGIN */

function login(){

  const username =
  document.getElementById(
    "loginUsername"
  ).value.trim();

  const password =
  document.getElementById(
    "loginPassword"
  ).value.trim();

  fetch(
    "http://localhost:5000/login",
    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        username,
        password
      })
    }
  )

  .then(async res => {

    const data =
    await res.json();

    if(!res.ok){

      alert(data.message);

      return;
    }

    currentUser =
    data.user.name;

    currentUsername =
    data.user.username;

    document
    .getElementById("loginPage")
    .classList.add("hidden");

    document
    .getElementById("dashboard")
    .classList.remove("hidden");

    document
    .getElementById("welcome")
    .innerText =
    "WELCOME " + currentUser;

    if(data.user.role === "admin"){

      document
      .getElementById("adminBtn")
      .classList.remove("hidden");

      document
      .getElementById("loggedUsersBtn")
      .classList.remove("hidden");

      loadLoggedEmployees();
    }

  })

  .catch(() => {

    alert("Server Not Responding");
  });
}



/* LOGOUT */

function logout(){

  fetch(
    "http://localhost:5000/logout",
    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        username:currentUsername
      })
    }
  )

  .then(() => {

    location.reload();
  });
}



/* OPEN PAGE */

function openPage(page){

  const pages = [

    "dashboard",

    "entry",

    "dispatch",

    "locator",

    "adminPanel",

    "loggedUsersPage"
  ];

  pages.forEach(id => {

    document
    .getElementById(id)
    .classList.add("hidden");
  });

  document
  .getElementById(page)
  .classList.remove("hidden");
}



/* BACK */

function back(){

  [

    "entry",

    "dispatch",

    "locator",

    "adminPanel",

    "loggedUsersPage"

  ].forEach(id => {

    document
    .getElementById(id)
    .classList.add("hidden");
  });

  document
  .getElementById("dashboard")
  .classList.remove("hidden");
}



/* MATERIAL ENTRY + DISPATCH */

function submitMaterial(type){

  let name = "";
  let qty = "";
  let location = "";

  if(type === "entry"){

    name =
    document.getElementById(
      "entryName"
    ).value;

    qty =
    document.getElementById(
      "entryQty"
    ).value;

    location =
    document.getElementById(
      "entryLocation"
    ).value;
  }

  else{

    name =
    document.getElementById(
      "dispatchName"
    ).value;

    qty =
    document.getElementById(
      "dispatchQty"
    ).value;

    location =
    document.getElementById(
      "dispatchLocation"
    ).value;
  }

  if(!name || !qty || !location){

    alert("Fill all fields");

    return;
  }

  materials.push({

    name,
    qty,
    location
  });

  loadEntryTable();

  loadCriticalStocks();

  alert("Saved Successfully");
}



/* LOAD ENTRY TABLE */

function loadEntryTable(){

  const table =
  document.getElementById(
    "entryTable"
  );

  table.innerHTML = "";

  materials.forEach(item => {

    table.innerHTML += `

      <tr>

        <td>${item.name}</td>

        <td>${item.qty}</td>

        <td>${item.location}</td>

      </tr>

    `;
  });
}



/* CRITICAL STOCK */

function loadCriticalStocks(){

  const table =
  document.getElementById(
    "criticalTable"
  );

  table.innerHTML = "";

  materials
  .filter(item => item.qty <= 5)

  .forEach(item => {

    table.innerHTML += `

      <tr>

        <td>${item.name}</td>

        <td>${item.qty}</td>

        <td>${item.location}</td>

      </tr>

    `;
  });
}



/* LOCATOR */

function searchLocator(){

  const name =
  document.getElementById(
    "locName"
  ).value.toLowerCase();

  const result =
  materials.find(item =>

    item.name
    .toLowerCase()
    .includes(name)
  );

  if(result){

    alert(

      "Found at: " +

      result.location
    );
  }

  else{

    alert("Item Not Found");
  }
}



/* ADMIN */

function changePassword(){

  alert("Password Changed");
}



/* LOGGED EMPLOYEES */

function loadLoggedEmployees(){

  fetch(
    "http://localhost:5000/logged-users"
  )

  .then(res => res.json())

  .then(data => {

    const table =
    document.getElementById(
      "loggedUsersTable"
    );

    table.innerHTML = "";

    data.users.forEach(user => {

      table.innerHTML += `

        <tr>

          <td>${user.name}</td>

          <td>${user.username}</td>

          <td>🟢 Online</td>

        </tr>

      `;
    });
  });
}