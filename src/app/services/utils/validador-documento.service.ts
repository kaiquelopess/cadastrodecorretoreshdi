import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ValidadorDocumentoService {

    constructor() {
    }

    validaCpf(CPF) {
        let Soma;
        let Resto;
        let cpf;
        Soma = 0;

        if ((CPF === '00000000000') || (CPF === '11111111111') || (CPF === '22222222222') || (CPF === '33333333333') ||
            (CPF === '44444444444') || (CPF === '55555555555') || (CPF === '66666666666') || (CPF === '77777777777') ||
            (CPF === '88888888888') || (CPF === '99999999999')) {
            return false;
        }

        for (let i = 1; i <= 9; i++) {
            Soma = Soma + parseInt(CPF.substring(i - 1, i), 10) * (11 - i);
        }

        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) {
            Resto = 0;
        }

        if (Resto !== parseInt(CPF.substring(9, 10), 10)) {
            return false;
        }

        Soma = 0;
        for (let i = 1; i <= 10; i++) {
            Soma = Soma + parseInt(CPF.substring(i - 1, i), 10) * (12 - i);
        }

        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) {
            Resto = 0;
        }

        if (Resto !== parseInt(CPF.substring(10, 11), 10)) {
            return false;
        }

        return true;
    }

    validaCnpj(cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj === '') {
            return false;
        }

        if (cnpj.length !== 14) {
            return false;
        }

        if (cnpj === '00000000000000' || cnpj === '11111111111111' || cnpj === '22222222222222' || cnpj === '33333333333333' ||
            cnpj === '44444444444444' || cnpj === '55555555555555' || cnpj === '66666666666666' || cnpj === '77777777777777' ||
            cnpj === '88888888888888' || cnpj === '99999999999999') {
            return false;
        }

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) {
            return false;
        }

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) {
            return false;
        }

        return true;

    }


}
