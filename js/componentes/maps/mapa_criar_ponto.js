/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Proj4js.defs["EPSG:29192"] = "+proj=utm +zone=22 +south +ellps=aust_SA +units=m +no_defs";
Proj4js.defs["EPSG:3857"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
var coor_from = new Proj4js.Proj("EPSG:3857");
var coor_to = new Proj4js.Proj("EPSG:29192");

function iniciaMapa() {

     map = new OpenLayers.Map(mapa,
            {
                maxExtent:
                        new OpenLayers.Bounds(-5804847.164511,
                        -3541988.011926,
                        -5544447.164511,
                        -3301649.645208),
                maxResolution: 401.232666
            }
    );
    var zoom;
    if (!$("#coordenadaX").val()) {
        var coordenadas = converteCoordenadas(-5685361.54, -3382739.89);
        x = coordenadas.lat;
        y = coordenadas.lon;
        xIni = -5685361.54;
        yIni = -3382739.89;
       zoom = 10;
    } else {
        x = $("#coordenadaX").val();
        y = $("#coordenadaY").val();
        var coordenadas = converteCoordenadasAoContrario(x, y);
        xIni = coordenadas.lat;
        yIni = coordenadas.lon;
       zoom = 14;
    }
    preencheCampo(x, y);

    map.addControl(new OpenLayers.Control.LayerSwitcher({
        'ascending': false
    }));

    var position = new OpenLayers.LonLat(xIni, yIni);

    
    var gmaps = new OpenLayers.Layer.Google(
            "Google Hybrid",
            {
                type: google.maps.MapTypeId.SATELLITE,
                numZoomLevels: 30
            }
    );
    map.addLayer(gmaps);

    map.setCenter(position, zoom);

    var template = {
        externalGraphic: "/js/OpenLayers/img/marker-gold.png",
        graphicWidth: 23,
        graphicHeight: 23
    };

    var style = new OpenLayers.Style(template, {});
    var camadaPonto = new OpenLayers.Layer.Vector("Vector Layer", {
        styleMap: new OpenLayers.StyleMap(style)
    });
    map.addLayer(camadaPonto);

    var pointGeometry = new OpenLayers.Geometry.Point(xIni, yIni);
    marcadorPontoFauna = new OpenLayers.Feature.Vector(pointGeometry);
    camadaPonto.addFeatures(marcadorPontoFauna);

    var drag = new OpenLayers.Control.DragFeature(camadaPonto)
    map.addControl(drag);
    drag.activate();

    map.events.register("mouseup", map, function() {
        if (drag.feature != null) {
            var lon = drag.feature.geometry.getBounds().getCenterLonLat().lon;
            var lat = drag.feature.geometry.getBounds().getCenterLonLat().lat;
            var ponto = converteCoordenadas(lon, lat);
            preencheCampo(ponto.lat, ponto.lon);
            var coordenadasZoom = converteCoordenadasAoContrario(ponto.lat, ponto.lon);
            zoom = 14;
            map.setCenter(new OpenLayers.LonLat(coordenadasZoom.lat, coordenadasZoom.lon),zoom);
        }
    });

    $(".coordenadas").blur(function() {
        var lonlat = converteCoordenadasAoContrario($("#coordenadaX").val(), $("#coordenadaY").val());
        marcadorPontoFauna.move(new OpenLayers.LonLat(lonlat.lat, lonlat.lon));
        map.setCenter(new OpenLayers.LonLat(lonlat.lat, lonlat.lon));
    });

}

function preencheCampo(x, y) {
    $("#coordenadaX").val(x);
    $("#coordenadaY").val(y);
}

function converteCoordenadas(x, y) {

    var point = new Proj4js.Point(x, y);
    Proj4js.transform(coor_from, coor_to, point);
    var ponto = new OpenLayers.LonLat(point.y, point.x);
    return ponto;
}

function converteCoordenadasAoContrario(x, y) {
    var point = new Proj4js.Point(x, y);
    Proj4js.transform(coor_to, coor_from, point);
    var ponto = new OpenLayers.LonLat(point.y, point.x);
    return ponto;
}

$(document).ready(
        function() {
            iniciaMapa();
        }
);