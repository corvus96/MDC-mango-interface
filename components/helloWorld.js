define(['angular', 'require'], function(angular, require) {
    'use strict';
    HelloWorldController.$inject = ['$scope'];
    
    function HelloWorldController($scope) {
    this.$onInit = () => {
            this.helloWorld = 'Hola Mango';
        };
    }
    
    return {
        bindings: {},
        controller: HelloWorldController,
        templateUrl: require.toUrl('./helloWorld.html')
    };
        
    });