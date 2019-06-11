import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {

  datapoints = [];
  chart: CanvasJS.Chart;

  constructor(private alphaVantageService: AlphaVantageService, private datepipe: DatePipe) {}

  ngOnInit() {

    this.alphaVantageService.getIntraDayData( "msft" ).subscribe(intradayData => {

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
    });

    let todayDateString: string = this.datepipe.transform(
      new Date(),
      'EEEE, MMMM d, yyyy'
    );

    this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light1",
      title: {
        text: "Microsoft Intraday Data"
      },
      subtitles: [ { text: todayDateString } ],
      axisY: {
        includeZero: false
      },
      data: [{
        type: "ohlc",
        dataPoints: this.datapoints
      }]
    });
  }

}
