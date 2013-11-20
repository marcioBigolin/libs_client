//Estrutura das opções

function ItemLegenda(nome, id) {
    this.nome = nome;
    this.icone = 'linha.png';
    this.geradorIcone = false;
    this.cluster = false;
    this.subItem = false;
    this.style = false;
    this.idCamada = id;
    this.checked = true;
    this.dim = new Array();
    this.click = false;
}

function Caminho() {
    //Atualiza a variavel caminho das imagens
    this.imagens = "imagens/mapa/";
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

    //Vetor de features para camadas de 
    this.features = new Array();

    //Vetor de styles para camadas de 
    this.styles = new Array();

    //contador de idCamada
    this.id = 0;


    this.popUp = false;

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


        var position = new OpenLayers.LonLat(-5685361.54, -3382739.89);
        var zoom = 11;
        var gmaps = new OpenLayers.Layer.Google(
                "Google Hybrid",
                {
                    type: google.maps.MapTypeId.SATELLITE,
                    numZoomLevels: 30
                }
        );
        this.map.addLayer(gmaps);

        this.map.setCenter(position, zoom);

        this.map.addControl(
                new OpenLayers.Control.MousePosition({
            prefix: '<a target="_blank" ' +
                    'href="http://spatialreference.org/ref/epsg/4326/">' +
                    'EPSG:4326</a> coordinates: ',
            separator: ' | ',
            numDigits: 2,
            emptyString: 'Mouse is not over map.'
        })
                );
    };

    this.adicionaCamada = function(camada) {
        this.map.addLayer(camada);
        this.id++;
        this.camadas[this.id] = camada;
        return this.id;
    }

    this.adicionaItemLegenda = function(itemLegenda) {
        this.legenda.push(itemLegenda);
        var that = this;
        var id = itemLegenda.idCamada;
        var dim = itemLegenda.dim;
        //itemLegenda = new ItemLegenda('teste');
        var icone = this.caminho.base + this.caminho.imagens + itemLegenda.icone;
        var html = '<li> <label>';
        html += ' <input type="checkbox" id="layer' + id + '" class="mapOverlays"';
        if (itemLegenda.checked) {
            html += ' checked="checked" ';
        }
        html += ' /> <span id="icone' + id + '" class="icone" ';
        html += 'style="background-image:url(' + icone + ');"> </span>';
        html += itemLegenda.nome + " </label>";


        html += '</li>'

        $("#legendaMapa .raiz").prepend(html);
        $('#layer' + id).click(
                function() {
                    if ($('#layer' + id).is(":checked")) {
                        that.camadas[id].setVisibility(true);
                    } else {
                        that.camadas[id].setVisibility(false);
                    }
                }
        );


        if (itemLegenda.icone == 'linha.png') {
            $('#icone' + id).css('backgroundColor', '#f00');
        }

        if (itemLegenda.click)
            this.adicionaEventoClick(this.camadas[id]);
    };

    /**
     * Função que realiza a troca de camada por uma com caracteristicas diferentes
     * 
     * @returns none
     */
    this.changeLayer = function(layer, id) {
    };

    this.adicionaEventoClick = function(camada) {
        this.select = new OpenLayers.Control.SelectFeature(camada);
        //Isso aqui agente tem la no catadores.
        camada.events.on({
            "featureselected": this.onFeatureSelect,
            "featureunselected": this.onFeatureUnselect
        });

        this.map.addControl(this.select);
        this.select.activate();
    };

    this.onPopupClose = function(evt) {
        alert('teste')
        this.select.unselectAll();
    };

    this.onFeatureSelect = function(event) {
        var feature = event.feature;
        var info = feature.attributes.dados;

        var popup = new OpenLayers.Popup.FramedCloud("chicken",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100, 100),
                info,
                null, true, this.onPopupClose, true);
        feature.popup = popup;
        this.map.addPopup(popup);
    };

    this.onFeatureUnselect = function(event) {
        var feature = event.feature;
        if (feature.popup) {
            this.map.removePopup(feature.popup);
            feature.popup.destroy();
            delete feature.popup;
        }
    }

    this.geraCamadaPontoJson = function(url, icone) {
        var vector = new OpenLayers.Layer.Vector("Features", {
            protocol: new OpenLayers.Protocol.HTTP({
                url: url,
                format: new OpenLayers.Format.GeoJSON()
            }),
            styleMap: new OpenLayers.StyleMap({
                externalGraphic: icone,
                graphicWidth: 25,
                graphicHeight: 25,
                fillOpacity: 1


            }),
            renderers: ['Canvas', 'SVG'],
            strategies: [new OpenLayers.Strategy.Fixed()]
        });

        return vector;
    };

    this.adicionaCamadaPontoJson = function(url, icone) {

        var vector = this.geraCamadaPontoJson(url, icone);

        return this.adicionaCamada(vector);
    }

    this.adicionaCamadaMapServer = function(url) {
        //map.layer[limiteMunicipal].class[limiteMunicipal].style[0]=OUTLINECOLOR+255+255+0
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




