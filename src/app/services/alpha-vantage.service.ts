import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlphaVantageService {

  baseQueryURL: string = 'https://www.alphavantage.co/query?';

  apiKeyQueryParamIdentifier = "apikey";
  apikey = "47B4WCCD7P0NWBF3"

  functionQueryParamIdentifier = "function";
  globalQuoteFunctionQueryParam = "GLOBAL_QUOTE";
  quoteFunctionQueryParam = this.globalQuoteFunctionQueryParam;

  symbolQueryParamIdentifier = "symbol";
  

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

  getQuote(symbol: string) {
    
    let queryURL = this.baseQueryURL;
    queryURL = this.addFunctionParam( queryURL, this.quoteFunctionQueryParam );
    queryURL = this.addSymbolParam( queryURL, symbol );
    queryURL = this.addApiKey( queryURL );

    console.log( queryURL );

    return this.http.get( queryURL );
  }
}
