// set to true below if cookie is found
var gmap_is_allowed = false;

// set cookie
function gmap_allow() {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 365);
    document.cookie = 'ss_googlemaps_allow=ok; expires=' + exdate.toUTCString() + '; path=/';
}

// get cookie / set allowed variable
function set_gmap_is_allowed() {
    var name = "ss_googlemaps_allow=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            gmap_is_allowed = c.substring(name.length, c.length);
            return;
        }
    }
    gmap_is_allowed = false;
}

// get cookie
set_gmap_is_allowed();

// 2-click map: if no cookie is found, confirm and set cookie
function confirmGoogleMaps(mapContentOptions, mapCustomOptions, gmap_api_url) {
    if(gmap_is_allowed == false){
        var mapsSrc = document.createElement('script');
        mapsSrc.type = 'text/javascript';
        mapsSrc.src =gmap_api_url;
        //mapsSrc.src = 'https://maps.googleapis.com/maps/api/js?key='+googleMapsApiKey;
        document.getElementsByTagName('head')[0].appendChild(mapsSrc);
        window.setTimeout(function() {
                gmap_allow();
                set_gmap_is_allowed();
                // initContactMap();
                initSimpleGoogleMap(mapContentOptions, mapCustomOptions)
            }, 500);
    }
}



function initSimpleGoogleMap(mapContentOptions, mapCustomOptions) {

    var gmap_id = mapContentOptions.gmap_id;
    var addresses = mapContentOptions.addresses;
    var openInfoWindow = mapContentOptions.openInfoWindow;
    var zoomToBounds = mapContentOptions.zoomToBounds;


    var gmarkers = [];
    var htmls = [];
    var to_htmls = [];
    var from_htmls = [];
    var infowindow = new google.maps.InfoWindow();

    // center berechnen
    var mapCenter = new google.maps.LatLng(addresses[0].lat,addresses[0].lng);

    // default map settings
    var mapDefaultOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 15,
        center: mapCenter,
        draggable: true,
        scrollwheel: false,
        mapTypeControl: false,
        streetViewControl: false,
    };

    // map settings: merge defaults and custum settings
    var mapOptions = $.extend({}, mapDefaultOptions, mapCustomOptions || {});


    // Labels/Translations
    var labels = {
        directions:     ss.i18n._t('SimpleGoogleMap.InfoWindowDirectionsLabelDirections', 'Anfahrt'),
        caclulate:      ss.i18n._t('SimpleGoogleMap.InfoWindowDirectionsLabelCalculate', 'Route berechnen'),
        to:             ss.i18n._t('SimpleGoogleMap.InfoWindowDirectionsLabelTo', 'Hierher'),
        from:           ss.i18n._t('SimpleGoogleMap.InfoWindowDirectionsLabelFrom', 'Von hier'),
        button:         ss.i18n._t('SimpleGoogleMap.InfoWindowDirectionsLabelButton', 'Wegbeschreibung anzeigen'),
        start:          ss.i18n._t('SimpleGoogleMap.InfoWindowDirectionsStart', 'Start-Adresse'),
        destination:    ss.i18n._t('SimpleGoogleMap.InfoWindowDirectionsDesination', 'Ziel-Adresse')
    };


    // Draw Map
    var map = new google.maps.Map(document.getElementById(gmap_id), mapOptions);
    var bounds = new google.maps.LatLngBounds();

    // Set Markers
    for (var i = 0; i < addresses.length; i++) {
        var markerlocation = new google.maps.LatLng(addresses[i].lat,addresses[i].lng);
        var marker = new google.maps.Marker({
            position: markerlocation,
            map: map
        });
        bounds.extend(markerlocation);
        marker.setTitle(addresses[i].name.toString());
        attachWindowHtml(marker, i);
        if (addresses[i].iconurl) marker.setIcon(addresses[i].iconurl);
    }

    // fit to Bounds
    if (zoomToBounds == true && addresses.length > 1){
        map.fitBounds(bounds);
    }


    // get HTML for Info Windows
    function attachWindowHtml(marker, number) {
        var address = addresses[number];

        html = ['<div class="gmapAddr" style="white-space: nowrap; margin-right: 15px">', getInfoicon(address.logourl),'<b>', address.name, '</b><br/>', address.street, '<br/> ' , address.zip,' ',address.city, '</div>'].join('');

        // if(use_to_from_inputs) {
        //     to_htmls[number] = html;
        //     to_htmls[number] += '<div class="gmapDir" style="white-space: nowrap; clear:both; margin-top:10px;">';
        //     to_htmls[number] += '<form class="gmapDir" id="gmapDirTo" action="http://maps.google.com/maps" method="get" target="_blank">';
        //     to_htmls[number] += '<div class="gmapDirHead" id="gmapDirHeadTo">' + labels.caclulate + ': <strong>' + labels.to + '</strong> - <a href="javascript:fromhere(' + number + ')">' + labels.from + '</a></div>';
        //     to_htmls[number] += '<div class="gmapDirItem" id="gmapDirItemTo" style="margin-top:10px;">' + labels.start + ':<br><input type="text" size="25" maxlength="40" name="saddr" class="gmapTextBox" id="gmapDirSaddr" value="" onfocus="this.style.backgroundColor = \'#e0e0e0\';" onblur="this.style.backgroundColor = \'#ffffff\';" /></div>';
        //     to_htmls[number] += '<div class="gmapDirBtns" id="gmapDirBtnsTo" style="margin-top:10px;"><input value="' + labels.button + '" type="submit" class="gmapDirButton" id="gmapDirButtonTo" /></div>';
        //     to_htmls[number] += '<input type="hidden" name="daddr" value="' + formatAddressForMaps(address) + '" /><br></form>';
        //     to_htmls[number] += '</div>';
        //     from_htmls[number] = html;
        //     from_htmls[number] += '<div class="gmapDir" style="white-space: nowrap; clear:both; margin-top:10px;">';
        //     from_htmls[number] += '<form class="gmapDir" id="gmapDirFrom" action="http://maps.google.com/maps" method="get" target="_blank">';
        //     from_htmls[number] += '<div class="gmapDirHead" id="gmapDirHeadFrom">' + labels.caclulate + ': <a href="javascript:tohere(' + number + ')">$gmap_infowindow_directions_label_to</a> - <strong>$gmap_infowindow_directions_label_from</strong></div>';
        //     from_htmls[number] += '<div class="gmapDirItem" id="gmapDirItemFrom" style="margin-top:10px;">' + labels.destination + ':<br><input type="text" size="25" maxlength="40" name="saddr" class="gmapTextBox" id="gmapDirSaddr" value="" onfocus="this.style.backgroundColor = \'#e0e0e0\';" onblur="this.style.backgroundColor = \'#ffffff\';" /></div>';
        //     from_htmls[number] += '<div class="gmapDirBtns" id="gmapDirBtnsFrom" style="margin-top:10px;"><input value="' + labels._button + '" type="submit" class="gmapDirButton" id="gmapDirButtonFrom" /></div>';
        //     from_htmls[number] += '<input type="hidden" name="daddr" value="' + formatAddressForMaps(address) + '" /><br></form>';
        //     from_htmls[number] += '</div>';

        //     html = html + '<div class="gmapDirHead" class="gmapDir" style="white-space: nowrap; clear:both; margin-top:10px;">' + labels.caclulate + ': <a href="javascript:tohere(' + number + ')">' + labels.to + '</a> - <a href="javascript:fromhere(' + number + ')">' + labels.from + '</a></div><br>';
        // } else {
            html = html + '<div><a target="_blank" href="https://maps.google.com/?daddr=' + formatAddressForMaps(address) + '">' + labels.directions + '</a></div>';
        // }

        gmarkers[number] = marker;
        htmls[number] = html;

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.close();
            //infowindow.setContent(htmls[number]);
            infowindow = new google.maps.InfoWindow({content: htmls[number]});
            infowindow.open(map,marker);
        });

    }



    // functions that open the directions forms
    //function tohere(i) {
    // var tohere = function(i) {
    //     infowindow.close();
    //     infowindow = new google.maps.InfoWindow({content: to_htmls[i]});
    //     infowindow.open(map,gmarkers[i]);
    //     infowindow.setSize();
    // }
    // // function fromhere(i) {
    // var fromhere = function (i) {
    //     infowindow.close();
    //     infowindow = new google.maps.InfoWindow({content: from_htmls[i]});
    //     infowindow.open(map,gmarkers[i]);
    //     infowindow.setSize();
    // }

    // get Icon for HTML-Window
    function getInfoicon(url) {
        // var url = url zum Icon
        if (url) {
            var inconhtml = "<img src=\""+url+"\" width=\"28\" height=\"40\" border=\"0\" alt=\"\" title=\"\" align=\"left\" style=\"margin-right:10px;\"/>";
        } else {
            var inconhtml = "";
        }
        return inconhtml;
    }

    // format Addresses for Directions
    function formatAddressForMaps(addresses) {
        //var address = addresses.lat + ',' + addresses.lng + '(' + addresses.name + ', ' + addresses.street + ', ' + addresses.zip + ' ' + addresses.city + ')';

        var address = addresses.lat + ',' + addresses.lng;
        if(addresses.name || addresses.street || addresses.zip || addresses.city) {
            address = address +  '(' + [addresses.name, addresses.street, addresses.zip, addresses.city].filter(Boolean).join() + ')';
        }
        return address;
    }

    // auto-open first or last marker
    //function openFirstMarker() {
    var openFirstMarker = function() {
        if (openInfoWindow == 'first') {
            infowindow = new google.maps.InfoWindow({content: htmls[0]});
            infowindow.open(map,gmarkers[0]);
            // if zoomToBounds: zoom out a little bit, so all markers are still inside the map bounds after opening the infowindow
            if (zoomToBounds == true && addresses.length) {map.setZoom(map.getZoom()-1)};
        } else if (openInfoWindow == 'last') {
            var z = gmarkers.length-1;
            infowindow = new google.maps.InfoWindow({content: htmls[z]});
            infowindow.open(map,gmarkers[z]);
            // if zoomToBounds: zoom out a little bit, so all markers are still inside the map bounds after opening the infowindow
            if (zoomToBounds == true && addresses.length) {map.setZoom(map.getZoom()-1)};
        } else {
            return false;
        }
    }

    // auto-open first or last marker (use a delay to be shure the map is rendered and sizes/dimensions are set)
    setTimeout(openFirstMarker(openInfoWindow), 3000);

}
