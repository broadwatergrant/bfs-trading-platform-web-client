import { TestBed } from '@angular/core/testing';
import { AlphaVantageService } from './alpha-vantage.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Quote } from '../models/quote';
import { IntradayData } from '../models/intraday-data';

describe('AlphaVantageService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlphaVantageService]
    });
  });

  it('should exist', () => {
    const service: AlphaVantageService = TestBed.get(AlphaVantageService);
    expect(service).toBeTruthy();
  });

  it( 'should retrieve and map a quote', (done: DoneFn) => {

    // Test case variables
    const alphaVantageService: AlphaVantageService = TestBed.get(AlphaVantageService);
    const httpController: HttpTestingController = TestBed.get(HttpTestingController);
    let responseObject = {
      "Global Quote": {
          "01. symbol": "GLD",
          "02. open": "127.5800",
          "03. high": "127.7500",
          "04. low": "126.4600",
          "05. price": "127.1200",
          "06. volume": "9685236",
          "07. latest trading day": "2019-06-18",
          "08. previous close": "126.4800",
          "09. change": "0.6400",
          "10. change percent": "0.5060%"
      }
    };
    let expectedQueryString = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=gld&apikey=47B4WCCD7P0NWBF3&";

    // Perform test
    alphaVantageService.getQuote('gld').subscribe({
      next: (quote: Quote) => {

        // Verify

        // Verify quote object exists
        expect(quote).toBeTruthy();

        // Verify symbol
        expect(quote.symbol).toBeTruthy();
        expect(quote.symbol.toLowerCase()).toEqual("gld");

        // Verify data values exist
        expect(quote.open).toBeTruthy();
        expect(quote.high).toBeTruthy();
        expect(quote.low).toBeTruthy();
        expect(quote.close).toBeFalsy();
        expect(quote.price).toBeTruthy();
        expect(quote.volume).toBeTruthy();
        expect(quote.timestamp).toBeFalsy();

        // Conclude test
        done();
      }
    });

    // Mock
    let mockRequest = httpController.expectOne(expectedQueryString);
    expect(mockRequest.request.method).toEqual('GET');
    mockRequest.flush(responseObject);
  } );

  it( 'should retrieve and map intraday data', (done: DoneFn) => {

    // Test case variables
    const alphaVantageService: AlphaVantageService = TestBed.get(AlphaVantageService);
    const httpController: HttpTestingController = TestBed.get(HttpTestingController);
    let quoteDataDate: number;
    const expectedQueryString = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&symbol=gld&apikey=47B4WCCD7P0NWBF3&";
    const responseObject = {
      "Meta Data": {
          "1. Information": "Intraday (5min) open, high, low, close prices and volume",
          "2. Symbol": "gld",
          "3. Last Refreshed": "2019-06-18 16:00:00",
          "4. Interval": "5min",
          "5. Output Size": "Compact",
          "6. Time Zone": "US/Eastern"
      },
      "Time Series (5min)": {
          "2019-06-18 16:00:00": {
              "1. open": "127.0500",
              "2. high": "127.0700",
              "3. low": "127.0300",
              "4. close": "127.0600",
              "5. volume": "224533"
          },
          "2019-06-18 15:55:00": {
              "1. open": "127.0600",
              "2. high": "127.0700",
              "3. low": "127.0101",
              "4. close": "127.0500",
              "5. volume": "346814"
          },
          "2019-06-18 15:50:00": {
              "1. open": "127.0450",
              "2. high": "127.0800",
              "3. low": "127.0400",
              "4. close": "127.0600",
              "5. volume": "77771"
          },
          "2019-06-18 15:45:00": {
              "1. open": "127.0500",
              "2. high": "127.0650",
              "3. low": "127.0300",
              "4. close": "127.0400",
              "5. volume": "29948"
          },
          "2019-06-18 15:40:00": {
              "1. open": "127.0700",
              "2. high": "127.0750",
              "3. low": "127.0200",
              "4. close": "127.0400",
              "5. volume": "28386"
          },
          "2019-06-18 15:35:00": {
              "1. open": "127.0700",
              "2. high": "127.0900",
              "3. low": "127.0600",
              "4. close": "127.0800",
              "5. volume": "33170"
          },
          "2019-06-18 15:30:00": {
              "1. open": "127.0700",
              "2. high": "127.0900",
              "3. low": "127.0567",
              "4. close": "127.0600",
              "5. volume": "20975"
          },
          "2019-06-18 15:25:00": {
              "1. open": "127.0615",
              "2. high": "127.0800",
              "3. low": "127.0500",
              "4. close": "127.0700",
              "5. volume": "44936"
          },
          "2019-06-18 15:20:00": {
              "1. open": "127.0600",
              "2. high": "127.0800",
              "3. low": "127.0600",
              "4. close": "127.0600",
              "5. volume": "19117"
          },
          "2019-06-18 15:15:00": {
              "1. open": "127.0600",
              "2. high": "127.0800",
              "3. low": "127.0600",
              "4. close": "127.0600",
              "5. volume": "55717"
          },
          "2019-06-18 15:10:00": {
              "1. open": "127.0750",
              "2. high": "127.1000",
              "3. low": "127.0600",
              "4. close": "127.0600",
              "5. volume": "65367"
          },
          "2019-06-18 15:05:00": {
              "1. open": "127.0949",
              "2. high": "127.0990",
              "3. low": "127.0600",
              "4. close": "127.0766",
              "5. volume": "53119"
          },
          "2019-06-18 15:00:00": {
              "1. open": "127.0900",
              "2. high": "127.1000",
              "3. low": "127.0657",
              "4. close": "127.0949",
              "5. volume": "5484"
          },
          "2019-06-18 14:55:00": {
              "1. open": "127.0900",
              "2. high": "127.1200",
              "3. low": "127.0800",
              "4. close": "127.1000",
              "5. volume": "22701"
          },
          "2019-06-18 14:50:00": {
              "1. open": "127.1073",
              "2. high": "127.1200",
              "3. low": "127.0800",
              "4. close": "127.0900",
              "5. volume": "58698"
          },
          "2019-06-18 14:45:00": {
              "1. open": "127.0900",
              "2. high": "127.1300",
              "3. low": "127.0900",
              "4. close": "127.1000",
              "5. volume": "44917"
          },
          "2019-06-18 14:40:00": {
              "1. open": "127.0900",
              "2. high": "127.1000",
              "3. low": "127.0717",
              "4. close": "127.0900",
              "5. volume": "23903"
          },
          "2019-06-18 14:35:00": {
              "1. open": "127.0919",
              "2. high": "127.0919",
              "3. low": "127.0400",
              "4. close": "127.0900",
              "5. volume": "29251"
          },
          "2019-06-18 14:30:00": {
              "1. open": "127.0200",
              "2. high": "127.1000",
              "3. low": "127.0200",
              "4. close": "127.1000",
              "5. volume": "56391"
          },
          "2019-06-18 14:25:00": {
              "1. open": "127.0200",
              "2. high": "127.0500",
              "3. low": "127.0198",
              "4. close": "127.0198",
              "5. volume": "23595"
          },
          "2019-06-18 14:20:00": {
              "1. open": "127.0396",
              "2. high": "127.0550",
              "3. low": "127.0100",
              "4. close": "127.0100",
              "5. volume": "51052"
          },
          "2019-06-18 14:15:00": {
              "1. open": "127.0268",
              "2. high": "127.0450",
              "3. low": "126.9950",
              "4. close": "127.0400",
              "5. volume": "37695"
          },
          "2019-06-18 14:10:00": {
              "1. open": "127.0150",
              "2. high": "127.0600",
              "3. low": "126.9948",
              "4. close": "127.0450",
              "5. volume": "35385"
          },
          "2019-06-18 14:05:00": {
              "1. open": "127.0400",
              "2. high": "127.0490",
              "3. low": "126.9700",
              "4. close": "127.0200",
              "5. volume": "265379"
          },
          "2019-06-18 14:00:00": {
              "1. open": "127.0300",
              "2. high": "127.0563",
              "3. low": "127.0250",
              "4. close": "127.0500",
              "5. volume": "72417"
          },
          "2019-06-18 13:55:00": {
              "1. open": "127.0400",
              "2. high": "127.0400",
              "3. low": "127.0100",
              "4. close": "127.0350",
              "5. volume": "51774"
          },
          "2019-06-18 13:50:00": {
              "1. open": "127.0700",
              "2. high": "127.0700",
              "3. low": "127.0100",
              "4. close": "127.0450",
              "5. volume": "22758"
          },
          "2019-06-18 13:45:00": {
              "1. open": "127.0200",
              "2. high": "127.0659",
              "3. low": "127.0200",
              "4. close": "127.0600",
              "5. volume": "10995"
          },
          "2019-06-18 13:40:00": {
              "1. open": "127.0000",
              "2. high": "127.0400",
              "3. low": "127.0000",
              "4. close": "127.0100",
              "5. volume": "30370"
          },
          "2019-06-18 13:35:00": {
              "1. open": "127.0900",
              "2. high": "127.0900",
              "3. low": "126.9701",
              "4. close": "127.0100",
              "5. volume": "49537"
          },
          "2019-06-18 13:30:00": {
              "1. open": "127.0900",
              "2. high": "127.1400",
              "3. low": "127.0735",
              "4. close": "127.1200",
              "5. volume": "13298"
          },
          "2019-06-18 13:25:00": {
              "1. open": "127.1800",
              "2. high": "127.1800",
              "3. low": "127.0800",
              "4. close": "127.0900",
              "5. volume": "45183"
          },
          "2019-06-18 13:20:00": {
              "1. open": "127.1700",
              "2. high": "127.2400",
              "3. low": "127.1200",
              "4. close": "127.1750",
              "5. volume": "73201"
          },
          "2019-06-18 13:15:00": {
              "1. open": "127.1900",
              "2. high": "127.1900",
              "3. low": "127.1300",
              "4. close": "127.1800",
              "5. volume": "20551"
          },
          "2019-06-18 13:10:00": {
              "1. open": "127.2800",
              "2. high": "127.2800",
              "3. low": "127.1700",
              "4. close": "127.1946",
              "5. volume": "96707"
          },
          "2019-06-18 13:05:00": {
              "1. open": "127.2100",
              "2. high": "127.2800",
              "3. low": "127.2050",
              "4. close": "127.2700",
              "5. volume": "60951"
          },
          "2019-06-18 13:00:00": {
              "1. open": "127.1316",
              "2. high": "127.2100",
              "3. low": "127.1200",
              "4. close": "127.2100",
              "5. volume": "8954"
          },
          "2019-06-18 12:55:00": {
              "1. open": "127.1100",
              "2. high": "127.1381",
              "3. low": "127.0800",
              "4. close": "127.1300",
              "5. volume": "62700"
          },
          "2019-06-18 12:50:00": {
              "1. open": "127.1400",
              "2. high": "127.1800",
              "3. low": "127.1100",
              "4. close": "127.1100",
              "5. volume": "34439"
          },
          "2019-06-18 12:45:00": {
              "1. open": "127.1450",
              "2. high": "127.1800",
              "3. low": "127.1300",
              "4. close": "127.1400",
              "5. volume": "18245"
          },
          "2019-06-18 12:40:00": {
              "1. open": "127.1600",
              "2. high": "127.2000",
              "3. low": "127.1200",
              "4. close": "127.1300",
              "5. volume": "27936"
          },
          "2019-06-18 12:35:00": {
              "1. open": "127.2021",
              "2. high": "127.2500",
              "3. low": "127.1500",
              "4. close": "127.1600",
              "5. volume": "28273"
          },
          "2019-06-18 12:30:00": {
              "1. open": "127.1400",
              "2. high": "127.2400",
              "3. low": "127.1200",
              "4. close": "127.2000",
              "5. volume": "32783"
          },
          "2019-06-18 12:25:00": {
              "1. open": "127.1899",
              "2. high": "127.1960",
              "3. low": "127.1300",
              "4. close": "127.1500",
              "5. volume": "19507"
          },
          "2019-06-18 12:20:00": {
              "1. open": "127.1400",
              "2. high": "127.1900",
              "3. low": "127.0800",
              "4. close": "127.1800",
              "5. volume": "46011"
          },
          "2019-06-18 12:15:00": {
              "1. open": "127.0200",
              "2. high": "127.1400",
              "3. low": "127.0000",
              "4. close": "127.1400",
              "5. volume": "60981"
          },
          "2019-06-18 12:10:00": {
              "1. open": "126.9700",
              "2. high": "127.0500",
              "3. low": "126.9700",
              "4. close": "127.0100",
              "5. volume": "46705"
          },
          "2019-06-18 12:05:00": {
              "1. open": "127.0300",
              "2. high": "127.0400",
              "3. low": "126.9600",
              "4. close": "126.9700",
              "5. volume": "23866"
          },
          "2019-06-18 12:00:00": {
              "1. open": "126.9700",
              "2. high": "127.0300",
              "3. low": "126.9200",
              "4. close": "127.0300",
              "5. volume": "59344"
          },
          "2019-06-18 11:55:00": {
              "1. open": "126.9485",
              "2. high": "127.0000",
              "3. low": "126.8900",
              "4. close": "126.9700",
              "5. volume": "82626"
          },
          "2019-06-18 11:50:00": {
              "1. open": "126.9800",
              "2. high": "127.0000",
              "3. low": "126.8750",
              "4. close": "126.9400",
              "5. volume": "161983"
          },
          "2019-06-18 11:45:00": {
              "1. open": "127.1000",
              "2. high": "127.1650",
              "3. low": "126.9700",
              "4. close": "126.9700",
              "5. volume": "127524"
          },
          "2019-06-18 11:40:00": {
              "1. open": "127.2200",
              "2. high": "127.2200",
              "3. low": "127.0800",
              "4. close": "127.1100",
              "5. volume": "93248"
          },
          "2019-06-18 11:35:00": {
              "1. open": "127.3077",
              "2. high": "127.3300",
              "3. low": "127.1100",
              "4. close": "127.2300",
              "5. volume": "112374"
          },
          "2019-06-18 11:30:00": {
              "1. open": "127.5900",
              "2. high": "127.5900",
              "3. low": "127.2900",
              "4. close": "127.3200",
              "5. volume": "508575"
          },
          "2019-06-18 11:25:00": {
              "1. open": "127.1900",
              "2. high": "127.6300",
              "3. low": "127.0301",
              "4. close": "127.5900",
              "5. volume": "616966"
          },
          "2019-06-18 11:20:00": {
              "1. open": "127.2659",
              "2. high": "127.2900",
              "3. low": "127.1800",
              "4. close": "127.2200",
              "5. volume": "290747"
          },
          "2019-06-18 11:15:00": {
              "1. open": "127.1100",
              "2. high": "127.2800",
              "3. low": "127.1000",
              "4. close": "127.2700",
              "5. volume": "283235"
          },
          "2019-06-18 11:10:00": {
              "1. open": "126.9700",
              "2. high": "127.2100",
              "3. low": "126.9700",
              "4. close": "127.1300",
              "5. volume": "338821"
          },
          "2019-06-18 11:05:00": {
              "1. open": "127.0300",
              "2. high": "127.0300",
              "3. low": "126.9350",
              "4. close": "126.9550",
              "5. volume": "71175"
          },
          "2019-06-18 11:00:00": {
              "1. open": "126.8650",
              "2. high": "127.0585",
              "3. low": "126.8650",
              "4. close": "127.0250",
              "5. volume": "213822"
          },
          "2019-06-18 10:55:00": {
              "1. open": "126.7700",
              "2. high": "127.0000",
              "3. low": "126.7650",
              "4. close": "126.8550",
              "5. volume": "321087"
          },
          "2019-06-18 10:50:00": {
              "1. open": "126.6400",
              "2. high": "126.7700",
              "3. low": "126.6100",
              "4. close": "126.7650",
              "5. volume": "71895"
          },
          "2019-06-18 10:45:00": {
              "1. open": "126.6717",
              "2. high": "126.6800",
              "3. low": "126.6000",
              "4. close": "126.6400",
              "5. volume": "15577"
          },
          "2019-06-18 10:40:00": {
              "1. open": "126.6100",
              "2. high": "126.7000",
              "3. low": "126.6100",
              "4. close": "126.6700",
              "5. volume": "45558"
          },
          "2019-06-18 10:35:00": {
              "1. open": "126.6900",
              "2. high": "126.7000",
              "3. low": "126.5200",
              "4. close": "126.6100",
              "5. volume": "114135"
          },
          "2019-06-18 10:30:00": {
              "1. open": "126.7900",
              "2. high": "126.8200",
              "3. low": "126.5900",
              "4. close": "126.6800",
              "5. volume": "338387"
          },
          "2019-06-18 10:25:00": {
              "1. open": "126.8500",
              "2. high": "126.8500",
              "3. low": "126.7400",
              "4. close": "126.8000",
              "5. volume": "399611"
          },
          "2019-06-18 10:20:00": {
              "1. open": "126.8500",
              "2. high": "126.9198",
              "3. low": "126.8500",
              "4. close": "126.9000",
              "5. volume": "69881"
          },
          "2019-06-18 10:15:00": {
              "1. open": "126.7601",
              "2. high": "126.8300",
              "3. low": "126.7300",
              "4. close": "126.8100",
              "5. volume": "222076"
          },
          "2019-06-18 10:10:00": {
              "1. open": "126.6799",
              "2. high": "126.7250",
              "3. low": "126.6100",
              "4. close": "126.7250",
              "5. volume": "243739"
          },
          "2019-06-18 10:05:00": {
              "1. open": "126.6000",
              "2. high": "126.6300",
              "3. low": "126.4600",
              "4. close": "126.4600",
              "5. volume": "172985"
          },
          "2019-06-18 10:00:00": {
              "1. open": "126.8200",
              "2. high": "126.8700",
              "3. low": "126.5200",
              "4. close": "126.6700",
              "5. volume": "387462"
          },
          "2019-06-18 09:55:00": {
              "1. open": "126.7800",
              "2. high": "126.9201",
              "3. low": "126.7350",
              "4. close": "126.8200",
              "5. volume": "151585"
          },
          "2019-06-18 09:50:00": {
              "1. open": "126.8700",
              "2. high": "126.9900",
              "3. low": "126.6950",
              "4. close": "126.7900",
              "5. volume": "332647"
          },
          "2019-06-18 09:45:00": {
              "1. open": "127.6000",
              "2. high": "127.6300",
              "3. low": "126.8600",
              "4. close": "126.8600",
              "5. volume": "758073"
          },
          "2019-06-18 09:40:00": {
              "1. open": "127.7000",
              "2. high": "127.7100",
              "3. low": "127.5200",
              "4. close": "127.5600",
              "5. volume": "230955"
          },
          "2019-06-18 09:35:00": {
              "1. open": "127.5800",
              "2. high": "127.7500",
              "3. low": "127.5800",
              "4. close": "127.7100",
              "5. volume": "97327"
          },
          "2019-06-17 16:00:00": {
              "1. open": "126.4500",
              "2. high": "126.4700",
              "3. low": "126.4400",
              "4. close": "126.4500",
              "5. volume": "118107"
          },
          "2019-06-17 15:55:00": {
              "1. open": "126.4250",
              "2. high": "126.4500",
              "3. low": "126.4200",
              "4. close": "126.4500",
              "5. volume": "149773"
          },
          "2019-06-17 15:50:00": {
              "1. open": "126.4100",
              "2. high": "126.4400",
              "3. low": "126.4000",
              "4. close": "126.4200",
              "5. volume": "97725"
          },
          "2019-06-17 15:45:00": {
              "1. open": "126.3950",
              "2. high": "126.4200",
              "3. low": "126.3900",
              "4. close": "126.4050",
              "5. volume": "83299"
          },
          "2019-06-17 15:40:00": {
              "1. open": "126.3948",
              "2. high": "126.4050",
              "3. low": "126.3835",
              "4. close": "126.3900",
              "5. volume": "23196"
          },
          "2019-06-17 15:35:00": {
              "1. open": "126.4200",
              "2. high": "126.4300",
              "3. low": "126.3800",
              "4. close": "126.3950",
              "5. volume": "57155"
          },
          "2019-06-17 15:30:00": {
              "1. open": "126.3900",
              "2. high": "126.4200",
              "3. low": "126.3800",
              "4. close": "126.4100",
              "5. volume": "121287"
          },
          "2019-06-17 15:25:00": {
              "1. open": "126.4150",
              "2. high": "126.4150",
              "3. low": "126.3800",
              "4. close": "126.3934",
              "5. volume": "65478"
          },
          "2019-06-17 15:20:00": {
              "1. open": "126.3600",
              "2. high": "126.4150",
              "3. low": "126.3600",
              "4. close": "126.4150",
              "5. volume": "248774"
          },
          "2019-06-17 15:15:00": {
              "1. open": "126.3800",
              "2. high": "126.3800",
              "3. low": "126.3501",
              "4. close": "126.3546",
              "5. volume": "23707"
          },
          "2019-06-17 15:10:00": {
              "1. open": "126.3796",
              "2. high": "126.3850",
              "3. low": "126.3650",
              "4. close": "126.3800",
              "5. volume": "12125"
          },
          "2019-06-17 15:05:00": {
              "1. open": "126.3800",
              "2. high": "126.3900",
              "3. low": "126.3700",
              "4. close": "126.3739",
              "5. volume": "33683"
          },
          "2019-06-17 15:00:00": {
              "1. open": "126.3850",
              "2. high": "126.4000",
              "3. low": "126.3747",
              "4. close": "126.3800",
              "5. volume": "23607"
          },
          "2019-06-17 14:55:00": {
              "1. open": "126.3700",
              "2. high": "126.4000",
              "3. low": "126.3600",
              "4. close": "126.3900",
              "5. volume": "45952"
          },
          "2019-06-17 14:50:00": {
              "1. open": "126.3500",
              "2. high": "126.3800",
              "3. low": "126.3400",
              "4. close": "126.3800",
              "5. volume": "11163"
          },
          "2019-06-17 14:45:00": {
              "1. open": "126.3623",
              "2. high": "126.3800",
              "3. low": "126.3300",
              "4. close": "126.3500",
              "5. volume": "13867"
          },
          "2019-06-17 14:40:00": {
              "1. open": "126.3667",
              "2. high": "126.3900",
              "3. low": "126.3477",
              "4. close": "126.3700",
              "5. volume": "14234"
          },
          "2019-06-17 14:35:00": {
              "1. open": "126.3700",
              "2. high": "126.3900",
              "3. low": "126.3400",
              "4. close": "126.3800",
              "5. volume": "24288"
          },
          "2019-06-17 14:30:00": {
              "1. open": "126.3300",
              "2. high": "126.3800",
              "3. low": "126.3261",
              "4. close": "126.3700",
              "5. volume": "12252"
          },
          "2019-06-17 14:25:00": {
              "1. open": "126.3100",
              "2. high": "126.3400",
              "3. low": "126.3100",
              "4. close": "126.3200",
              "5. volume": "39818"
          },
          "2019-06-17 14:20:00": {
              "1. open": "126.3000",
              "2. high": "126.3300",
              "3. low": "126.3000",
              "4. close": "126.3200",
              "5. volume": "112512"
          },
          "2019-06-17 14:15:00": {
              "1. open": "126.3300",
              "2. high": "126.3300",
              "3. low": "126.2800",
              "4. close": "126.3000",
              "5. volume": "19624"
          }
      }
    };

    // Perform test
    alphaVantageService.getIntraDayData('gld').subscribe({
      next: (intradayData: IntradayData) => {

        // Verify

        // Verify response exists
        expect( intradayData ).toBeTruthy();

        // Verify Metadata
        expect( intradayData.metaData.symbol ).toBeTruthy();
        expect( intradayData.metaData.symbol.toLowerCase() ).toEqual( "gld" );
        expect( intradayData.metaData.lastRefreshed ).toBeTruthy();
        expect( intradayData.metaData.interval ).toBeTruthy();
        expect( intradayData.metaData.name ).toBeFalsy();

        // Verify quote data
        expect( intradayData.quoteData ).toBeTruthy();
        expect( intradayData.quoteData.length ).toBeGreaterThan( 0 );
        quoteDataDate = intradayData.quoteData[0].timestamp.getDate()
        for( let quote of intradayData.quoteData ) {

          // Verify data values exist
          expect(quote.open).toBeTruthy();
          expect(quote.high).toBeTruthy();
          expect(quote.low).toBeTruthy();
          expect(quote.close).toBeTruthy();
          expect(quote.price).toBeFalsy();
          expect(quote.volume).toBeTruthy();
          expect(quote.timestamp).toBeTruthy();
          expect(quote.timestamp.getDate()).toEqual(quoteDataDate);

        }

        // Conclude test
        done();
      }
    });

    // Mock
    let mockRequest = httpController.expectOne(expectedQueryString);
    expect(mockRequest.request.method).toEqual('GET');
    mockRequest.flush(responseObject);

  });
});
