let proxy = 'https://api.allorigins.win/raw?url='
let ctx = document.getElementById('myChart').getContext('2d');
let ctx2 = document.getElementById('myChart')
let container = document.querySelector('.container')
let cards = document.querySelector('.cards')
let cardsTitles = document.querySelectorAll('.card h3')
const  MainContainer = document.querySelector('#MainContainer')



let  continent  = 'Asia' // the state value of the continent choose -> asia defult
let  healthData = 'death' //  the state of data recived  -> deaths,confirmed,recovered,critical ->  deaths defult


let totalDeaths = 0
let positive = 0
let recovered = 0

world = {
    
}


Chart.defaults.global.defaultFontColor = 'white';

/////////////////////////////////////////////////////////////////
const getContentsWithCountry = async () =>{
    let request = await fetch(`${proxy}https://api.covidtracking.com/v1/states/current.json`)
    let res = await request.json()

    for(let el of res){  /// can use Map
        if(!world[el.state]){  
          world[el.state] = []
          world[el.state].push(el)
          totalDeaths = totalDeaths + (world[el.state][0].death || 1)
          positive = positive + (world[el.state][0].positive || 1)
          recovered = recovered + (world[el.state][0].recovered || 1)
        }else{
            world[el.state].push(el)
        }
    }
//////////////////////////////////////////////////////////////////////////////
//  await  getCountrysData()

}

///////////////////////////////////////////////////////////////////
// const getCountrysData = async () =>{
//     let request = await fetch('https://corona-api.com/countries')
//     let Countrydata = await request.json()
    
//     for(mainland in world){
//         let CountryArray = []
//       for(countryName of world[mainland]){
//           for(let country of Countrydata.data){
//               if(country.name === countryName.common){
//                 CountryArray.push({
//                     name:country.name,
//                     death:country.latest_data.deaths,
//                     confirmed:country.latest_data.confirmed,
//                     recovered:country.latest_data.recovered,
//                     critical:country.latest_data.critical
//                 })
//               }
//           }
//       }
   
//       world[mainland] = CountryArray
//     }
//    return world
// }

//////////////////////////////////////////////////////////////////////////


const MakeGraph = (healthData) =>{
    let countryNames = []
    let HealthNumbers = []
    for(let el in world){

        countryNames.push(el)
        world[el][0][healthData]?HealthNumbers.push(world[el][0][healthData]):HealthNumbers.push(1)
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
    
        options: {}
    });


}


// const createContinentHealthButtons = () =>{ 
//     console.log(world);
//     console.log('in create buttons');
//     let div = document.createElement('div')
//     div.classList.add('flex')
//     let div2 = document.createElement('div')
//     div2.classList.add('flex')
//     for(let el in world[0]){
//         if(el !== 'state'){
//             let button =  document.createElement('button')
//             button.setAttribute('healthType',el)
//             button.classList.add('btn')
//             button.innerHTML = el
//             div.appendChild(button)
//         }
//     }
//     container.appendChild(div)
//     // for(let el in world){
//     //     if(el !== ''){
//     //         let button =  document.createElement('button')
//     //         button.setAttribute('continent',el)
//     //         button.classList.add('btn')
//     //         button.innerHTML = el
//     //         div2.appendChild(button)
//     //     }
//     // }
//     container.appendChild(div2)  
// }



const ButtonEvent = () =>{
    console.log(world);
    const allButtons = document.querySelectorAll('.card')
    allButtons.forEach(el =>{
        el.addEventListener('click',(p)=>{
            console.log(p.target.getAttribute('type'));
            let type = p.target.getAttribute('type')

            MakeGraph(type)
            // createCountryButtons()
        })
    })
}

const createCountryButtons = () =>{

    const HealthCards = document.querySelectorAll('.card h3')
    // for(let country of world[continent]){
    //    let bt = document.createElement('button')
    //    bt.setAttribute('death',country.death)
    //    bt.setAttribute('confirmed',country.confirmed)
    //    bt.setAttribute('recovered',country.recovered)
    //    bt.setAttribute('critical',country.critical)   
    //    bt.classList.add('btn2')  
    //    bt.innerHTML =  country.name

    //    bt.addEventListener('click', p =>{
            console.log(positive);

            HealthCards[0].innerHTML = totalDeaths
            HealthCards[1].innerHTML = positive
            HealthCards[2].innerHTML = recovered
         
}         
    //    }) 

    //    MainContainer.appendChild(bt)
    // }
       
// }

// cards.addEventListener('click',p =>{
//     cards.classList.add('none')
//     ctx2.classList.remove('none')
// })


const run = async () =>{
    await getContentsWithCountry()
    MakeGraph('death')
    // createContinentHealthButtons()
    ButtonEvent()
    createCountryButtons()
}


run()
