import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

  private colorPalette: string[] = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
    '#4caf50', '#ff5722', '#795548', '#607d8b', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#9e9e9e'
  ];

  constructor() { }

  getRandomColor(): { [key: string]: string } {
    const colorIndex = Math.floor(Math.random() * this.colorPalette.length);
    return {
      backgroundColor: this.colorPalette[colorIndex],
      textColor: (colorIndex < 13 ? 'white' : 'black')
    };
  }

}
