//making a tree map
let movieDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"


let movieData

//dimensions
let height = 500 ;
let width = 1000 ;
let padding = 30;

let colors = ['#fde992', '#40e0d0', '#fcbacb', '#df6967', '#aef359', '#5555a9', '#99edc3']
let movieCategory = ['Action', 'Drama', 'Adventure', 'Family', 'Animation', 'Comedy', 'Biography']

let svg = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

let canvas = d3.select('#canvas')
                .attr('width', width)
                .attr('height', height)

let drawMap = ( ) => {

    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node['children']
    }).sum((node) => {
        return node['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']
    })

    let createTreeMap = d3.treemap()
                            .size([width, height])
    
    createTreeMap(hierarchy)

    let movieBlock = hierarchy.leaves()
    console.log(movieBlock)

    let block = canvas.selectAll('g')
                    .data(movieBlock)
                    .enter()
                    .append('g')
                    .attr('transform', (movie) => {
                        return 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')'
                    })
    
    block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (movie) => {
                let category = movie['data']['category']
                return category  === movieCategory[0] ? colors[0]
                        : category === movieCategory[1] ? colors[1]
                        : category === movieCategory[2] ? colors[2]
                        : category === movieCategory[3] ? colors[3]
                        : category === movieCategory[4] ? colors[4]
                        : category === movieCategory[5] ? colors[5]
                        : colors[6]
            })
            .attr(('data-name'), (movie) => {
                return movie['data']['name']
            })
            .attr('data-category',  (movie) => {
                return movie['data']['category']
            })
            .attr('data-value', (movie) => {
                return movie['data']['value']
            })
            .attr('width', (movie) => {
                return movie['x1'] - movie['x0']
            })
            .attr('height', (movie) => {
                return movie['y1'] - movie['y0']
            })
            .on('mouseover', (movie) => {
                tooltip.transition()
                        .style('visibility', 'visible')

                let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                tooltip.html(
                    '$ ' + revenue + '<hr />' + movie['data']['name']
                )
                
                tooltip.attr('data-value', movie['data']['value'])
            })
            .on('mouseout', (movie) => {
                tooltip.transition()
                        .style('visibility', 'hidden')
                
                
            })

    block.append('text')
            .text((movie) =>  {
                return movie['data']['name']
            })
            .attr('x', 5)
            .attr('y', 20)

}

let createLegend = ( ) => {

    let legendContainer  = svg.append('g').attr('id', 'legend');
    let legend = legendContainer
                .selectAll('#legend')
                .data(colors)
                .enter()
                .append('g')
                .attr('class', 'legend-label')                            
                
  
    for(let i = 0 ; i <= colors.length - 1; i++){
  
        legend.append('rect')                      
              .attr('width', 20)
              .attr('height', 20)
              .attr('class', 'legend-item')
              .style('fill', colors[i])
              .attr('y', height - 15)
              .attr('x', width - 100 - 150*i)
              
              
                  
        legend.append('text')
                .attr('y', height-5)             
              .attr('dy', '.13em')
              .attr('x', width - 75 - 150*i)                       
              .text(`  ${movieCategory[i]}` )
  
    }
} 

d3.json(movieDataUrl).then(
    (data, error) => {
        if(error) {
            console.log(error)
        } else {
            movieData = data
            console.log(movieData)
        }
        createLegend();
        drawMap();
    }
)