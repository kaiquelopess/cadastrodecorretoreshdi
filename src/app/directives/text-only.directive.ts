import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'input[TextOnly]'
})
export class TextOnlyDirective {

  constructor(private _el: ElementRef) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        const initalValue = this._el.nativeElement.value;
        this._el.nativeElement.value = initalValue.replace(/\d|[!@#$%*&(){}\[\]:;/\\,?<>+="'_\|]/g, '');
        if (initalValue !== this._el.nativeElement.value) {
            event.stopPropagation();
        }
    }
}
