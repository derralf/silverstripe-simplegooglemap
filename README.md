# SilverStripe SimpleGoogleMap
==============================

Simple experimental Module to add a google map to a page type (not editable via CMS)

Private project, no help/support provided

**Caution:** multiple marker arrays for multiple maps possible, but only one map per page – with this module...

## Requirements

* SilverStripe ^4.1
* silverstripe/vendor-plugin

## Installation

Install the module via Composer

```
composer require derralf/silverstripe-simplegooglemap
```


## Configuration

In your config.yml for example:

```
Derralf\SimpleGoogleMap\SimpleGMap:
  include_maps_api: true
  include_i18n_js: true
  include_i18n_module_js: true
  include_module_js: true
  google_maps_api_version: '3.36'
  google_maps_api_key: '123456789012345678901234567890'
  Adresses:
    - name: 'Thalia Mannheim'
      street: 'P7 22'
      city: 'Mannheim'
      zip: '668161'
      logourl: '/resources/vendor/derralf/silverstripe-simplegooglemap/logos/logo.gif'
      iconurl: '/resources/vendor/derralf/silverstripe-simplegooglemap/icons/red.png'
      lat: 49.485796
      lng: 8.47419489999993
    - name: 'Parkhaus Q7'
      street: 'Zufahrt über Fressgasse (P7/Q7)'
      city: ''
      zip: ''
      logourl: '/resources/vendor/derralf/silverstripe-simplegooglemap/logos/parkhaus.gif'
      iconurl: '/resources/vendor/derralf/silverstripe-simplegooglemap/icons/parkhaus.png'
      lat: 49.486048
      lng: 8.473053
    - name: 'Parkhaus Q6'
      street: 'Zufahrt über Q5/Q6'
      city: ''
      zip: ''
      logourl: '/resources/vendor/derralf/silverstripe-simplegooglemap/logos/parkhaus.gif'
      iconurl: '/resources/vendor/derralf/silverstripe-simplegooglemap/icons/parkhaus.png'
      lat: 49.48710
      lng: 8.47135
    - name: 'Parkhaus R5'
      street: 'Zufahrt über R5/R6'
      city: ''
      zip: ''
      logourl: '/resources/vendor/derralf/silverstripe-simplegooglemap/logos/parkhaus.gif'
      iconurl: '/resources/vendor/derralf/silverstripe-simplegooglemap/icons/parkhaus.png'
      lat: 49.487796
      lng: 8.471832
```

## Usage & Templates

e.g. ContactPage.php

```
public function Map() {
	$Map = new SimpleGMap($name='Kontakt', $zoomLevel = 14, $width = 460, $height = 383, $openInfoWindow = 'first', $zoomToBounds = true, $addressList = 'Adresses');
	return $Map->display();
	
	// Options:
	// $name: string (used as Prefix, here Kontakt_SimpleGMap)
	// $zoomLevel: integer
	// $width: integer
	// $height: integer
	// $openInfoWindow: string first||last||none
	// $zoomToBounds: Boolean
	// $addresses: optional name of array used in config.yml (multiple maps with different Adresses possible, defaults to "Adresses")
	// Caution: only one map per page possible

}

```

e.g. ContactPage.ss

```
$Map
```