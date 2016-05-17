'use strict';

var app = angular.module('pokerApp');


app.factory('mySocket', function (socketFactory) {
  return socketFactory();
})