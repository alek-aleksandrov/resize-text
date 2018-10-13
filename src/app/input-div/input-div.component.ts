import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContextService } from '../context.service';

@Component({
  selector: 'app-input-div',
  templateUrl: './input-div.component.html',
  styleUrls: ['./input-div.component.css']
})
export class InputDivComponent implements OnInit {

  currentWidth: number;
  currentText: string;

  constructor(private service: ContextService) {
    this.currentWidth = JSON.parse(sessionStorage.getItem('currentWidth')) || 100;
    this.currentText = sessionStorage.getItem('currentText') || 'Example Text';
  }

  ngOnInit() {
  }

  setWidth(value) {
    this.currentWidth = value;
    this.service.newWidth(value);
  }

  setText(value) {
    this.currentText = value;
    this.service.newText(value);
  }

}
