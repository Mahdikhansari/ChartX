// ============================================================================================================== //
//       ChartX
//       Mahdi Khansari
//       Enhanced D3 line chart
//       Apr 21, 2023
//       v1.1.0
// ============================================================================================================== //
    class chartX {
    constructor(_container, _data){
        this.countainer = _container;
        this.data = _data;
        this.legend = [];

        // resize handler
        var ro = new ResizeObserver(enteries => {
            this.drawChart();
        })
        ro.observe(document.getElementById(this.countainer))
    }
    

    // ============================================================================================================== //
    //                                                Constants & Variables                                           //
    // ============================================================================================================== //
    chartMargin = {top: 10, right: 45, bottom: 40, left: 45};
    CHART_Y_AXIS_MARGIN_PERC_TOP = 0.1;
    CHART_Y_AXIS_MARGIN_PERC_BOTTOM = 0.1;
    CHART_X_AXIS_MARGIN_PERC_LEFT = 0;
    CHART_X_AXIS_MARGIN_PERC_RIGHT = 0;
    
    SERIES_DEFAULT_COLOR = 'black';
    SERIES_DEFAULT_STROKE_WIDTH = 1;
    SERIES_DEFAULT_DOTS_RADIUS = 3;

    CHART_GRID_X_NO = 20;
    CHART_GRID_Y_NO = 10;

    CHART_AXIS_LABEL_MARGIN_X = 30;
    CHART_AXIS_LABEL_MARGIN_Y_PRI = 4;
    CHART_AXIS_LABEL_MARGIN_Y_SEC = 20;

    // ============================================================================================================== //
    //                                                    Functions                                                   //
    // ============================================================================================================== //
    
    // JSON 2 Datum
    //————————————————————————————————————————————————————————————————————————————————————————————————————————————————
    chartJson2Datum(_ChartJson){

        // JSON Array -> Datum
        var resDatum = [];

        // how many y series
        var ySeriesCount = _ChartJson['y'].length;

        // y Series Types
        var ySeriesTypes = [];
        _ChartJson['y'].forEach(function(yk, yi){
            ySeriesTypes.push(yk['chart_type']);
        });

        // Json to Datum
        _ChartJson['x']['values'].forEach(function(xk,xi){
            
            // x
            var point = {'x' : xk};

            // for each y
            _ChartJson['y'].forEach(function(yk, yi){
                point['y'.concat(yi+1)] = _ChartJson['y'][yi]['values'][xi];
            })
            
            // push to result
            resDatum.push(point);
            point = {};
        });

        return {'datum': resDatum, 'ySeriesCount':ySeriesCount, 'ySeriesTypes': ySeriesTypes};
    }

    // Draw Chart
    //————————————————————————————————————————————————————————————————————————————————————————————————————————————————
    drawChart(){

        var _id = this.countainer;
        var _ChartJson = this.data;
        this.legend = [];

        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                   Style                                   //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        // To add style to the HTML file
        var style = document.createElement('style'); 
        style.innerHTML = this.STYLE_DEFAULT;
        document.head.appendChild(style);


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                   Divs                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        var divMain = d3.select("#".concat(_id))    // divMain
            .html('')                               // resets the content, requried while resizing
            .append("div")
            .style("height", "100%")
            .style("width", "100%")  


        var divHeader = divMain.append("div")       // divHeader [Title, Subtitle]
            .style("width", "100%")
            .style("height", "30px");

        var divChart = divMain.append("div")        // divChart [Chart]
            .style("width", "100%")
            .style("height", "auto")
            .style("position", "relative");

        var divFooter = divMain.append("div")       // divFooter [Legend]
            .style("width", "100%")
            .style("height", "30px")
            .style("text-align", "center");


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                    Data                                   //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        // Chart -> Datum
        var chartDatum = this.chartJson2Datum(_ChartJson);

        // Chart width and height
        var width = document.getElementById(_id).offsetWidth - this.chartMargin.left - this.chartMargin.right;
        var height = document.getElementById(_id).offsetHeight - this.chartMargin.top - this.chartMargin.bottom - 60;


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                    SVG                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        var svg = divChart
            .append("svg")
            .attr("width", width + this.chartMargin.left + this.chartMargin.right)
            .attr("height", height + this.chartMargin.top + this.chartMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.chartMargin.left + "," + this.chartMargin.top + ")");


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                   Title                                   //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        divHeader.append("div")                                 // Title
            .style("text-align","center")
            .style("width", "100%")
            .append("a")
            .text(_ChartJson["title"])
            .attr("class", "chartX_title")

        divHeader.append("div")                                 // Sub-title
            .style("text-align","center")
            .style("width", "100%")
            .append("a")
            .text(_ChartJson["subTitle"])
            .attr("class", "chartX_subTitle")
        


        //———————————————————————————————————————————————————————————————————————————//
        //                                    __  __                                 //
        //                                    \ \/ /                                 //  
        //                                     >  <                                  //  
        //                                    /_/\_\                                 // 
        //———————————————————————————————————————————————————————————————————————————//
   

        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                    Axis                                   //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        var xMin = d3.min(_ChartJson['x']['values']);
        var xMax = d3.max(_ChartJson['x']['values']);
        var xAxisMin = xMin - (this.CHART_X_AXIS_MARGIN_PERC_LEFT * (xMax - xMin));
        var xAxisMax = xMax + (this.CHART_X_AXIS_MARGIN_PERC_RIGHT * (xMax - xMin));
        var x = d3.scaleLinear()
            // x domain with margin
            .domain([xAxisMin, xAxisMax])
            .range([ 0, width ]);
        

        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                  Lines                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                   Grid                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(this.CHART_GRID_X_NO)
                .tickSize(-height)
                .tickFormat("")   // !!!!!!!!!!!!!!!!!! START HERE : the grid is overlapping the Axis, fix it.
            )


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                Axis Label                                 //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + this.CHART_AXIS_LABEL_MARGIN_X)
            .text(_ChartJson['x']['label'].concat('[',_ChartJson['x']['unit'],']'));

        //———————————————————————————————————————————————————————————————————————————//
        //                                   __   __                                 //
        //                                   \ \ / /                                 //
        //                                    \ V /                                  //
        //                                     |_|                                   //
        //———————————————————————————————————————————————————————————————————————————//


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                    Axis                                   //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        // there are primary and secondary axises, if all y series are using
        // only primary there wont be a secondary axis. it's also correct if
        // all y series are using only seconday axises.
        
        
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                  Primary                                  //
        //                                  Domain                                   //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        var yAll = [];
        var yAxis_primary = null;

        _ChartJson['y'].forEach(function(k){
            if(!(k['secondary_axis'])){     // Only Primary series
                yAll = yAll.concat(k["values"]);

                // Create Y axis Label (Primary)
                if(k['label'] != null){
                    if(yAxis_primary == null){
                        yAxis_primary = k['label'].concat('[',k['unit'],']');
                    }
                    else{
                        yAxis_primary = yAxis_primary.concat(', ', k['label'].concat('[',k['unit'],']'));
                    }
                }
            }
        })
        var yAxisMin = d3.min(yAll) - (this.CHART_Y_AXIS_MARGIN_PERC_BOTTOM  * (d3.max(yAll) - d3.min(yAll)));
        var yAxisMax = d3.max(yAll) + (this.CHART_Y_AXIS_MARGIN_PERC_TOP     * (d3.max(yAll) - d3.min(yAll)));

        var yp = d3.scaleLinear()
            .domain([yAxisMin, yAxisMax])
            .range([height, 0]);

        if (yAll.length > 0){
            // Primary axis render
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(yp));

            if(yAxis_primary != null){

                // Y Axis Label (Primary)
                svg.append("text")
                    .attr("class","axis_label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", this.CHART_AXIS_LABEL_MARGIN_Y_PRI - this.chartMargin.left)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(yAxis_primary);
            }
        }


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                 Secondary                                 //
        //                                  Domain                                   //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        var yAll = [];
        var yAxis_secondary = null;

        _ChartJson['y'].forEach(function(k){
            if(k['secondary_axis']){        // Only secondary series
                yAll = yAll.concat(k["values"]);

                // Create Y axis Label (Secondary)
                if(k['label'] != null){
                    if(yAxis_secondary == null){
                        yAxis_secondary = k['label'].concat('[',k['unit'],']');
                    }
                    else{
                        yAxis_secondary = yAxis_secondary.concat(', ', k['label'].concat('[',k['unit'],']'));
                    }
                }
            }
        })
        var yAxisMin = d3.min(yAll) - (this.CHART_Y_AXIS_MARGIN_PERC_BOTTOM  * (d3.max(yAll) - d3.min(yAll)));
        var yAxisMax = d3.max(yAll) + (this.CHART_Y_AXIS_MARGIN_PERC_TOP     * (d3.max(yAll) - d3.min(yAll)));
        var ys = d3.scaleLinear()
            .domain([yAxisMin, yAxisMax])
            .range([height, 0]);
        
        if (yAll.length > 0){
            // Secondary axis
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisRight(ys))
                .attr("transform", "translate(" + width + ",0)");

                if(yAxis_secondary != null){

                    // Y Axis Label (Secondary)
                    svg.append("text")
                        .attr("class","axis_label")
                        .attr("transform", "rotate(-90)")
                        .attr("y", width + this.CHART_AXIS_LABEL_MARGIN_Y_SEC + this.chartMargin.left - this.chartMargin.right)
                        .attr("x",0 - (height / 2))
                        .attr("dy", "1em")
                        .style("text-anchor", "middle")
                        .text(yAxis_secondary);
                }
        }


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                  Lines                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        svg.append("g")			
            .attr("class", "grid")
            .style("z-index", "0")
            .call(d3.axisLeft(yp)
                .ticks(this.CHART_GRID_Y_NO)
                .tickSize(-width)
                .tickFormat("")
            )


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                Tooltip                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        var Tooltip_container = divChart
            .append("div")
            .attr("class", "chartX_tooltip_container")
        var Tooltip_content = Tooltip_container
            .append("div")
            .attr("class", "chartX_tooltip_content")

        
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                               Y Series                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        for (var seriesIndex = 0; seriesIndex<chartDatum.ySeriesCount ; seriesIndex++){
            
            // Type
            if (_ChartJson['y'][seriesIndex]['chart_type'] != 'line'){continue;}
            
            // Color
            var seriesColor = this.SERIES_DEFAULT_COLOR;
            if (_ChartJson['y'][seriesIndex]['color'] != undefined) { 
                seriesColor = _ChartJson['y'][seriesIndex]['color'];}

            // Stroke Width
            var strokeWidth = this.SERIES_DEFAULT_STROKE_WIDTH;
            if (_ChartJson['y'][seriesIndex]['stroke-width'] != undefined) { 
                strokeWidth = _ChartJson['y'][seriesIndex]['stroke-width'];}

            // Dots (Dots Opacity)
            var dotsOpacity = 0;
            if (_ChartJson['y'][seriesIndex]['dots'] != undefined) { 
                if(_ChartJson['y'][seriesIndex]['dots']){
                    dotsOpacity=true;
                }}

            // Dots Radius
            var dotsRadius = this.SERIES_DEFAULT_DOTS_RADIUS;
            if (_ChartJson['y'][seriesIndex]['dots-radius'] != undefined) { 
                dotsRadius = _ChartJson['y'][seriesIndex]['dots-radius'];}

        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                Mouse Events                               //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//

            // Line
            // -------------------------------
            // Mouse Event [Over]
            var lines_mouseOver = function(d){
                d3.selectAll("path")                // Makes all line gray
                    .attr("stroke-width", 1)
                    .attr("stroke", "lightgray")

                d3.selectAll("circle")
                    .attr("visibility","hidden");   // Disapear all dots


                d3.select(this)                     
                    .attr("stroke-width", 4)        // increase the stroke width by 2 times
                    .attr("stroke",                 // the hovered line will keep color
                        d3.select(this).attr("stroke-copy"))  

            }

            // Mouse Event [Over]
            var lines_mouseLeave = function(){                      
                d3.selectAll("path")
                    .each(function(){
                        d3.select(this).attr("stroke",
                            d3.select(this).attr("stroke-copy"))                    // sets the color to the set value  
                        d3.select(this).attr("stroke-width",
                            d3.select(this).attr("stroke-width-copy"))              // sets the stroke width to the set value  
                    })
                
                d3.selectAll("circle")
                    .attr("visibility","visible");                                  // make all dots appear again
                
            }

            // Dots
            // -------------------------------
            // Mouse Event [Over]
            var dots_mouseOver = function(d){
                Tooltip_container
                    .style("display", "block")
                    .style("top", (Number(this.getAttribute('cy'))-16) + "px")          // to put tooltip on top of the marker
                    .style("left", (Number(this.getAttribute('cx'))-29.5) + "px")       // to put tooltip on top of the marker
                Tooltip_content
                    .html(Number(this.getAttribute('value')))
                    
                d3.select(this)
                    .style("outline","1px dotted black")
                    .style("outline-offset","3px")
            }

            // Mouse Event [Leave]
            var dots_mouseLeave = function(d){
                Tooltip_container
                .style("display", "none")

                d3.select(this)
                    .style("stroke","none")
                    .style("outline","none")
            }
            

        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                               Y Series                                    //
        //                                Lines                                      //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
            svg.append("path")
            .datum(chartDatum.datum)
            .attr("fill", "none")
            .attr("stroke", seriesColor)                    // Color
            .attr("stroke-copy", seriesColor)               // Color-copy
            .attr("stroke-width", strokeWidth)              // Width
            .attr("stroke-width-copy", strokeWidth)         // Width-copy
            .on("mouseover", lines_mouseOver)
            .on("mouseleave", lines_mouseLeave)
            .attr("d", d3.line()
                .x(function(d) { return x(d['x']) })
                .y(function(d) { 
                    // Secondary
                    if (_ChartJson['y'][seriesIndex]['secondary_axis']){
                        return ys(d['y'.concat(seriesIndex + 1)]);
                    }
                    // Primary
                    else{
                        return yp(d['y'.concat(seriesIndex + 1)]);
                    }})
                .curve(d3.curveCardinal.tension(0.7))
                
                )


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                               Y Series                                    //
        //                                 Dots                                      //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
            var yValue = 0;
            svg.append("g")                                                     
                .selectAll("dot")
                .data(chartDatum.datum)
                .enter()
                .append("circle")
                    .attr("cx", function(d) { return x(d['x']) })
                    .attr("cy", function(d) { 
                        // Secondary
                        if (_ChartJson['y'][seriesIndex]['secondary_axis']){
                            yValue= d['y'.concat(seriesIndex + 1)];
                            return ys(d['y'.concat(seriesIndex + 1)]);
                        }
                        // Primary
                        else{
                            yValue = d['y'.concat(seriesIndex + 1)];
                            return yp(d['y'.concat(seriesIndex + 1)]);
                        }})
                    .attr("value",function(d) {                                 // Value
                        // Secondary
                        if (_ChartJson['y'][seriesIndex]['secondary_axis']){
                            return d['y'.concat(seriesIndex + 1)];
                        }
                        // Primary
                        else{
                            return d['y'.concat(seriesIndex + 1)];
                        }})
                    .attr("r",dotsRadius)
                    .style("fill",seriesColor)
                    .style("opacity",dotsOpacity)
                    .on("mouseover", dots_mouseOver)            
                    .on("mouseleave", dots_mouseLeave)
        }


        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        //                                 Legend                                    //
        //— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —//
        _ChartJson["y"].forEach(tmpY=>{                         // get keys
            this.legend.push({"label" : tmpY['label'], "color": tmpY["color"]});
        })
        var tmpMargin = this.chartMargin;                       // Margin clone

        var legend_main_container = divFooter                   // main Container
            .append("div")
            .attr("class","chartX_legend_container_main");

        var legend_Y_containers = legend_main_container         // Y container
            .selectAll("div")
            .data(this.legend)
            .enter()
            .append("div")
            .attr("class", "chartX_legend_container_y");

        legend_Y_containers                                     // Lines
            .append("svg")
            .attr("class","chartX_legend_svg")
            .append("rect")
            .attr("fill", d => d["color"])
            .attr("width", 30)
            .attr("height", 3);
            
        legend_Y_containers.append("text")                      // Titles
            .text(function (d){
                return d["label"];
            })
            .attr("class","chartX_legend_title")
    }
    // ============================================================================================================== //
    //                                                      Style                                                     //
    // ============================================================================================================== //
    STYLE_DEFAULT =`
    :root{
        --chartX_font: "Proxima Nova";
    }
    .line {
    fill: none;
    stroke: steelblue;
    stroke-width: 2px;
    }

    .grid line {
    stroke: lightgrey;
    stroke-opacity: 0.7;
    shape-rendering: crispEdges;
    z-index: 0;
    }

    .grid path {
    stroke-width: 0;
    }

    .axis path {
        stroke-width: 2;
        stroke: rgb(68, 68, 68);
    }

    .axis .tick line{
        stroke-width: 2;
        stroke: rgb(68, 68, 68);
    }

    .axis .tick text{
        font-family: var(--chartX_font);
        fill: rgb(68, 68, 68);
    }

    .axis_label{
        font-family: var(--chartX_font);
        font-size: 0.8rem;
    }

    .chartX_title{
        font-size: 1em;
        font-weight: 500;
        font-family: var(--chartX_font);
    }
    .chartX_subTitle{
        font-size: 0.8em;
        font-weight: 300;
        font-family: var(--chartX_font);
    }


    .chartX_legend_container_main{
        display: inline-block;
        border: 1px solid #bfbfbf;
        padding: 2px 10px;
    }

    .chartX_legend_container_y{
        display: inline-block;
        text-align: left;
    }

    .chartX_legend_container_y:last-child > .chartX_legend_title{
        margin-right: 0px !important;
    }

    .chartX_legend_title{
        font-size: 0.8em;
        font-weight: 300;
        font-family: var(--chartX_font);
        margin-left: 5px;
        margin-right: 30px;
    }

    .chartX_legend_svg{
        display: inline-block;
        width: 30px;
        height: 3px;
    }

    .chartX_tooltip_container{
        display: none;
        position: absolute;
        text-align: center;
        width: 150px;
    }
    .chartX_tooltip_content{
        background-color: rgba(65, 65, 65, 0.774);
        border: none;
        border-radius: 3px;
        padding: 3px;
        color: white;
        font-family: var(--chartX_font);
        font-size: 0.7rem;
        width: fit-content;
        display: inline-block;
    }
    `
}
