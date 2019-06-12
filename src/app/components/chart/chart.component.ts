/*****************************************************************************
 *
 * File:
 *   chart.component.ts
 * 
 * Description:
 *   Controller for the Chart Component
 * 
 *****************************************************************************/

/* Dependencies */

import { Component, OnInit, OnChanges, SimpleChange, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';
import { IntradayData } from 'src/app/models/intraday-data';
import { Quote } from 'src/app/models/quote';

/* Chart Namespace */

namespace Chart {

  export const PublicProperties = {
    SYMBOL: "symbol"
  };

  export enum DataPlotType {
    ohlc = "ohlc",
    line = "line"
  }

  export enum TimeSeries {
    intraday = "intraday"
  }
}

/* Component Decorator */

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

/* Chart Component Controlling Class */

export class ChartComponent implements OnInit, OnChanges {

  /* Member Variables */

  // Constants
  CHART_DOM_ID = "chartContainer";

  // Public properties
  @Input() symbol: string;

  // Private members
  private chartTitle: string = "Microsoft";
  private chartSubtitle: string;
  private chartDataPlotType: Chart.DataPlotType = Chart.DataPlotType.line;
  private chartDataTimeSeries: Chart.TimeSeries = Chart.TimeSeries.intraday;
  private datapoints: any[] = [];
  private chart: CanvasJS.Chart;
  private cachedDataSet: IntradayData;

  dataPlotTypes: string[] = [];
  selectedDataPlotType: string;

  /* Private Functions */

  private getDataPointForQuote(quote: Quote): any {
    
    switch (this.chartDataPlotType) {
      case Chart.DataPlotType.ohlc:
        return { 
          x: quote.timestamp, 
          y: [
            quote.open,
            quote.high,
            quote.low,
            quote.close
          ] 
        };
      case Chart.DataPlotType.line:
        return {
          x: quote.timestamp,
          y: quote.price || quote.open
        }
      default:
        return null;
    }
  }

  private reloadChart(data: IntradayData = null) {

    if( data ) {
      this.recieveNewChartData(data);
    } else {
      this.fetchNewChartData();
    }
  }

  private fetchNewChartData() {

    switch( this.chartDataTimeSeries ) {
      case Chart.TimeSeries.intraday:
        this.alphaVantageService.getIntraDayData( this.symbol ).subscribe(
          this.recieveNewChartData.bind(this),
          (err) => {
            console.error( err );
          }
        );
        break;
      default:
        console.error( "Unknown chart data plot type" );
        break;
    }
  }

  private recieveNewChartData( intradayData: IntradayData ) {

    // Cahce data set
    this.cachedDataSet = intradayData;

    // Get symbol name for data set
    this.alphaVantageService.getSymbolName( this.symbol ).subscribe(
      ( name => {
        this.chartTitle = name;
        this.cachedDataSet.metaData.name = name;
      }),
      ( err => {
        console.log(err);
      }),
      () => {
        this.renderChart();
      }
    );
  }

  private renderChart() {

    // Set chart subtitle
    this.chartSubtitle = this.datepipe.transform(
      this.cachedDataSet.metaData.lastRefreshed,
      'EEEE, MMMM d, yyyy'
    );
    
    this.chart = new CanvasJS.Chart( this.CHART_DOM_ID, {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light1",
      axisY: {
        includeZero: false
      },
      data: [{
        type: Chart.DataPlotType[this.chartDataPlotType],
        dataPoints: this.datapoints
      }]
    });

    // Plot each point
    this.datapoints.length = 0;
    this.cachedDataSet.quoteData.forEach( quote => {
      this.datapoints.push( this.getDataPointForQuote( quote ) );
    });
    
    this.chart.render();
  }

  /* Public */

  constructor(
    private alphaVantageService: AlphaVantageService, 
    private datepipe: DatePipe
  ) {}

  /* Lifecycle Functions */

  ngOnInit() {  
    Object.values(Chart.DataPlotType).forEach( dataPlotType => {
      this.dataPlotTypes.push(dataPlotType);
    });
    this.selectedDataPlotType = Chart.DataPlotType[this.chartDataPlotType];
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

    for( let changedPropertyIdentifier in changes ) {

      switch( changedPropertyIdentifier ) {
        case Chart.PublicProperties.SYMBOL:
          this.reloadChart();
          break;
        default:
          break;
      }
    }
  }

  onDataPlotTypeValueChanged() {

    let selectedDataPlotType: Chart.DataPlotType = Chart.DataPlotType[this.selectedDataPlotType];

    if( selectedDataPlotType != this.chartDataPlotType) {
      this.chartDataPlotType = selectedDataPlotType
      this.reloadChart(this.cachedDataSet);
    }
  }
}
