/**
 * authors - JYRIK (Julia, Yana, Rostik, Illia, Katya)
 */


(function() {
  'use strict';

  angular
    .module('solver', ['ui.router', 'angular-cache', 'ui.bootstrap'])
    .config(SolverConfig)
    .run(SolverRun);

  SolverRun.$inject = ['$rootScope'];

  function SolverRun($rootScope) {
    $rootScope._ = _;
  }

  SolverConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'CacheFactoryProvider'];

  function SolverConfig($stateProvider, $urlRouterProvider, CacheFactoryProvider) {
    angular.extend(
      CacheFactoryProvider.defaults,
      {
        maxAge: 15 * 60 * 1000,
        storageMode: 'localStorage'
      }
    );
    $stateProvider
      .state('data', {
        url: "/data",
        templateUrl: 'source/js/app/data/templates/data.html',
        controller: 'SolverDataController',
        controllerAs: "data"
      })
      .state('loader', {
        url: "/loader",
        templateUrl: 'source/js/app/loader/templates/loader.html',
        controller: 'SolverLoaderController',
        controllerAs: "loader"
      })
      .state('graph', {
        url: "/graph",
        templateUrl: 'source/js/app/graph/templates/graph.html',
        controller: 'SolverGraphController',
        controllerAs: "graph"
      });
      $urlRouterProvider.otherwise('/data');
  }
})();

