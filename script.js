let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => { //para desenhar mapas, primeiro precisa importar os dados antes de desenhar
 
    canvas.selectAll('path')
            .data(countyData)
            .enter() //especificar o que fazer quando há um objeto de um county que não tem um caminho
            .append('path')
            .attr('d', d3.geoPath()) //converte a geometria em uma string para desenhar o caminho necessário
            .attr('class', 'county')
            .attr('fill', (countyData) => {
                let id = countyData['id']
                let county = educationData.find((item) => {
                   return item['fips'] === id
                }) 
                let percentage = county['bachelorsOrHigher']
                if(percentage <= 15){
                    return "#f7fbff"
                    } else if(percentage <= 30){
                        return "#6daed5"
                    } else if(percentage <= 45) {
                        return "#2f7ebc"
                    } else{
                        return "#08306b"
                    }

//
            } )
            .attr('data-fips', (countyDataItem) =>{
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) =>{
                let id = countyData['id']
                let county = educationData.find((item) => {
                   return item['fips'] === id
                }) 
                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .on('mouseover', (countyDataItem) =>{
                tooltip.transition()
                .style('visibility', 'visible')
                let id = countyData['id']
                let county = educationData.find((item) => {
                   return item['fips'] === id
                })
                
                tooltip.text(county['fips'] + '-' + county['area_name'] + ','+
                county['state'] + ':' + county['bachelorsOrHigher'] + '%')

                tooltip.attr('data-education', county['bachelorsOrHigher'])
                
            })
            .on('mouseout', (countyDataItem) =>{
                tooltip.transition()
                .style('visibility', 'hidden')
            })
}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features // método para mudar para geodata
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    } else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)