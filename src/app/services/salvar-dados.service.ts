import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})

export class SalvarDadosService {

    private salvar: any;

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    salvarContatos(salvar: any): any {
        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/novoscorretores';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json', 'Accept': 'application/json'
            })
        };

        const data = {
            request: {
                dsDadosProdutor: {
                    dsDadosProdutor: {
                        ttDadosProdutor: [{
                            numseq: salvar.numseq ? salvar.numseq : sessionStorage.getItem('numseq'),
                            susep: salvar.susep ? salvar.susep : sessionStorage.getItem('codigoSusep'),
                            cpfcnpj: salvar.cpfcnpj ? salvar.cpfcnpj : sessionStorage.getItem('cnpjCpf'),
                            situacao: salvar.situacao ? salvar.situacao : sessionStorage.getItem('situacao'),
                            codBanco: salvar.codBanco ? salvar.codBanco : sessionStorage.getItem('banco'),
                            codAgencia: salvar.codAgencia ? salvar.codAgencia : sessionStorage.getItem('agencia'),
                            dvAgencia: salvar.dvAgencia ? salvar.dvAgencia : sessionStorage.getItem('dvAgencia'),
                            conta: salvar.conta ? salvar.conta : sessionStorage.getItem('conta'),
                            dvConta: salvar.dvConta ? salvar.dvConta : sessionStorage.getItem('dvConta'),
                            codCamara: salvar.codCamara ? salvar.codCamara : sessionStorage.getItem('camara'),
                            codEmpresa: salvar.cod_empresa ? salvar.cod_empresa : sessionStorage.getItem('cod_empresa'),
                            codSucursal: salvar.sucursalAtiva ? salvar.sucursalAtiva : sessionStorage.getItem('codSucursal'),
                            nome: salvar.nome ? salvar.nome : sessionStorage.getItem('nome_corretor'),
                            contato: sessionStorage.getItem('nome_corretor'),
                            endereco: salvar.endereco ? salvar.endereco : sessionStorage.getItem('endereco'),
                            numero: salvar.numero ? salvar.numero : sessionStorage.getItem('numero'),
                            complemento: salvar.complemento ? salvar.complemento : sessionStorage.getItem('complemento'),
                            bairro: salvar.bairro ? salvar.bairro : sessionStorage.getItem('bairro'),
                            municipio: salvar.cidade ? salvar.cidade : sessionStorage.getItem('cidade'),
                            uf: salvar.uf ? salvar.uf : sessionStorage.getItem('uf'),
                            cep: salvar.cep ? salvar.cep : sessionStorage.getItem('cep'),
                            telComercial: salvar.telefoneComercial ? salvar.telefoneComercial : sessionStorage.getItem('telComercial'),
                            telCelular: salvar.telefoneCelular ? salvar.telefoneCelular : sessionStorage.getItem('telCelular'),
                            email: salvar.emailRenova ? salvar.emailRenova : sessionStorage.getItem('email'),
                            emailSin: salvar.emailSin ? salvar.emailSin : sessionStorage.getItem('emailSin'),
                            emailExt: salvar.emailExt ? salvar.emailExt : sessionStorage.getItem('emailExt'),
                            emailNf: salvar.emailNotaFiscal ? salvar.emailNotaFiscal : sessionStorage.getItem('emailNotaFiscal'),
                            emiteNF: false,
                            numInss: salvar.numInss,
                            sexo: salvar.sexo,
                            dataNasc: salvar.datNascPf ? salvar.datNascPf : '',
                            simplesNacional: salvar.simplesNacional ? salvar.simplesNacional : sessionStorage.getItem('simplesNacional'),
                        }],
                        ttUsuario: [{
                            numseq: salvar.numseq ? salvar.numseq : sessionStorage.getItem('numseq'),
                            cpf: salvar.cpfContato,
                            nome: salvar.nomeContato,
                            email: salvar.emailUsuario,
                            dtNasc: salvar.dtNascContato,
                            telComercial: salvar.telComercialContato,
                            telCelular: salvar.telCelularContato,
                            codCargo: salvar.SbgrId,
                            senha: salvar.senha,
                            userPrincipal: salvar.TipoContato,
                        }]
                    }
                }
            }
        };

        try {
            return this.http.post(apiMethodUri, data, httpOptions);
        } catch (error) {
        }
    }

    salvarDados(salvar: any): any {

        this.setSalvar(salvar);

        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/novoscorretores';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json', 'Accept': 'application/json'
            })
        };

        const data = {
            request: {
                dsDadosProdutor: {
                    dsDadosProdutor: {
                        ttDadosProdutor: [{
                            numseq: salvar.numseq ? salvar.numseq : sessionStorage.getItem('numseq'),
                            susep: salvar.susep ? salvar.susep : sessionStorage.getItem('codigoSusep'),
                            cpfcnpj: salvar.cpfcnpj ? salvar.cpfcnpj : sessionStorage.getItem('cnpjCpf'),
                            situacao: salvar.situacao ? salvar.situacao : sessionStorage.getItem('situacao'),
                            codBanco: salvar.codBanco ? salvar.codBanco : sessionStorage.getItem('banco'),
                            codAgencia: salvar.codAgencia ? salvar.codAgencia : sessionStorage.getItem('agencia'),
                            dvAgencia: salvar.dvAgencia ? salvar.dvAgencia : sessionStorage.getItem('dvAgencia'),
                            conta: salvar.conta ? salvar.conta : sessionStorage.getItem('conta'),
                            dvConta: salvar.dvConta ? salvar.dvConta : sessionStorage.getItem('dvConta'),
                            codCamara: salvar.codCamara ? salvar.codCamara : sessionStorage.getItem('camara'),
                            codEmpresa: salvar.cod_empresa ? salvar.cod_empresa : sessionStorage.getItem('cod_empresa'),
                            codSucursal: salvar.sucursalAtiva ? salvar.sucursalAtiva : sessionStorage.getItem('codSucursal'),
                            nome: salvar.nome ? salvar.nome : sessionStorage.getItem('nome_corretor'),
                            contato: sessionStorage.getItem('nome_corretor'),
                            endereco: salvar.endereco ? salvar.endereco : sessionStorage.getItem('endereco'),
                            numero: salvar.numero ? salvar.numero : sessionStorage.getItem('numero'),
                            complemento: salvar.complemento ? salvar.complemento : sessionStorage.getItem('complemento'),
                            bairro: salvar.bairro ? salvar.bairro : sessionStorage.getItem('bairro'),
                            municipio: salvar.cidade ? salvar.cidade : sessionStorage.getItem('cidade'),
                            uf: salvar.uf ? salvar.uf : sessionStorage.getItem('uf'),
                            cep: salvar.cep ? salvar.cep : sessionStorage.getItem('cep'),
                            telComercial: salvar.telefoneComercial ? salvar.telefoneComercial : sessionStorage.getItem('telComercial'),
                            telCelular: salvar.telefoneCelular ? salvar.telefoneCelular : sessionStorage.getItem('telCelular'),
                            email: salvar.emailRenova ? salvar.emailRenova : sessionStorage.getItem('email'),
                            emailSin: salvar.emailSin ? salvar.emailSin : sessionStorage.getItem('emailSin'),
                            emailExt: salvar.emailExt ? salvar.emailExt : sessionStorage.getItem('emailExt'),
                            emailNf: salvar.emailNotaFiscal ? salvar.emailNotaFiscal : sessionStorage.getItem('emailNotaFiscal'),
                            emiteNF: false,
                            numInss: salvar.numInss ? salvar.numInss : sessionStorage.getItem('numInss'),
                            sexo: salvar.sexo ? salvar.sexo : sessionStorage.getItem('sexo'),
                            dataNasc: salvar.datNascPf ? salvar.datNascPf : sessionStorage.getItem('datNascPf'),
                            simplesNacional: salvar.simplesNacional ? salvar.simplesNacional : sessionStorage.getItem('simplesNacional'),
                        }]
                    }
                }
            }
        };

        try {
            return this.http.post(apiMethodUri, data, httpOptions);
        } catch (error) {
        }
    }

    getSalvar(): any {
        return this.salvar;
    }

    updateSessionStorage(dt) {

        sessionStorage.setItem('numseq', dt.numseq);
        sessionStorage.setItem('codigoSusep', dt.susep);
        sessionStorage.setItem('cnpjCpf', dt.cpfcnpj);
        sessionStorage.setItem('situacao', (!dt.situacao ? '1' : dt.situacao));
        sessionStorage.setItem('banco', (!dt.codBanco ? '' : dt.codBanco));
        sessionStorage.setItem('agencia', (!dt.codAgencia ? '' : dt.codAgencia));
        sessionStorage.setItem('dvAgencia', (!dt.dvAgencia ? '' : dt.dvAgencia));
        sessionStorage.setItem('conta', (!dt.conta ? '' : dt.conta));
        sessionStorage.setItem('dvConta', (!dt.dvConta ? '' : dt.dvConta));
        sessionStorage.setItem('camara', (!dt.codCamara ? '' : dt.codCamara));
        sessionStorage.setItem('cod_empresa', dt.codEmpresa);
        sessionStorage.setItem('codSucursal', dt.codSucursal);
        sessionStorage.setItem('nome_corretor', dt.nome);
        sessionStorage.setItem('contatocorretor', dt.nome);
        sessionStorage.setItem('endereco', dt.endereco);
        sessionStorage.setItem('numero', dt.numero);
        sessionStorage.setItem('complemento', dt.complemento);
        sessionStorage.setItem('bairro', dt.bairro);
        sessionStorage.setItem('cidade', dt.municipio);
        sessionStorage.setItem('uf', dt.uf);
        sessionStorage.setItem('email', (!dt.email ? '' : dt.email));
        sessionStorage.setItem('emailSin', (!dt.emailSin ? '' : dt.emailSin));
        sessionStorage.setItem('emailNotaFiscal', (!dt.emailNf ? '' : dt.emailNf));
        sessionStorage.setItem('emailExt', (!dt.emailExt ? '' : dt.emailExt));
        sessionStorage.setItem('telComercial', (!dt.telComercial ? '' : dt.telComercial));
        sessionStorage.setItem('telCelular', (!dt.telCelular ? '' : dt.telCelular));
        sessionStorage.setItem('numInss', dt.numInss);
        sessionStorage.setItem('sexo', dt.sexo);
        sessionStorage.setItem('datNascPf', dt.dataNasc);
        sessionStorage.setItem('simplesNacional', dt.simplesNacional);

        this.salvar = dt;
    }


    setSalvar(salvar: any): void {
        this.salvar = salvar;
    }
}
