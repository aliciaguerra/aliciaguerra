/**
 * Created by jamesxieaudaexplorecom on 12/18/15.
 */
angular
    .module('mbeapp')
    .controller('ConfigurationController',['$scope','$state','$rootScope','ConfigurationsService','NavigateService',
        function($scope,$state,$rootScope,ConfigurationsService,NavigateService) {
            NavigateService.selectedTab = 4;
            $scope.configList = [];
            $scope.sortType     = 'updatedDate'; // set the default sort type
            $scope.sortReverse  = true;

            $scope.searchClientId = "";
            $scope.searchConfigKey ="";
            $scope.searchConfigValue="";

            $scope.successMsg ="";
            $scope.errorMsg ="";

            $scope.selectedConfig ="";
            $scope.originaConfig = "";
            $scope.configEditErrorMsg ="";
            $scope.configEditSuccessMsg="";


            var getConfigList = function() {
                if(!localStorage.getItem('currentUser') || $rootScope.currentUser.role !== 'admin'){
                    $state.go('login');
                }
                spinner.spin(pageCenter);
                ConfigurationsService.getConfigList(
                    $scope.searchClientId,
                    $scope.searchConfigKey,
                    $scope.searchConfigValue,
                    $scope.sortType,
                    $scope.sortReverse
                ).then(
                    function(response) {
                        spinner.stop();
                        $scope.configList = response;
                    },
                    function(error) {
                        spinner.stop();
                        $scope.errorMsg ="Error: Can't get Configuration from Server.";
                    }
                )
            };
            getConfigList();
            var clearMsg = function() {
                $scope.configEditSuccessMsg = "";
                $scope.configEditErrorMsg ="";
            };
            $scope.update = function(data) {
                clearMsg();
                $scope.selectedConfig =   data;
                $scope.originaConfig = JSON.parse(JSON.stringify(data));
                $("#configEditDialog").modal({
                    show:true
                });
            };

            $scope.cancel = function() {
                for (var key in $scope.originaConfig) {
                    $scope.selectedConfig[key] =  $scope.originaConfig[key];
                }

                $("#configEditDialog").modal({
                    show:false
                });
            };

            $scope.updateConfiguration = function() {
                clearMsg();
                if(typeof($scope.selectedConfig.configKey) == 'undefined' || typeof($scope.selectedConfig.configValue) == 'undefined') {
                    $scope.configEditErrorMsg= "Error: Key and Value are required!";
                    return;
                }
                if(typeof($scope.selectedConfig.id) != 'undefined' && $scope.selectedConfig.id != '') {
                    ConfigurationsService.updateConfig(
                        $scope.selectedConfig).then(
                        function(response){
                            $scope.configEditSuccessMsg ="Update Configuration success!";
                        },
                        function(error) {
                            $scope.configEditErrorMsg= "Error: updated configuration error!";
                        }
                    );
                } else {
                    ConfigurationsService.createConfig($scope.selectedConfig).then(
                        function(response){
                            $scope.configEditSuccessMsg ="Create Configuration success!";
                            $scope.configList.push(response);
                        },
                        function(error){
                            $scope.configEditErrorMsg= "Error: create configuration error!";
                        }
                    );
                }
            };

            $scope.createConfig = function() {
                clearMsg();
                $scope.selectedConfig = new Object();
                $("#configEditDialog").modal({
                    show:true
                });
            };
            $scope.search = function() {
                getConfigList();
            };
            $scope.sortField = function(fieldName) {
                $scope.sortType = fieldName;
                $scope.sortReverse = !$scope.sortReverse;
                getConfigList();
            };
        }]);