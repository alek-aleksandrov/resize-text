import { TestBed, inject } from '@angular/core/testing';

import { ContextService } from './context.service';

describe('ContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContextService]
    });
  });

  beforeEach(() => {
    let store = {};

    spyOn(sessionStorage, 'getItem').and.callFake( (key: string): String => {
     return store[key] || null;
    });
    spyOn(sessionStorage, 'removeItem').and.callFake((key: string): void =>  {
      delete store[key];
    });
    spyOn(sessionStorage, 'setItem').and.callFake((key: string, value: string): string =>  {
      return store[key] = <string>value;
    });
    spyOn(sessionStorage, 'clear').and.callFake(() =>  {
        store = {};
    });
  });

  it('should be created', inject([ContextService], (service: ContextService) => {
    expect(service).toBeTruthy();
  }));

  it('should save the new text value to the session and pass it to next', inject([ContextService], (service: ContextService) => {
    service.newText('Test Text');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('currentText', 'Test Text');
    service.textSource$.subscribe((data) => {
      expect(data).toBe('Test Text');
    });
  }));

  it('should save the new width value to the session and pass it to next', inject([ContextService], (service: ContextService) => {
    service.newWidth(850);
    expect(sessionStorage.setItem).toHaveBeenCalledWith('currentWidth', '850');
    service.widthSource$.subscribe((data) => {
      expect(data).toBe(850);
    });
  }));

});
