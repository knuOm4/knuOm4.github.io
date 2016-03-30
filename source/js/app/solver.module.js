/**
 * authors - JYRIK (Julia, Yana, Rostik, Illia, Katya)
 */


(function() {
  'use strict';

  angular
    .module('solver', ['ngRoute'])
    .config(SolverConfig);

  SolverConfig.$inject = ['$routeProvider'];

  function SolverConfig($routeProvider) {
    $routeProvider
      .when('/data', {
        templateUrl: 'source/js/app/data/templates/data.html',
        controller: 'SolverDataController',
        controllerAs: "data"
      })
      .when('/loader', {
        templateUrl: 'source/js/app/loader/templates/loader.html',
        controller: 'SolverLoaderController',
        controllerAs: "loader"
      })
      .when('/graph', {
        templateUrl: 'source/js/app/graph/templates/graph.html',
        controller: 'SolverGraphController',
        controllerAs: "graph"
      })
      .otherwise({
        redirectTo: '/data'
      });
  }
})();

