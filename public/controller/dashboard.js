/**
 * Created by jamesxieaudaexplorecom on 12/16/15.
 */
angular
    .module('mbeapp')
    .controller('DashboardController',['$scope','$http','$state','$timeout','$interval',
        'ClaimService','SurveyDataService', 'MetricsDataService','CommErrorsService','NavigateService', 'AttachmentService',
        function($scope,$http,$state,$timeout,$interval,
                 ClaimService,SurveyDataService,MetricsDataService,CommErrorsService,NavigateService,AttachmentService) {
            NavigateService.selectedTab = 2;
            var totalMonths = ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
            var startDates = ["1-1","2-1","3-1","4-1","5-1","6-1","7-1","8-1","9-1","10-1","11-1","12-1"];
            var endDates = ["1-31","2-30","3-31","4-30","5-31","6-30","7-31","8-31","9-30","10-31","11-30","12-31"];
            $scope.clients = CLIENTS_INFO;
            $scope.dataRange =0;
            $scope.surveyDataRange = 0;
            $scope.errorMsg = "";
            $scope.searchClientId="";
            $scope.surveySearchClientId = "";
            $scope.avgNumOfSubmitted = 0;
            $scope.avgNumOfSubmitted2Hours = 0;
            $scope.avgNumOfSubmitted8Hours = 0;
            $scope.avgNumOfSubmitted1Week = 0;
            $scope.totalSubmitNumberGreatThenFive = 0;
            $scope.statisticsBackground = "background1";
            $scope.issueBackground ="background2";
            $scope.submitedBackground = 'background3';

            var getClaimStatusCountData = function(label, begin, end,arrayTotal,array1,array2, array3) {
                $scope.labels.push(label);
                ClaimService.getClaimCount('',$scope.searchClientId,begin,end).then(
                    function(res) {
                        arrayTotal.push(res.count);
                    },
                    function(error){
                        arrayTotal.push(0);
                    }
                );
                ClaimService.getClaimCountByClaimStatus('',$scope.searchClientId,"lt",begin,end).then(
                    function(res) {
                        array1.push(res.count);
                    },
                    function(error){
                        array1.push(0);
                    }
                );
                ClaimService.getClaimCountByClaimStatus('',$scope.searchClientId,'',begin,end).then(
                    function(res) {
                        array2.push(res.count);
                    },
                    function(error){
                        array2.push(0);
                    }
                );
                ClaimService.getClaimCountByClaimStatus('',$scope.searchClientId,"gt",begin,end).then(
                    function(res) {
                        array3.push(res.count);
                    },
                    function(error){
                        array3.push(0);
                    }
                );
            };

            var getSurveyCountData = function(label, begin, end,array1,array2,array3) {
                $scope.surveyLabels.push(label);

                SurveyDataService.getSurveyList(
                    $scope.surveySearchClientId,
                    begin,
                    end).then(
                    function(response){
                        var sumQ1 = 0;
                        var sumQ2 = 0;
                        var sumQ3 = 0;
                        response.forEach(function(survey){
                            sumQ1 += Number(survey.questionsRatings.q1rating);
                            sumQ2 += Number(survey.questionsRatings.q2rating);
                            sumQ3 += Number(survey.questionsRatings.q3rating);
                        });

                        array1.push(response.length == 0 ?0:Math.round((sumQ1/response.length)*100)/100);
                        array2.push(response.length == 0 ?0:Math.round((sumQ2/response.length)*100)/100);
                        array3.push(response.length == 0 ?0:Math.round((sumQ3/response.length)*100)/100);
                    },
                    function(error) {
                        $scope.errorMsg ="Error Can't get Survey Data from Server.";
                    }
                );
            };

            var initSurveyMonths = function() {
                $scope.surveyLabels = [];
                $scope.surveyData = [];
                var array1 = [];
                var array2 = [];
                var array3 = [];
                var label = "";
                for (var i = -1; i < 7; i++) {
                    var date = new Date();
                    date.setMonth(date.getMonth()-(6-i));
                    var currentYear = date.getFullYear();
                    var currentMonth = date.getMonth();
                    label = totalMonths[date.getMonth()];
                    var begin = formatDate(new Date(currentYear,currentMonth,1));
                    var end  = formatDate(new Date(currentYear,currentMonth+1,0));
                    if(i == -1) {
                        label = "Total";
                        date.setDate(date.getDate()-(6-i+1));
                        begin = formatDate(date);
                        end = formatDate(new Date());
                    }
                    getSurveyCountData(label,begin,end,array1,array2,array3);
                }
                $scope.surveySeries = ['Question 1','Querstion 2','Querstion 3'];
                $scope.surveyData =[array1,array2,array3];
                $scope.surveyColours= ['#ff0000','#0000ff','#00ff00'];
            };

            var getStartAndEndDate = function(dateStrs) {
                var res = [];
                for (var i = 0; i < 7 ; i++) {
                    var date = new Date();
                    date.setDate(date.getDate()-(6-i)*7);
                    var weekDays = startAndEndOfWeek(date);
                    if (formatDateDay(weekDays[0]) == dateStrs[0].trim() && formatDateDay(weekDays[1]) == dateStrs[1].trim()) {
                        res.push(formatDate(weekDays[0]));
                        res.push(formatDate(weekDays[1]));
                        return res;
                    }
                }
                return res;
            };

            var initSurveyWeeks = function() {
                $scope.surveyLabels = [];
                $scope.surveyData = [];
                var label = "";
                var array1 = [];
                var array2 = [];
                var array3 = [];
                for (var i = -1; i < 7; i++) {
                    var date = new Date();
                    date.setDate(date.getDate()-(6-i)*7);
                    var weekDays = startAndEndOfWeek(date);
                    label = formatDateDay(weekDays[0]) +"-"+ formatDateDay(weekDays[1]);
                    var begin = formatDate(weekDays[0]);
                    var end  =  formatDate(weekDays[1]);
                    if(i == -1) {
                        label = "Total";
                        date.setDate(date.getDate()-(6-i+1));
                        begin = formatDate(date);
                        end = formatDate(new Date());
                    }
                    getSurveyCountData(label,begin,end,array1,array2,array3);
                }
                $scope.surveySeries = ['Question 1','Querstion 2','Querstion 3'];
                $scope.surveyData =[array1,array2,array3];
                $scope.surveyColours= ['#ff0000','#0000ff','#00ff00'];
            };

            var getSearchDayDate = function(oneDay) {
                var res = ""
                for (var i = 0; i < 7 ; i++) {
                    var date = new Date();
                    date.setDate(date.getDate()-(6-i));
                    if (formatDateDay(date) == oneDay.trim()) {
                        res = formatDate(date);
                        return res;
                    }
                }
                return res;
            };
            var initSurveyDays = function() {
                $scope.surveyLabels = [];
                $scope.surveyData = [];
                var array1 = [];
                var array2 = [];
                var array3 = [];
                var label = "";
                for (var i = -1; i < 7; i++) {
                    var date = new Date();
                    date.setDate(date.getDate()-(6-i));
                    var dateString = formatDate(date);
                    label = formatDateDay(date);
                    var begin =dateString;
                    var end  =dateString;
                    if(i == -1) {
                        label = "Total";
                        date.setDate(date.getDate()-(6-i+1));
                        begin = formatDate(date);
                        end = formatDate(new Date());
                    }
                    getSurveyCountData(label,begin,end,array1,array2,array3);
                }

                $scope.surveySeries = ['Question 1','Querstion 2','Querstion 3'];
                $scope.surveyData =[array1,array2,array3];
                $scope.surveyColours= ['#ff0000','#0000ff','#00ff00'];
            };

            var initMonths = function() {
                $scope.labels = [];
                $scope.data = [];
                var arrayTotal=[];
                var array1 = [];
                var array2 = [];
                var array3 = [];
                var label = "";
                for (var i = 0; i < 7; i++) {
                    var date = new Date();
                    date.setMonth(date.getMonth()-(6-i));
                    var currentYear = date.getFullYear();
                    var currentMonth = date.getMonth();
                    label = totalMonths[date.getMonth()];
                    var begin = formatDate(new Date(currentYear,currentMonth,1));
                    var end  = formatDate(new Date(currentYear,currentMonth+1,0));
                    if(i == -1) {
                        label = "Total";
                        date.setDate(date.getDate()-(6-i+1));
                        begin = formatDate(date);
                        end = formatDate(new Date())
                    }
                    getClaimStatusCountData(label,begin,end,arrayTotal,array1,array2,array3);
                }
                $scope.series = ['Total','Status 0-4', 'Status 5', 'Status 6-7'];
                $scope.data =[arrayTotal,array1,array2,array3];
            };

            var initWeeks = function() {
                $scope.labels = [];
                $scope.data = [];
                var arrayTotal=[];
                var array1 = [];
                var array2 = [];
                var array3 = [];
                var label = "";
                for (var i = 0; i < 7; i++) {
                    var date = new Date();
                    date.setDate(date.getDate()-(6-i)*7);
                    var weekDays = startAndEndOfWeek(date);
                    label = formatDateDay(weekDays[0]) +"-"+ formatDateDay(weekDays[1]);
                    var begin = formatDate(weekDays[0]);
                    var end  =  formatDate(weekDays[1]);
                    if(i == -1) {
                        label = "Total";
                        date.setDate(date.getDate()-(6-i+1));
                        begin = formatDate(date);
                        end = formatDate(new Date())
                    }
                    getClaimStatusCountData(label,begin,end,arrayTotal,array1,array2,array3);
                }
                $scope.series = ['Total','Status 0-4', 'Status 5', 'Status 6-7'];
                $scope.data =[arrayTotal,array1,array2,array3];
            };


            var initDays = function() {
                $scope.labels = [];
                $scope.data = [];
                var arrayTotal=[];
                var array1 = [];
                var array2 = [];
                var array3 = [];
                var label = "";

                for (var i = 0; i < 7; i++) {
                    var date = new Date();
                    date.setDate(date.getDate()-(6-i));
                    var dateString = formatDate(date);
                    label = formatDateDay(date);
                    var begin =dateString;
                    var end  =dateString;
                    if(i == -1) {
                        label = "Total";
                        date.setDate(date.getDate()-(6-i+1));
                        begin = formatDate(date);
                        end = formatDate(new Date())
                    }
                    getClaimStatusCountData(label,begin,end,arrayTotal,array1,array2,array3);
                }
                $scope.series = ['Total','Status 0-4', 'Status 5', 'Status 6-7'];
                $scope.data =[arrayTotal,array1,array2,array3];
            };

            var initCommErrorData = function() {
                CommErrorsService.getCommErrorsCount('',false).then(function(response){
                    $scope.totalCommerrorCount = response.count;
                },function(error){
                    $scope.totalCommerrorCount = 0;
                });
            };
            var initTotalData = function() {
                $scope.errorMsg = "";
                var date = new Date();
                var begin = "";
                var end ="";
                switch($scope.dataRange){
                    case 0:
                        $scope.rangeString = "DAYS";
                        date.setDate(date.getDate()-6);
                        begin = formatDate(date);
                        end = formatDate(new Date());
                        break;
                    case 1:
                        date.setDate(date.getDate()-6*7);
                        begin = formatDate(date);
                        end = formatDate(new Date());
                        $scope.rangeString = "WEEKS";
                        break;
                    case 2:
                        date.setMonth(date.getMonth()-6);
                        var currentYear = date.getFullYear();
                        begin =currentYear+"-"+startDates[date.getMonth()];
                        var endDate = new Date();
                        end  =endDate.getFullYear()+"-"+endDates[endDate.getMonth()];
                        $scope.rangeString = "MONTHS";
                        break;
                }

                ClaimService.getClaimCount(
                    $scope.searchClaimNumber,
                    $scope.searchClientId,
                    begin,
                    end).then(
                    function(response) {
                        $scope.totalClaimCount = response.count;
                        $scope.totalPages = $scope.totalClaimCount/$scope.claimPerPage;
                        $scope.totalPages = Math.ceil($scope.totalPages);
                        ClaimService.getClaimSubmittedCount(
                            $scope.searchClaimNumber,
                            $scope.searchClientId,
                            begin,
                            end).then(
                            function(submitdata){
                                $scope.totalSubmit=submitdata.count;
                                $scope.percentageSubmitted=(submitdata.count*100)/$scope.totalClaimCount;
                                $scope.percentageSubmitted =  Math.round($scope.percentageSubmitted*10)/10;
                                if(isNaN($scope.percentageSubmitted)) {
                                    $scope.percentageSubmitted = 0;
                                    $scope.statisticsBackground = "background-error";
                                } else {
                                    $scope.statisticsBackground = "background1";
                                }
                                SurveyDataService.getSurveyDataCount(
                                    $scope.searchClientId,
                                    begin,
                                    end).then(
                                    function(surveydata){
                                        $scope.surveysSubmitted=surveydata.count;
                                        $scope.percentageSurveysSubmitted=(surveydata.count*100)/$scope.totalSubmit;
                                        $scope.percentageSurveysSubmitted = Math.round($scope.percentageSurveysSubmitted*10)/10;
                                    },
                                    function(error){
                                        $scope.errorMsg ="Error: can't get count for submitted survey claims.";
                                    }
                                );
                            },
                            function(error){
                                $scope.errorMsg ="Error: can't get count for submitted claims.";
                            }
                        );
                    }, function (error) {
                        $scope.errorMsg ="Error: can't get count of the claims.";
                    });
            };
            var initClaimStatusFiveCount = function() {
                ClaimService.getClaimStatusFiveThen24Hours('',$scope.searchClientId).then(
                    function(response){
                        $scope.claimsInStatusFive = response.count;
                    },
                    function(error){
                        $scope.claimsInStatusFive = 0;
                    }
                );
            };
            var initSubmittedCountData = function() {
                MetricsDataService.getMetricsDataCounts($scope.searchClientId,"MobileBackendJob_PhotosEmailSent_Appraiser").then(
                  function(response) {
                      var submittedClaimCounter = response.count;
                      console.log("Total MobileBackendJob_PhotosEmailSent_Appraiser of " + response.count);
                      MetricsDataService.getMetricsDataCounts($scope.searchClientId,"Photos_Submit_ButtonClicked").then(
                          function(response){
                              var totalTimeClickSubmitted = response.count;
                              console.log("Total Photos_Submit_ButtonClicked of " + response.count);
                              MetricsDataService.getMetricsDataCounts($scope.searchClientId,"ClaimNotes_Submit_ButtonClicked").then(
                                  function(response){
                                      console.log("Total ClaimNotes_Submit_ButtonClicked of " + response.count);
                                      totalTimeClickSubmitted +=response.count;
                                      $scope.avgNumOfSubmitted = Math.round((totalTimeClickSubmitted/submittedClaimCounter)*100)/100;
                                      if(isNaN($scope.avgNumOfSubmitted)) {
                                          $scope.avgNumOfSubmitted = 0;
                                          $scope.submitedBackground = 'background-error';
                                      } if($scope.avgNumOfSubmitted > 2.0){
                                          $scope.submitedBackground = 'background-error';
                                      } else {
                                          $scope.submitedBackground = 'background3';
                                      }
                                  },
                                  function(error) {
                                      $scope.errorMsg ="Error:Can't get total submit click count!";
                                  }
                              );
                          },
                          function(error){
                             $scope.errorMsg ="Error:Can't get total submit click count!";
                          }
                      );
                  },
                  function(error){
                        $scope.errorMsg = "Error:Can't get total submit claim count!";
                  }
              );
            };

            
            /////////////////////////////////////////////////////////////////
            var initSubmittedCountData1Week = function() {
                MetricsDataService.getMetricsDataCounts1Week($scope.searchClientId,"MobileBackendJob_PhotosEmailSent_Appraiser").then(
                  function(response) {
                      var submittedClaimCounter = response.count;
                      console.log("Total MobileBackendJob_PhotosEmailSent_Appraiser of " + response.count);
                      MetricsDataService.getMetricsDataCounts1Week($scope.searchClientId,"Photos_Submit_ButtonClicked").then(
                          function(response){
                              var totalTimeClickSubmitted = response.count;
                              console.log("Total Photos_Submit_ButtonClicked of " + response.count);
                              MetricsDataService.getMetricsDataCounts1Week($scope.searchClientId,"ClaimNotes_Submit_ButtonClicked").then(
                                  function(response){
                                      console.log("Total ClaimNotes_Submit_ButtonClicked of " + response.count);
                                      totalTimeClickSubmitted +=response.count;
                                      $scope.avgNumOfSubmitted1Week = Math.round((totalTimeClickSubmitted/submittedClaimCounter)*100)/100;
                                      if(isNaN($scope.avgNumOfSubmitted1Week)) {
                                          $scope.avgNumOfSubmitted1Week = 0;
                                          $scope.submitedBackground = 'background-error';
                                      } if($scope.avgNumOfSubmitted1Week > 2.0){
                                          $scope.submitedBackground = 'background-error';
                                      } else {
                                          $scope.submitedBackground = 'background3';
                                      }
                                  },
                                  function(error) {
                                      $scope.errorMsg ="Error:Can't get total submit click count!";
                                  }
                              );
                          },
                          function(error){
                             $scope.errorMsg ="Error:Can't get total submit click count!";
                          }
                      );
                  },
                  function(error){
                        $scope.errorMsg = "Error:Can't get total submit claim count!";
                  }
              );
            };
            ////////////////////////////////////////////////////////////////
            
            /////////////////////////////////////////////////////////////////
            var initSubmittedCountData2Hours = function() {
                MetricsDataService.getMetricsDataCounts2Hours($scope.searchClientId,"MobileBackendJob_PhotosEmailSent_Appraiser").then(
                  function(response) {
                      var submittedClaimCounter = response.count;
                      console.log("Total MobileBackendJob_PhotosEmailSent_Appraiser of " + response.count);
                      MetricsDataService.getMetricsDataCounts2Hours($scope.searchClientId,"Photos_Submit_ButtonClicked").then(
                          function(response){
                              var totalTimeClickSubmitted = response.count;
                              console.log("Total Photos_Submit_ButtonClicked of " + response.count);
                              MetricsDataService.getMetricsDataCounts2Hours($scope.searchClientId,"ClaimNotes_Submit_ButtonClicked").then(
                                  function(response){
                                      console.log("Total ClaimNotes_Submit_ButtonClicked of " + response.count);
                                      totalTimeClickSubmitted +=response.count;
                                      $scope.avgNumOfSubmitted2Hours = Math.round((totalTimeClickSubmitted/submittedClaimCounter)*100)/100;
                                      if(isNaN($scope.avgNumOfSubmitted2Hours)) {
                                          $scope.avgNumOfSubmitted2Hours = 0;
                                          $scope.submitedBackground = 'background-error';
                                      } if($scope.avgNumOfSubmitted2Hours > 2.0){
                                          $scope.submitedBackground = 'background-error';
                                      } else {
                                          $scope.submitedBackground = 'background3';
                                      }
                                  },
                                  function(error) {
                                      $scope.errorMsg ="Error:Can't get total submit click count!";
                                  }
                              );
                          },
                          function(error){
                             $scope.errorMsg ="Error:Can't get total submit click count!";
                          }
                      );
                  },
                  function(error){
                        $scope.errorMsg = "Error:Can't get total submit claim count!";
                  }
              );
            };
            ////////////////////////////////////////////////////////////////
            
            /////////////////////////////////////////////////////////////////
            var initSubmittedCountData8Hours = function() {
                MetricsDataService.getMetricsDataCounts8Hours($scope.searchClientId,"MobileBackendJob_PhotosEmailSent_Appraiser").then(
                  function(response) {
                      var submittedClaimCounter = response.count;
                      console.log("Total MobileBackendJob_PhotosEmailSent_Appraiser of " + response.count);
                      MetricsDataService.getMetricsDataCounts8Hours($scope.searchClientId,"Photos_Submit_ButtonClicked").then(
                          function(response){
                              var totalTimeClickSubmitted = response.count;
                              console.log("Total Photos_Submit_ButtonClicked of " + response.count);
                              MetricsDataService.getMetricsDataCounts8Hours($scope.searchClientId,"ClaimNotes_Submit_ButtonClicked").then(
                                  function(response){
                                      console.log("Total ClaimNotes_Submit_ButtonClicked of " + response.count);
                                      totalTimeClickSubmitted +=response.count;
                                      $scope.avgNumOfSubmitted8Hours = Math.round((totalTimeClickSubmitted/submittedClaimCounter)*100)/100;
                                      if(isNaN($scope.avgNumOfSubmitted8Hours)) {
                                          $scope.avgNumOfSubmitted8Hours = 0;
                                          $scope.submitedBackground = 'background-error';
                                      } if($scope.avgNumOfSubmitted8Hours > 2.0){
                                          $scope.submitedBackground = 'background-error';
                                      } else {
                                          $scope.submitedBackground = 'background3';
                                      }
                                  },
                                  function(error) {
                                      $scope.errorMsg ="Error:Can't get total submit click count!";
                                  }
                              );
                          },
                          function(error){
                             $scope.errorMsg ="Error:Can't get total submit click count!";
                          }
                      );
                  },
                  function(error){
                        $scope.errorMsg = "Error:Can't get total submit claim count!";
                  }
              );
            };
            ////////////////////////////////////////////////////////////////
            
            var initSubmittedCountGreatThenFiveData = function() {
                MetricsDataService.getMetricsDatas($scope.searchClientId,"Photos_Submit_ButtonClicked").then(
                    function(response) {
                        var metricsDatas1 = response;
                        var dataMap = new Object();
                        var iteratorFunction = function(element) {
                            if(dataMap.hasOwnProperty(element.claim_objectId)) {
                                dataMap[element.claim_objectId] = dataMap[element.claim_objectId] + 1;
                            } else {
                                dataMap[element.claim_objectId] = 1;
                            }
                        };
                        metricsDatas1.forEach(function(el) {
                            iteratorFunction(el);
                        });
                        MetricsDataService.getMetricsDatas($scope.searchClientId,"ClaimNotes_Submit_ButtonClicked").then(
                            function(response){
                                var metricsDatas2 = response;
                                metricsDatas2.forEach(function(el){
                                    iteratorFunction(el);
                                });
                                var totalNumbers = 0;
                                for(var key in dataMap) {
                                    if(dataMap[key] > 5) {
                                        totalNumbers++;
                                    }
                                }
                                $scope.totalSubmitNumberGreatThenFive = totalNumbers;
                            },
                            function(error){
                                $scope.errorMsg ="Error:Can't get Metrics data from server!";
                            }
                        );
                    },
                    function(error){
                        $scope.errorMsg = "Error:Can't get Metrics data from server!";
                    }
                );
            };

            var initClaim = function() {
                switch($scope.dataRange){
                    case 0:
                        initDays();
                        break;
                    case 1:
                        initWeeks();
                        break;
                    case 2:
                        initMonths();
                        break;
                }
            };
            var initSurvey = function() {
                switch($scope.surveyDataRange){
                    case 0:
                        initSurveyDays();
                        break;
                    case 1:
                        initSurveyWeeks();
                        break;
                    case 2:
                        initSurveyMonths();
                        break;
                }
            };

            var init = function() {
                if(!localStorage.getItem('currentUser')){
                    $state.go('login');
                }
                initStatisticData();
                initClaim();
                initSurvey();
            };
            var initStatisticData = function() {
                initTotalData();
                initCommErrorData();
                initClaimStatusFiveCount();
                initSubmittedCountData();
                initSubmittedCountData1Week();
                initSubmittedCountData2Hours();
                initSubmittedCountData8Hours();
                initSubmittedCountGreatThenFiveData();
            };

            init();
            //Every 3 minutes refreshing the Dashboard.
            $scope.intervalPromise = $interval(function(){
                initStatisticData();
            }, 180000);

            $scope.updateClientId = function(value) {
                $scope.searchClientId = value;
                console.log($scope.searchClientId);
                initClaim();
                initTotalData();
            };
            $scope.dataRangeChange = function(value) {
                $scope.dataRange = value;
                initClaim();
                initTotalData();
            };

            $scope.updateSurveyClientId = function(value) {
                $scope.surveySearchClientId = value;
                initSurvey();
            };
            $scope.surveyDataRangeChange = function(value) {
                $scope.surveyDataRange = value;
                initSurvey();
            };
            var getMonthIndex = function(month) {
                var index = 0;
                totalMonths.forEach(function(value,i){
                    if(value == month) {
                        index = i;
                    }
                });
                return index;
            };
            $scope.onSurveyClick = function (points, evt) {
                console.log(points, evt);
                var begin = "";
                var end  = "";
                if (points[0].label.indexOf("Total") < 0) {
                    switch($scope.surveyDataRange) {
                        case 0:
                            var selectedDate = getSearchDayDate(points[0].label);
                            begin = selectedDate;
                            end = selectedDate;
                            break;
                        case 1:
                            var labels = points[0].label.split("-");
                            var startEnds = getStartAndEndDate(labels);
                            begin = startEnds[0];
                            end = startEnds[1];
                            break;
                        case 2:
                            var date = new Date();
                            var currentMonth = date.getMonth();
                            var currentYear = date.getFullYear();
                            var index = getMonthIndex(points[0].label);
                            if(index <= currentMonth) {
                                begin = formatDate(new Date(currentYear,index,1));
                                end = formatDate(new Date(currentYear,index+1,0));
                            } else {
                                begin = formatDate(new Date(currentYear-1,index,1));
                                end = formatDate(new Date(currentYear-1,index+1,0));
                            }
                            break;
                    }
                }
                $state.go("all-claims",{'begin':begin,'end':end,'orgId':$scope.surveySearchClientId});
            };
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
                var begin = "";
                var end  = "";
                switch($scope.dataRange) {
                    case 0:
                        var selectedDate = getSearchDayDate(points[0].label);
                        begin = selectedDate;
                        end = selectedDate;
                        break;
                    case 1:
                        var labels = points[0].label.split("-");
                        var startEnds = getStartAndEndDate(labels);
                        begin = startEnds[0];
                        end = startEnds[1];
                        break;
                    case 2:
                        var date = new Date();
                        var currentMonth = date.getMonth();
                        var currentYear = date.getFullYear();
                        var index = getMonthIndex(points[0].label);
                        if(index <= currentMonth) {
                            begin = formatDate(new Date(currentYear,index,1));
                            end = formatDate(new Date(currentYear,index+1,0));
                        } else {
                            begin = formatDate(new Date(currentYear-1,index,1));
                            end = formatDate(new Date(currentYear-1,index+1,0));
                        }
                        break;
                }
                $state.go("all-claims",{'begin':begin,'end':end,'orgId':$scope.searchClientId});
            };
        }]);