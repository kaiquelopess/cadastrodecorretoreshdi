import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ParamsService {
    params;

    constructor() {
    }

    getParams() {
        switch (window.location.host) {
            case 'netd.hdi.com.br':
                this.params = {

                    production: false,
                    // apiBaseAddress: '/api/',
                    apiBaseAddress: 'https://api-desenv.hdi.com.br/',
                    apiTokenBaseAddress: 'https://login-desenv.hdi.com.br/',
                    tokenUsername: '74faa8cd-851b-4d7e-99e6-5f4aaac34a20',
                    tokenPassword: 'd450e0a8-e04e-4ae8-9165-348ef14ef5cb',

                };
                break;
            case 'net.hdi.com.br':
                this.params = {

                    production: false,
                    // apiBaseAddress: '/api/',
                    apiBaseAddress: 'https://api-sandbox.hdi.com.br/',
                    apiTokenBaseAddress: 'https://login-sandbox.hdi.com.br/',
                    tokenUsername: '4caa2fea-06ad-4cf7-ac80-d0959da57776',
                    tokenPassword: 'b2059391-7edd-406a-ac78-05b116119509',

                };
                break;
            case 'www.hdi.com.br':
                this.params = {

                    production: true,
                    // apiBaseAddress: '/api/',
                    apiBaseAddress: 'https://api.hdi.com.br/',
                    apiTokenBaseAddress: 'https://login.hdi.com.br/',
                    tokenUsername: 'ac8065dc-557e-4e34-b034-3bf9a558b059',
                    tokenPassword: 'ea360e52-c71b-4f62-925e-3d622cb31dfe',

                };
                break;
            default:
                this.params = {

                    production: false,
                    apiBaseAddress: 'https://api-desenv.hdi.com.br/',
                    apiTokenBaseAddress: 'https://login-desenv.hdi.com.br/',
                    tokenUsername: '74faa8cd-851b-4d7e-99e6-5f4aaac34a20',
                    tokenPassword: 'd450e0a8-e04e-4ae8-9165-348ef14ef5cb',

                };
                break;
        }

        return this.params;
    }

}
