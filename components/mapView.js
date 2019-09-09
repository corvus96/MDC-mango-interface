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
                    //this.sites.unshift('ALL');
                    console.log(this.sites);
                    if (!this.sites.includes(this.site)) {

                        if (this.sites.includes($stateParams.site)) {
                            this.site = $stateParams.site;
                        } else if (this.sites.length) {
                            this.site = this.sites[0];
                        } else {
                            this.site = 'ALL';
                        }
                        console.log(this.sites);
                        this.siteChanged();
                    }

                });
        };

        this.siteChanged = () => {
            $stateParams.site = this.site;
            $state.go('.', $stateParams, { location: 'replace', notify: false });

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
                    console.log(this.MDCIDs);
                    if (!this.MDCIDs.includes(this.MDC)) {

                        if (this.MDCIDs.includes($stateParams.MDC)) {
                            this.MDC = $stateParams.MDC;
                        } else if (this.MDCIDs.length) {
                            this.MDC = this.MDCIDs[0];
                        } else {
                            this.MDC = null;
                        }
                        this.copyMDCs = this.MDCIDs;
                        console.log(this.MDCIDs);
                        this.MDCChanged();
                    }

                });
        };

        this.MDCChanged = () => {

            $stateParams.MDC = this.MDC;
            $state.go('.', $stateParams, { location: 'replace', notify: false });

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
            console.log(points)
            this.copyMDCs.forEach(MDCID => {

                this.mdcs[MDCID] = {
                    'temp': this.filterByName(points, 'temp-1'),
                    'totalEnergy': this.filterByName(points, 'total-energy-1'),
                    'totalPower': this.filterByName(points, 'total-power-1'),
                    'upsLoad': this.filterByName(points, 'ups-Load-1'),
                };
                console.log(this.mdcs)
            });
            this.temp = this.filterByName(points, 'temp-1');
            this.totalEnergy = this.filterByName(points, 'total-energy-1');
            this.totalPower = this.filterByName(points, 'total-power-1');
            this.upsLoad = this.filterByName(points, 'ups-Load-1');
        };

        this.filterByName = (points, name) => {
            return points.filter(point => {
                return point.name == name;
            })[0];
        };


    }
    return {
        bindings: {},
        controller: MapViewController,
        templateUrl: require.toUrl('./mapView.html')
    };

});