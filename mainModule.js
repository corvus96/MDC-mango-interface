define([
    'angular', 
    'require',
    './components/helloWorld.js',
    './components/mapView.js',
    './components/siteOverview.js',
    './components/energyAndPDU.js',
    './components/refrigeration.js',
    './components/configMDC.js',
], 

function(angular, require,helloWorld,mapView,siteOverview,energyAndPDU,refrigeration,configMDC) {
'use strict';

var mainModule = angular.module('mainModule', ['maUiApp']);
    mainModule.component('helloWorld', helloWorld);
    mainModule.component('mapView', mapView);
    mainModule.component('siteOverview', siteOverview);
    mainModule.component('energyAndPDU', energyAndPDU);
    mainModule.component('refrigeration', refrigeration);
    mainModule.component('configMDC', configMDC);
    mainModule.config(['maUiMenuProvider', function(maUiMenuProvider) {
    maUiMenuProvider.registerMenuItems([
        {
            name: 'ui.mapView',
            url: '/mapView',
            template: '<map-view></map-view>',
            menuIcon: 'room',
            menuText: 'Map of MDCs',
            weight: 997,
            params: {
                noPadding: false,
                hideFooter: false,
            },
        },
        {
            name: 'ui.siteOverview',
            url: '/siteOverview',
            template: '<site-overview></site-overview>',
            menuIcon: 'visibility',
            menuText: 'Site Overview',
            weight: 997,
            params: {
                noPadding: false,
                hideFooter: false,
            },
        },
        {
            name: 'ui.energyAndPDU',
            url: '/energyAndPDU',
            template: '<energy-and-p-d-u></energy-and-p-d-u>',
            menuIcon: 'fa-plug',
            menuText: 'Energy and PDUs',
            weight: 997,
            params: {
                noPadding: false,
                hideFooter: false,
            },
        },
        {
            name: 'ui.refrigeration',
            url: '/refrigerationSystem',
            template: '<refrigeration></refrigeration>',
            menuIcon: 'ac_unit',
            menuText: 'Refrigeration System',
            weight: 997,
            params: {
                noPadding: false,
                hideFooter: false,
            },
        },
        {
            name: 'ui.configMDC',
            url: '/configMDC',
            template: '<config-m-d-c></config-m-d-c>',
            menuIcon: 'fa-cogs',
            menuText: 'MDCs Configuration',
            weight: 997,
            params: {
                noPadding: false,
                hideFooter: false,
            },
        },
    ]);
}]);
return mainModule;
});