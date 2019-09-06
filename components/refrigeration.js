define(['angular', 'require'], function(angular, require) {
    'use strict';
    RefrigerationController.$inject = ['$scope', 'maDataPointTags', '$state', '$stateParams', 'maPoint', 'maUiDateBar'];
    
    function RefrigerationController($scope, maDataPointTags, $state, $stateParams, maPoint, maUiDateBar) {
    this.$onInit = () => {
        this.maUiDateBar = maUiDateBar;
        this.refreshSites();
    };

    this.refreshSites = () => {
        return maDataPointTags
        .buildQuery('siteName')
        .query()
        .then(values => {
            this.sites = values.sort();
     
            if (!this.sites.includes(this.site)) {
                
                if (this.sites.includes($stateParams.site)) {
                    this.site = $stateParams.site;
                } else if (this.sites.length) {
                    this.site = this.sites[0];
                } else {
                    this.site = 'ALL';
                }
                this.siteChanged();
            }
            
        });
    };

    this.siteChanged = () => {
        $stateParams.site = this.site;
        $state.go('.', $stateParams, {location: 'replace', notify: false});
        
        this.refreshMDCs();
    };

    this.refreshMDCs = () => {
        let queryBuilder = maDataPointTags.buildQuery('MDCID');

        if (this.site == 'ALL') {
            queryBuilder.ne('siteName', null);
        } else {
            queryBuilder.eq('siteName', this.site);
        }

        return queryBuilder
            .query()
            .then(values => {
                this.MDCIDs = values.sort();

                if (!this.MDCIDs.includes(this.MDC)) {
                
                    if (this.MDCIDs.includes($stateParams.MDC)) {
                        this.MDC = $stateParams.MDC;
                    } else if (this.MDCIDs.length) {
                        this.MDC = this.MDCIDs[0];
                    } else {
                        this.MDC = null;
                    }
                    this.MDCChanged();
                }

            });
    };

    this.MDCChanged = () => {

        $stateParams.MDC = this.MDC;
        $state.go('.', $stateParams, {location: 'replace', notify: false});

        return maPoint
            .buildQuery()
            .eq('tags.MDCID', this.MDC)
            .limit(1000)
            .query()
            .then((points) => { 
                this.orderPoints(points);
            });
    };

    this.orderPoints = (points) => {
        this.temp = this.filterByName(points, 'temp-1');
        this.humid = this.filterByName(points, 'humid-1');
    };

    this.filterByName = (points, name) => {
        return points.filter(point => {
            return point.name == name;
        })[0];
    };

}
return {
    bindings: {},
    controller: RefrigerationController,
    templateUrl: require.toUrl('./refrigeration.html')
};
    
});