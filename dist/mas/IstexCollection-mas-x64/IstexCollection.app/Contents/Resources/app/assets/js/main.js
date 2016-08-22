'use strict';

const angular = require('angular');

angular
  .module('app', [])
  .controller('appController', ["$scope",appController]);

function appController($scope) {
  $scope.$watch('app.url', function(newValue,oldValue,scope){
    
  });
}