<?php

namespace Derralf\SimpleGoogleMap;

use SilverStripe\Control\ContentNegotiator;
use SilverStripe\Control\Director;
use SilverStripe\Core\Config\Config;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\View\ArrayData;
use SilverStripe\View\Requirements;
use SilverStripe\View\ViewableData;


/**
 * SimpleGMap class allows you to display an arbitrary number of GMapPoints.
 * Google Maps API V3
 * Based on Maps for Slverstripe, http://doc.silverstripe.com/doku.php?id=gsoc07googlemaps
 */
class SimpleGMap extends ViewableData {

    function __construct($name='default', $zoomLevel = 5, $width = 600, $height = 500, $openInfoWindow = 'first',$zoomToBounds = false, $addressList = 'Adresses') {
		$this->name = $name;
		$this->zoomLevel = $zoomLevel;
		$this->width = $width;
		$this->height = $height;
		$this->openInfoWindow = ($openInfoWindow) ? $openInfoWindow : "nein"; // first or last or no
		$this->zoomToBounds = ($zoomToBounds) ? $zoomToBounds : 0;
		$this->baseFolder = Director::baseURL();
        $this->addressList = $addressList;
	}

    function display() {



        //$map_addresses = $this->config()->get('Adresses');;
        $map_addresses = $this->config()->get($this->addressList);
        $gmap_has_addresses = ($map_addresses) ? true : false;


        $map_vars = new ArrayData([
            'gmap_has_addresses' => $gmap_has_addresses,
            'gmap_addresses' => json_encode($map_addresses),
            'gmap_id'        => $this->name . '_SimpleGMap',
            'width'          => $this->width . 'px',
            'height'         => $this->height . 'px',
            'gmap_zoomLevel'                              => $this->zoomLevel,
            'gmap_openInfoWindow'                         => $this->openInfoWindow,
            'gmap_zoomToBounds'                           => $this->zoomToBounds,
            'gmap_useToFromInputs'                        => $this->useToFromInputs,
        ]);

        $map = $map_vars->renderWith('SimpleGoogleMap');


        // Requirements

        // i18n
        if($this->config()->get('include_i18n_js')) {
            Requirements::javascript('silverstripe/admin:client/dist/js/i18n.js');
        }
        if($this->config()->get('include_i18n_module_js')) {
            Requirements::add_i18n_javascript('derralf/silverstripe-simplegooglemap:javascript/lang');
        }

        // get api version and and key
        $api_version = $this->config()->get('google_maps_api_version');
        $api_key = $this->config()->get('google_maps_api_key');
        // set maps url
        $api_url = 'https://maps.google.com/maps/api/js?';
        $api_url_params = [];
        if($api_version) $api_url_params['v'] = $api_version;
        if($api_key) $api_url_params['key'] = $api_key;
        $api_url .= http_build_query($api_url_params);
        //require maps api
        if ($this->config()->get('include_maps_api')) {
            Requirements::insertHeadTags(
                '<script type="text/javascript" src="'
                .'https://maps.google.com/maps/api/js'
                .'?v=' . $api_version
                .'&key='. $api_key
                .'"></script>'
                , $uniquenessID = 'google_maps'
            );
        }

        Requirements::javascript('derralf/silverstripe-simplegooglemap:javascript/simplegooglemap.js');




        // return map
        return DBField::create_field('HTMLFragment', $map);
    }
}