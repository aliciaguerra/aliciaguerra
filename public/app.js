angular
    .module('mbeapp', [
        'ui.router',
        'ngRoute',
        'chart.js',
        'ngSanitize',
        'ngCsv'
    ])
    .config(['$stateProvider', '$urlRouterProvider','$routeProvider',
        function($stateProvider, $urlRouterProvider,$routeProvider) {

            $routeProvider
                .when('/',{
                    templateUrl:'views/login.html',
                    controller: 'AuthLoginController'
                })
                .when('/login',{
                    templateUrl:'views/login.html',
                    controller: 'AuthLoginController'
                })
                .when('/all-claims',{
                    templateUrl:'views/all-claims.html',
                    controller: 'AllClaimsController',
                    authenticate:true
                })
                .when('/commerrors',{
                    templateUrl:'views/comerrors.html',
                    controller:'AllCommErrorsController',
                    authenticate:true
                })
                .when('/claim-details',{
                    templateUrl:'views/claim-details.html',
                    controller: 'ClaimDetailsController',
                    authenticate: true
                })
                .when('/line-chart',{
                    templateUrl:'views/line-chart.html',
                    controller: 'LineChartController',
                    authenticate: true
                })
                .when('/survey',{
                    templateUrl:'views/survey.html',
                    controller: 'SurveyController',
                    authenticate: true
                })
                .when('/config',{
                    templateUrl:'views/confiurations.html',
                    controller: 'ConfigurationController',
                    authenticate: true
                })
                .when('/dashboard',{
                    templateUrl:'views/dashboard.html',
                    controller: 'DashboardController',
                    authenticate: true
                })
                .when('/forbidden',{
                    templateUrl:'views/forbidden.html'
                })
                .otherwise({
                    redirectTo:'/'
                });

            $stateProvider
                .state('all-claims', {
                    url: '/all-claims',
                    params:{'begin':'','end':'','orgId':''},
                    templateUrl: 'views/all-claims.html',
                    controller: 'AllClaimsController',
                    authenticate:true
                })
                .state('commerrors', {
                    url: '/commerrors',
                    templateUrl: 'views/comerrors.html',
                    controller: 'AllCommErrorsController',
                    authenticate:true
                })
                .state('claim-details', {
                    url: '/claim-details',
                    templateUrl: 'views/claim-details.html',
                    controller: 'ClaimDetailsController',
                    authenticate: true
                })
                .state('line-chart', {
                    url: '/line-chart',
                    templateUrl: 'views/line-chart.html',
                    controller: 'LineChartController',
                    authenticate: true
                })
                .state('survey', {
                    url: '/survey',
                    templateUrl: 'views/survey.html',
                    controller: 'SurveyController',
                    authenticate: true
                })
                .state('config', {
                    url: '/config',
                    templateUrl: 'views/confiurations.html',
                    controller: 'ConfigurationController',
                    authenticate: true
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard.html',
                    controller: 'DashboardController',
                    authenticate: true
                })
                .state('forbidden', {
                    url: '/forbidden',
                    templateUrl: 'views/forbidden.html'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'AuthLoginController'
                });
            $urlRouterProvider.otherwise('login');
        }])
    .run(['$rootScope', '$state', '$location', function($rootScope, $state,$location) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
            // redirect to login page if not logged in
            if (next.authenticate && !$rootScope.currentUser) {
                event.preventDefault(); //prevent current page from loading
                if(localStorage.getItem('currentUser')){
                    $rootScope.currentUser = jQuery.parseJSON(localStorage.getItem('currentUser'));
                    $rootScope.environments = jQuery.parseJSON(localStorage.getItem('MBE_ENV_DATA'));
                    $rootScope.selectedENV = $rootScope.environments[parseInt(localStorage.getItem('selectedENVId'))];
                    $state.go(next.name);
                } else {
                    $state.go('login');
                }
            }
        });
    }]);
