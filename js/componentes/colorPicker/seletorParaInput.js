$(document).ready(function() {
    for (a in colorPickers) {
            $('#'+ colorPickers[a].idCampo).ColorPicker({
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
                    $('#'+colorPickers[a].idCampo).css('backgroundColor', '#' + hex);
                    $('#'+colorPickers[a].idCampo).val('#' + hex);
                }
            });
    }
});