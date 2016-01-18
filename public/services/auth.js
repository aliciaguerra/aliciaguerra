/**
 * Created by jamesxieaudaexplorecom on 9/13/15.
 */
angular
    .module('mbeapp')
    .factory('AuthService', ['$rootScope', function($rootScope) {
        var AuthService = {};
        AuthService.login = function(data) {
            $rootScope.environments = data.environments;
            if (localStorage.getItem('selectedENVId') !== null && localStorage.getItem('selectedENVId') !=='') {
                $rootScope.selectedENV = data.environments[parseInt(localStorage.getItem('selectedENVId'))];
            } else {
                $rootScope.selectedENV = data.environments[0];
            }
            localStorage.setItem('selectedENVId',$rootScope.selectedENV.value);
            localStorage.setItem('MBE_ENV_DATA',JSON.stringify(data.environments));
            $rootScope.currentUser ={
                username:data.username,
                role:data.role
            };

            localStorage.setItem('currentUser',JSON.stringify($rootScope.currentUser));
        };
        AuthService.logout = function() {
            $rootScope.currentUser = '';
            $rootScope.selectedENV = '';
            localStorage.setItem('currentUser','');
            localStorage.setItem('MBE_ENV_DATA','');
        };
        return AuthService;
    }]);
