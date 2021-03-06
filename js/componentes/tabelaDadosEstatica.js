function getIndiceTabela(grid){
    idTabela = $('.bDiv table', grid).attr('id');
    i = 0;
    for(tab in tabela){
        if(tabela[tab].idTabela == idTabela){
            i = tab;
            break;
        }
    }
    return i;
}

function dadosSelecionadosUrl(grid){
    selecionados = $('.trSelected', grid);
    url = "";
    $.each(selecionados, function(i) {
        url += "&dado["+i+"]=" + selecionados[i].id.replace('row', '');
    });

    return url;
}

function gerarGrafico(teste, grid){
    i = getIndiceTabela(grid);
    if(tabela[i].graficoDinamico){
        dadosSelecionados = dadosSelecionadosUrl(grid);
        if(dadosSelecionados == 0){
            //alert("Gerar Gráfico!");
            alert("Você deve escolher pelo menos uma linha na tabela!");
            return false;
        }
    }else{
        dadosSelecionados = '';
    }

    $.ajax(
    {
        url: tabela[i].acaoGerarGrafico+dadosSelecionados,
        success: function(data) {
            $('#graficoGerado').html(data);
        },
        error: function(data){
            $('#graficoGerado').html('<p class="erro">Problemas ao carregar o site. Tente novamente mais tarde!</p>');
        }
    }
    );
    $("#graficoGerado").dialog('open');
}

function exportarPDF(teste, grid){
    i = getIndiceTabela(grid)
    location.href = tabela[i].acaoExportarPDF;
}

function gerarCSV(teste, grid){
    i = getIndiceTabela(grid)
    location.href = tabela[i].acaoGerarCSV;
}

function imprimir(teste, grid){
    i = getIndiceTabela(grid)
    window.open(tabela[i].acaoImprimir, 'impressao', 'width=800,height=500,scroll=yes');
}

for(tab in tabela){
    botoes = new Array();
    if(tabela[tab].botaoImprimir){
        botoes.push({
            name: 'Imprimir', 
            bclass: 'imprimirIco',
            onpress: imprimir
        });
    }

    if(tabela[tab].botaoGerarCSV){
        botoes.push({
            name: 'Gerar CSV', 
            bclass: 'gerarCSVIco',
            onpress: gerarCSV
        });
    }

    if(tabela[tab].botaoExportarPDF){
        botoes.push({
            name: 'Exportar PDF',
            bclass: 'exportarPDFIco',
            onpress: exportarPDF
        });
    }
    botoes.push( {
        separator: true
    });
    if(tabela[tab].botaoGerarGrafico){
        botoes.push({
            name: 'Gerar gráfico',
            bclass: 'gerarGraficoIco',
            onpress: gerarGrafico
        });
    }

    $("#"+tabela[tab].idTabela).flexigrid({
        // colModel: tabela[tab].colunas,
        buttons: botoes,
        usepager: false,
        title: tabela[tab].titulo,       
        singleSelect: tabela[tab].selecaoSimples,
        showTableToggleBtn: true,
        width: "100%",
        height: 240
    });

}
$(document).ready(function()
{

    $("#graficoGerado").dialog({
        autoOpen: false,
        width: 600,
        height: 510,
        modal: true
    });

});