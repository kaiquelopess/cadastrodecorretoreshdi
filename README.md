# Cadastro de Corretores

Projeto da HDI Seguros/Foursys para automatização do cadastramento e análise de novos corretores para a seguradora.

## Servidor de Desenvolvimento

Para acessar o ambiente de desenvolvimento utilize `npm start` e navegue até o endereçoo `http://localhost:4200/login/1?codorigem=HDI`. 

## Build

Para fazer o build do projeto no ambiente de desenvolvimento, utilize o comando `ng build --prod --baseHref='/corretor/v1/cadastroDeCorretor/'`. 

Os artefatos criados estarão armazenados na pasta `dist/cadastro-corretor/` e este conteúdo deve ser colocado no servidor `\\hdistd\wwwroot\corretor\v1\cadastroDeCorretor\`.

Lembrar de apagar, ou passar o conteúdo existente para uma pasta antes de copiar os dados.  

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
