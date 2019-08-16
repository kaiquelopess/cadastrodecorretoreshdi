import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cnpjCpfFormat',
    pure: true
})
export class CnpjCpfFormatPipe implements PipeTransform {

    transform(value: string): string {
        let returnString: string = '';

        if (value.length == 0) {
            return;
        }
        if (value.length == 11) {
            //cpf
            returnString = this.convertCpf(value);
        } else if (value.length == 14) {
            //cnpj
            returnString = this.convertCnpj(value);
        } else {
            if (value == '##Número Inválido.##') {
                returnString = '#Número Inválido.#';
            } else {
                returnString = '##Número Inválido.##';
            }
        }

        return returnString;
    }

    convertCpf(value: string): string {
        let formattedString: string = '';

        formattedString = value.padStart(11, '0');

        formattedString = formattedString.substr(0, 3) + '.' +
            formattedString.substr(3, 3) + '.' +
            formattedString.substr(6, 3) + '-' +
            formattedString.substr(9, 2);

        return formattedString;
    }

    convertCnpj(value: string): string {
        let formattedString: string = '';

        formattedString = value.padStart(14, '0');

        formattedString = formattedString.substr(0, 2) + '.' +
            formattedString.substr(2, 3) + '.' +
            formattedString.substr(5, 3) + '/' +
            formattedString.substr(8, 4) + '-' +
            formattedString.substr(12, 2);

        return formattedString;
    }


}
