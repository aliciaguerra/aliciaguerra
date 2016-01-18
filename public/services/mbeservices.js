/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .factory('ClaimService', ['$http', '$q', '$rootScope', function($http, $q,
                                                                   $rootScope) {
        var ClaimService = {};
        ClaimService.conditionNumber = 0;
        ClaimService.selectedClaim = {};
        ClaimService.url ='';
        ClaimService.selectOneClaim = function(claim) {
            ClaimService.selectedClaim = claim;
            ClaimService.url = $rootScope.selectedENV.apiURL+"/Claims/"+claim.id+"?access_token="+$rootScope.selectedENV.accessToken;
        };

        ClaimService.resendpasscode = function(id) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/Claims/resendInviteToVehicleOwner?id="+ id +"&access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            var claimNumber = ClaimService.selectedClaim.claimNumber;
            $http.get(url).success(function(response){
                q.resolve(response);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };

        ClaimService.update = function(claim) {
            var q = $q.defer();
            ClaimService.selectOneClaim(claim);
            var url = $rootScope.selectedENV.apiURL+"/Claims/"+claim.id+"?access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.put(url,claim)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };

        ClaimService.getQueryClaimUrl = function(claimNumber,clientId,beginDate,endDate,url) {
            ClaimService.conditionNumber = 0;
            if (typeof (claimNumber) !== 'undefined' && claimNumber !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][claimNumber]="+""+claimNumber.toString()+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (clientId) !== 'undefined' && clientId !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][orgId]="+""+clientId+"";
                ClaimService.conditionNumber++;
            }
            if ((typeof(beginDate) !== 'undefined' && beginDate !== '')){
                if ((typeof (endDate) ==='undefined' || endDate ==='' )) {
                    endDate = getTodayDate();
                }
                beginDate +=" 00:00:00";
                endDate +=" 23:59:59";
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][createdDate][gt]="+beginDate;
                ClaimService.conditionNumber++;
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][createdDate][lt]="+endDate;
                ClaimService.conditionNumber++;
            }
            //url +="&filter[where][and]["+ClaimService.conditionNumber+"][orgId]="+selectedENV.orgID;
            //ClaimService.conditionNumber++;
            return url;
        };
        ClaimService.getQueryUrl = function(claimNumber,clientId,beginDate,endDate,url) {
            ClaimService.conditionNumber = 0;
            if (typeof (claimNumber) !== 'undefined' && claimNumber !=='') {
                url += "&where[and]["+ClaimService.conditionNumber+"][claimNumber]="+""+claimNumber.toString()+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (clientId) !== 'undefined' && clientId !=='') {
                url += "&where[and]["+ClaimService.conditionNumber+"][orgId]="+""+clientId.toString()+"";
                ClaimService.conditionNumber++;
            }
            if ((typeof(beginDate) !== 'undefined' && beginDate !== '')) {
                if ((typeof (endDate) ==='undefined' || endDate ==='' )) {
                    endDate = getTodayDate();
                }
                beginDate +=" 00:00:00";
                endDate +=" 23:59:59";
                url += "&where[and]["+ClaimService.conditionNumber+"][createdDate][gt]="+beginDate;
                ClaimService.conditionNumber++;
                url += "&where[and]["+ClaimService.conditionNumber+"][createdDate][lt]="+endDate;
                ClaimService.conditionNumber++;
            }
            return url;
        };

        ClaimService.getClaimSubmittedCount = function(claimNumber,clientId,beginDate,endDate){
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Claims/count?access_token="+$rootScope.selectedENV.accessToken;
            url = ClaimService.getQueryUrl(claimNumber,clientId,beginDate,endDate,url);
            url +="&where[and]["+ClaimService.conditionNumber+"][customerStatus][gt]=4";
            console.log(url);
            $http.get(url)
                .success(function(res) {
                    q.resolve(res);
                })
                .error(function(error) {
                    q.reject(error);
                });
            return q.promise;
        };

        ClaimService.getClaimCountBySearch = function(claimNumber,clientId,beginDate,endDate,voPhoneNumber,voEmail,claimStatus){
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Claims/count?access_token="+$rootScope.selectedENV.accessToken;
            url = ClaimService.getQueryUrl(claimNumber,clientId,beginDate,endDate,url);
            if (typeof (voPhoneNumber) !== 'undefined' && voPhoneNumber !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][vehicleOwnerCellPhone]="+""+formatPhone(voPhoneNumber)+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (voEmail) !== 'undefined' && voEmail !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][vehicleOwnerEmail]="+""+voEmail+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (claimStatus) !== 'undefined' && claimStatus !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][customerStatus]="+""+claimStatus+"";
                ClaimService.conditionNumber++;
            }
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };

        ClaimService.getClaimCount = function(claimNumber,clientId,beginDate,endDate){
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Claims/count?access_token="+$rootScope.selectedENV.accessToken;
            url = ClaimService.getQueryUrl(claimNumber,clientId,beginDate,endDate,url);
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };

        ClaimService.getClaimCountByClaimStatus = function(claimNumber,clientId,operator,beginDate,endDate){
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Claims/count?access_token="+$rootScope.selectedENV.accessToken;
            url = ClaimService.getQueryUrl(claimNumber,clientId,beginDate,endDate,url);
            if(operator) {
                url +="&where[and]["+ClaimService.conditionNumber+"][customerStatus]["+operator+"]=5";
            } else {
                url +="&where[and]["+ClaimService.conditionNumber+"][customerStatus]=5";
            }
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };

        ClaimService.getClaimCountSubmittedInLast24Hours = function(claimNumber,clientId)  {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Claims/count?access_token="+$rootScope.selectedENV.accessToken;

            ClaimService.conditionNumber = 0;
            if (typeof (claimNumber) !== 'undefined' && claimNumber !=='') {
                url += "&where[and]["+ClaimService.conditionNumber+"][claimNumber]="+""+claimNumber.toString()+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (clientId) !== 'undefined' && clientId !=='') {
                url += "&where[and]["+ClaimService.conditionNumber+"][orgId]="+""+clientId.toString()+"";
                ClaimService.conditionNumber++;
            }
            var date = new Date();
            date.setDate(date.getDate()-1);
            var beginDate = formatDate(date) + " " + time_format(date);
            url += "&where[and]["+ClaimService.conditionNumber+"][createdDate][gt]="+beginDate;
            ClaimService.conditionNumber++;
            url +="&where[and]["+ClaimService.conditionNumber+"][customerStatus][gt]=4";

            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };

        ClaimService.getClaimStatusFiveThen24Hours = function(claimNumber,clientId){
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Claims/count?access_token="+$rootScope.selectedENV.accessToken;

            ClaimService.conditionNumber = 0;
            if (typeof (claimNumber) !== 'undefined' && claimNumber !=='') {
                url += "&where[and]["+ClaimService.conditionNumber+"][claimNumber]="+""+claimNumber.toString()+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (clientId) !== 'undefined' && clientId !=='') {
                url += "&where[and]["+ClaimService.conditionNumber+"][orgId]="+""+clientId.toString()+"";
                ClaimService.conditionNumber++;
            }
            var date = new Date();
            date.setDate(date.getDate()-1);
            var thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            var endDate = formatDate(date) + " " + time_format(date);
            var beginDate = formatDate(thirtyDaysAgo) + " " + time_format(thirtyDaysAgo);
            url += "&where[and]["+ClaimService.conditionNumber+"][updatedDate][lt]="+endDate;
            ClaimService.conditionNumber++;
            url += "&where[and]["+ClaimService.conditionNumber+"][createdDate][gt]="+beginDate;
            ClaimService.conditionNumber++;
            url += "&where[and]["+ClaimService.conditionNumber+"][orgId]!=M00";
            ClaimService.conditionNumber++;
            url +="&where[and]["+ClaimService.conditionNumber+"][customerStatus]=5";

            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };

        ClaimService.getClaimList = function(claimNumber,clientId,beginDate,endDate,currentPage,claimPerPage,voPhoneNumber,voEmail,claimStatus,sortedField,sortReverse) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/Claims?access_token="+$rootScope.selectedENV.accessToken;
            for(var index = 0; index< sortedField.length ; index++) {
                url +="&filter[order]["+index+"]="+sortedField[index]+"%20"+(sortReverse?"DESC":"ASC");
            }
            url = ClaimService.getQueryClaimUrl(claimNumber,clientId,beginDate,endDate,url);
            if (typeof (voPhoneNumber) !== 'undefined' && voPhoneNumber !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][vehicleOwnerCellPhone]="+""+formatPhone(voPhoneNumber)+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (voEmail) !== 'undefined' && voEmail !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][vehicleOwnerEmail]="+""+voEmail+"";
                ClaimService.conditionNumber++;
            }
            if (typeof (claimStatus) !== 'undefined' && claimStatus !=='') {
                url += "&filter[where][and]["+ClaimService.conditionNumber+"][customerStatus]="+""+claimStatus+"";
                ClaimService.conditionNumber++;
            }
            var skipNumber = parseInt((currentPage -1) * claimPerPage);
            url +='&filter[skip]='+skipNumber;
            url +='&filter[limit]='+claimPerPage;
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        ClaimService.load = function() {
            var q = $q.defer();
            $http.get(ClaimService.url).success(function(res){
                q.resolve(res);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        return ClaimService;
    }])
    .factory('SurveyDataService',['$http','$q','$rootScope',function($http,$q,$rootScope){
        var SurveyDataService = {};
        SurveyDataService.conditionNumber = 0;
        SurveyDataService.getQueryUrl = function(clientId,beginDate,endDate,url) {
            SurveyDataService.conditionNumber = 0;
            if ((typeof(clientId) !== 'undefined' && clientId !== '')){
                url += "&where[and]["+SurveyDataService.conditionNumber+"][orgId]="+clientId;
                SurveyDataService.conditionNumber++;
            }
            if ((typeof(beginDate) !== 'undefined' && beginDate !== '')){
                if ((typeof (endDate) ==='undefined' || endDate ==='' )) {
                    endDate = getTodayDate();
                }
                beginDate +=" 00:00:00";
                endDate +=" 23:59:59";
                url += "&where[and]["+SurveyDataService.conditionNumber+"][createdDate][gt]="+beginDate;
                SurveyDataService.conditionNumber++;
                url += "&where[and]["+SurveyDataService.conditionNumber+"][createdDate][lt]="+endDate;
                SurveyDataService.conditionNumber++;
            }
            return url;
        };
        SurveyDataService.getSurveyList = function(clientId,beginDate,endDate) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/SurveyDatas?access_token="+$rootScope.selectedENV.accessToken;
            SurveyDataService.conditionNumber = 0;
            if ((typeof(clientId) !== 'undefined' && clientId !== '')){
                url += "&filter[where][and]["+SurveyDataService.conditionNumber+"][orgId]="+clientId;
                SurveyDataService.conditionNumber++;
            }
            if ((typeof(beginDate) !== 'undefined' && beginDate !== '')){
                if ((typeof (endDate) ==='undefined' || endDate ==='' )) {
                    endDate = getTodayDate();
                }
                beginDate +=" 00:00:00";
                endDate +=" 23:59:59";
                url += "&filter[where][and]["+SurveyDataService.conditionNumber+"][createdDate][gt]="+beginDate;
                SurveyDataService.conditionNumber++;
                url += "&filter[where][and]["+SurveyDataService.conditionNumber+"][createdDate][lt]="+endDate;
                SurveyDataService.conditionNumber++;
            }
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        SurveyDataService.getSurveyDataCount = function(clientId,beginDate,endDate) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/SurveyDatas/count?access_token="+$rootScope.selectedENV.accessToken;
            url = SurveyDataService.getQueryUrl(clientId,beginDate,endDate,url);
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        SurveyDataService.getSurveyDataByClaimId = function(id) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/SurveyDatas?filter[where][claim_objectId]="+ id +"&access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        return SurveyDataService;
    }]).factory('MetricsDataService',['$http','$q','$rootScope',function($http, $q,$rootScope) {
        var MetricsDataService = {};
        MetricsDataService.getMetricsDataByClaimId = function(id) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/MetricsDatas?filter[order]=createdDate%20ASC&filter[where][claim_objectId]="+id +"&access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.get(url).success(function(response){
                q.resolve(response);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        MetricsDataService.saveMetrics = function(eventName, claimId,orgId) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL + "/MetricsDatas?access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.post(url,{
                eventName:eventName,
                orgId:orgId,
                appName:getAppName(orgId),
                claim_objectId: claimId
            }).success(function(res){
                q.resolve(res);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };

        MetricsDataService.getMetricsDataCounts = function(orgId,eventName) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/MetricsDatas/count?access_token="+$rootScope.selectedENV.accessToken;
            MetricsDataService.conditionNumber = 0;
            if (typeof (orgId) !== 'undefined' && orgId !=='') {
                url += "&where[and]["+MetricsDataService.conditionNumber+"][orgId]="+""+orgId.toString()+"";
                MetricsDataService.conditionNumber++;
            }
            var date = new Date();
            date.setDate(date.getDate()-1);
            var beginDate = formatDate(date) + " " + time_format(date);
            url += "&where[and]["+MetricsDataService.conditionNumber+"][updatedDate][gt]="+beginDate;
            MetricsDataService.conditionNumber++;
            url +="&where[and]["+MetricsDataService.conditionNumber+"][eventName]="+eventName;
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        ///////////////////////////////////////////////////////////
        MetricsDataService.getMetricsDataCounts1Week = function(orgId,eventName) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/MetricsDatas/count?access_token="+$rootScope.selectedENV.accessToken;
            MetricsDataService.conditionNumber = 0;
            if (typeof (orgId) !== 'undefined' && orgId !=='') {
                url += "&where[and]["+MetricsDataService.conditionNumber+"][orgId]="+""+orgId.toString()+"";
                MetricsDataService.conditionNumber++;
            }
            var date = new Date();
            date.setDate(date.getDate()-7);
            var beginDate = formatDate(date) + " " + time_format(date);
            url += "&where[and]["+MetricsDataService.conditionNumber+"][updatedDate][gt]="+beginDate;
            MetricsDataService.conditionNumber++;
            url +="&where[and]["+MetricsDataService.conditionNumber+"][eventName]="+eventName;
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        ///////////////////////////////////////////////////////////
        
///////////////////////////////////////////////////////////
        MetricsDataService.getMetricsDataCounts2Hours = function(orgId,eventName) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/MetricsDatas/count?access_token="+$rootScope.selectedENV.accessToken;
            MetricsDataService.conditionNumber = 0;
            if (typeof (orgId) !== 'undefined' && orgId !=='') {
                url += "&where[and]["+MetricsDataService.conditionNumber+"][orgId]="+""+orgId.toString()+"";
                MetricsDataService.conditionNumber++;
            }
            var date = new Date();
            date.setHours(date.getHours()-2);
            var beginDate = formatDate(date) + " " + time_format(date);
            url += "&where[and]["+MetricsDataService.conditionNumber+"][updatedDate][gt]="+beginDate;
            MetricsDataService.conditionNumber++;
            url +="&where[and]["+MetricsDataService.conditionNumber+"][eventName]="+eventName;
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        ///////////////////////////////////////////////////////////
        
///////////////////////////////////////////////////////////
        MetricsDataService.getMetricsDataCounts8Hours = function(orgId,eventName) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/MetricsDatas/count?access_token="+$rootScope.selectedENV.accessToken;
            MetricsDataService.conditionNumber = 0;
            if (typeof (orgId) !== 'undefined' && orgId !=='') {
                url += "&where[and]["+MetricsDataService.conditionNumber+"][orgId]="+""+orgId.toString()+"";
                MetricsDataService.conditionNumber++;
            }
            var date = new Date();
            date.setHours(date.getHours()-8);
            var beginDate = formatDate(date) + " " + time_format(date);
            url += "&where[and]["+MetricsDataService.conditionNumber+"][updatedDate][gt]="+beginDate;
            MetricsDataService.conditionNumber++;
            url +="&where[and]["+MetricsDataService.conditionNumber+"][eventName]="+eventName;
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        ///////////////////////////////////////////////////////////      
        
        
        
        MetricsDataService.getMetricsDatas = function(orgId,eventName) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/MetricsDatas?access_token="+$rootScope.selectedENV.accessToken;
            MetricsDataService.conditionNumber = 0;
            if (typeof (orgId) !== 'undefined' && orgId !=='') {
                url += "&filter[where][and]["+MetricsDataService.conditionNumber+"][orgId]="+""+orgId.toString()+"";
                MetricsDataService.conditionNumber++;
            }
            var date = new Date();
            date.setDate(date.getDate()-1);
            var beginDate = formatDate(date) + " " + time_format(date);
            url += "&filter[where][and]["+MetricsDataService.conditionNumber+"][updatedDate][gt]="+beginDate;
            MetricsDataService.conditionNumber++;
            url +="&filter[where][and]["+MetricsDataService.conditionNumber+"][eventName]="+eventName;
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        return MetricsDataService;
    }]).factory('AttachmentService',['$http','$q','$rootScope',function($http,$q,$rootScope) {
        var AttachmentService = {};
        AttachmentService.downloadImageContent = function(photo,times) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/Attachments/downloadImage?file="+ photo.file +"&access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.get(url).success(function(photoContent){
                q.resolve(photoContent);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        AttachmentService.initialSubmitedImage = function(id) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/Attachments?filter[where][and][0][claim_objectId]="+ id +"&filter[where][and][1][attachmentType]=UserUpload&access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.get(url).success(function(response){
                q.resolve(response);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        AttachmentService.uploadEstimateReport= function(reportData,taskId){
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/Attachments/saveEstimateReport?access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.post(url,{
                data:reportData,
                fileName:"estimatereport.pdf",
                attachmentType:"estimatereport",
                taskId:taskId
            }).success(function(res){
                q.resolve(res);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        AttachmentService.uploadImage= function(imageData,fileName,userName){
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL +"/Attachments/uploadImage?access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.post(url,{
                parameters:{
                    attachmentType:"UserUpload",
                    fileName:fileName,
                    data:imageData,
                    userName:userName
                }
            }).success(function(res){
                q.resolve(res);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        return AttachmentService;
    }]).factory('CommErrorsService',['$http','$q','$rootScope',function($http,$q,$rootScope){
        var CommErrorsService = {};
        CommErrorsService.conditionNumber = 0;
        CommErrorsService.getCommErrors = function(claimNumber,
            currentPage,
            commErrorPerPage,isReported,sortedField,sortReverse){
            var q = $q.defer();
            CommErrorsService.conditionNumber = 0;
            var url = $rootScope.selectedENV.apiURL+"gateway/CommErrorLogs";
            var skipNumber = (currentPage -1) * commErrorPerPage;
            url += "?filter[order]="+sortedField+"%20"+ (sortReverse? "DESC":"ASC");
            if ((typeof(isReported) !== 'undefined' && isReported !== '')){
                url += "&filter[where][and]["+CommErrorsService.conditionNumber+"][isReported]="+isReported;
                CommErrorsService.conditionNumber++;
            }
            if ((typeof(claimNumber) !== 'undefined' && claimNumber !== '')){
                url += "&filter[where][and]["+CommErrorsService.conditionNumber+"][claimNumber]="+claimNumber;
                CommErrorsService.conditionNumber++;
            }
            url +='&filter[skip]='+skipNumber;
            url +='&filter[limit]='+commErrorPerPage;
            console.log(url);
            $http.get(url).success(function(res){
                q.resolve(res);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        CommErrorsService.getCommErrorsCount = function(claimNumber,isReported){
            var q = $q.defer();
            CommErrorsService.conditionNumber = 0;
            var url = $rootScope.selectedENV.apiURL+"gateway/CommErrorLogs/count";
            if ((typeof(isReported) !== 'undefined' && isReported !== '')){
                url += "?where[and]["+CommErrorsService.conditionNumber+"][isReported]="+isReported;
                CommErrorsService.conditionNumber++;
            }
            if ((typeof(claimNumber) !== 'undefined' && claimNumber !== '')){
                url += "?where[and]["+CommErrorsService.conditionNumber+"][claimNumber]="+claimNumber;
                CommErrorsService.conditionNumber++;
            }
            console.log(url);
            $http.get(url).success(function(res){
                q.resolve(res);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        CommErrorsService.update = function(data) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"gateway/CommErrorLogs/"+data.id;
            console.log(url);
            $http.put(url,{isReported:true}).success(function(response){
                q.resolve(response);
            }).error(function(error){
                q.reject(error);
            });
            return q.promise;
        };
        return CommErrorsService;
    }]).factory('NavigateService',['$http',function($http){
        var NavigateService = {};
        NavigateService.changeNavTab = function(tabNumber) {
            NavigateService.selectedTab = tabNumber;
        };
        return NavigateService;
    }]).factory('ConfigurationsService',['$http','$q','$rootScope',function($http,$q,$rootScope){
        var ConfigurationsService = {};
        ConfigurationsService.getConfigList = function(clientId,key,value,sortedField,sortReverse) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Configurations?access_token="+$rootScope.selectedENV.accessToken;
            ConfigurationsService.conditionNumber = 0;
            if ((typeof(clientId) !== 'undefined' && clientId !== '')){
                url += "&filter[where][and]["+ConfigurationsService.conditionNumber+"][orgId]="+clientId;
                ConfigurationsService.conditionNumber++;
            }
            if ((typeof(key) !== 'undefined' && key !== '')){
                url += "&filter[where][and]["+ConfigurationsService.conditionNumber+"][configKey]="+key;
                ConfigurationsService.conditionNumber++;
            }
            if ((typeof(value) !== 'undefined' && value !== '')){
                url += "&filter[where][and]["+ConfigurationsService.conditionNumber+"][configValue]="+value;
                ConfigurationsService.conditionNumber++;
            }
            url += "&filter[order]="+sortedField+"%20"+ (sortReverse? "DESC":"ASC");
            console.log(url);
            $http.get(url)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        ConfigurationsService.updateConfig = function(config) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Configurations/"+config.id+"?access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.put(url,config)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        ConfigurationsService.createConfig = function(config) {
            var q = $q.defer();
            var url = $rootScope.selectedENV.apiURL+"/Configurations?access_token="+$rootScope.selectedENV.accessToken;
            console.log(url);
            $http.post(url,config)
                .success(function(res){
                    q.resolve(res);
                })
                .error(function(error){
                    q.reject(error);
                });
            return q.promise;
        };
        return ConfigurationsService;
    }]);