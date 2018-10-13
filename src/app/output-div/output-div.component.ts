import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ContextService } from '../context.service';
@Component({
  selector: 'app-output-div',
  templateUrl: './output-div.component.html',
  styleUrls: ['./output-div.component.css']
})
export class OutputDivComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('outputDiv') outputDiv: ElementRef;
  @ViewChild('outputText') outputText: ElementRef;

  cache = {};
  currentText: string;
  currentWidth: number;
  setFont = 12;
  setLineHeight = 12;

  constructor(private service: ContextService, private cdr: ChangeDetectorRef) {
    if (sessionStorage.getItem('currentText')) {
      this.currentText = sessionStorage.getItem('currentText');
    } else {
      this.currentText = 'Example Text';
    }
    if (sessionStorage.getItem('currentWidth')) {
      this.currentWidth = JSON.parse(sessionStorage.getItem('currentWidth'));
    } else {
      this.currentWidth = 100;
    }
    this.service.textSource$.subscribe(data => {
      this.currentText = data;
      this.fitText(this.outputDiv, this.outputText);
    });
    this.service.widthSource$.subscribe(data => {
      this.currentWidth = data;
      this.fitText(this.outputDiv, this.outputText);
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.fitText(this.outputDiv, this.outputText);
  }

  ngOnChanges() {
    this.fitText(this.outputDiv, this.outputText);
  }


  elementDimensions(element: ElementRef) {
    const dimensions = {
      width: element.nativeElement.offsetWidth,
      height: element.nativeElement.offsetHeight
    };
    return dimensions;
  }

  calcChangeFactor(spanBox, containerBox) {
    let widthRatio;
    let heightRatio;

    if (containerBox.width > 2) {
      widthRatio = (containerBox.width - 2) / spanBox.width;
      heightRatio = (containerBox.height - 2) / spanBox.height;
    } else if (containerBox.width <= 2) { // Sets font to 0 when box is tiny so we have to check for it
      widthRatio = containerBox.width / spanBox.width;
      heightRatio = containerBox.height / spanBox.height;
    }

    // Pass multiplier to size up text to box
    if (widthRatio < heightRatio) {
      return widthRatio;
    } else if (widthRatio >= heightRatio) {
      return heightRatio;
    }
  }

  fitText(div: ElementRef, span: ElementRef) {
    const spanBox = this.elementDimensions(span);
    const containerBox = this.elementDimensions(div);
    let changeFactor = this.calcChangeFactor(spanBox, containerBox);
    if (changeFactor === Infinity) {
      changeFactor = 1; // Fix for when there is no text, it goes to infinity
    }
    this.setFont = Math.floor(changeFactor * this.setFont);
    this.setLineHeight = Math.floor(changeFactor * this.setLineHeight);

    this.cdr.detectChanges(); // Sets the element change
  }
}
