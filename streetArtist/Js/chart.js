let myChart
function initChart(){
    const last7 = document.querySelector("#last7")
    const last14 = document.querySelector("#last14")
    const last30 = document.querySelector("#last30")
    const last360 = document.querySelector("#last360")
    const artistName = localStorage.getItem("artist")

    const itemsPerArtist = items_LS ? items_LS.filter(item => item.artist === artistName) :
    items.filter(item => item.artist === artistName)

    const soldItems = itemsPerArtist.filter(item => item.dateSold)

    let dateLabels = generateDates(14)
    let daysData = dateLabels.map(label =>{
        let sum = 0
        soldItems.forEach(item => {
            if(formatDate(item.dateSold) === label){
                sum += item.priceSold
            }
        });
        return sum
    })

    let daysLabels = dateLabels.map(label => label.slice(0,2))


    const data = {
    labels: daysLabels,
    datasets: [{
      axis: 'y',
      label: 'Amount',
      data: daysData,
      fill:false,
      backgroundColor: ['#A16A5E'],
      hoverBackgroundColor:["#D44C2E"],
      barThickness: 8
    }]
    };

    const config = {
        type: 'bar',
        data: data,
        options:{
            maintainAspectRatio: false,
            indexAxis: 'y'
        }
    };
    if(!myChart){
         myChart = new Chart(document.getElementById('myChart'), config);
    }


    document.addEventListener("click", function(e){
        const {target} = e
        let days

        target === last7 ? days = 7 : target === last14 ?
        days = 14 : target === last30 ? days = 30 :target === last360 ? days = 360: ""

        if(days){
            const activeBtn = document.querySelector(".days-btns .active")
            activeBtn.classList.remove("active")
            target.classList.add("active")

            dateLabels = generateDates(days)
            daysLabels = dateLabels.map(label => label.slice(0,2))
            myChart.data.labels = daysLabels

            daysData = dateLabels.map(label =>{
                let sum = 0
                soldItems.forEach(item => {
                    if(formatDate(item.dateSold) === label){
                        sum += item.priceSold
                    }
                });
                return sum
            })
            myChart.data.datasets[0].data = daysData
            myChart.update()
        }
    })
   last14.click() //reseton chartin per User te rri
}

function formatDate(date){
    return new Date(date).toLocaleDateString("en-GB")
}

function generateDates(daysAgo){
    const arr = []
    for (let i = 0; i < daysAgo; i++) {
        const now = new Date();
        const date = now.setDate(now.getDate() - i)
        arr.push(formatDate(date))
    }
    return arr
}