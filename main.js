



const tip = document.querySelector('.tip')
//const dodaj = document.querySelector('.dodaj')
const gumbi = document.querySelector('.okvirGumbi')
const stanjePrikaz = document.querySelector('.stanje')
const obvestiloText = document.querySelector('.obvestiloText')
const obvestilo = document.querySelector('.obvestilo')
const gumbZapri = document.querySelector('.gumbZapri')
const tabela = document.querySelector('.tabela')
const mesci = document.querySelector('.mesci')
const zapriTabelo = document.querySelector('.zapriTabelo')
const tabelaOkvir = document.querySelector('.tabelaOkvir')
const prikaziTabelo= document.querySelector('.prikaziTabelo')
const gumbPrihod= document.querySelector('.gumbPrihod')
const gumbaBrisanje= document.querySelector('.gumbaBrisanje')
const okvirBrisiPrihOdh = document.querySelector('.okvirBrisiPrihOdh')

let today = new Date();
let dan1 = today.getDay()
let mesec1 = today.getMonth() + 1
let leto1 = today.getFullYear()

//console.log('dela')

gumbi.addEventListener('click', (e) => {
    console.log(e.target)
    if(e.target.classList.contains('prihod')) {
        dodajPrihod('prihod')
    }
    else if (e.target.classList.contains('odhod')) {
        dodajPrihod('odhod')
    }
})

gumbZapri.addEventListener('click', () => {
    obvestilo.classList.remove('prikazi')
})

zapriTabelo.addEventListener('click', () => {
    tabelaOkvir.classList.remove('prikaziTabelo')
})

prikaziTabelo.addEventListener('click', () => {
    tabelaOkvir.classList.add('prikaziTabelo')
    tabelaPodatki(mesec1)
})



//fetch('http://localhost:4000/podatki')
//.then(response => response.json())
//.then(data => console.log(data))

let podatki = null

let jsona = JSON.stringify(podatki)

console.log(jsona)

const dodajPrihod = async (prihodOdhod) => {
    let d = new Date()
    let ure = d.getHours()
    let minute = d.getMinutes()
    let sekunde = d.getSeconds()
    const pod = {
        tip: prihodOdhod,
        ura: ure + ':' + minute + ':' + sekunde,
        dan: d.getDate(),
        mesec: Number(d.getMonth()) + 1,
        leto: d.getFullYear()
    }
    console.log(pod.ura)
    try {
    const post = await fetch('urca1.onrender.com/posljiPodatke', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pod),
    })
    const response = await post.text()
    if(post.ok) {
        console.log(response)
        obvestiloText.innerText = response
        obvestilo.classList.add('prikazi')
        
    }
    if(!post.ok) {
        console.log(response)
        obvestiloText.innerText = response
        obvestilo.classList.add('prikazi')
    }
    }  
    catch (e) {
        return e
    } 
    //const response = await post.json()
    //console.log(response)
    
    osveziStanje()    
}

const pridobiPodatke = async () => {
    const response = await fetch('urca1.onrender.com/podatki')
    const data = await response.json()
    console.log(data)
}

const stanje = async () => {
    let d = new Date
    const pod = {
        mesec: Number(d.getMonth()) + 1,
        leto: d.getFullYear()
    }
    const response = await fetch('urca1.onrender.com/stanje?' + new URLSearchParams({
        mesec: pod.mesec,
        leto: pod.leto
    }))
    const data = await response.json()
    let ure = data[0].stanje.hours
    let minute = Math.abs(data[0].stanje.minutes)
    let sekunde = Math.abs(data[0].stanje.seconds)
    if('hours' in  data[0].stanje) {
        
    } else {
        ure = '00'
    }
    if('minutes' in data[0].stanje) {
    } else {
        minute = '00'
    }
    if('seconds' in data[0].stanje) {
    } else {
        sekunde = '00'
    }
    return (ure + ':' + minute + ':' + sekunde)
}

const tabelaPodatki = async (mesecIzbran) => {
    tabela.innerHTML = `<tr>
    <th>Datum</th>
    <th>Prihod</th>
    <th>Odhod</th>
</tr>`

    let d = new Date
    const pod = {
        mesec: Number(mesecIzbran),
        leto: d.getFullYear()
    }
    const response = await fetch('urca1.onrender.com/tabela?' + new URLSearchParams({
        mesec: pod.mesec,
        leto: pod.leto
    }))
    const data = await response.json()
    console.log(data)
    podatki = data
    for(const podatek of podatki) {
        const tr = document.createElement('tr')
        const td1 = document.createElement('td')
        td1.innerText = podatek.datum
        const td2 = document.createElement('td')
        td2.setAttribute('id', podatek.prihod_id)
        td2.innerText = podatek.ura_prihoda
        const td3 = document.createElement('td')
        td3.setAttribute('id', podatek.odhod_id)
        td3.innerText = podatek.ura_odhoda
        const td4 = document.createElement('td')
        const bt = document.createElement('button')
        bt.innerText = 'Briši'
        bt.classList.add('gumb')
        //bt.classList.add('btn-primary')
        bt.classList.add('brisi')
        td4.appendChild(bt)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tabela.appendChild(tr)

    }
}



const osveziStanje = async () => {
    let novoStanje = await stanje()
    stanjePrikaz.innerText = novoStanje
}

osveziStanje()

document.addEventListener('DOMContentLoaded', () => {
    osveziStanje()
})

mesci.addEventListener('change', (e) => {
    console.log(e.target.value)
    let izrbanMesec = e.target.value
    tabelaPodatki(izrbanMesec)
})

let idPrihod = null
let idOdhod = null

tabela.addEventListener('click', (e) => {
    if(e.target.classList.contains('brisi')) {

        idPrihod = e.target.parentElement.parentElement.children[1].id
        idOdhod = e.target.parentElement.parentElement.children[2].id

        okvirBrisiPrihOdh.style.display = 'block'
        
    }
})

const brisiPodatek = async (id) => {
    const data = await fetch('urca1.onrender.com/brisanje?' + new URLSearchParams({
        id: id
    }), { method: 'DELETE' })
    
    if(data.ok) {
        const response = await data.text()
        obvestiloText.innerText = response
        obvestilo.classList.add('prikazi')
    }
    else {
        console.log('Prišlo je do napake pri brisanju')
    }
}


gumbaBrisanje.addEventListener('click',async (e) => {
    console.log(e.target)
    console.log(idPrihod)
    console.log(idOdhod)

    if(e.target.classList.contains('gumbPrihod')) {
        try {
            await brisiPodatek(idPrihod)
            tabelaPodatki(1)
            okvirBrisiPrihOdh.style.display = 'none'
        }
        catch (e) {
            console.log(e)
        }
    }
    if(e.target.classList.contains('gumbOdhod')) {
        await brisiPodatek(idOdhod)
        tabelaPodatki(1)
    
        try {
            await brisiPodatek(idOdhod)
            tabelaPodatki(1)
            okvirBrisiPrihOdh.style.display = 'none'
        }
        catch (e) {
            console.log(e)
        }
    }
})



