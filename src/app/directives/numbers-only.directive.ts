import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: 'input[NumbersOnly]' })
export class NumbersOnlyDirective {

  @Input() allowDecimals: boolean = true;
  @Input() allowSign: boolean = false;
  @Input() decimalSeparator: string = '.';

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
