define(['angular', 'require'], function (angular, require) {
    'use strict';
    MapViewController.$inject = ['$scope', 'maDataPointTags', '$state', '$stateParams', 'maPoint'];

    function MapViewController($scope, maDataPointTags, $state, $stateParams, maPoint) {
        this.$onInit = () => {
            this.refreshSites();
        };

        this.refreshSites = () => {
            return maDataPointTags
                .buildQuery('siteName')
                .query()
                .then(values => {
                    this.sites = values.sort();
                    this.sites.unshift('ALL');
 
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
            this.mdcs = {};
            $stateParams.site = this.site;
            $state.go('.', $stateParams, { location: 'replace', notify: false });

            this.getMDCNames();
        };

        this.getMDCNames = () => {
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
                    this.refreshMDCs();
                });
        };

        this.refreshMDCs = () => {

            let queryBuilder = maPoint.buildQuery();

            if (this.site == 'ALL') {
                queryBuilder.ne('tags.siteName', null);
            } else {
                queryBuilder.eq('tags.siteName', this.site);
            }

            return queryBuilder
                .limit(1000)
                .query()
                .then((points) => {
                    this.orderPoints(points);
                });
        };
 
        this.orderPoints = (points) => {
            this.MDCIDs.forEach(MDCID => {
                
                this.mdcs[MDCID] = {
                    'temp': this.filterByNameAndMDCID(points, 'temp-1', MDCID),
                    'totalAveragePower': this.filterByNameAndMDCID(points, 'total-power-1', MDCID),
                    'upsLoad': this.filterByNameAndMDCID(points, 'ups-Load-1', MDCID),
                    'totalEnergy' : this.filterByNameAndMDCID(points, 'total-energy-1',MDCID),
                    'statusOfMDC' : this.filterByNameAndMDCID(points, 'status-of-MDC',MDCID),
                    'operationMode' : this.filterByNameAndMDCID(points, 'operation-mode',MDCID),
                };
                
            });
            console.log(this.mdcs) 
        };

        this.filterByNameAndMDCID = (points, name, MDCID) => {
            return points.filter(point => {
                return point.name == name && point.tags.MDCID == MDCID;
            })[0];
        };
    }
    return {
        bindings: {},
        controller: MapViewController,
        templateUrl: require.toUrl('./mapView.html')
    };

});