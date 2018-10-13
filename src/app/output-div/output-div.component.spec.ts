import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputDivComponent } from './output-div.component';
import { ElementRef, Injectable, ChangeDetectorRef } from '@angular/core';
import { ContextService } from '../context.service';
import { detectChanges } from '@angular/core/src/render3';

@Injectable()
export class MockElementRef {
  nativeElement: {};
}

describe('OutputDivComponent', () => {
  let component: OutputDivComponent;
  let fixture: ComponentFixture<OutputDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputDivComponent ],
      providers: [
        { provide: ElementRef, useClass: MockElementRef },
        ContextService,
        ChangeDetectorRef
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the default values for text if no value is in session', () => {
    expect(component.currentText).toBe('Example Text');
  });

  it('should load the default values for width if no value is in session', () => {
    expect(component.currentWidth).toEqual(100);
  });

  it('should retrieve the element width and height when elementDimensions is called', () => {
    expect(component.elementDimensions(component.outputText))
    .toEqual({width: component.outputText.nativeElement.offsetWidth, height: component.outputText.nativeElement.offsetHeight});
  });

  it('should create a size ratio between the text and the output box', () => {
    const mockContainerBox = {
      width: 1,
      height: 1
    };
    const mockSpanBox = {
      width: 1,
      height: 1
    };
    expect(component.calcChangeFactor(mockContainerBox, mockSpanBox)).toBe(1);
  });

  it('should call the methods to size up the text and trigger a render', () => {
    const previousFontSize = component.setFont;
    component.currentWidth = 500;
    TestBed.createComponent(OutputDivComponent);
    component.fitText(component.outputDiv, component.outputText);
    expect(component.setFont !== previousFontSize).toBeTruthy();
  });
});
