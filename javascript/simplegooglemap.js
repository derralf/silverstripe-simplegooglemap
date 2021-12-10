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
    // check config
    if (typeof(gmap_use_consenting_cookie) != 'undefined' && gmap_use_consenting_cookie == false) {
        gmap_is_allowed = true;
        return;
    }
    // check cookie
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

    // map default styles
    var mapDefaultStyles = [
        {"featureType":"poi","stylers":[{"visibility":"off"}]},
        {"featureType":"poi.attraction","stylers":[{"visibility":"on"}]},
        {"featureType":"poi.park","stylers":[{"visibility":"on"}]}
    ];

    // map custom styles
    if (typeof(simplegooglemapcustomstyles) != 'undefined' && simplegooglemapcustomstyles != null) {
        var mapCustomStyles = simplegooglemapcustomstyles;
    } else {
        var mapCustomStyles = [];
    }

    // merge styles
    var mapStyles = mapDefaultStyles.concat(mapCustomStyles);

    // test
    // console.dir(simplegooglemapcustomstyles);
    // console.dir(mapDefaultStyles);
    // console.dir(mapStyles);


    // default map settings
    var mapDefaultOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 15,
        center: mapCenter,
        draggable: true,
        scrollwheel: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: mapStyles
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

        //html = ['<div class="gmapAddr" style="white-space: nowrap; margin-right: 15px">', getInfoicon(address.logourl),'<b>', address.name, '</b><br/>', address.street, '<br/> ' , address.zip,' ',address.city, '</div>'].join('');

        // html = [
        //     '<div class="gmapAddr" style="white-space: nowrap; margin-right: 15px">',
        //     getInfoicon(address.logourl),
        //     '<div><strong>', address.name, '</strong><br>',
        //     address.street, '<br> ' , address.zip,' ',address.city,
        //     '</div></div>'
        // ].join('');
        //
        // // Directions
        // html = html + '<div class="gmapDirLink"><a target="_blank" href="https://maps.google.com/?daddr=' + formatAddressForMaps(address) + '">' + labels.directions + '</a></div>';

        // Directions-Link
        var directions_html = [
            '<div class="gmapDirLink">',
            '<a target="_blank" href="https://maps.google.com/?daddr=' + formatAddressForMaps(address) + '">',
            labels.directions,
            '</a></div>'
        ].join('');


        // Address
        var address_html = [
            getInfoicon(address.logourl),
            '<div class="gmapAddressText">',
                '<strong>', address.name, '</strong><br>',
                address.street,
                '<br> ' ,
                address.zip,' ',address.city,
                directions_html,
            '</div>'
        ].join('');


        // Wrapper
        html = [
            '<div class="gmapAddr" style="display: flex; white-space: nowrap; margin-right: 15px">',
            address_html,
            '</div>'
        ].join('');


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
            infowindow = new google.maps.InfoWindow({
                content: htmls[0]
            });
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
