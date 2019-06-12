import { Component, OnInit, OnChanges, SimpleChange, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';
import { IntradayData } from 'src/app/models/intraday-data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit, OnChanges {

  @Input() symbol: string;
  symbolName: string = "Microsoft";
  dateString: string;
  datapoints = [];
  chart: CanvasJS.Chart;

  constructor(private alphaVantageService: AlphaVantageService, private datepipe: DatePipe) {}

  populateChart( intradayData: IntradayData ) {

    this.alphaVantageService.getSymbolName( intradayData.metaData.symbol ).subscribe(
      ( name => {
        this.symbolName = name;
      }),
      ( err => {
        console.log(err);
      })
    );

    this.dateString = this.datepipe.transform(
      intradayData.metaData.lastRefreshed,
      'EEEE, MMMM d, yyyy'
    );

    intradayData.quoteData.forEach( quote => {

      this.datapoints.push( { 
        x: quote.timestamp, 
        y: [
          quote.open,
          quote.high,
          quote.low,
          quote.close
        ] 
      } );

    });
    
    this.chart.render();
  }

  ngOnInit() {

    

    this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light1",
      axisY: {
        includeZero: false
      },
      data: [{
        type: "ohlc",
        dataPoints: this.datapoints
      }]
    });
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

    for( let propName in changes ) {

      if( propName === "symbol" ) {
        let changedProp = changes[ propName ];
        let newValue = changedProp.currentValue;

        this.datapoints.length = 0;
        this.alphaVantageService.getIntraDayData( newValue ).subscribe(this.populateChart.bind(this));
      }

    }

  }

}
