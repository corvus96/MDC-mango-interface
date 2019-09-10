define(['angular', 'require'], function (angular, require) {
    'use strict';
    EnergyAndPDUController.$inject = ['$scope', 'maDataPointTags', '$state', '$stateParams', 'maPoint', 'maUiDateBar'];

    function EnergyAndPDUController($scope, maDataPointTags, $state, $stateParams, maPoint, maUiDateBar) {
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
                    }
                    this.MDCChanged();

                });
        };



        this.MDCChanged = () => {
            $stateParams.MDC = this.MDC;
            $state.go('.', $stateParams, { location: 'replace', notify: false });
            this.outputs = {};
            maPoint
                .buildQuery()
                .eq('tags.MDCID', this.MDC)
                .limit(1000)
                .query()
                .then((points) => {
                    this.generalPoints(points);
                    this.refreshOutputs(points);
                });

        };

        this.refreshOutputs = (points) => {
            let queryBuilder = maDataPointTags.buildQuery('outputs');
            queryBuilder.ne('outputs', null);
            queryBuilder.eq('MDCID', this.MDC);
            return queryBuilder
                .query()
                .then(values => {
                    this.outputs = values.sort();
                    
                    if (!this.outputs.includes(this.output)) {
                        if (this.outputs.includes($stateParams.output)) {
                            this.output = $stateParams.output;
                        } else if (this.outputs.length) {
                            this.output = this.outputs[0];
                        } else {
                            this.output = null;
                        }
                    }
                        this.outputChanged (points);
                });
        };

        this.outputChanged = () => {
            $stateParams.output = this.output;
            console.log(this.output)
            $state.go('.', $stateParams, { location: 'replace', notify: false });
            return maPoint
            .buildQuery()
            .eq('tags.outputs', this.output)
            .limit(1000)
            .query()
            .then((points) => {
                this.especificPoints(points);
            });
        };

        this.generalPoints = (points) => {
            this.totalAveragePower = this.filterByName(points, 'total-power-1');
            this.totalEnergy = this.filterByName(points, 'total-energy-1');
        };

        this.especificPoints = (points) => {
            this.volt = this.filterByOutput(points,this.output)
            this.current = this.filterByOutput(points,this.output)
            console.log(points)
            console.log(this.output)
            console.log(this.outputs)
            console.log(this.volt)
            console.log(this.current)
        };

        this.filterByName = (points, name) => {
            return points.filter(point => {
                return point.name == name;
            })[0];
        };

        this.filterByOutput = (points,output) => {
            return points.filter(point => {
                return  point.tags.outputs == output;
            })[0];
        };

    }
    return {
        bindings: {},
        controller: EnergyAndPDUController,
        templateUrl: require.toUrl('./energyAndPDU.html')
    };

});
