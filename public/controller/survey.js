/**
 * Created by jamesxieaudaexplorecom on 12/18/15.
 */
angular
    .module('mbeapp')
    .controller('SurveyController',['$scope','$state','SurveyDataService','NavigateService',
        function($scope,$state,SurveyDataService,NavigateService) {
            NavigateService.selectedTab = 3;
            $scope.clients = CLIENTS_INFO;
            $scope.surveyList = [];
            $scope.searchClientId = "";
            $scope.searchBeginDate="";
            $scope.searchEndDate="";
            $scope.errorMsg ="";
            $scope.successMsg = "";
            $scope.totalSurveyCount = 0;
            $scope.pageList =[];

            $scope.datepickerInti=function(event) {
                var view = this;
                $(event.currentTarget).datepicker({
                    orientation: "bottom auto",
                    autoclose: true,
                    todayHighlight: true,
                    dateFormat:'yy-mm-dd',
                    defaultDate:view.selectedDate,
                    onSelect:function(dateText,datePicker) {
                        view.selectedDate = dateText;
                    }
                });
            };

            var getSurveyData = function() {
                if(!localStorage.getItem('currentUser')){
                    $state.go('login');
                }
                spinner.spin(pageCenter);
                SurveyDataService.getSurveyList(
                    $scope.searchClientId,
                    $scope.searchBeginDate,
                    $scope.searchEndDate).then(
                    function(response){
                        spinner.stop();
                        $scope.surveyList = response;
                        var sumQ1 = 0;
                        var sumQ2 = 0;
                        var sumQ3 = 0;
                        $scope.surveyList.forEach(function(survey){
                            sumQ1 += Number(survey.questionsRatings.q1rating);
                            sumQ2 += Number(survey.questionsRatings.q2rating);
                            sumQ3 += Number(survey.questionsRatings.q3rating);
                        });
                        $scope.avgScore1 = Math.round((sumQ1/$scope.surveyList.length)*100)/100;
                        $scope.avgScore2 = Math.round((sumQ2/$scope.surveyList.length)*100)/100;
                        $scope.avgScore3 = Math.round((sumQ3/$scope.surveyList.length)*100)/100;
                    },
                    function(error) {
                        spinner.stop();
                        $scope.errorMsg ="Error Can't get Survey Data from Server.";
                    }
                );
            };

            getSurveyData();
            $scope.search = function() {
                $scope.searchBeginDate = $("#searchStartDate").val();
                $scope.searchEndDate= $("#searchEndDate").val();
                getSurveyData();
            };
            $scope.getDataContent = function(data) {
                return (typeof(data.comments) !=='undefined')? data.comments : "";
            }

        }]);