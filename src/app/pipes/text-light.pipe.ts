import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textLight'
})
export class TextLightPipe implements PipeTransform {
  transform(value: string): string {
    let valueArr =  value.split(' ')
    valueArr = valueArr.map((word) => {
      if (word.startsWith('#')) word = `<span class="tag-word">${word}</span>`
      return word
    })
    return valueArr.join(' ');
  }
}
