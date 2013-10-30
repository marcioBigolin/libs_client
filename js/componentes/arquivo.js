if(window.jsTreeAbertos == null){
    window.jsTreeAbertos =  new Array();
}
$('#arvoreArquivo').
    jstree({
        "plugins" : [ "themes", "html_data", 'ui' ],
        "core" : {
            "initially_open" : jsTreeAbertos,
            'animation': 80
        }
    }).bind("select_node.jstree", function (event, data) {
        // `data.rslt.obj` is the jquery extended node that was clicked
        classes = data.rslt.obj.attr("class").split(" ", 1);
        classe = classes[0];
        if(classe == "folder"){
            id = '#' + data.rslt.obj.attr("id");
            $.jstree._reference(id).open_node(id);
        }else{
            id = data.rslt.obj.attr("id");
            $.ajax(
            {
                url: '/admin/arquivo/getArquivo?id='+id,
                success: function(data) {
                    $('#telaArquivo').html(data);
                },
                error: function(data){
                    $('#telaArquivo').html('<p class="erro">Problemas ao carregar o arquivo. Tente novamente mais tarde!</p>');
                }
            }
            );
        }
    }
    ).delegate("a", "click", function (event, data) { 
        event.preventDefault();
    });

