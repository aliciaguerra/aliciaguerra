/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .controller('AllClaimsController',['$scope','ClaimService','SurveyDataService','$state','$http','NavigateService','$rootScope','$stateParams',
        function($scope, ClaimService,SurveyDataService,$state,$http,NavigateService,$rootScope,$stateParams) {

            $scope.clients = CLIENTS_INFO;
            $scope.errorMsg ="";
            $scope.claimList =[];
            $scope.totalClaimCount = 0;
            $scope.claimPerPage = 100;
            $scope.currentPage = 1;
            $scope.totalPages = 1;
            $scope.pageList =[];
            $scope.sortType     = 'createdDate'; // set the default sort type
            $scope.sortReverse  = true;
            $scope.searchCategory="";
            $scope.searchClaimNumber = "";
            $scope.searchVOPhoneNumber = "";
            $scope.searchVOEmailAddress = "";
            $scope.searchClaimStatus ="";
            $scope.searchStartDate = $stateParams.begin;
            $scope.searchEndDate =$stateParams.end;
            $scope.searchClientId = $stateParams.orgId;

            NavigateService.selectedTab = 0;

            $scope.pageChanged = function(newPage) {
                getResultsPage(newPage);
            };

            $scope.closeErrorMsg = function() {
                $scope.errorMsg ="";
            };
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

            $scope.search = function() {
                getResultsPage(1);
            };

            $scope.lastSevenDays = function() {
                var date = new Date();
                date.setDate(date.getDate() - 6);
                $scope.searchStartDate = formatDate(date);
                $scope.searchEndDate = formatDate(new Date());
                getResultsPage(1);
            };
            $scope.lastThirdDays = function() {
                var date = new Date();
                date.setDate(date.getDate() - 29);
                $scope.searchStartDate = formatDate(date);
                $scope.searchEndDate = formatDate(new Date());
                getResultsPage(1);
            };
            $scope.isSelectedPage = function(pageNunber) {
                return $scope.currentPage == pageNunber;
            };

            var getResultsPage= function(pageNumber){
                if(!localStorage.getItem('currentUser')){
                    $state.go('login');
                }
                spinner.spin(pageCenter);
                $scope.searchStartDate = trimString($scope.searchStartDate);
                var beginDate = $scope.searchStartDate ? $scope.searchStartDate : this.$("#searchStartDate").val();
                beginDate = trimString(beginDate);
                $scope.searchEndDate = trimString($scope.searchEndDate);
                var endDate = $scope.searchEndDate ? $scope.searchEndDate: this.$("#searchEndDate").val();
                endDate = trimString(endDate);
                $scope.currentPage = pageNumber;

                if($scope.currentPage == 1) {
                    ClaimService.getClaimCountBySearch(
                        $scope.searchClaimNumber,
                        $scope.searchClientId,
                        beginDate,
                        endDate,
                        $scope.searchVOPhoneNumber,
                        $scope.searchVOEmailAddress,
                        $scope.searchClaimStatus).then(
                        function(response) {
                            $scope.totalClaimCount = response.count;
                            $scope.totalPages = $scope.totalClaimCount/$scope.claimPerPage;
                            $scope.totalPages = Math.ceil($scope.totalPages);
                            iniPages($scope);
                        }, function (error) {
                            $scope.errorMsg ="Error: can't get count of the claims.";
                        });
                } else {
                    iniPages($scope);
                }

                ClaimService.getClaimList(
                    $scope.searchClaimNumber,
                    $scope.searchClientId,
                    beginDate,
                    endDate,
                    $scope.currentPage,
                    $scope.claimPerPage,
                    $scope.searchVOPhoneNumber,
                    $scope.searchVOEmailAddress,
                    $scope.searchClaimStatus,
                    $scope.sortType.split(','),$scope.sortReverse).then(
                    function(res){
                        spinner.stop();
                        if(res.length == 0) {
                            $scope.errorMsg="Error can't find any claim based on the query condition!";
                        } else {
                            $scope.claimList = res;
                        }
                    },function(error){
                        spinner.stop();
                        $scope.errorMsg="Error occurred on server side.";
                    }
                );
            };

            getResultsPage(1);

            $scope.getVehicle = function(claim) {
                var year = (claim.estimateVehicleYear == null ? "" : claim.estimateVehicleYear);
                var make = (claim.estimateVehicleMake == null? "" : claim.estimateVehicleMake);
                var model = (claim.estimateVehicleModel == null ? "" : claim.estimateVehicleModel);

                var output = year;
                if(make.length > 0){
                    output = output + " " + make;
                }
                if(model.length > 0){
                    output = output + " " + model;
                }
                return output;
            };
            $scope.getClaimStatus = function(claim) {
                return getClaimStatus(claim);
            };
            $scope.getClientName = function(claim) {
                return getClientName(claim);
            };
            $scope.selectClaim = function(claim) {
                ClaimService.selectOneClaim(claim);
            };
            $scope.sortField = function(fieldName) {
                $scope.sortType= fieldName;
                $scope.sortReverse = !$scope.sortReverse;
                getResultsPage(1);
            };

            $scope.getHeader = function() {
                return ["Pass Code", "Claim Number", "Vehicle", "Status", "Company Name", "Created Date"];
            };
            $scope.getCSVData = function() {
                var csvData = [];
                for(var i=0; i < $scope.claimList.length;i++) {
                    var obj = new Object();
                    obj.userName= $scope.claimList[i].userName;
                    obj.claimNumber = $scope.claimList[i].claimNumber;
                    obj.vehicle = $scope.getVehicle($scope.claimList[i]);
                    obj.status = getClaimStatus($scope.claimList[i]);
                    obj.companyName = getClientName($scope.claimList[i]);
                    obj.createdDate = $scope.claimList[i].createdDate;
                    csvData.push(obj);
                }
                return csvData;
            };

    }])
    .controller('ClaimDetailsController',['$scope','$http','ClaimService','SurveyDataService','MetricsDataService','AttachmentService','NavigateService',
        '$stateParams','$state', '$location','$rootScope',function($scope,$http,ClaimService,SurveyDataService,MetricsDataService,AttachmentService,NavigateService,$stateParams,$state,$location,$rootScope){
            NavigateService.changeNavTab(-1);
            var id = ClaimService.selectedClaim.id;
            $scope.claim =ClaimService.selectedClaim;
            $scope.errorMsg ="";
            $scope.successMsg="";
            $scope.uploadErrorMsg="";
            $scope.eventList=[];
            $scope.surveyDatas={};
            $scope.submitedImages=[];
            $scope.showMetricsflag = true;
            $scope.searchEventName="";
            $scope.sortType= 'createdDate'; // set the default sort type
            $scope.sortReverse=true;
            $scope.confirmMessage="Are you Sure?";

            $scope.communications=[{value:0,name:"Email"},{value:1,name:"Text"},{value:2,name:"Email and Text"},{value:3,name:"None"}];

            var initial = function() {
                if(!localStorage.getItem('currentUser')){
                    $state.go('login');
                }
                spinner.spin(pageCenter);
                ClaimService.load().then(
                    function(response){
                        spinner.stop();
                        $scope.claim = response;
                    },
                    function(){
                        spinner.stop();
                        $scope.errorMsg ="Can't get claim from server. Please try it later.";
                    }
                );
            };
            $scope.collapse_click = function(event) {
                event.preventDefault();
                $("#accordion").toggleClass("toggled");
            };

            var initialMetricsData = function() {
                if(!localStorage.getItem('currentUser')){
                    $state.go('login');
                }
                spinner.spin(pageCenter);
                MetricsDataService.getMetricsDataByClaimId(
                    id).then(
                    function(response) {
                        spinner.stop();
                        $scope.eventList = response;
                },  function(error) {
                        spinner.stop();
                        $scope.errorMsg ="Can't get metric data from server. Please try it later.";
                });
            };
            initialMetricsData();
            var initialSurveyData = function() {
                if(!localStorage.getItem('currentUser')){
                    $state.go('login');
                }
                spinner.spin(pageCenter);
                SurveyDataService.getSurveyDataByClaimId(id).then(
                    function(response){
                    spinner.stop();
                    $scope.surveyDatas = response[0];
                },function(error){
                    spinner.stop();
                    $scope.errorMsg ="Can't get survey data from server. Please try it later.";
                });
            };
            initialSurveyData();
            var downloadImageContent = function(photo,times) {
                spinner.spin(pageCenter);
                AttachmentService.downloadImageContent(
                    photo,
                    times).then(
                    function(photoContent){
                        spinner.stop();
                        photo.content = photoContent.content;
                        photo.name = photoContent.name;
                },  function(error){
                        spinner.stop();
                        times++;
                        if(times < 3) {
                            downloadImageContent(photo,times);
                        }
                    });
            };
            var chunk = function (arr, size) {
                var newArr = [];
                for (var i=0; i<arr.length; i+=size) {
                    newArr.push(arr.slice(i, i+size));
                }
                return newArr;
            };
            var initialSubmitedImage = function() {
                if(!localStorage.getItem('currentUser')){
                    $state.go('login');
                }
                spinner.spin(pageCenter);
                AttachmentService.initialSubmitedImage(
                    id).then(
                    function(response){
                        spinner.stop();
                        response.forEach(function(photo) {
                            downloadImageContent(photo,0);
                        });
                        $scope.submitedImages = chunk(response, 3);
                },  function(error){
                        spinner.stop();
                        $scope.errorMsg ="Can't get submitted images  from server. Please try it later.";
                    });
            };

            var saveMetrics = function(eventName, claimId) {
                spinner.spin(pageCenter);
                MetricsDataService.saveMetrics(
                    eventName,
                    claimId).then(
                    function(res){
                        spinner.stop();
                        console.log("Save Metrics success.");
                    },
                    function(error){
                        spinner.stop();
                        console.log("Save Metrics data fail.");
                    });
            };

            var updateRemoteClaim = function() {
                spinner.spin(pageCenter);
                ClaimService.update($scope.claim).then(
                    function(res){
                        spinner.stop();
                        $scope.claim = res;
                }, function(error){
                        spinner.stop();
                        $scope.errorMsg ="Update claim error happened on server. Please try it later.";
                });
            };

            initialSubmitedImage();
            $scope.displayLargePhoto = function(image)
            {
                var myWindow = window.open("", "LargePhoto", "width=600, height=480");
                myWindow.document.write("<html><head><title>LargePhoto</title></head><body height=\"100%\" width=\"100%\"><img src=\'data:image/png;base64," + image + "\'/></body></html>");
            };
            $scope.refresh = function()
            {
                initialMetricsData();
                initialSurveyData();
                initialSubmitedImage();
            };
            $scope.closeErrorMsg = function() {
                $scope.errorMsg ="";
            };
            $scope.closeSuccessMsg = function() {
                $scope.successMsg = "";
            };
            $scope.update = function() {
                console.log($scope.claim.vehicleOwnerEmail);
                console.log($scope.claim.vehicleOwnerCellPhone);
                console.log($scope.claim.communicationPreference);
                updateRemoteClaim();
            };

            $scope.getEstimateNetTotal = function() {
                if(isPositiveNumber($scope.claim.estimateNetTotal)) {
                    return $scope.claim.estimateNetTotal
                }   else {
                    return 0;
                }
            };
            $scope.getProgressStepClass = function(status) {
                if ($scope.customerStatus == status) {
                    return "col-sm-2 bs-wizard-step active";
                } else if ($scope.customerStatus > status) {
                    return "col-sm-2 bs-wizard-step complete";
                } else {
                    return "col-sm-2 bs-wizard-step disabled";
                }
            };
            $scope.resendpasscode = function() {
                var claimNumber = $scope.claim.claimNumber;
                spinner.spin(pageCenter);
                $scope.errorMsg = "";
                $scope.successMsg ="";
                ClaimService.resendpasscode(id).then(
                    function(data){
                        spinner.stop();
                        if (typeof(data) === 'undefined' || data === null || typeof(data.error) !== 'undefined') {
                            $scope.errorMsg ="Failed to resend passcode for claim " + claimNumber + ".\nError: nothing return from server. ";
                        } else {
                            saveMetrics('SupportSite_ResendPasscode_ButtonClicked',id,$scope.claim.orgId);
                            $scope.successMsg ="Successfully resend passcode for claim " + claimNumber;
                        }
                    },function(error){
                        spinner.stop();
                        $scope.errorMsg = "Failed to resend passcode for claim " + claimNumber + ".\nError: " + error.message;
                    }
                );
            };
            $scope.hideMetrics = function() {
                $scope.showMetricsflag = false;
            };
            $scope.showMetrics = function() {
                $scope.showMetricsflag = true;
            };

            $scope.resendestimate = function() {
                $scope.claim.customerStatus = 6;
                updateRemoteClaim();
                saveMetrics('SupportSite_ResendEstimate_ButtonClicked',id,$scope.claim.orgId);
            };
            $scope.cancel = function() {
                initial();
            };
            $scope.getClaimStatus = function(claim) {
                return getClaimStatus(claim);
            };
            $scope.openDialog = function(id) {
                var filesSelected = $("#estimateReportInput").prop("files");
                if (typeof (filesSelected) !== 'undefined' && filesSelected.length > 0) {
                    $("#"+id+"").modal({
                        show:true
                    });
                    $scope.errorMsg="";
                } else {
                    $scope.errorMsg="Please select estimate report.";
                }
            };
            $scope.closeDialog = function(id) {
                $("#"+id+"").modal({
                    show:false
                });
                initial();
            };
            $scope.getHighlight = function(event) {
                if (event.eventName =="MobileBackendJob_Claim_Created"
                || event.eventName =="Welcome_PageLoaded"
                || event.eventName =="DamageViewer_PageLoaded"
                || event.eventName =="Photos_PageLoaded"
                || event.eventName =="Photos_Submit_Complete") {
                    return "highlight";
                } else {
                    return "";
                }
            };
            $scope.uploadestimatereport = function() {
                var filesSelected = $("#estimateReportInput").prop("files");
                if (typeof (filesSelected) !== 'undefined' && filesSelected.length > 0) {
                    if(isPositiveNumber($scope.claim.estimateNetTotal)) {
                        $scope.uploadErrorMsg="";
                        var fileToLoad = filesSelected[0];
                        var fileReader = new FileReader();
                        fileReader.onload = function(fileLoadedEvent) {
                            var reportData = btoa(fileLoadedEvent.target.result);
                            spinner.spin(pageCenter);
                            AttachmentService.uploadEstimateReport(
                                reportData,
                                $scope.claim.taskId).then(
                                function(){
                                    spinner.stop();
                                    $scope.claim.customerStatus = 6;
                                    updateRemoteClaim();
                                    $("#estimateNetTotalDialog").modal({
                                        show:false
                                    });
                                    $("#estimateReportInput").replaceWith($("#estimateReportInput").clone());
                                    saveMetrics('SupportSite_ManuallyAttachEstimate_EstimateAttached',id,$scope.claim.orgId);
                                },function(){
                                    $scope.uploadErrorMsg="upload estimate report error happened on server. Please try it later!";
                                }
                            );
                        }
                        fileReader.readAsBinaryString(fileToLoad);
                    } else {
                        $scope.uploadErrorMsg="Please input right estimate gross total.";
                    }
                }
            }
        }])
    .controller('navController',['$scope','$state','$rootScope','$window','AuthService','NavigateService',function($scope,$state,$rootScope,$window,AuthService,NavigateService){
        $scope.environments=$rootScope.environments;

        $scope.isActive = function(tabNum) {
            return NavigateService.selectedTab == tabNum;
        };
        $scope.isAdmin = function() {
            return $rootScope.currentUser.role === 'admin';
        };

        $scope.changeNavTab = function(tabNum) {
            NavigateService.changeNavTab(tabNum);
        };

        $scope.logout = function() {
            spinner.stop();
            AuthService.logout();
            $state.go('login');
        };
        $scope.environmentClick = function(event){
            event.preventDefault();
        };
        $scope.changeEvn= function(event,env) {
            event.preventDefault();
            $rootScope.selectedENV = env;
            localStorage.setItem('selectedENVId',$rootScope.selectedENV.value);
            $window.location.reload();
        };
    }])
    .directive('toggle', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                if (attrs.toggle=="popover"){
                    $(element).popover();
                }
                if (attrs.toggle=="tooltip"){
                    $(element).tooltip();
                }
            }
        };
    });