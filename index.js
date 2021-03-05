let proxy = 'https://api.allorigins.win/raw?url='
let ctx = document.getElementById('myChart').getContext('2d');
let Grid = document.querySelector('.grid')


let  continent  = 'Asia' // the state value of the continent choose -> asia defult
let  healthData = 'deaths' //  the state of data recived  -> deaths,confirmed,recovered,critical ->  deaths defult



world = {
    
}



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
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: HealthNumbers
            }]
    },
    
        // Configuration options go here
        options: {}
    });


}


const createContinentHealthButtons = () =>{
    
    for(let el in world['Asia'][0]){
        if(el !== 'name'){
            let button =  document.createElement('element')
            button.setAttribute('healthType',el)
            button.classList.add('btn')
            button.innerHTML = el
            Grid.appendChild(button)
        }
    }
    for(let el in world){
        if(el !== ''){
            let button =  document.createElement('element')
            button.setAttribute('continent',el)
            button.classList.add('btn')
            button.innerHTML = el
            Grid.appendChild(button)
        }
    }

}


const run = async () =>{
    await getContentsWithCountry()
    MakeGraph('Asia','death')
    createContinentHealthButtons()
}


run()
