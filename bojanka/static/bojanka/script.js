document.addEventListener('DOMContentLoaded', () => {       //js počinje raditi tek kad se učita osnova stranice

    //proglašenje svih konstanta i varijabli

    //brojač
    let interval = setInterval(štoperica, 100);     //započinje funkciju štoperica svakih 0.1 sek
    let brojač = Date.now();        //bilježi vrijeme početka pokretanja programa
    let kraj;                       //bilježi vrijeme izvršenja svih zadataka

    //django modeli
    const listaZastava = JSON.parse(document.getElementById('mydata').textContent)["zastave"];

    //HTML objekti
    const ime = document.querySelector('#ime');           //h2 naslov imena zastave
    const zastava = document.querySelector('.zastava');         //div zastave
    const pruge = document.querySelectorAll('.pruga');        //div lista svih pruga
    const drugaPruga = document.querySelector('#second');       //div druge pruge
    const selectBox = document.querySelector('#shapes');       //select menu
    const gumbi = document.querySelectorAll('button');        //div lista svih gumba
    const lista = document.querySelector('.lista');         //ul imena zastava u zadatku
    const vrijeme = document.querySelector('#vrijeme');         //pokazivač vremena
    const rekord = document.querySelector('#rekord');       //pokazivač rekorda

    let imena = [];     //lista s imenima zastava u zadatku
    let brojevi = []        //lista brojeva za zadatak

    let shape;      //trenutno odabrani dio zastave koji će se bojati s gumbima

    let dict = {};      //prazan rječnik u kojem se dodaju svojstva nacrtane zastave
    
    //definiranje funkcija

    function oboji() {      //postavlja početnu boju pruga na "white"
        for(i = 0; i < pruge.length; i++) {
            pruga = pruge[i];
            pruga.style.backgroundColor = "white";
            dict[pruga.id.toString()] = pruga.style.backgroundColor;
        }
    }

    function vidljivost(vidljiv) {      //sakriva ili otkriva pruge
        for(i = 0; i < pruge.length; i++) {
            if(vidljiv) {
                pruge[i].style.visibility = "visible";
            }
            else {
                pruge[i].style.visibility = "hidden";
            }
        }
    }

    function oblikZastave(oblik) {      //mijenja oblik zastave (horizontalan ili vertikalan)
        if(oblik === "horizontalna") {
            zastava.style = "grid-template-columns: none; grid-template-rows: repeat(3, 1fr);";            
            drugaPruga.style.borderWidth = "2px 0";
        }
        else if(oblik === "vertikalna") {
            zastava.style = "grid-template-rows: none; grid-template-columns: repeat(3, 1fr);";
            drugaPruga.style.borderWidth = "0 2px";
        }
    }

    function obriši() {     //uklanja sve select opcije (osim neodređene)
        while(selectBox.length > 1) {
            selectBox.remove(1);
        }
    }

    function dodajOption(ime, value) {     //dodaje option sa svojim imenom i valueom u padajući izbornik 
        selectBox.add(new Option(ime, value), undefined);
    }

    function nadi_zastavu(zastava_rj) {     //uzima rječnik jedne zastave iz baze i uspoređuje s nacrtano i vraća ime zastave ako su iste
        const keys = Object.keys(dict);
        for(j = 0; j < keys.length; j++) {      //uspoređuje na temelju ključeva iz dict rječnika
            let key = keys[j];
            if(!(dict[key] === zastava_rj[key])) {
                return ""
            }
        }
        return zastava_rj["name"]
    }

    function provjera() {
        for(i = 0; i < listaZastava.length; i++) {      //prolazi kroz listu zastava definiranih rječnicima
            let imeZastave = nadi_zastavu(listaZastava[i]);
            ime.innerHTML = imeZastave;     //ako se nacrtana zastava poklapa s nekom pravom, prikazuje njeno ime 
            if(imeZastave !== "") {      //funkcija završava kad se nađe odgovarajuća zastava
                if(imena.includes(imeZastave)) {        //da li je ta zastava u zadatku, ako da prekriži ju
                    document.getElementById(imeZastave).style.textDecoration = "line-through";
                    imena.splice(imena.indexOf(imeZastave), 1);
                }
                return
            }
        }
    }
    function štoperica() {      //prikazuje proteklo vrijeme od početka, prikazuje i ažurira rekord, zaustavlja brojač vremena
        if(imena.length !== 0) {
            kraj = (Math.floor((Date.now() - brojač)/100))/10;
            vrijeme.innerHTML = `Vrijeme: ${kraj} sekundi`;     //prikazuje proteklo vrijeme
        }
        else {
            if(kraj < localStorage.getItem('rekord') || localStorage.getItem('rekord') == 0) {
                localStorage.setItem('rekord', kraj);       //ako je postignut rekord, sprema ga u localStorage
            }
            clearInterval(interval);        //zaustavlja brojanje vremena
        }
    }

    //početne radnje

    //sakrivanje pruga
    pruge.forEach(div => {
        div.style.visibility = "hidden";
    });

    //bojanje gumba iz njegovog svojstva (dataset-color)
    for(i = 0; i < gumbi.length; i++) {
        let gumb = gumbi[i] 
        gumb.style.backgroundColor = gumb.dataset.color;
    }

    //dodavanje zadatka
    for(i = 0; i < 6; i++) {
        let randomBroj;
        do {
            randomBroj = Math.floor(Math.random() * listaZastava.length);
        } while(brojevi.includes(randomBroj))       //ponavlja se dok se ne nađe broj koji već nije u brojevi
        brojevi.push(randomBroj);

        let ime = listaZastava[randomBroj]["name"];     //ime randomly odabrane zastave
        let zadatak = document.createElement("li");
        zadatak.innerHTML = ime;
        zadatak.id = ime;
        imena.push(ime);
        lista.append(zadatak);
    }

    //postavljanje rekorda
    if (!localStorage.getItem('rekord')) {      //ako nema rekorda, postavlja ga na 0
        localStorage.setItem('rekord', 0);
    }
    rekord.innerHTML = `Rekord: ${localStorage.getItem('rekord')} sekundi`;     //prikazuje rekord

    //radio menu

    document.querySelectorAll('.radio').forEach((input) => {
        input.addEventListener('change', () => {
            dict["style"] = input.value;     //kod promjene tipa zastave, ažuriramo dict
            ime.innerHTML = "";         //nova zastava je prazna, pa treba ukloniti prijašnje ime
            obriši();           //uklanja select optione od prije
            if (input.value === "prazna") {
                dodajOption('Cijela zastava', 'cijela');
                vidljivost(false);
            }
            else {
                oblikZastave(input.value);
                vidljivost(true);
                oboji();

                dodajOption('Prva pruga', 'first');
                dodajOption('Druga pruga', 'second');
                dodajOption('Treća pruga', 'third');
            }
        });
    });

    //select menu
 
    selectBox.onchange = () => {       // pri odabiru optiona na select menu-u definira shape
        if (selectBox.value === "cijela") {
            shape = zastava;
        }
        else if (["first", "second", "third"].includes(selectBox.value)) {
            shape = pruge[selectBox.selectedIndex - 1];    //prugu bira prema odabranom indexu padajućeg izbornika
        }
        else {
            shape = null;       //u ovom slučaju odabrana je opcija bez ičega, pa se ništa ne radi
        }
    }

    //gumbi

    gumbi.forEach(button => {
        button.onclick = () => {
            if (shape !== null) {
                shape.style.backgroundColor = button.dataset.color;     //mijenja se boja shape objekta ovisno o pritisnutom gumbu
                dict[shape.id.toString()] = button.dataset.color;       //mijenja se boja u dict rječniku
            }
            provjera();     //provjerava da li nacrtana zastava odgovara nekoj stvarnoj
        }
    });
});