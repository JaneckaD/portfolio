document.addEventListener('DOMContentLoaded', nacteniKaret);
document.addEventListener("DOMContentLoaded", () => {
    
    

    //  nacteni rezimu
    const ulozenyRezim = localStorage.getItem("rezim");
    if (ulozenyRezim !== null) {
        rezimPocitadlo = parseInt(ulozenyRezim);
    }
    nastavRezim();
});


// --- PŘEKLADY  -- cestina, nemcina, anglictina
const translations = {
    cz: {
       
        appNamePart1: "Sub",
        appNamePart2: "Tify",
        preloaderText: "🚀 Spouštím Subtify engine…",
        placeholderSearch: "Vyhledat předplatné...",
        addCardTitle: "Přidat",
        inputName: "Zadejte název",
        inputAmount: "Zadejte částku v czk",
        inputDate: "Zadejte datum další splátky",
        addCardButton: "Přidat",
        cardDueDate: "Datum další splatnosti:",
        cardAmount: "Částka:",
        hledacekText: "Vyhledat předplatné...",
        footerSlogan: "Chytrá správa všech vašich předplatných na jednom místě.<br>Udržujte přehled, šetřete peníze a mějte kontrolu nad svými výdaji.",
        footerCopyright: "Copyright © 2025. Made By D. Zedek & D. Vavrečka & D. Janečka & D. Svoboda",
    },
    en: {
        appNamePart1: "Sub",
        appNamePart2: "Tify",
        preloaderText: "🚀 Launching Subtify engine…",
        placeholderSearch: "Search subscription...",
        addCardTitle: "Add",
        inputName: "Enter name",
        inputAmount: "Enter amount in CZK",
        inputDate: "Enter next payment date",
        addCardButton: "Add",
        cardDueDate: "Next due date:",
        cardAmount: "Amount:",
        hledacekText: "Search subscription...",
        footerSlogan: "Smart management of all your subscriptions in one place.<br>Keep track, save money, and control your expenses.",
        footerCopyright: "Copyright © 2025. Made By D. Zedek & D. Vavrečka & D. Janečka & D. Svoboda",
    },
    de: {
        appNamePart1: "Sub",
        appNamePart2: "Tify",
        preloaderText: "🚀 Subtify Engine wird gestartet…",
        placeholderSearch: "Abonnement suchen...",
        addCardTitle: "Hinzufügen",
        inputName: "Namen eingeben",
        inputAmount: "Betrag in CZK eingeben",
        inputDate: "Nächstes Fälligkeitsdatum eingeben",
        addCardButton: "Hinzufügen",
        cardDueDate: "Nächstes Fälligkeitsdatum:",
        cardAmount: "Betrag:",
        hledacekText: "Abonnement suchen...",
        footerSlogan: "Intelligente Verwaltung all Ihrer Abonnements an einem Ort.<br>Behalten Sie den Überblick, sparen Sie Geld und kontrollieren Sie Ihre Ausgaben.",
        footerCopyright: "Copyright © 2025. Made By D. Zedek & D. Vavrečka & D. Janečka & D. Svoboda",
    }
};


function updateLanguage(langCode) {
    const lang = translations[langCode];
    if (!lang) return;


    document.querySelector('.levaStrana h1:first-child').textContent = lang.appNamePart1;
    document.querySelector('.levaStrana h1.blue').textContent = lang.appNamePart2;
    document.getElementById('preloader').querySelector('p').textContent = lang.preloaderText;
    document.getElementById('hledacek').placeholder = lang.hledacekText


    document.getElementById('nazevInput').placeholder = lang.inputName;
    document.getElementById('castkaInput').placeholder = lang.inputAmount;
    document.getElementById('dateInput').placeholder = lang.inputDate;
    document.getElementById('pridat').textContent = lang.addCardButton;

    // texty karet
    document.querySelectorAll('.karta').forEach(karta => {
        const dateElement = karta.querySelector('.datumExpirace');
        if (dateElement) {
            dateElement.textContent = `${lang.cardDueDate} ${dateElement.dataset.originalDate || ''}`;
        }

        const amountElement = karta.querySelector('.castka');
        if (amountElement && amountElement.dataset.originalAmount) {
            const originalAmount = parseFloat(amountElement.dataset.originalAmount);
            let displayAmount;

            if (currentCurrency === 'czk') {
                displayAmount = Math.round(originalAmount);
            } else {
                displayAmount = (originalAmount * (exchangeRates[currentCurrency] || 1)).toFixed(2);
            }

            amountElement.innerHTML = `${lang.cardAmount} ${displayAmount} ${currencySymbols[currentCurrency] || 'Kč'}`;
        }
    });

    // Footer
    document.querySelector('.footerText p').innerHTML = lang.footerSlogan;
    document.querySelector('.footer-bottom-section .copyright-text').textContent = lang.footerCopyright;
}




const jazykSelect = document.getElementById('jazyk');


const defaultLang = jazykSelect.value;
updateLanguage(defaultLang);

jazykSelect.addEventListener('change', (event) => {
    const novyJazyk = event.target.value;
    updateLanguage(novyJazyk);
    

    localStorage.setItem('userLang', novyJazyk);  // ulozeni jazyka do local storage
});


document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('userLang') || 'cz'; 
    if (jazykSelect.value !== savedLang) {
        jazykSelect.value = savedLang; 
    }
    updateLanguage(savedLang);
    
});


// KURZY A MENA

// API
const API_URL = "https://api.exchangerate-api.com/v4/latest/CZK";
let exchangeRates = null; 
let currentCurrency = 'czk'; 

const currencySymbols = {
    czk: "Kč",
    eur: "€",
    usd: "$"
};


const currencyLabels = {
    cardAmount: "Částka:",
    inputAmount: "Zadejte částku v"
};



function updateCurrency(newCurrency) {

    if (!exchangeRates) {
        console.warn("Čekám na načtení směnných kurzů z API...");
        return; 
    }
    
    currentCurrency = newCurrency;
    
    const conversionRate = exchangeRates[newCurrency] || exchangeRates['czk']; 
    const targetSymbol = currencySymbols[newCurrency] || currencySymbols['czk'];
    
    const amountLabel = currencyLabels.cardAmount;
    const amountLabelInput = currencyLabels.inputAmount;

    const castkaInput = document.getElementById('castkaInput');
    if (castkaInput) {
        castkaInput.placeholder = `${amountLabelInput} ${newCurrency.toUpperCase()}`;
    }

 
    document.querySelectorAll('.karta, .kartaExpirace').forEach(karta => {
        const amountElement = karta.querySelector('.castka');

        if (amountElement && amountElement.dataset.originalAmount) {
            const originalAmountCZK = parseFloat(amountElement.dataset.originalAmount);

            if (!isNaN(originalAmountCZK)) {
                
                const convertedAmount = originalAmountCZK * conversionRate;
                
                let displayAmount;

                if (newCurrency === 'czk') {
                    // CZK - zaokrouhleni na nejblizsi cele cislo
                    displayAmount = Math.round(convertedAmount);
                } else {
                    // dve desetinna
                    displayAmount = convertedAmount.toFixed(2);
                }

                amountElement.innerHTML = `${amountLabel} ${displayAmount} ${targetSymbol}`;
            }
        }
    });
}


// API 
async function fetchExchangeRates() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        exchangeRates = {
            czk: 1.0,
            eur: data.rates.EUR,
            usd: data.rates.USD
        };
        console.log("Kurzy úspěšně načteny z API:", exchangeRates);
        
 // ulozeni local storage
        const savedMena = localStorage.getItem('userMena') || 'czk';
        const menaSelect = document.getElementById('mena');
        if (menaSelect) {
             menaSelect.value = savedMena;
        }
        updateCurrency(savedMena);

    } catch (error) {
        console.error("Chyba při načítání směnných kurzů z API. Používají se záložní kurzy.", error);
        
        // Záložní kurzy v případě selhání API
        exchangeRates = {
            czk: 1.0,
            eur: 0.040, // 1 CZK = 0.040 EUR
            usd: 0.043  // 1 CZK = 0.043 USD
        };
        alert("Chyba při načítání aktuálních kurzů. Používají se statické záložní kurzy.");
        

        const savedMena = localStorage.getItem('userMena') || 'czk';
        const menaSelect = document.getElementById('mena');
        if (menaSelect) {
             menaSelect.value = savedMena;
        }
        updateCurrency(savedMena);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    fetchExchangeRates(); 

    const menaSelect = document.getElementById('mena');
    if (menaSelect) {
   
        menaSelect.addEventListener('change', (event) => {
            const novaMena = event.target.value;
            updateCurrency(novaMena);

            localStorage.setItem('userMena', novaMena); 
        });
    }
    
});




// chcandova verze režimů (pak se dohodneme)
let rezimPocitadlo = 0;

function nastavRezim() {
    if (rezimPocitadlo === 1) {
        // Tmavý režim
        document.documentElement.classList.add("dark-mode"); // <<< Přidej toto

        document.documentElement.style.setProperty("--white-primary", "#212121");
        document.documentElement.style.setProperty("--white-secondary", "#ffffff");
        document.documentElement.style.setProperty("--white-third", "#181818");
        document.documentElement.style.setProperty("--white-fourth", "#181818");
        document.getElementById("theme-icon").src = "obrazky/device-theme_w.png";
        document.getElementById("plus").src = "obrazky/plus_w.png";
        document.getElementById("mena-icon").src = "obrazky/change_w.png";
        document.getElementById("jazyk-icon").src = "obrazky/language_w.png";
        document.querySelectorAll(".calendar-icon").forEach(el => el.src = "obrazky/calendar_w.png");
        document.querySelectorAll("#abeceda-icon").forEach(el => el.src = "obrazky/az_w.png");
        document.querySelectorAll("#datum-icon").forEach(el => el.src = "obrazky/hourglass_w.png");
        document.querySelectorAll("#castka-icon").forEach(el => el.src = "obrazky/piggy-bank_w.png");

    } else {
        // Světlý režim
        document.documentElement.classList.remove("dark-mode"); // <<< A i toto

        document.documentElement.style.setProperty("--white-primary", "#ffffff");
        document.documentElement.style.setProperty("--white-secondary", "#000000");
        document.documentElement.style.setProperty("--white-third", "#ffffff");
        document.documentElement.style.setProperty("--white-fourth", "#000000");
        document.getElementById("theme-icon").src = "obrazky/device-theme.png";
        document.getElementById("plus").src = "obrazky/plus.png";
        document.getElementById("mena-icon").src = "obrazky/change.png";
        document.getElementById("jazyk-icon").src = "obrazky/language.png";
        document.querySelectorAll(".calendar-icon").forEach(el => el.src = "obrazky/calendar.png");
        document.querySelectorAll("#abeceda-icon").forEach(el => el.src = "obrazky/az.png");
        document.querySelectorAll("#datum-icon").forEach(el => el.src = "obrazky/hourglass.png");
        document.querySelectorAll("#castka-icon").forEach(el => el.src = "obrazky/piggy-bank.png");
    }
}



document.getElementById("theme-icon").addEventListener("click", () => {
    rezimPocitadlo = rezimPocitadlo === 0 ? 1 : 0;
    localStorage.setItem("rezim", rezimPocitadlo);
    nastavRezim();
});



// Přidávání karty
let kartaPlus = document.getElementById("kartaPlus");
let plus = document.getElementById("plusButton");
let pridani = document.getElementById("pridaniKarty");

plus.addEventListener("click", () => {
    kartaPlus.style.display = "none";      
    pridani.style.display = "flex";        
});

let pridatButton = document.getElementById("pridat");
pridat.addEventListener("click", () => {
    kartaPlus.style.display = "flex";      
    pridani.style.display = "none";        
});



// hledání podle názvu
let hledacek = document.getElementById("hledacek");

hledacek.addEventListener("input", () => {
    const hledanyText = hledacek.value;
    const karty = document.querySelectorAll(".karta, .kartaExpirace"); 

    karty.forEach(karta => {
        const nazev = karta.querySelector(".nazev");
        if (!nazev) return;

        if (hledanyText && nazev.textContent.toUpperCase().includes(hledanyText.toUpperCase())) {
            nazev.classList.add("highlight");
        } else {
            nazev.classList.remove("highlight");
        }
    });
});



//kalendar drivejsi datum
const dateInput = document.querySelector('input[type="date"]');
    let dnes = new Date().toISOString().split("T")[0];
    dateInput.min = dnes;







const POCITADLO_KLIC = 'pocitadloKaret';


let pocitadlo = Number(localStorage.getItem(POCITADLO_KLIC) || 0);


const kontejnerKaret = document.getElementById("karty");
const pridaniKartyElement = document.getElementById("pridaniKarty"); 




function vytvoreniKarty() {

    const nazevKarty = document.getElementById("nazevInput").value.trim();
    const castkaKarty = document.getElementById("castkaInput").value.trim();
    const obrazekKarty = document.getElementById("vyberObrazku").value; 
    const datumKarty = document.getElementById("dateInput").value.trim();


    


    if (!nazevKarty || !castkaKarty || !datumKarty || castkaKarty <= 0) {
        alert("Vyplňte prosím platné údaje karty (včetně kladné částky).");
        return;
    }

    // 1. Inkrementace počítadla a nastavení unikátního klíče
    pocitadlo++; 
    const klicKarty = `karta${pocitadlo}`;

    const mojePole = [nazevKarty, castkaKarty, obrazekKarty, datumKarty]; 
    localStorage.setItem(klicKarty, JSON.stringify(mojePole)); 
    localStorage.setItem(POCITADLO_KLIC, String(pocitadlo)); 


    nacteniKaret(); 

    document.getElementById("nazevInput").value = '';
    document.getElementById("castkaInput").value = '';
    document.getElementById("dateInput").value = '';
    document.getElementById("vyberObrazku").selectedIndex = 0;

    
}



function nacteniKaret() {
    if (!kontejnerKaret || !kartaPlus) {
        console.error("Kontejner karet ('karty') nebo prvek pro přidání ('kartaPlus') nebyl nalezen.");
        return;
    }

    let prvek = kontejnerKaret.firstChild;
    while (prvek && prvek !== kartaPlus) {
        const dalsiPrvek = prvek.nextSibling;
        if (prvek.nodeType === 1 && prvek.classList.contains('karta')) {
            prvek.remove();
        } else if (prvek.nodeType === 3) {
            prvek.remove();
        }
        prvek = dalsiPrvek;
    }

    const pocetKaret = pocitadlo;

    for (let i = 1; i <= pocetKaret; i++) {
        const klic = `karta${i}`;
        const dataJSON = localStorage.getItem(klic);

        if (dataJSON) {
            try {
                const kartaPole = JSON.parse(dataJSON);

                const novaKarta = document.createElement('div');
                novaKarta.classList.add('karta');
                novaKarta.id = klic;

                novaKarta.setAttribute('data-aos', 'zoom-in');
                novaKarta.setAttribute('data-aos-duration', '2500');

                novaKarta.innerHTML = `
                    <div class="dvojice" id="dvojca">
                        <div class="dvojiceLeva">
                            <p class="nazev" id="nazevOut" data-aos="fade-down" data-aos-duration="2500">${kartaPole[0]}</p>
                            <img src=${kartaPole[2]} alt="logo" class="kartaImg" data-aos="zoom-in-down" data-aos-duration="3000" id="logoOut"> 
                        </div>
                        <div class="dvojicePrava">
                            <button class="kartaImgs" id="smazat" data-klic="${klic}"><img src="obrazky/bin.png" alt="smazat" id="smazat-icon" class="del"  data-aos="zoom-in-down" data-aos-duration="3000"></button>
                        </div>
                    </div>
                    <p class="datumExpirace" data-original-date="${kartaPole[3]}" data-aos="slide-down" data-aos-duration="2600">
                        Datum další splatnosti: ${kartaPole[3]}
                    </p>
                    <p class="castka" data-aos="slide-down" data-aos-duration="2900" data-original-amount="${kartaPole[1]}">
                        Částka: ${kartaPole[1]} Kč
                    </p>
                `;

                kontejnerKaret.insertBefore(novaKarta, kartaPlus);

            } catch (e) {
                console.error(`Chyba při parsování dat pro klíč ${klic}:`, e);
            }
        }
    }

    if (pridaniKartyElement) {
        // pridaniKartyElement.style.display = 'none';
    }

    // datum splatnosti
    zvyrazniBliziciSeKarty();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("karty").addEventListener("click", (event) => {
        const deleteButton = event.target.closest("#smazat"); 

        if (deleteButton) {
            const klicKarty = deleteButton.dataset.klic;
            const targetCard = deleteButton.closest(".karta");
            
            if (targetCard) {
                targetCard.remove();
                if (klicKarty) {
                    localStorage.removeItem(klicKarty);
                }
            } else {
                console.error("Nadřezený prvek nenalezen, něco jsi pokazil :D");
            }
        }
    });
});


function zvyrazniBliziciSeKarty() {
    const dnes = new Date();
    const karty = document.querySelectorAll(".karta, .kartaExpirace");

    karty.forEach(karta => {
        const datumElement = karta.querySelector(".datumExpirace");
        if (!datumElement) return;

        const text = datumElement.textContent;
        const datumText = text.split(":").pop().trim(); 
        const datumKarty = new Date(datumText);

        if (!isNaN(datumKarty)) {
            const rozdilMs = datumKarty - dnes;
            const rozdilDni = rozdilMs / (1000 * 60 * 60 * 24);

            if (rozdilDni >= 0 && rozdilDni <= 3) {
                karta.classList.add("kartaExpirace");
            } else {
                karta.classList.remove("kartaExpirace");
            }
        }
    });
} 



//filtrace podle datumu
let datumSmer = "ASC"
function seradKartyDatum() {
    const karty = [...document.querySelectorAll(".karta")];
    const container = document.getElementById("karty");
    const kartaPlus = document.getElementById("kartaPlus");

    karty.sort((a, b) => {
        const datumA = new Date(a.querySelector(".datumExpirace").dataset.originalDate);
        const datumB = new Date(b.querySelector(".datumExpirace").dataset.originalDate);

        return datumSmer === "ASC" ? datumA - datumB : datumB - datumA;
    });

    karty.forEach(karta => container.insertBefore(karta, kartaPlus));
}
document.getElementById("datum").addEventListener("click", () => {
    seradKartyDatum();
    datumSmer = datumSmer === "ASC" ? "DESC" : "ASC";
});

// filtrace podle abecedy
let abecedaSmer = "ASC"
function seradKartyAbecedne() {
    
    const karty = [...document.querySelectorAll(".karta")]; // pole karet
    const container = document.getElementById("karty");
    const kartaPlus = document.getElementById("kartaPlus");

    karty.sort((a, b) => {
        const nazevA = a.querySelector(".nazev").textContent.toUpperCase();
        const nazevB = b.querySelector(".nazev").textContent.toUpperCase();

        if (nazevA < nazevB) return abecedaSmer === "ASC" ? -1 : 1;
        if (nazevA > nazevB) return abecedaSmer === "ASC" ? 1 : -1;
        return 0;
    });
    

    karty.forEach(karta => container.insertBefore(karta, kartaPlus));
}

document.getElementById("abeceda").addEventListener("click", () => {
    seradKartyAbecedne()
    abecedaSmer = abecedaSmer === "ASC" ? "DESC" : "ASC";
});


//filtrace podle castky
let castkaSmer = "ASC"
function seradKartyCastka() {
    const karty = [...document.querySelectorAll(".karta")];
    const container = document.getElementById("karty");
    const kartaPlus = document.getElementById("kartaPlus");

    karty.sort((a, b) => {
        const castkaA = parseFloat(a.querySelector(".castka").dataset.originalAmount);
        const castkaB = parseFloat(b.querySelector(".castka").dataset.originalAmount);

        return castkaSmer === "ASC" ? castkaA - castkaB : castkaB - castkaA;
    });

    karty.forEach(karta => container.insertBefore(karta, kartaPlus));
}
document.getElementById("castka").addEventListener("click", () => {
   seradKartyCastka();
   castkaSmer = castkaSmer === "ASC" ? "DESC" : "ASC"; 
});




