// ---------------------------------------------------------------------------- //
//       ______     ______   ____  ____  
//      |_   _ `.  / ____ `.|_  _||_  _| 
//        | | `. \ `'  __) |  \ \  / /   
//        | |  | | _  |__ '.   > `' <    
//       _| |_.' /| \____) | _/ /'`\ \_  
//      |______.'  \______.'|____||____| 
//
//       Mahdi Khansari
//       Enhanced version of D3 line chart
//       Apr 6, 2023
//
// ---------------------------------------------------------------------------- //
class D3X {
    constructor(_container, _data){
        this.countainer = _container;
        this.data = _data;
    }
    


    // ---------------------------------------------------------------------------- //
    //                             Constants & Variables                            //
    // ---------------------------------------------------------------------------- //
    chartMargin = {top: 10, right: 45, bottom: 40, left: 45};
    CHART_Y_AXIS_MARGIN_PERC_TOP = 0.9;
    CHART_Y_AXIS_MARGIN_PERC_BOTTOM = 0;
    CHART_X_AXIS_MARGIN_PERC_LEFT = 0;
    CHART_X_AXIS_MARGIN_PERC_RIGHT = 0;
    SERIES_COLOR_DEFAULT = 'black';

    CHART_GRID_X_NO = 20;
    CHART_GRID_Y_NO = 10;

    CHART_AXIS_LABEL_MARGIN_X = 30;
    CHART_AXIS_LABEL_MARGIN_Y_PRI = 4;
    CHART_AXIS_LABEL_MARGIN_Y_SEC = 20;

    // ---------------------------------------------------------------------------- //
    //                              Getters & Setters                               //
    // ---------------------------------------------------------------------------- //

    // get data(){
    //     return this.data;
    // }

    // ---------------------------------------------------------------------------- //
    //                                   Functions                                  //
    // ---------------------------------------------------------------------------- //
    
    // JSON 2 Datum
    //________________________________________________________________________________
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
    //________________________________________________________________________________
    drawChart(){

        var _id = this.countainer;
        var _ChartJson = this.data;

        // Chart -> Datum
        var chartDatum = this.chartJson2Datum(_ChartJson);

        // Chart width and height
        var width = document.getElementById(_id).offsetWidth - this.chartMargin.left - this.chartMargin.right;
        var height = document.getElementById(_id).offsetHeight - this.chartMargin.top - this.chartMargin.bottom;

        //________________
        // SVG 

        var svg = d3.select("#".concat(_id))
            .append("svg")
            .attr("width", width + this.chartMargin.left + this.chartMargin.right)
            .attr("height", height + this.chartMargin.top + this.chartMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.chartMargin.left + "," + this.chartMargin.top + ")");


        //________________
        // Title
        
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Start Here to add Title to the chart

        //______________\\ 
        //    __  __  
        //    \ \/ /  
        //     >  <   
        //    /_/\_\  
        //______________\\   

        // X Axis
        //_______________
        var xMin = d3.min(_ChartJson['x']['values']);
        var xMax = d3.max(_ChartJson['x']['values']);
        var xAxisMin = xMin - (this.CHART_X_AXIS_MARGIN_PERC_LEFT * (xMax - xMin));
        var xAxisMax = xMax + (this.CHART_X_AXIS_MARGIN_PERC_RIGHT * (xMax - xMin));
        var x = d3.scaleLinear()
            // x domain with margin
            .domain([xAxisMin, xAxisMax])
            .range([ 0, width ]);
        
        // Lines
        //_______________
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // X Grid
        //_______________
        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(this.CHART_GRID_X_NO)
                .tickSize(-height)
                .tickFormat("")   // !!!!!!!!!!!!!!!!!! START HERE : the grid is overlapping the Axis, fix it.
            )

        // X Axis Label
        svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + this.CHART_AXIS_LABEL_MARGIN_X)
            .text(_ChartJson['x']['label'].concat('[',_ChartJson['x']['unit'],']'));

        //______________\\ 
        //    __   __  
        //    \ \ / /  
        //     \ V /  
        //      |_|  
        //______________\\  

        // Y axis 
        //_______________
        // there are primary and secondary axises, if all y series are using
        // only primary there wont be a secondary axis. it's also correct if
        // all y series are using only seconday axises.
        
        // Primary
        // domain  (with margin)
        //_______________
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

        // Secondary
        //_______________
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



        // Y Series
        //_______________
        for (var seriesIndex = 0; seriesIndex<chartDatum.ySeriesCount ; seriesIndex++){
            
            // Lines
            //_______________
            if (_ChartJson['y'][seriesIndex]['chart_type'] != 'line'){continue;}
            
            // Series Color
            //_______________
            var seriesColor = this.SERIES_COLOR_DEFAULT;
            if (_ChartJson['y'][seriesIndex]['color'] != undefined) { 
                seriesColor = _ChartJson['y'][seriesIndex]['color'];}

            // Lines
            //_______________
            // Primary Y
            if (!(_ChartJson['y'][seriesIndex]['secondary_axis'])){
                svg.append("path")
                .datum(chartDatum.datum)
                .attr("fill", "none")
                .attr("stroke", seriesColor) // Color
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return x(d['x']) })
                    .y(function(d) { return yp(d['y'.concat(seriesIndex + 1)]) })
                    )
            }

            // Secondary Y
            if (_ChartJson['y'][seriesIndex]['secondary_axis']){
                svg.append("path")
                .datum(chartDatum.datum)
                .attr("fill", "none")
                .attr("stroke", seriesColor) // Color
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return x(d['x']) })
                    .y(function(d) { return ys(d['y'.concat(seriesIndex + 1)]) })
                    )
            }
        }

        // Y Grid
        //_______________
        svg.append("g")			
            .attr("class", "grid")
            .call(d3.axisLeft(yp)
                .ticks(this.CHART_GRID_Y_NO)
                .tickSize(-width)
                .tickFormat("")
            )
    }


}
