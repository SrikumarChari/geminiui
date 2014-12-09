'use strict';

angular.module('view2', ['ui.router'])

//        .config(function ($stateProvider, $urlRouterProvider) {
//
//            $urlRouterProvider.otherwise('/view2');
//
//            $stateProvider
//
//                    .state('view2', {
//                        url: '#/view2',
//                        templateUrl: 'view2/view2.html',
//                        controller: 'View2Ctrl'
//                    });
//        })

        .controller('View2Ctrl', [function () {

            }])
        .config(function ($stateProvider, $urlRouterProvider) {
            //default state if none provided
//            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                    .state('view2', {
                        url: '/view2',
                        views: {
                            'view2': {
                                templateUrl: '<p>this is a test</p>',
                                // './views/view2.html',
                                controller: 'View2Ctrl'
                            }
                        }
                    });
        });