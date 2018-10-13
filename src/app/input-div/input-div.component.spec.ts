import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDivComponent } from './input-div.component';
import { FormsModule } from '@angular/forms';
import { ContextService } from '../context.service';

describe('InputDivComponent', () => {
  let component: InputDivComponent;
  let fixture: ComponentFixture<InputDivComponent>;
  let service: ContextService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDivComponent ],
      imports: [ FormsModule ],
      providers: [ ContextService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDivComponent);
    component = fixture.componentInstance;
    // Since this is a helper service (no outside calls) simpler to use the real service
    service = TestBed.get(ContextService);
    fixture.detectChanges();
    sessionStorage.clear();
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

  it('should set the text when setText is called', () => {
    spyOn(service, 'newText').and.callThrough();
    spyOn(component, 'setText').and.callThrough();
    expect(component).toBeTruthy();
    component.setText('Test');
    expect(service.newText).toHaveBeenCalled();
    expect(component.currentText).toBe('Test');
  });

  it('should set the width when setWidth is called', () => {
    spyOn(service, 'newWidth').and.callThrough();
    spyOn(component, 'setWidth').and.callThrough();
    expect(component).toBeTruthy();
    component.setWidth(1000);
    expect(service.newWidth).toHaveBeenCalled();
    expect(component.currentWidth).toBe(1000);
  });

  it('should try to use the value saved in session before setting the default', () => {
    TestBed.createComponent(InputDivComponent);
    expect(sessionStorage.getItem).toHaveBeenCalledTimes(2);
  });
});
