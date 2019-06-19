/*****************************************************************************
 *
 * File:
 *   chart.component.ts
 * 
 * Description:
 *   Controller for the Chart Component
 * 
 *****************************************************************************/

/* Dependencies **************************************************************/

import { Component, OnInit, OnChanges, SimpleChange, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';
import { IntradayData } from 'src/app/models/intraday-data';
import { Quote } from 'src/app/models/quote';
import { Observable } from 'rxjs';

/* Chart Namespace ***********************************************************/

namespace Chart {

  /** All public property identifiers on the ChartComponent class. */
  export const PublicProperties = {
    /** The financial symbol for which to display data. */
    SYMBOL: "symbol"
  };

  /** All data plot types supported by the ChartComponent. */
  export enum DataPlotType {

    /** Open, high, low, close plot type. */
    ohlc = "ohlc",

    /** Line plot type. */
    line = "line"
  }

  /** All time series supported by the ChartComponent. */
  export enum TimeSeries {
    intraday = "intraday"
  }
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

/** Controlling Class of the ChartComponent. */
export class ChartComponent implements OnInit, OnChanges {

  /* Member Variables ********************************************************/

  /** The document model identifier. */
  CHART_DOM_ID = "chartContainer";

  /** The financial symbol for which to display data.  */
  @Input() symbol: string;

  // Private members

  /**
   * The title of the chart.
   * Expected to be the full name corresponding the the Financial Symbol.
   */
  private chartTitle: string = "Microsoft";

  /**
   * The subtitle of the chart.
   * Expected to be the time range of the displayed chart data.
   */
  private chartSubtitle: string;

  /** The current chart type. */
  private chartDataPlotType: Chart.DataPlotType = Chart.DataPlotType.line;
  
  /** The current financial data time series. */
  private chartDataTimeSeries: Chart.TimeSeries = Chart.TimeSeries.intraday;

  /** The datapoints that are used when rendering the graph */
  private datapoints: any[] = [];

  /** The CanvasJS chart reference */
  private chart: CanvasJS.Chart;

  /** Cache the data set for when changing between chart types */
  private cachedDataSet: IntradayData;

  dataPlotTypes: string[] = [];
  selectedDataPlotType: string;

  /* Private Functions *******************************************************/

  /***************************************************************************
   *  
   * @description
   *   Returns the correctly formatted data point for a given quote.
   *   Formats the data point based on the current data plot type.
   * 
   * @param quote The quote to format as a datapoint.
   * @return A datapoint with the values from quote.
   * 
   ***************************************************************************/
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

  /***************************************************************************
   *  
   * @description
   *   Does a hard reset of the entire ChartComponent.
   *   Will fetch new data if no data is given.
   * 
   * @param data Will use in place of fetching new chart data
   * 
   ***************************************************************************/
  private reloadChart(data: IntradayData = null) {

    if( data ) {
      this.recieveNewChartData(data);
    } else {
      this.fetchNewChartData().subscribe({
        next: this.recieveNewChartData.bind(this),
        error: (errorData) => {
          console.error(errorData);
        }
      });
    }
  }

  /***************************************************************************
   *  
   * @description
   *   Retreieves data from alpha vantage service.
   * 
   * @returns
   *   An observable to deliver the data from the alpha vantage service.
   * 
   ***************************************************************************/
  private fetchNewChartData(): Observable<IntradayData> {

    // Guard
    if( !this.symbol ) {
      // Todo: alert? 
      return;
    }

    switch( this.chartDataTimeSeries ) {
      case Chart.TimeSeries.intraday:
        return this.alphaVantageService.getIntraDayData( this.symbol );
        break;
      default:
        console.error( "Unknown chart data plot type" );
        break;
    }
  }

   /***************************************************************************
   *  
   * @description
   *   Handles when new financial data is recieved.
   * 
   * @param intradayData
   *   The new financial data.
   * 
   ***************************************************************************/
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

  /***************************************************************************
   *  
   * @description
   *   Displays and renders all data once fetch is complete.
   * 
   ***************************************************************************/
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

  /* Public ******************************************************************/

  constructor(
    private alphaVantageService: AlphaVantageService, 
    private datepipe: DatePipe
  ) {}

  /* Lifecycle Functions *****************************************************/

  ngOnInit() {  
    Object.values(Chart.DataPlotType).forEach( dataPlotType => {
      this.dataPlotTypes.push(dataPlotType);
    });
    this.selectedDataPlotType = Chart.DataPlotType[this.chartDataPlotType];
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

    for( let changedPropertyIdentifier in changes ) {

      console.log( changedPropertyIdentifier );
      console.log( changes[ changedPropertyIdentifier ] );

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
