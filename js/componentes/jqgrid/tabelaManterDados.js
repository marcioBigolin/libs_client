function editarDado() {
    var id = $("#tabelaDadosManterDados").jqGrid('getGridParam', 'selrow');
    //alert(gr);
    if (id != null) {
        //$("#tabelaDados_manterDados").jqGrid('delGridRow',gr,{reloadAfterSubmit:false}); 
        location.href = tabelaManterDados.acaoEditarDado + '?id=' + id;
    } else {
        alert("Selecione um dado!");
    }

}

function adicionarDado() {
    location.href = tabelaManterDados.acaoAdicionarDado;
}


function deletarDado() {
    var id = $("#tabelaDadosManterDados").jqGrid('getGridParam', 'selrow');
    if (id) {
        if (window.confirm("Tem certeza que deseja apagar este dado? \n Essa ação é irreversível.")) {
            location.href = tabelaManterDados.acaoDeletarDado + '?id=' + id;
        }
    } else {
        alert("Por favor selecione um dado!");
    }
}

$(document).ready(function()
{
    largura = parseInt($('#tabelaDadosManterDados').parent().css('width'));
    tabelaPaginacao = "#tabelaPaginacaoManterDados";
    objeto = {
        url: tabelaManterDados.dados,
        datatype: 'json',
        mtype: 'POST',
        colModel: tabelaManterDados.colunas,
        colNames: tabelaManterDados.labelsColunas,
        usepager: true,
        caption: tabelaManterDados.titulo,
        useRp: true,
        singleSelect: tabelaManterDados.selecaoSimples,
        pager: tabelaPaginacao,
        rowNum: 40,
        rowList: [40, 80, 200],
        editUrl: tabelaManterDados.dados,
        width: largura,
        height: tabelaManterDados.altura


    };
    $("#tabelaDadosManterDados").jqGrid(objeto);
    $("#tabelaDadosManterDados").jqGrid('gridResize', {
        minWidth: 500,
        maxWidth: largura,
        minHeight: 80,
        maxHeight: 1000
    });


    $('#tabelaDadosManterDados').navGrid(tabelaPaginacao, {
        search: true,
        edit: false,
        add: false,
        del: false
    },
    {}, {}, {},
            {
                closeOnEscape: true,
                multipleSearch: true,
                closeAfterSearch: true
            }
    );

    $('#tabelaDadosManterDados').jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false});

    $('#tabelaDadosManterDados').navSeparatorAdd(tabelaPaginacao,
            {
                sepclass: 'ui-separator',
                sepcontent: ''
            });

    //Botão deletar dados  
    if (tabelaManterDados.botaoDeletar) {
        $('#tabelaDadosManterDados').jqGrid('navButtonAdd',
                tabelaPaginacao, {
                    caption: "",
                    buttonicon: "ui-icon-trash",
                    onClickButton: deletarDado,
                    position: "last",
                    title: "Deletar dado",
                    cursor: "hand"
                });
    }

    //Botão editar dados                        
    if (tabelaManterDados.botaoEditar) {
        $('#tabelaDadosManterDados').jqGrid('navButtonAdd',
                tabelaPaginacao, {
                    caption: "",
                    buttonicon: "ui-icon-pencil",
                    onClickButton: editarDado,
                    position: "last",
                    title: "Editar dado",
                    cursor: "hand"
                });

    }

    //Botão de adicionar Dados   
    if (tabelaManterDados.botaoAdicionar) {
        $('#tabelaDadosManterDados').jqGrid('navButtonAdd',
                tabelaPaginacao, {
                    caption: "",
                    buttonicon: "ui-icon-plusthick",
                    onClickButton: adicionarDado,
                    position: "last",
                    title: "Adicionar dado",
                    cursor: "hand"
                });
    }

    $('#tabelaDadosManterDados').navSeparatorAdd(tabelaPaginacao,
            {
                sepclass: 'ui-separator',
                sepcontent: ''
            });



});