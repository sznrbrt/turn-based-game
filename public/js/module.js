'use strict';

var app = angular.module('pokerApp', ['ui.router', 'ui.bootstrap', 'btford.socket-io']);

app.filter('html',function($sce){
    return function(input){
        return $sce.trustAsHtml(input);
    }
})

// app.config(function($stateProvider, $urlRouterProvider) {


// 	$stateProvider
// 		.state('home', {
// 			url: '/',
// 			templateUrl: '/html/home.html',
// 			controller: 'homeCtrl'
// 		})

// })
