define(['angular', 'require'], function (angular, require) {
    'use strict';
    SiteOverviewController.$inject = ['$scope','maDataPointTags', '$state', '$stateParams', 'maPoint', 'maUiDateBar'];

    function SiteOverviewController($scope,maDataPointTags, $state, $stateParams, maPoint, maUiDateBar) {
        this.$onInit = () => {
            $scope.data = {};
            $scope.data.cb1 = false;
            $scope.data.cb2 = false;
            $scope.data.cb3 = false;
            $scope.data.cb4 = false;
            $scope.data.cb5 = false;
            $scope.data.cb6 = false;
            $scope.data.cb7 = false;
            $scope.data.cb8 = false;
            $scope.data.cb9 = false;
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
            this.coolingCapacity = this.filterByName(points, 'cooling-capacity');
            this.capacityOfUPS = this.filterByName(points, 'capacity-of-ups');
            this.cabinet = this.filterByName(points, 'cabinet');
            this.operationMode = this.filterByName(points, 'operation-mode');
            this.againstFireSystem = this.filterByName(points, 'against-fire-system');
            this.humid = this.filterByName(points, 'humid-1');
            this.humidDiference = this.filterByName(points, 'humid-diference');
            this.coolingState = this.filterByName(points, 'cooling-state');
            this.temp = this.filterByName(points, 'temp-1');
            this.tempDiference = this.filterByName(points, 'temp-diference');
            this.totalRefrigerationPower = this.filterByName(points, 'total-refrigeration-power-1');
            this.averageVoltageCoolingSystem = this.filterByName(points, 'average-voltage-cooling-system');
            this.accessControlState = this.filterByName(points, 'access-control-state');
            this.totalPower = this.filterByName(points, 'total-power-1');
            this.averageVoltagePDU = this.filterByName(points, 'average-voltage-pdu');
            this.averageCurrent = this.filterByName(points, 'average-current-1');
            this.currentFeed = this.filterByName(points, 'current-feed');
            this.upsLoad = this.filterByName(points, 'ups-Load-1');
            this.activePower = this.filterByName(points, 'active-power-1');
            this.activeCoolingPower = this.filterByName(points, 'active-cooling-power-1');
            this.totalRefriReactivePower = this.filterByName(points, 'total-refrigeration-reactive-power-1');
            this.totalReactivePower = this.filterByName(points, 'total-reactive-power-1');
        };

        this.filterByName = (points, name) => {
            return points.filter(point => {
                return point.name == name;
            })[0];
        };

    }
    return {
        bindings: {},
        controller: SiteOverviewController,
        templateUrl: require.toUrl('./siteOverview.html')
    };

});
