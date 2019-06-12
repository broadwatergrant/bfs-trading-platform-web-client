import { Quote } from './quote';

export class IntradayData {
    metaData: {
        information: string,
        symbol: string,
        lastRefreshed: Date,
        interval: string,
        name?: string
    }
    quoteData: Quote[]
}