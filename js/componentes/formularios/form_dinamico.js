
function CampoDinamico(campo) {
    this.j = 0;
    this.i = 0;
    this.base = campo.replace('#', '');
    that = this;
    this.campos = '';
    this.botaoApagar = true;
    this.campo = campo;
    this.contador = false;
    this.tabela = false;


    this.criaBotao = function(botao) {
        $(botao).click($.proxy(function(e) {
            e.preventDefault();
            var htmlFinal = this.campos.replace(/\{\$contador\}/g, this.j);
            if (this.botaoApagar) {
               if(!this.tabela){
                    htmlFinal += '<a id="apagar' + this.i + this.base + '" href="#"  >[X]</a>';
               }else{
                   htmlFinal += '<td><a id="apagar' + this.i + this.base + '" href="#"  >[X]</a></td>';
               }
            }

            if (this.contador) {
                htmlFinal = '<label><span class="label" >[' + this.j + ']</label>' + htmlFinal;
            }
            if(!this.tabela){
                this.adicionaCampos('<div style="clear:both">' + htmlFinal + '</div>', this.campo);
            }else{
                this.adicionaCampos('<tr>' + htmlFinal + '</tr>', this.campo);
            }

            this.removeCampos(this.i);
            this.i++;
            return false;
        }, this));
    }

    this.adicionaCampos = function(campos, onde) {

        this.j++;
        $(campos).appendTo(onde);
    };

    this.removeCampos = function(i) {
        $('#apagar' + i + this.base).click($.proxy(function(e) {
            e.preventDefault();
            if(!this.tabela){
            $(e.target).parent().remove();
            }else{
                //$(e.target).closest('tr').remove();
                $(e.target).parent().parent().remove();
            }
            this.j--;
            var elementos = $(this.campo + ' div');
            for (var k = 0; k < elementos.length; k++) {
                $(".label", elementos[k]).html('[' + k + ']');
            }
            return false;
            return false;
        }, this));

      
    }

    this.addCampos = function(campoParaAdd) {
        this.campos += campoParaAdd;

    };
}

//                campo = new campoDinamico("#grupoTerceiro"); //Div que sera adicionada
//                campo.addCampos('<label>Nome:</label>');
//                campo.addCampos('<input type="text"/>');
//                campo.addCampos('<input type="button" value="=]"/>');
//                campo.contador = true;
//                campo.criaBotao("#adicionarPessoa");