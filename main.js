


const tip = document.querySelector('.tip')
//const dodaj = document.querySelector('.dodaj')
const gumbi = document.querySelector('.okvirGumbi')
const stanjePrikaz = document.querySelector('.stanje')
const obvestiloText = document.querySelector('.obvestiloText')
const obvestilo = document.querySelector('.obvestilo')
const gumbZapri = document.querySelector('.gumbZapri')

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




//fetch('http://localhost:4000/podatki')
//.then(response => response.json())
//.then(data => console.log(data))

const podatki = {
    tip: 'prihod',
    ura: '10:00:00',
    dan: 12,
    mesec: 12,
    leto: 2022
}

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
    const post = await fetch('https://urca1.onrender.com/posljiPodatke', {
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
    const response = await fetch('https://urca1.onrender.com/podatki')
    const data = await response.json()
    console.log(data)
}

const stanje = async () => {
    let d = new Date
    const pod = {
        mesec: Number(d.getMonth()) + 1,
        leto: d.getFullYear()
    }
    const response = await fetch('https://urca1.onrender.com/stanje?' + new URLSearchParams({
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

const osveziStanje = async () => {
    let novoStanje = await stanje()
    stanjePrikaz.innerText = novoStanje
}

osveziStanje()

//pridobiPodatke()


