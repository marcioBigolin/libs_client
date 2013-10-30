function editarDado(com, grid){
    a = $('.trSelected',grid);
    id = a[0].id;

    location.href = tabelaManterDados.acaoEditarDado + '?id=' + id.replace('row', '');
}

function adicionarDado(){
    location.href = tabelaManterDados.acaoAdicionarDado;
}

function deletarDado(com, grid){
    if(window.confirm("Tem certeza que deseja deletar os dados selecionados?")){
        var a = $('.trSelected',grid); 
        id = a[0].id;
        location.href = tabelaManterDados.acaoDeletarDado + '?id=' + id.replace('row', '');
    }else{
        alert("Operação cancelada.");
    }
}

botoes = new Array();
if(tabelaManterDados.botaoAdicionar){
    botoes.push({ name: 'Adicionar', bclass: 'adicionarIco', onpress: adicionarDado });
}

if(tabelaManterDados.botaoEditar){
    botoes.push({ name: 'Editar', bclass: 'editarIco', onpress: editarDado });
}

if(tabelaManterDados.botaoDeletar){
    botoes.push({ name: 'Deletar', bclass: 'deletarIco', onpress: deletarDado });
}

botoes.push( {separator: true});
$("#tabela").flexigrid({
    url: tabelaManterDados.dados,
    dataType: 'json',
    colModel: tabelaManterDados.colunas,
    buttons: botoes,
    searchitems: tabelaManterDados.camposPesquisa,
    usepager: true,
    title: tabelaManterDados.titulo,
    useRp: true,
    singleSelect: tabelaManterDados.selecaoSimples,
    rp: 10,
    showTableToggleBtn: true,
    width: '620',
    height: 200
});
