define(['angular', 'require'], function(angular, require) {
    'use strict';
    ConfigMDCController.$inject = ['$scope'];
    
    function ConfigMDCController($scope) {
    this.$onInit = () => {
            this.config = 'Configuration MDCs view';
        };
    }
    
    return {
        bindings: {},
        controller: ConfigMDCController,
        templateUrl: require.toUrl('./configMDC.html')
    };
        
    });