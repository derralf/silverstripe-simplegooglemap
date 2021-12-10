<% if $gmap_has_addresses %>
<div id="$gmap_id" style="width:$width;height:$height;" class="gmap display {$additionalClassNames}">
    <% if not $gmap_is_allowed %>
    <div class="confirm-googlemaps" style="background:#DDD;border:#666;padding:20px;text-align:center;">
        <div class="well text-center">
            <%t Derralf\SimpleGoogleMap.GoogleMapsConfirm "cick here to activate Google Maps plugin permanently" %>
        </div>
    </div>
    <% end_if %>
</div>

<script type="text/javascript">
    var {$gmap_id}_gmap_addresses = $gmap_addresses.RAW;

    <%-- just in case the map-config-JS is loaded before this: set gmap_is_allowed true if config is set to not use the consent cookie --%>
    var gmap_use_consenting_cookie = {$gmap_use_consenting_cookie};
    <% if not $gmap_use_consenting_cookie %> var gmap_is_allowed = true;<% end_if %>

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
        if(gmap_is_allowed) {initSimpleGoogleMap({$gmap_id}_MapContent, {$gmap_id}_MapCustomOptions);}
    };
    <% if not $gmap_is_allowed %>
    document.getElementById("{$gmap_id}").addEventListener("click", function(){
        confirmGoogleMaps({$gmap_id}_MapContent, {$gmap_id}_MapCustomOptions, "{$gmap_api_url.RAW}");
    });
    <% end_if %>

</script>
<% else %>
<p>- keine Adressen hinterlegt - </p>
<% end_if %>

