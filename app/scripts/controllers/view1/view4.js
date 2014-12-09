'use strict';

angular.module('view1', ['ui.router'])
        .controller('View1Ctrl', [function () {
            }])
        .config(function ($stateProvider, $urlRouterProvider) {
            //default state if none provided
//            $urlRouterProvider.otherwise('/');

            $stateProvider
                    .state('view1', {
                        url: '/view1',
                        views: {
                            'view1': {
                                templateUrl: '<p>this is a test 2</p>',
//                                './views/view1.html',
                                controller: 'View1Ctrl'
                            }
                        }
                    });
        });