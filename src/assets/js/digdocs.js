function loadUploader(perfil, susep, documento, razao) {
    var username = susep+'_'+documento;
    return $('div.uploads__container').load({
        perfil: perfil,
        codigoExterno: documento,
        username: username,
        parametros: {
            cpfcnpj: documento,
            filial: '01',
            susep: susep,
            codigo_produtor: '',
            razao_social: razao,
            exibir_botao_exportar: false,
            bloquear_edicao: false
        },
        qrcode: false
    });
}

function checkDocuments() {
    return $('div.uploads__container').status().faltaDocumentos();
}

function sendDocuments() {
    return $('._upl-tools a.btn-export').click();
}
