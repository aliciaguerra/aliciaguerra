/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .controller('AuthLoginController', ['$scope', '$http', '$state','AuthService','$rootScope',
        function($scope, $http, $state,AuthService,$rootScope) {
            $scope.errorMsg="";
            $scope.submit = function(){
                spinner.spin(pageCenter);
                var url ="/api/login";
                console.log(url);
                $http.post(url,{username:$scope.username,password:$scope.password})
                    .then(
                    function(response) {
                        spinner.stop();
                        if(typeof(response.data.error) === 'undefined') {
                            AuthService.login(response.data);
                            $state.go('dashboard');
                        } else {
                            $scope.errorMsg="Invalid username or password. Please try again.";
                        }
                    },
                    function(error){
                        console.log(JSON.stringify(error));
                        spinner.stop();
                        $scope.errorMsg="Invalid username or password. Please try again.";
                    });
            };

            $scope.logout = function() {
                AuthService.logout();
                $state.go('login');
            };
        }]);
