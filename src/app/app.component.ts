import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as CanvasJS from 'src/assets/canvasjs.min';
import { AlphaVantageService } from 'src/app/services/alpha-vantage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'bfs-trading-platform-web-client';
  datapoints = [];
  subtitles = [];
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
      'yyyy-MM-dd'
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
