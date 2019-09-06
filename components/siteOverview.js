define(['angular', 'require'], function(angular, require) {
    'use strict';
    SiteOverviewController.$inject = ['$scope'];
    
    function SiteOverviewController($scope) {
    this.$onInit = () => {
            this.siteOverview = 'Site view';
        };
    }
    
    return {
        bindings: {},
        controller: SiteOverviewController,
        templateUrl: require.toUrl('./siteOverview.html')
    };
        
    });