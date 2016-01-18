/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .controller('AllCommErrorsController',['$scope','$http','CommErrorsService','$state','NavigateService','$rootScope',
        function($scope,$http,CommErrorsService,$state,NavigateService,$rootScope){
        $scope.errorMsg="";
        $scope.successMsg="";
        $scope.commErrorList =[];
        $scope.totalCommError = 0;
        $scope.commErrorPerPage = 25;
        $scope.currentPage = 1;
        $scope.totalPages =[];
        $scope.pageList =[];
        $scope.sortType     = 'updatedDate'; // set the default sort type
        $scope.sortReverse  = true;
        $scope.searchClaimNumber ="";
        $scope.searchClientId ="";
        $scope.flags = [{'name':'All','value':''},{'name':'True','value':'true'},{'name':'False','value':'false'}];
        $scope.searchIsReportFlag = '';
        $scope.confirmMessage="Are you sure you want to clear this error message?";
        $scope.selectedCommError="";
        NavigateService.changeNavTab(1);
        $scope.errorDescriptionIsVisible = false;
        $scope.operationCodeIsVisible = false;

        $scope.pageChanged = function(newPage) {
            $scope.currentPage = newPage;
            $scope.errorMsg="";
            $scope.successMsg="";
            getResultsPage();
        };

        var getCommErrors = function() {
            spinner.spin(pageCenter);
            CommErrorsService.getCommErrors(
                $scope.searchClaimNumber,
                $scope.currentPage,
                $scope.commErrorPerPage,
                $scope.searchIsReportFlag,
                $scope.sortType,
                $scope.sortReverse).then(
                function(res){
                    spinner.stop();
                    $scope.commErrorList = res;
                },function(error){
                    spinner.stop();
                    $scope.errorMsg="Can't get comm error from server. Please try it later.";
                });
        };

        var getResultsPage= function(){
            if(!localStorage.getItem('currentUser')){
                $state.go('login');
            }
            if($scope.currentPage === 1) {
                CommErrorsService.getCommErrorsCount($scope.searchClaimNumber,$scope.searchIsReportFlag).then(
                    function(response){
                    $scope.totalCommError = response.count;
                    $scope.totalPages = $scope.totalCommError/$scope.commErrorPerPage;
                    $scope.totalPages = Math.ceil($scope.totalPages);
                    iniPages($scope);
                },function(error){
                    $scope.errorMsg="Can't get comm error count. Please try it later.";
                });
            } else {
                iniPages($scope);
            }
            getCommErrors();
        };

        getResultsPage();

        $scope.closeErrorMsg = function() {
            $scope.errorMsg ="";
        };
        $scope.closeSuccessMsg = function() {
            $scope.successMsg = "";
        };
        $scope.showDialog = function(data) {
            $scope.selectedCommError = data;
            $("#confirmDialog").modal({
                show:true
            });
        };
        $scope.update = function() {
            $scope.errorMsg ="";
            $scope.successMsg="";
            spinner.spin(pageCenter);
            CommErrorsService.update($scope.selectedCommError).then(
                function(response){
                    spinner.stop();
                    console.log(response.id);
                    getCommErrors();
                    $scope.successMsg="Update isReported flag successfully.";
                },function(error){
                    spinner.stop();
                    $scope.errorMsg="Can't update isReported to true. Please try it later.";
                });
        };
        $scope.cancel = function() {
            $("#confirmDialog").modal({
                show:false
            });
        };
        $scope.search = function() {
            $scope.currentPage = 1
            getResultsPage();
        };
        $scope.sortField = function(fieldName) {
            $scope.sortType = fieldName;
            $scope.sortReverse  = !$scope.sortReverse;
            getResultsPage();
        };
        $scope.showPopover = function() {
            console.log("ng-mouseover!");
           this.errorDescriptionIsVisible = true;
        };
        $scope.hidePopup = function() {
            console.log("ng-mouseleave!");
            this.errorDescriptionIsVisible = false;
        };
    }]);