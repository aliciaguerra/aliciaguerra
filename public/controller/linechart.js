/**
 * Created by jamesxieaudaexplorecom on 9/21/15.
 */
angular
    .module('mbeapp')
    .controller('LineChartController',['$scope','ClaimService','NavigateService',
        function($scope,ClaimService,NavigateService) {
            /*
            NavigateService.changeNavTab(2);
            var totalMonths = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
            var startDates = ["1-1","2-1","3-1","4-1","5-1","6-1","7-1","8-1","9-1","10-1","11-1","12-1"];
            var endDates = ["1-31","2-30","3-31","4-30","5-31","6-30","7-31","8-31","9-30","10-31","11-30","12-31"];
            var d = new Date();
            var currentMonth = d.getMonth();
            var currentYear = d.getFullYear();
            $scope.labels = [];
            $scope.realStartDates =[];
            $scope.realEndDates =[];
            var array1 = [];
            var array2 = [];
            for (var i =0; i <= currentMonth;i++) {
                $scope.labels.push(totalMonths[i]);
                var begin =currentYear+"-"+startDates[i];
                var end  =currentYear+"-"+endDates[i];
                ClaimService.getClaimCount('',begin,end).then(
                    function(res) {
                        array1.push(res.count);
                    },
                    function(error){
                        array1.push(0);
                    }
                );
                ClaimService.getClaimSubmittedCount('',begin,end).then(
                    function(res) {
                        array2.push(res.count);
                    },
                    function(error){
                        array2.push(0);
                    }
                );
            }

            $scope.series = ['Total Claims', 'Submitted Claims'];
            $scope.data = [
               array1, array2
            ];
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };

            */

            $scope.medal_ticks = ['Gold', 'Silver', 'Bronze', 'Not passed'];
            $scope.series = ['Medaljer'];
            $scope.medals_colours = [{fillColor:['#087D76', '#B3BC3A', '#38B665', '#8B4A9D']}];

            $scope.medal_data = [['1','2'], ['5','6'], ['2','4'], ['0','2']];
    }]);