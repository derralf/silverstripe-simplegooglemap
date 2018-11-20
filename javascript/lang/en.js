if(typeof(ss) == 'undefined' || typeof(ss.i18n) == 'undefined') {
  console.error('Class ss.i18n not defined');
} else {
  ss.i18n.addDictionary('en', {
    'SimpleGoogleMap.InfoWindowDirectionsLabelDirections' : 'Directions',
    'SimpleGoogleMap.InfoWindowDirectionsLabelCalculate' :  'Calculate Route',
    'SimpleGoogleMap.InfoWindowDirectionsLabelTo' :         'To here',
    'SimpleGoogleMap.InfoWindowDirectionsLabelFrom' :       'From here',
    'SimpleGoogleMap.InfoWindowDirectionsLabelButton' :     'Show Directions',
    'SimpleGoogleMap.InfoWindowDirectionsStart' :           'Start address',
    'SimpleGoogleMap.InfoWindowDirectionsDesination' :      'Destination address'
  });
}
