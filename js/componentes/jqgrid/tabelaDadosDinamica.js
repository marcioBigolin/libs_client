function getIndiceTabela(a) {
    btId = a.currentTarget.id;
    bt = btId.split('_');
    return bt[1];
}

function getIdTabela(tab) {
    return "#tabelaDados" + tabela[tab].idTabela;
}

function dadosSelecionadosUrl(grid) {
    selecionados = $('.trSelected', grid);
    url = "";
    $.each(selecionados, function(i) {
        url += "&dado[" + i + "]=" + selecionados[i].id.replace('row', '');
    });

    return url;
}

function gerarGrafico(a) {

    url = '';
    i = getIndiceTabela(a);
    if (tabela[i].gerarGraficoSemConfirmacao == true) {
        dadosSelecionados = '';
    } else {
        id = $(getIdTabela(i)).jqGrid('getGridParam', 'selarrrow');
        var cont = 0;
        $.each(id, function(a) {
            url += "&dado[" + cont + "]=" + id[cont];
            cont++;
        });
        if (url == '') {
            alert("Você deve escolher pelo menos uma linha na tabela!");
            return false;
        }
    }

    if (tabela[i].graficoDinamico) {
        dadosSelecionados = dadosSelecionadosUrl(a);
        if (dadosSelecionados == 0) {
            alert("Você deve escolher pelo menos uma linha na tabela!");
            return false;
        }
    } else {
        dadosSelecionados = '';
    }

    requisicao = $.ajax(
            {
                url: tabela[i].acaoGerarGrafico + url,
                type: 'get',
                dataType: "html"
            }
    );

    requisicao.done(function(data) {
        $('#graficoGerado').html(data);
    });
    requisicao.fail(function(jqXHR, textStatus) {
        $('#graficoGerado').html('<p class="erro">Problemas ao carregar o site. Tente novamente mais tarde!</p>');
    });
    $("#graficoGerado").dialog('open');
    return true;


}

function exportarPDF(a) {
    i = getIndiceTabela(a)
    location.href = tabela[i].acaoExportarPDF;
}

function gerarCSV(a) {
    i = getIndiceTabela(a);
    $(getIdTabela(i)).jqGrid('excelExport', {
        tag: 'csv', url: tabela[i].acaoGerarCSV
    });
    //location.href = tabela[i].acaoGerarCSV;
}

function imprimir(a) {
    i = getIndiceTabela(a);
    window.open(tabela[i].acaoImprimir, 'impressao', 'width=800,height=500,scroll=yes');
}

function editar(a) {
    i = getIndiceTabela(a);
    var id = $(getIdTabela(i)).jqGrid('getGridParam', 'selrow');
    if (id) {
        location.href = tabela[i].acaoEditar + '?id=' + id;
    } else {
        alert("Por favor selecione um dado!");
    }
}

function deletar(a) {
    i = getIndiceTabela(a)
    var id = $(getIdTabela(i)).jqGrid('getGridParam', 'selrow');
    if (id) {
        if (window.confirm("Tem certeza que deseja apagar o arquivo? \n Essa ação é irreversível.")) {
            location.href = tabela[i].acaoDeletar + '?id=' + id;
        } else {
            return false;
        }
    } else {
        alert("Por favor selecione um dado!");
    }
}


$(document).ready(function()
{
    largura = parseInt($('#conteudo').css('width'));

    for (tab in tabela) {
        tabelaPaginacao = "#tabelaPaginacao" + tabela[tab].idTabela;
        idTabela = getIdTabela(tab);

        objeto = {
            url: tabela[tab].dados,
            datatype: 'json',
            mtype: 'POST',
            colNames: tabela[tab].labelsColunas,
            colModel: tabela[tab].colunas,
            multiselect: tabela[tab].selecaoSimples,
            usepager: true,
            sortable: tabela[tab].ordenavel,
            useRp: true,
            caption: tabela[tab].titulo,
            pager: tabelaPaginacao,
            rowNum: 300,
            autowidth: false,
            width: largura,
            height: tabela[tab].altura,
            rowList: [80, 160, 200],
            viewrecords: true,
            showTableToggleBtn: true
        };

        $('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow', 'auto');


        $(idTabela).jqGrid(objeto);

        $(idTabela).jqGrid('gridResize', {
            minWidth: 500,
            maxWidth: largura,
            minHeight: 80,
            //maxHeight: 800
        });

        $(idTabela).jqGrid('setFrozenColumns');


        navegacao = $('#tabelaDados' + tabela[tab].idTabela).navGrid(
                tabelaPaginacao,
                {
                    search: true,
                    edit: false,
                    add: false,
                    del: false,
                    refresh: false
                },
        {caption: "Buscar"}, {}, {},
                {
                    closeOnEscape: true,
                    multipleSearch: true,
                    closeAfterSearch: true
                }
        );

        $('#tabelaDados' + tabela[tab].idTabela).navSeparatorAdd(tabelaPaginacao,
                {
                    sepclass: 'ui-separator',
                    sepcontent: ''
                });
        if (tabela[tab].filtrar){    
            $('#tabelaDados' + tabela[tab].idTabela).jqGrid('filterToolbar',{stringResult: true,searchOnEnter : false});
        }

        //Botão editar dados  
        if (tabela[tab].botaoEditar) {
            navegacao.navButtonAdd(
                    tabelaPaginacao, {
                caption: "Editar",
                buttonicon: "ui-icon-pencil",
                onClickButton: editar,
                position: 'last',
                title: "Editar informação",
                cursor: "hand",
                id: "btEditar_" + tab
            });
        }

        if (tabela[tab].botaoDeletar) {
            navegacao.navButtonAdd(
                    tabelaPaginacao, {
                caption: "Deletar",
                buttonicon: "ui-icon-trash",
                onClickButton: deletar,
                position: 'last',
                title: "Deletar informação",
                cursor: "hand",
                id: "btDeletar_" + tab
            });
        }
        if (tabela[tab].botaoImprimir) {
            navegacao.navButtonAdd(
                    tabelaPaginacao, {
                caption: "Imprimir",
                buttonicon: "ui-icon-print",
                onClickButton: imprimir,
                position: "last",
                title: "Imprimir",
                cursor: "hand",
                id: "btPrint_" + tab
            });
        }

        if (tabela[tab].botaoGerarGrafico) {
            navegacao.navButtonAdd(
                    tabelaPaginacao, {
                caption: "Gráfico",
                buttonicon: "gerarGraficoIco",
                onClickButton: gerarGrafico,
                title: "Gerar gráfico",
                position: 'last',
                cursor: "hand",
                id: "btGrafico_" + tab
            });

        }
        $('#tabelaDados' + tabela[tab].idTabela).navSeparatorAdd("#tabelaPaginacao" + tabela[tab].idTabela,
                {
                    sepclass: 'ui-separator',
                    sepcontent: ''
                });
        if (tabela[tab].botaoGerarCSV) {
            navegacao.navButtonAdd(
                    tabelaPaginacao, {
                caption: "CSV",
                buttonicon: "gerarCSVIco",
                onClickButton: gerarCSV,
                position: "last",
                title: "Gerar CSV",
                cursor: "hand",
                id: "btGerarCsv_" + tab
            });
        }

        if (tabela[tab].botaoExportarPDF) {
            navegacao.navButtonAdd(
                    tabelaPaginacao, {
                caption: "PDF",
                buttonicon: "exportarPDFIco",
                onClickButton: exportarPDF,
                position: "last",
                title: "Exportar PDF",
                cursor: "hand",
                id: "btExportar_" + tab
            });
        }
    }

    $("#graficoGerado").dialog({
        autoOpen: false,
        width: 600,
        height: 510,
        modal: true
    });

});

