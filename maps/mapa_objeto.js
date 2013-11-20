/**
 * 
 * @param {type} nome
 * @param Integer id - id da camada
 * @returns {ItemLegenda}
 */
function ItemLegenda(nome, id) {
    this.idCamada = id;
    this.nome = nome;
    this.icone = 'linha.png';
    this.geradorIcone = false;
    this.cluster = false;
    this.subItem = false;
    this.style = false;
    this.checked = true;
    this.rota = new Rota();
    this.setaDistancia = function(){
        var dist  = this.rota.distancia / 1000;
        dist = dist.toFixed(2) + ' Km';
        $('#distanciaRota'+this.idCamada).val(dist);
    };
}

function Rota(id) {
    this.idRota = id;
    this.nome = false;
    this.geometria = false;
    this.pontosSelecionados = new Array();
    this.tipoRota = 1;
    this.layer = false;
    this.cor = null;
    this.ordem = new Array();
    this.distancia = 0;
}

function Caminho() {
    //Atualiza a variavel caminho das imagens
    this.imagens = "imagens/";
    // Caminho do local onde estão os arquivos kml
    this.KML = '../dados_geograficos/sct/';
    //caminho servidor
    this.base = '';
    //executor
    this.executor = false;

    this.getExecutor = function() {
        return this.base + this.executor;
    }

    this.getImagem = function() {
        return this.base + this.imagens;
    }
}
function tamanhoMapa() {
    var altura = $("body").height() - 45;
    $("#" + this.idMapa).css('height', altura);
    $("#principal").css('height', altura);
}

function estiloCluster(icone) {
    var colors = {
        low: "rgb(181, 226, 140)",
        middle: "rgb(241, 211, 87)",
        high: "rgb(253, 156, 115)"
    };


    //             externalGraphic: "${getIco}",
    //        graphicWidth: 20,
    //        graphicHeight: 20,
    //        fillOpacity: 1,
    //        fontColor:"#000000",
    //        yOffset:"80",
    //        fontSize:12,
    //        label:"${getLabel}"
    // Define three rules to style the cluster features.
    var unique = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: "count",
            value: 1
        }),
        symbolizer: {
            externalGraphic: icone[0],
            fillColor: colors.low,
            fillOpacity: 0.9,
            strokeColor: colors.low,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 10,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#000000",
            fontSize: "9px",
            fontWeight: 'bold'
        }
    });
    var lowRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            //type: OpenLayers.Filter.Comparison.LESS_THAN ,
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: "count",
            lowerBoundary: 2,
            upperBoundary: 16
                    //value: 15
        }),
        symbolizer: {
            externalGraphic: icone[1],
            fillColor: colors.low,
            fillOpacity: 0.9,
            strokeColor: colors.low,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 10,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#000000",
            fontSize: "9px",
            fontWeight: 'bold'

        }
    });

    var middleRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.BETWEEN,
            property: "count",
            lowerBoundary: 15,
            upperBoundary: 50
        }),
        symbolizer: {
            externalGraphic: icone[2],
            fillColor: colors.middle,
            fillOpacity: 0.9,
            strokeColor: colors.middle,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 15,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#000000",
            fontWeight: 'bold',
            fontSize: "9px"
        }
    });
    var highRule = new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.GREATER_THAN,
            property: "count",
            value: 50
        }),
        symbolizer: {
            externalGraphic: icone[3],
            fillColor: colors.high,
            fillOpacity: 0.9,
            strokeColor: colors.high,
            strokeOpacity: 0.5,
            strokeWidth: 12,
            pointRadius: 20,
            label: "${count}",
            labelOutlineWidth: 1,
            fontColor: "#000000",
            fontSize: "9px",
            fontWeight: 'bold'

        }
    });

    // Create a Style that uses the three previous rules
    var style = new OpenLayers.Style(null, {
        rules: [unique, lowRule, middleRule, highRule]
    });

    return style;
}

function camada(tipo) {
    /**
     * 1 = VectorLayer
     * 2 = MapServer
     *
     * @var Integer 
     */
    this.tipo = tipo;
    this.alteraCorBorda = function() {
        if (this.tipo == 1) {

        }
    };
    this.alteraCorPreenchimento = function() {
    };
    this.alteraTransparencia = function() {
    };
}


function itemSelect(value, label) {
    this.value = value;
    this.label = label;
    this.subArvore = new Array();
}

//Objeto Mapa
function Mapa(mapa) {
    this.legenda = new Array();

    this.caminho = new Caminho();

    //Vetor de camadas
    this.camadas = new Array();
    this.editaRota = new Array();

    //Vetor de features para camadas de 
    this.features = new Array();

    //Vetor de styles para camadas de 
    this.styles = new Array();

    //contador de idCamada
    this.id = 0;

    //arvore dimensoes e atributos
    this.dim = new Array();

    //


    //O Mapa
    this.idMapa = mapa;
    this.map = new OpenLayers.Map(mapa,
            {
                maxExtent:
                        new OpenLayers.Bounds(-5804847.164511,
                        -3541988.011926,
                        -5544447.164511,
                        -3301649.645208),
                maxResolution: 401.232666
            }
    );

    //Projeções
    this.deProj = new OpenLayers.Projection("EPSG:4326"); // transform from WGS 1984
    this.paraProj = new OpenLayers.Projection("EPSG:3857"); // to Spherical Mercator Projection

    this.setMapa = function(mapa) {
        this.map = mapa;
    }



    this.iniciaMapa = function() {

        this.map.addControl(new OpenLayers.Control.LayerSwitcher({
            'ascending': false
        }));
        var position = new OpenLayers.LonLat(-5724847, -3365618);
        var zoom = 10;
        var gmaps = new OpenLayers.Layer.Google(
                "Google Hybrid",
                {
                    type: google.maps.MapTypeId.SATELLITE,
                    numZoomLevels: 30
                }
        );
        this.map.addLayer(gmaps);
        this.map.setCenter(position, zoom);
        
    };

    this.adicionaCamada = function(camada) {
        this.map.addLayer(camada);
        this.id++;
        this.camadas[this.id] = camada;
        return this.id;
    };
    
    this.adicionaLoaderCamada = function(){
        this.id++;
        this.camadas[this.id] = false;
        return this.id;
    }

    this.adicionaItemLegenda = function(itemLegenda) {
        //this.legenda.push(itemLegenda);
        var that = this;       
        if(itemLegenda.idCamada == -1){
            itemLegenda.idCamada =  this.adicionaLoaderCamada();
            itemLegenda.checked = false;
        }
        
        var id = itemLegenda.idCamada;
        this.legenda[id]= itemLegenda;
        
        //itemLegenda = new ItemLegenda('teste');
        var icone = this.caminho.base + this.caminho.imagens + itemLegenda.icone;
        var html = '<li id="itemDaLegenda'+id+'"> <label>';
        html += ' <input type="checkbox" id="layer' + id + '" class="mapOverlays"';
        if (itemLegenda.checked) {
            html += ' checked="checked" ';
        }
        html += ' /> <span id="icone' + id + '" class="icone" ';
        html += 'style="background-image:url(' + icone + ')"> </span>';
        html += itemLegenda.nome + " </label>";

        if (itemLegenda.cluster) {
            html = html.substring(0, (html.length - 8))
            html += '<sub><a href="#" id="maisCluster' + id + '" class="maisCluster">[-] Cluster</a></sub></label>';
            html += '<ul class="clusterOption" id="clusterOption' + id + '"> <li> <label class="makeCluster">';
            html += '    <input type="checkbox"  name="cluster' + id + '" ';
            html += '              id="makeCluster' + id + '" />Make Cluster</label><ul class="legendaCluster">';
            var tam = 20;
            for (var a in itemLegenda.geradorIcone) {
                html += '<li> <img src="' + itemLegenda.geradorIcone[a] + '" width="' + tam + '" height="' + tam + '"/>  </li>';
                tam += 3;
            }
            html += '</ul>  <div style="clear:both"></div>';
            html += ' </li> <li class="restricoesCluster">';
            html += '   <label class="camposRestricao"> Dimension';
            html += '     <select name="dimension' + id + '" id="dimension' + id + '">';
            //              for(var a in this.dim){
            //                  
            //              }
            html += '               <option value="political">Political</option>';
            //                <option value="fisic">Fisic - Hidrographyc</option>
            html += '           </select> </label>';
            html += '          <label class="camposRestricao">Rule';
            html += '     <select name="restricao' + id + '" id="restricao' + id + '">';
            html += '                                                    <option value="town">Town</option>';
            //                                                    <option>Micro-region</option>
            //                                                    <option>Corede</option>
            //                                                    <option>Estado</option>
            //                                                    <option>País</option>
            html += '     </select> </label>';
            html += ' <p style="margin-top: 12px; text-indent: 2px;">';
            html += '<a href=""  title="Adicionar restrição"  > AND </a></p>';

            html += '<label class="campoRestricaoSlider">Size cluster:';
            html += '<input type="text" id="valorSliderCluster' + id + '" />';

            html += '<div id="sliderCluster' + id + '"></div></label><p class="duplicarCluster"><a href="" title="Duplicar plano de informação"> [+] Duplicate</a></p>';
            html += '</li></ul><div style="clear:both"></div>';
        }
        if (itemLegenda.style) {
            html += '<ul class="acoesRotas">'
            html += '<li><a href="#editarRota" id="botaoEditarRota' + id + '" class="botaoEditarRota">Editar</a></li>';
            html += '<li><a href="#salvarRota" id="botaoSalvarRota' + id + '" class="botaoSalvarRota" >Salvar</a></li>';
            html += '<li><a href="#editarDadosRota" id="botaoEditarDadosRota' + id + '" class="botaoEditarDadosRota">Dados</a></li>';
            html += '<li><a href="#editarEstiloRota" id="botaoEditarEstiloRota' + id + '" class="botaoEditarEstiloRota">Estilos</a></li>';
            html += '<ul> <div class="clear" />'
            html += '<fieldset class="infoRapida"> <legend>Informações</legend>';
            html += '<label>Distância: <input type="text" id="distanciaRota'+id+'" /></label>';
            html += '<label>Ordem: <div id="ordemLista'+id+'"></div></label></fieldset>';
            html += '<label>Tipo:<input type"text" id="labelTipoRota"'+id+'"/></label>'
            
            html += '<fieldset id="estiloCaixa' + id + '" class="estiloCaixa"> <legend>Estilos</legend>';
            html += '<div id="colorSelector' + id + '" class="colorpickerButtom">Trocar Cor</div>';
            html += '<label class="transparencia">Transparência';
            html += '<div id="sliderTransp' + id + '"></div>';
            html += '<input type="text" id="valorSliderTransp' + id + '" class="sliderValor" value="0"/>';
            html += '</label></fieldset>';
        }

        html += '</li>'
        $("#legendaMapa .raiz").prepend(html);
        $('#layer' + id).click(
                function() {
                    if ($('#layer' + id).is(":checked")) {
                        if(that.camadas[id] === false){
                            mostrarRotaSemLegenda(that.legenda[id].rota.idRota);
                        }
                        that.camadas[id].setVisibility(true);
                    } else {
                        that.camadas[id].setVisibility(false);
                        
                    }
                }
        );

        if (itemLegenda.icone === 'linha.png') {
            $('#icone' + id).css('backgroundColor', '#f00');
        }
        if (itemLegenda.style) {

            $('#botaoEditarEstiloRota' + id).click(function() {
                $("#estiloCaixa" + id).toggle("slow");
            });

            $("#botaoSalvarRota" + id).click(
                    function() {
                        //alert(id);
                        if (itemLegenda.rota.tipoRota === 1) {
                            salvarRota(itemLegenda.rota);
                        } else {
                            salvarRotaOtimizada(itemLegenda.rota);
                        }
                        //alert("Rota salva com sucesso!");
                        return true;
                    }
            );

            $("#botaoEditarDadosRota" + id).click(
                    function() {
                        dadosRota(itemLegenda.rota);
                    }
            );

            if (typeof this.camadas[id] !== 'undefined') {
                this.editaRota[id] = new OpenLayers.Control.ModifyFeature(
                        this.camadas[id], {
                    clickout: false, standalone: false}
                );

                this.map.addControl(this.editaRota[id]);
            }
            
            $("#botaoEditarRota" + id).click(
                    function() {
                        if (that.editaRota[id].active) {
                            //Se for descomentar isso, vai perder os vértices ao mudar de cor.
//                            that.camadas[id].styleMap = new OpenLayers.Style({
//                                strokeColor: that.camadas[id].cor,
//                                strokeWidth: 4
//                            });
                            that.editaRota[id].deactivate();
                            that.camadas[id].redraw();
                            return 1;
                        } else {
                            that.editaRota[id].activate();
                            that.camadas[id].redraw();
                        }
                    });

            //$('#icone'+id).css('backgroundColor', '#f00');
            $('#colorSelector' + id).ColorPicker({
                color: '#0000ff',
                onShow: function(colpkr) {
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function(colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function(hsb, hex, rgb) {
                    $('#icone' + id).css('backgroundColor', '#' + hex);
                    that.camadas[id].styleMap = new OpenLayers.StyleMap(
                            new OpenLayers.Style({
                        strokeColor: "#" + hex,
                        strokeWidth: 4
                    })
                            );
                    that.camadas[id].cor = "#" + hex;
                    that.camadas[id].redraw();
                }
            });
            $('#sliderTransp' + id).slider({
                value: 0,
                min: 0,
                max: 100,
                step: 5,
                slide: function(event, ui) {
                    $("#valorSliderTransp" + id).val(ui.value);
                }
            });
        }
        if (itemLegenda.cluster) {
            $('#dimension' + id).change(function() {
                alert(dim[$(this).val()]);
                var restrict = dim[$(this).val()];
                for (var a in restrict) {
                    $('#restrict' + id).append('<option value="' + a + '">' + restrict[a] + '</option>');
                }
            });
            this.features[id] = this.camadas[id].features;
            this.styles[id] = this.camadas[id].styleMap;
            itemLegenda.maisCluster = true;
            $("#valorSliderCluster" + id).val(25);
            $('#sliderCluster' + id).slider({
                value: 25,
                min: 0,
                max: 100,
                step: 5,
                slide: function(event, ui) {
                    $("#valorSliderCluster" + id).val(ui.value);
                }
            });
            $('#maisCluster' + id).click(function() {

                if (itemLegenda.maisCluster) {
                    $('#clusterOption' + id).show('fast');
                    $('#maisCluster' + id).html('[-] Cluster');
                    itemLegenda.maisCluster = false;
                } else {
                    $('#clusterOption' + id).hide('fast');
                    $('#maisCluster' + id).html('[+] Cluster');
                    itemLegenda.maisCluster = true;
                }
                return false;
            });
            $('#makeCluster' + id).click(
                    function() {
                        that.map.removeLayer(that.camadas[id]);
                        var layer;
                        if ($('#makeCluster' + id).is(':checked')) {

                            layer = new OpenLayers.Layer.Vector("Features", {
                                strategies: [
                                    new OpenLayers.Strategy.AnimatedCluster({
                                        distance: 30,
                                        animationMethod: OpenLayers.Easing.Expo.easeOut,
                                        animationDuration: 20
                                    })

                                ],
                                styleMap: new OpenLayers.StyleMap(
                                        estiloCluster(
                                        itemLegenda.geradorIcone
                                        ))
                            });
                        } else {
                            layer = new OpenLayers.Layer.Vector("Features", {
                                strategies: [],
                                styleMap: that.styles[id],
                                cor: null
                            });
                        }
                        that.camadas[id] = layer;
                        that.map.addLayer(layer)
                        layer.addFeatures(that.features[id])
                    }
            );
        }
    };

    this.adicionaCamadaPontoJson = function(url, icone) {

        var vector = new OpenLayers.Layer.Vector("Features", {
            protocol: new OpenLayers.Protocol.HTTP({
                url: url,
                format: new OpenLayers.Format.GeoJSON()
            }),
            styleMap: new OpenLayers.StyleMap({
                externalGraphic: icone,
                graphicWidth: 20,
                graphicHeight: 20,
                fillOpacity: 1

            }),
            renderers: ['Canvas', 'SVG'],
            strategies: [new OpenLayers.Strategy.Fixed()]
        });


        return this.adicionaCamada(vector);
    }

    this.adicionaCamadaMapServer = function(url) {
        var layer = new OpenLayers.Layer.MapServer(
                "OpenLayers WMS",
                url,
                {
                    layers: 'limiteMunicipal',
                    //srs: 'EPSG:3857', 
                    //projection: new OpenLayers.Projection("EPSG:3857"),
                    transparent: true,
                    format: 'image/png'
                },
        {
            isBaseLayer: false,
            alpha: true,
            visibility: true,
            opacity: 1,
            singleTile: false,
            ratio: 1
        });

        return this.adicionaCamada(layer);
    }

    this.adicionaCamadaKML = function(camada) {
        var url = this.caminho.KML + camada + '.kml';
        var vector = new OpenLayers.Layer.Vector("KML", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: url,
                format: new OpenLayers.Format.KML({
                    extractStyles: false,
                    extractAttributes: false
                })
            })
        });
        return this.adicionaCamada(vector);
    };

    this.adicionaCamadaPonto = function(nome) {
        var vector = new OpenLayers.Layer.Vector(nome, {
            renderers: ['Canvas', 'SVG']
        });
        return this.adicionaCamada(vector);
    };

    this.adicionaPontoEmCamada = function(idCamada, px, py) {
        var pointGeometry = new OpenLayers.Geometry.Point(px, py);
        var pointFeature = new OpenLayers.Feature.Vector(pointGeometry);
        this.camadas[idCamada].push([pointFeature]);
    };
}


function fixarRota() {
    var val = parseInt($("#principal").css('width'));
    var altura = parseInt($("#principal").css('height'));
    if (!rotaFixa) {
        rotaFixa = true;
        $("#rotas").dialog('destroy');
        var medida = '' + (val - 320) + 'px';
        $("#rotas").css('width', '300px');
        $("#rotas").css('height', altura);
        $("#rotas").css('float', 'right');
        $("#rotas").css('overflow', 'scroll');
        $("#mapa").css('width', medida);
        $("#mapa").css('float', 'left');
        $("#fixarRotas").html('[Desafixar]')
    } else {
        rotaFixa = false;
        $("#mapa").css('width', val);
        $("#rotas").css('height', 'auto');
        $("#rotas").dialog({
            autoOpen: true,
            width: 600,
            height: 510,
            modal: false
        });

        $("#fixarRotas").html('[Fixar]')
    }
}

$(document).ready(
        function() {
            $("#rotas").dialog({
                autoOpen: false,
                width: 600,
                height: 510,
                modal: false
            });
            rotaFixa = false;
            fixarRota();
            $("#fixarRotas").click(function() {
                fixarRota();
            });

        });




function Loader()
{
    this.show = function() {
        //        $.blockUI({
        //            message:  'Carregando...',
        //            css : {
        //                border:'none',
        //                padding:'15px',
        //                backgroundColor:'#000',
        //                '-webkit-border-radius':'10px',
        //                '-moz-border-radius':'10px',
        //                opacity:'.5',
        //                color:'#fff'
        //            }
        //        });
    }

    this.hide = function() {
        //        $.unblockUI();
    }
}

//Funcões legenda
function abrirMaisCluster(obj) {
    var classe = obj.href.split("#");
    classe = classe[1];
    if (isFechado(classe)) {
        $('.' + classe + ' .clusterOption').show('fast');
        $(obj).html('[-] Cluster');
    } else {
        $('.' + classe + ' .clusterOption').hide('fast');
        $(obj).html('[+] Cluster');
    }

}

function isFechado(classe) {
    if (pontosCluster[classe]) {
        pontosCluster[classe] = false;
        return true;
    }
    pontosCluster[classe] = true;
    return false;
}