/** **************************************************************************
 * 
 * File:
 *   app.component.ts
 * 
 * Description:
 *   root application component
 * 
 *****************************************************************************/

/* Dependencies **************************************************************/

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/** The main application component. */
export class AppComponent implements OnInit {

  /* Local Variables *********************************************************/

  /** The title of the application. */
  title = 'bfs-trading-platform-web-client';

  /** The financial symbol that is passed to the chart component. */
  chartSymbol: string = 'msft';

  /** The form group used to search for a new financial symbol. */
  searchSymbolFormGroup: any;
  
  /* Lifecycle Functions *****************************************************/

  constructor(
    private formBuilder: FormBuilder
  ) {

    this.searchSymbolFormGroup = this.formBuilder.group({
      symbol: this.chartSymbol
    });

  }

  ngOnInit() {

  }

  /** Called once the searchSymbolFormGroup submits. */
  onSubmit(searchSymbolFormGroupData: any) {
    this.chartSymbol = searchSymbolFormGroupData.symbol;
  }
}
