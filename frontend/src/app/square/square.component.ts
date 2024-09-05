import {Component, input, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [
    NgStyle
  ],
  template: `

    <button type="button" class="btn btn-warning" [ngStyle]="{'color': getColor()}">{{ squareValue }}</button>
  `,
  styles: [`
    button {
      width: 100%;
      height: 100%;
      font-size: 3em;
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      border-radius: 10px;
    }
  `]
})
export class SquareComponent {
  @Input() squareValue: 'X' | 'O' | null = 'O';

  getColor(): string {
    if (this.squareValue === 'X') {
      return '#18b597';
    } else if (this.squareValue === 'O') {
      return '#e96475';
    } else {
      return 'black';
    }
  }
}

