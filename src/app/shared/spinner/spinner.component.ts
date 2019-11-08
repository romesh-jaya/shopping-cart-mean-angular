import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input() size: number = 60;
  @Input() show: boolean;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
