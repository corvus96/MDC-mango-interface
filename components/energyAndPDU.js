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
                queryBuilder.ne('MDCID', null);
                queryBuilder.eq('siteName', this.site);

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
            $state.go('.', $stateParams, { location: 'replace', notify: false });
            return maPoint
            .buildQuery()
            .eq('tags.outputs', this.output)
            .eq('tags.MDCID', this.MDC)     
            .limit(1000)
            .query()
            .then((points) => {
                this.especificPoints(points);
            });
        };

        this.generalPoints = (points) => {
            this.totalAveragePower = this.filterByName(points, 'total-power-1');
            this.totalEnergy = this.filterByName(points, 'total-energy-1');
            
            console.log(this.totalEnergy)
        };

        this.especificPoints = (points) => {
            points.forEach(point => {
                if(point.name == 'volt-take-1'||
                point.name == 'volt-take-2'||
                point.name == 'volt-take-3'||
                point.name == 'volt-take120-1'||
                point.name == 'volt-take120-2'||
                point.name == 'volt-take120-3'){

                    this.volt = point;
                }

                else if(point.name == 'current-take-1'||
                point.name == 'current-take-2'||
                point.name == 'current-take-3'||
                point.name == 'current-take120-1'||
                point.name == 'current-take120-2'||
                point.name == 'current-take120-3'){

                    this.current = point;
                }
            
            });
            console.log(points)
            console.log(this.volt)
            console.log(this.current)
        };

        this.filterByName = (points, name) => {
            return points.filter(point => {
                return point.name == name;
            })[0];
        };

    }
    return {
        bindings: {},
        controller: EnergyAndPDUController,
        templateUrl: require.toUrl('./energyAndPDU.html')
    };

});
