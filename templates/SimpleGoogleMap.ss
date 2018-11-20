
<% if $gmap_has_addresses %>
<div id="$gmap_id" style="width:$width;height:$height;" class="gmap display"></div>
<script type="text/javascript">
    var {$gmap_id}_gmap_addresses = $gmap_addresses.RAW;

    var {$gmap_id}_MapContent = {
        gmap_id: "{$gmap_id}",
        addresses: {$gmap_id}_gmap_addresses,
        openInfoWindow: "{$gmap_openInfoWindow}",
        zoomToBounds: {$gmap_zoomToBounds}
    };

    var {$gmap_id}_MapCustomOptions = {
        zoom: $gmap_zoomLevel
    }

    window.onload = function () {
        initSimpleGoogleMap({$gmap_id}_MapContent, {$gmap_id}_MapCustomOptions);
    };

</script>
<% else %>
<p>- keine Adressen hinterlegt - </p>
<% end_if %>

