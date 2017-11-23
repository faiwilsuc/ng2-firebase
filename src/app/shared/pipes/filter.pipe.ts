import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  private romanianChars = ['ă', 'â', 'î', 'ș', 'ț'];
  private englishChars = ['a', 'a', 'i', 's', 't'];

  transform(value: any, filter: string, props: string[]): any {
    if (value.length === 0 || filter.length < 2 || props.length === 0) {
      return value;
    }
    const resultArray = [];
    for (let item of value) {
      for (let prop of props) {
        let propString = item[prop].toLowerCase();
        let filterString = filter.toLowerCase();

        for (let i = 0; i < 5; i++) {
          const initPropString = propString;
          propString = propString.replace(this.romanianChars[i], this.englishChars[i]);
          if (initPropString !== propString) {
            filterString = filterString.replace(this.romanianChars[i], this.englishChars[i]);
          }
        }

        if (propString.indexOf(filterString) !== -1 && resultArray.indexOf(item) === -1) {
          resultArray.push(item);
        }
      }
    }
    return resultArray;
  }

}
