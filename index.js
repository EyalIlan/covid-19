let proxy = 'https://api.allorigins.win/raw?url='
let ctx = document.getElementById('myChart').getContext('2d');
let ctx2 = document.getElementById('myChart')
let container = document.querySelector('.container')
let cards = document.querySelector('.cards')
let cardsTitles = document.querySelectorAll('.card h3')
const  MainContainer = document.querySelector('#MainContainer')



let  continent  = 'Asia' // the state value of the continent choose -> asia defult
let  healthData = 'deaths' //  the state of data recived  -> deaths,confirmed,recovered,critical ->  deaths defult

world = {
    
}


Chart.defaults.global.defaultFontColor = 'white';

//working ///////////////////////////////////////////////////////////////
const getContentsWithCountry = async () =>{
    let request = await fetch(`${proxy}https://restcountries.herokuapp.com/api/v1`)
    let res = await request.json()
    for(let el of res){  /// can use Map
        if(!world[el.region]){  
          world[el.region] = []
          world[el.region].push(el.name)
        }else{
            world[el.region].push(el.name)
        }
    }
//////////////////////////////////////////////////////////////////////////////
 
 await  getCountrysData()

}

// working /////////////////////////////////////////////////////////////////
const getCountrysData = async () =>{
    let request = await fetch('https://corona-api.com/countries')
    let Countrydata = await request.json()
    
    for(mainland in world){
        let CountryArray = []
      for(countryName of world[mainland]){
          for(let country of Countrydata.data){
              if(country.name === countryName.common){
                CountryArray.push({
                    name:country.name,
                    death:country.latest_data.deaths,
                    confirmed:country.latest_data.confirmed,
                    recovered:country.latest_data.recovered,
                    critical:country.latest_data.critical
                })
              }
          }
      }
   
      world[mainland] = CountryArray
    }
   return world
}

//////////////////////////////////////////////////////////////////////////


const MakeGraph = (continent,healthData) =>{
    
    let countryNames = []
    let HealthNumbers = []
    for(let el of world[continent]){
        countryNames.push(el.name)
        HealthNumbers.push(el[healthData])
    }
    
    let chart = new Chart(ctx, {
        type: 'line',
    
        data: {
            labels:countryNames,
            datasets: [{
                label: 'Corona Chart',
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor:  ['rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',],
                data: HealthNumbers
            }]
    },
    
        // Configuration options go here
        options: {}
    });


}


const createContinentHealthButtons = () =>{ // need to fix it!!!!! bad practice!!!!!!
    
    let div = document.createElement('div')
    div.classList.add('flex')
    let div2 = document.createElement('div')
    div2.classList.add('flex')
    for(let el in world['Asia'][0]){
        if(el !== 'name'){
            let button =  document.createElement('button')
            button.setAttribute('healthType',el)
            button.classList.add('btn')
            button.innerHTML = el
            div.appendChild(button)
        }
    }
    container.appendChild(div)
    for(let el in world){
        if(el !== ''){
            let button =  document.createElement('button')
            button.setAttribute('continent',el)
            button.classList.add('btn')
            button.innerHTML = el
            div2.appendChild(button)
        }
    }
    container.appendChild(div2)  
}



const ButtonEvent = () =>{
    const allButtons = document.querySelectorAll('button')
    allButtons.forEach(el =>{
        el.addEventListener('click',(p)=>{
            if(p.target.getAttribute('healthType') === null){
                continent = p.target.getAttribute('continent')
            }else{
                healthData = p.target.getAttribute('healthType')
            }
            MakeGraph(continent,healthData)
            createCountryButtons()
        })
    })
}

const createCountryButtons = () =>{

    const CountryButtons = document.querySelectorAll('.btn2')
    CountryButtons.forEach(p =>{
        p.remove()
    })

    for(let country of world[continent]){
       let bt = document.createElement('button')
       bt.setAttribute('death',country.death)
       bt.setAttribute('confirmed',country.confirmed)
       bt.setAttribute('recovered',country.recovered)
       bt.setAttribute('critical',country.critical)   
       bt.classList.add('btn2')  
       bt.innerHTML =  country.name

       bt.addEventListener('click', p =>{
            cardsTitles[0].innerHTML = p.target.getAttribute('death')
            cardsTitles[1].innerHTML = p.target.getAttribute('confirmed')
            cardsTitles[2].innerHTML = p.target.getAttribute('recovered')
            cards.classList.remove('none')
            ctx2.classList.add('none')
             
       }) 

       MainContainer.appendChild(bt)
    }
       
}

cards.addEventListener('click',p =>{
    cards.classList.add('none')
    ctx2.classList.remove('none')
})


const run = async () =>{
    await getContentsWithCountry()
    MakeGraph('Asia','death')
    createContinentHealthButtons()
    ButtonEvent()
    createCountryButtons()
}


run()
