import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  private widthSource = new Subject<number>();
  private textSource = new Subject<string>();

  widthSource$ = this.widthSource.asObservable();
  textSource$ = this.textSource.asObservable();

  newWidth(width: number) {
    sessionStorage.setItem('currentWidth', JSON.stringify(width));
    this.widthSource.next(width);
  }

  newText(text: string) {
    sessionStorage.setItem('currentText', text);
    this.textSource.next(text);
  }
}
