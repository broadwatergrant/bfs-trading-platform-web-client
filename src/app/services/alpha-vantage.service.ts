import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Quote } from '../models/quote';
import { IntradayData } from '../models/intraday-data';

@Injectable({
  providedIn: 'root'
})
export class AlphaVantageService {

  baseQueryURL: string = 'https://www.alphavantage.co/query?';

  apiKeyQueryParamIdentifier = "apikey";
  apikey = "47B4WCCD7P0NWBF3"

  functionQueryParamIdentifier = "function";
  globalQuoteFunctionQueryParam = "GLOBAL_QUOTE";
  intraDayFunctionQueryParam = "TIME_SERIES_INTRADAY";
  symbolSearchFunctionParam = "SYMBOL_SEARCH";
  quoteFunctionQueryParam = this.globalQuoteFunctionQueryParam;

  keywordQueryParamIdentifier = "keywords";
  symbolQueryParamIdentifier = "symbol";
  
  intervalQueryParamIdentifier = "interval";
  fiveMinIntervalQueryParam = "5min";
  fifteenMinIntervalQueryParam = "15min";

  constructor(private http: HttpClient) { }

  private addQueryParam(baseURL: string, queryParamIdentifer: string, queryParamValue: string): string {
    return baseURL + queryParamIdentifer + "=" + queryParamValue + "&";
  }

  private addFunctionParam(baseURL: string, functionValue: string): string {
    return this.addQueryParam( baseURL, this.functionQueryParamIdentifier, functionValue );
  }

  private addSymbolParam(baseURL: string, symbol: string): string {
    return this.addQueryParam( baseURL, this.symbolQueryParamIdentifier, symbol );
  }

  private addApiKey( baseURL: string ) {
    return this.addQueryParam( baseURL, this.apiKeyQueryParamIdentifier, this.apikey );
  }

  private addIntervalParam( baseURL: string, intervalValue: string ) {
    return this.addQueryParam( baseURL, this.intervalQueryParamIdentifier, intervalValue );
  }

  private addKeywordParam( baseURL: string, keyword: string ) {
    return this.addQueryParam( baseURL, this.keywordQueryParamIdentifier, keyword );
  }

  getQuote(symbol: string): Observable<Quote> {
    
    let queryURL = this.baseQueryURL;
    queryURL = this.addFunctionParam( queryURL, this.quoteFunctionQueryParam );
    queryURL = this.addSymbolParam( queryURL, symbol );
    queryURL = this.addApiKey( queryURL );

    return this.http.get( queryURL ).pipe(
      map( avGlobalQuote => {
        return {
          symbol: avGlobalQuote["Global Quote"]["01. symbol"],
          price: +avGlobalQuote["Global Quote"]["05. price"],
          open: +avGlobalQuote["Global Quote"]["02. open"],
          high: +avGlobalQuote["Global Quote"]["03. high"],
          low: +avGlobalQuote["Global Quote"]["04. low"],
          volume: +avGlobalQuote["Global Quote"]["06. volume"]
        }
      } )
    );
  }

  getIntraDayData(symbol: string): Observable<IntradayData> {

    // Member variables
    let queryURL: string;
    let interval: string;
    let quoteDataKey: string;
    let lastQuoteTimestamp: Date;

    // Initialize
    interval = this.fiveMinIntervalQueryParam;
    quoteDataKey = "Time Series (" + interval + ")";

    // Structure query
    queryURL = this.baseQueryURL;
    queryURL = this.addFunctionParam( queryURL, this.intraDayFunctionQueryParam );
    queryURL = this.addIntervalParam( queryURL, interval );
    queryURL = this.addSymbolParam( queryURL, symbol );
    queryURL = this.addApiKey( queryURL );

    // Perform get request
    return this.http.get( queryURL ).pipe(
      
      // Map raw data into internal data structure
      map( data => {

        // Expect meta data in response, throw if there is no meta data in response 
        if( !data["Meta Data"] ) {
          throw data;
        }

        // Map meta data
        let result: IntradayData = {
          metaData: {
            information: data["Meta Data"]["1. Information"],
            symbol: data["Meta Data"]["2. Symbol"],
            lastRefreshed: new Date(data["Meta Data"]["3. Last Refreshed"] + " GMT-0400"),
            interval: data["Meta Data"]["4. Interval"]
          },
          quoteData: []
        }

        // For each data point...
        Object.keys( data[quoteDataKey] ).forEach( (key, index) => {

          let quoteData = data[quoteDataKey][key];
          let quoteTimestamp: Date = new Date(key + " GMT-0400");

          // Only return data for one singular calendar day
          if ( lastQuoteTimestamp && lastQuoteTimestamp.getDate() != quoteTimestamp.getDate()) {
            return;
          }

          // Add the data point to the resulting object
          result.quoteData.push({
            symbol: symbol,
            open: +quoteData["1. open"],
            high: +quoteData["2. high"],
            low: +quoteData["3. low"],
            close: +quoteData["4. close"],
            volume: +quoteData["5. volume"],
            timestamp: quoteTimestamp
          })

          // Prepare for next iteration
          lastQuoteTimestamp = quoteTimestamp;
        } );

        return result;
      })
    );
  }

  getSymbolName(symbol: string): Observable<string> {

    let queryURL = this.baseQueryURL;
    queryURL = this.addFunctionParam( queryURL, this.symbolSearchFunctionParam );
    queryURL = this.addKeywordParam( queryURL, symbol );
    queryURL = this.addApiKey( queryURL );

    return this.http.get( queryURL ).pipe(
      map( data => {

        let firstMatch = data["bestMatches"][0];
        if( +firstMatch["9. matchScore"] == 1.0) {
          return firstMatch["2. name"];
        } 
        throw data;

      })
    );
  }
}
