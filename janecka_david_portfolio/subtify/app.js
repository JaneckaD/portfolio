const myForm = document.getElementById("myForm");
const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const input3 = document.getElementById("input3");
const wrapper = document.querySelector(".wrapper");

// Logika pro zobrazení formuláře při kliknutí na "Plus" kartu
const plusButton = document.querySelector(".container");
const formCard = document.querySelector(".nazev");

plusButton.addEventListener("click", () => {
  formCard.style.display = "flex"; // Zobrazí formulář
});

// Logika pro schování formuláře po kliknutí na tlačítko smazání
const deleteButton = document.getElementById("delete-bt");

deleteButton.addEventListener("click", () => {
  formCard.style.display = "none"; // Skryje formulář
  myForm.reset();
});

// Načtení hodnoty cardCounter z localStorage při načítání stránky
let cardCounter = parseInt(localStorage.getItem("cardCounter")) || 0; // Pokud není v localStorage, nastavíme na 0

// Funkce pro formátování data na dd.mm.yyyy
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Měsíce jsou 0-indexovány
  const year = date.getFullYear();

  return `${day}. ${month}. ${year}`; // Formát dd.mm.yyyy
}

// Při odeslání formuláře vytvoříme novou kartu
myForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Získání dnešního data
  const today = new Date().toISOString().split('T')[0]; // "yyyy-mm-dd"

  // Kontrola, zda datum není starší než dnes
  if (input2.value < today) {
    alert("Datum nesmí být v minulosti.");
    return;
  }

  // Zvýšíme čítač karet
  cardCounter++;

  // Uložíme aktuální hodnotu cardCounter do localStorage
  localStorage.setItem("cardCounter", cardCounter);

  // Objekt, který chceme uložit
  const cardData = {
    input1: input1.value,
    input2: formatDate(input2.value), // Převedeme datum na formát dd.mm.yyyy
    input3: input3.value
  };

  // Uložíme data aktuální karty do localStorage s unikátním klíčem
  localStorage.setItem(`card-${cardCounter}`, JSON.stringify(cardData));

  // Vytvoření nové karty
  const newCard = document.createElement("div");
  newCard.classList.add("karta");
  newCard.setAttribute("id", `card-${cardCounter}`);

  newCard.innerHTML = `
    <div class="radek1">
      <p class="sluzba">${cardData.input1}</p>
      <button class="delete2" id="delete-${cardCounter}">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
    </div>
    <div class="radek2">
      <p class="splatnost-icon">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-240q100 0 170-70t70-170q0-100-70-170t-170-70v240L310-310q35 33 78.5 51.5T480-240Zm0 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
      </p>
      <p class="dalsi-sp">${cardData.input2}</p>
    </div>
    <div class="radek3">
      <p class="predplaceno-icon">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z"/></svg>
      </p>
      <p class="uz-pr">${cardData.input3} Kč</p>
    </div>
  `;

  wrapper.insertBefore(newCard, document.querySelector(".nazev"));
  myForm.reset();
  document.querySelector(".nazev").style.display = "none";

  // Přidání funkce na smazání konkrétní karty
  newCard.querySelector(".delete2").addEventListener("click", () => {
    localStorage.removeItem(`card-${cardCounter}`); // Odstranění z localStorage
    newCard.remove(); // Odstranění z DOM
  });
});

// Načtení všech uložených karet při načítání stránky
window.addEventListener("load", () => {
  // Nastavení atributu min pro input2 na dnešní datum
  const today = new Date().toISOString().split('T')[0]; // "yyyy-mm-dd"
  input2.setAttribute('min', today);

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("card-")) {
      const cardData = JSON.parse(localStorage.getItem(key));

      const newCard = document.createElement("div");
      newCard.classList.add("karta");
      newCard.setAttribute("id", key);

      newCard.innerHTML = `
        <div class="radek1">
          <p class="sluzba">${cardData.input1}</p>
          <button class="delete2" id="delete-${key}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </button>
        </div>
        <div class="radek2">
          <p class="splatnost-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-240q100 0 170-70t70-170q0-100-70-170t-170-70v240L310-310q35 33 78.5 51.5T480-240Zm0 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
          </p>
          <p class="dalsi-sp">${cardData.input2}</p>
        </div>
        <div class="radek3">
          <p class="predplaceno-icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z"/></svg>
          </p>
          <p class="uz-pr">${cardData.input3} Kč</p>
        </div>
      `;

      wrapper.insertBefore(newCard, document.querySelector(".nazev"));

      // Přidání funkce na smazání konkrétní karty
      newCard.querySelector(".delete2").addEventListener("click", () => {
        localStorage.removeItem(key); // Odstranění z localStorage
        newCard.remove(); // Odstranění z DOM
      });
    }
  });
});
