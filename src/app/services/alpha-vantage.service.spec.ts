import { TestBed } from '@angular/core/testing';

import { AlphaVantageService } from './alpha-vantage.service';

describe('AlphaVantageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlphaVantageService = TestBed.get(AlphaVantageService);
    expect(service).toBeTruthy();
  });
});
