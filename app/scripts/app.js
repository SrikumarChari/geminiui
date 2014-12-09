var whenConfig = ['$urlRouterProvider',
    function ($urlRouterProvider) {

        $urlRouterProvider
                .otherwise('/');
    }
];

var stateConfig = ['$stateProvider',
    function ($stateProvider) {

        $stateProvider
                .state('index', {
                    url: '/',
                    views: {
                        '': {
                            templateUrl: './views/layout.html',
                            //controller: 'MyAppCtrl'
                        },
                        'app-navbar@index': {
                            templateUrl: './views/app-navbar.html',
                        },
                        'app-accordion@index': {
                            templateUrl: './views/app-accordion.html',
                            controller: 'AppController',
                            resolve: {
                                aPromiseObj: function (AppFactory) {
                                    return AppFactory.getApps();
                                }
                            }
                        },
                        'app-right@index': {
                            templateUrl: './views/app-right.html'
                        },
                        'appSummary@index': {
                            templateUrl: './views/app-info.html'
                        },
                        'appTabs@index': {
                            templateUrl: './views/app-tabs.html'
                        },
                        'servers@index': {
                            templateUrl: './views/servers.html',
                            controller: 'AppServerController',
                            resolve: {
                                aPromiseObj: function (AppServerFactory) {
                                    return AppServerFactory.getServers();
                                }
                            }
                        },
                        'networks@index': {
                            templateUrl: './views/networks.html',
                            controller: 'AppNetworkController',
                            resolve: {
                                nPromiseObj: function (AppNetworkFactory) {
                                    return AppNetworkFactory.getNetworks();
                                }
                            }
                        },
                        'workflow@index': {
                            templateUrl: './views/workflow.html',
                            controller: 'AppWorkflowController',
                            resolve: {
                                wPromiseObj: function (AppWorkflowFactory) {
                                    return AppWorkflowFactory.getWorkflow();
                                }
                            }
                        }
                    }
                });
    }
];

myApp = angular.module('MyApp', [
    'ui.router', 'ui.bootstrap', 'ui.grid'
])
        .config(whenConfig)
        .config(stateConfig)

myApp.controller('AppController', function ($scope, GeminiModelService, AppServerFactory,
        AppNetworkFactory, AppWorkflowFactory) {
    //The application names to be displayed; get it from the model service
    $scope.apps = GeminiModelService.apps;
    $scope.currentApp = 0;

    $scope.opened = function (index) {
        //new accordion open, update the currentApp with the index
        $scope.currentApp = index;
        GeminiModelService.currentApp = index;

        //update the networks, servers and workflow data for the current selection
        AppServerFactory.getServers();
        AppNetworkFactory.getNetworks();
        AppWorkflowFactory.getWorkflow();
    }
});

myApp.factory('AppFactory', function ($http, GeminiModelService) {
    var appFac = {
    };

    appFac.getApps = function () {
        return $http
                .get('http://localhost:4567/applications')
                .success(function (data) {
                    console.log("success calling get apps");
                    angular.copy(data, GeminiModelService.apps);
                    return GeminiModelService.apps;
                });
    };
    return appFac;
});


myApp.controller('AppServerController', function ($scope, GeminiModelService, uiGridConstants) {
    $scope.servers = GeminiModelService.servers;
    $scope.columns = [{field: 'id', enableSorting: false, visible: false}, 
        {field: 'networkID', enableSorting: false, visible: false},
        {field: 'appID', enableSorting: false, visible: false}, {field: 'name'}, {field: 'description', enableSorting: false}, 
        {field: 'address'}, {field: 'subnetMask'}, {field: 'port'}, {field: 'manufacturer'}, 
        {field: 'backupSize'}, {field: 'location', enableSorting: false}, 
        {field: 'admin', enableSorting: false}, {field: 'password', enableSorting: false, visible: false}];
    $scope.gridOptions = {
        enableSorting: true,
        columnDefs: $scope.columns,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.gridOptions.data = $scope.servers;
});

myApp.factory('AppServerFactory', function ($http, GeminiModelService) {
    var appSrvFac = {
    };

    //gets all the server names 
    appSrvFac.getServers = function () {
        var url = '';
        if (GeminiModelService.currentApp === 0)
            url = 'http://localhost:4567/servers';
        else
            url = 'http://localhost:4567/applications/' + GeminiModelService.getApp(GeminiModelService.currentApp).id + '/servers';

        return $http
                .get(url)
                .success(function (data) {
                    console.log("Success calling get servers")
                    angular.copy(data, GeminiModelService.servers);
                    return GeminiModelService.servers;
                });
    };

    return appSrvFac;
});

myApp.controller('AppNetworkController', function ($scope, GeminiModelService) {
    $scope.networks = GeminiModelService.networks;
    $scope.columns = [{field: 'id', visible: false}, {field: 'appID', visible: false}, {field: 'start'},
        {field: 'end'}, {field: 'networkType'}];
    $scope.gridOptions = {
        enableSorting: true,
        columnDefs: $scope.columns,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.gridOptions.data = $scope.networks;

});

myApp.factory('AppNetworkFactory', function ($http, GeminiModelService) {
    var appNetFac = {
    };

    appNetFac.getNetworks = function () {
        var url = '';
        if (GeminiModelService.currentApp === 0)
            url = 'http://localhost:4567/networks';
        else
            url = 'http://localhost:4567/applications/' + GeminiModelService.getApp(GeminiModelService.currentApp).id + '/networks';

        return $http
                .get(url)
                .success(function (data) {
                    console.log("success calling get networks")
                    angular.copy(data, GeminiModelService.networks);
                    return GeminiModelService.networks;
                });
    };

    return appNetFac;
});

myApp.controller('AppWorkflowController', function ($scope, GeminiModelService) {
    $scope.workflow = GeminiModelService.workflow;
});

myApp.factory('AppWorkflowFactory', function ($http, GeminiModelService) {
    var appWorkflowFac = {
    };

    appWorkflowFac.getWorkflow = function () {
        var url = '';
        if (GeminiModelService.currentApp === 0)
            url = 'http://localhost:4567/workflow';
        else
            url = 'http://localhost:4567/applications/' + GeminiModelService.getApp(GeminiModelService.currentApp).id + '/workflow';

        return $http
//                .get(url)
                .get('./JSON/workflow.json')
                .success(function (data) {
                    console.log("success calling get workflow")
                    angular.copy(data, GeminiModelService.workflow);
                    return GeminiModelService.workflow;
                });
    };

    return appWorkflowFac;
});

myApp.service('GeminiModelService', function () {
    var geminiModelSrv = {
        apps: [],
        //the currentApp will initialize to 0 and refer to the hard-coded 'all servers'
        //element of the accordion. All users of this service will need to use
        //'getApp' to access the vars in this service
        currentApp: 0,
        servers: [],
        networks: [],
        workflow: []
    }

    geminiModelSrv.getApp = function (i) {
        //return the app at index 'i'
        if (i === 0)
            return null;
        else
            return geminiModelSrv.apps[i - 1];
    };

    return geminiModelSrv;
});