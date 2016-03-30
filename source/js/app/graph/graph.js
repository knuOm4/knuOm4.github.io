/**
 * authors - JYRIK (Julia, Yana, Rostik, Illia, Katya)
 */


(function() {
  'use strict';

  angular
    .module('solver')
    .controller('SolverGraphController', SolverGraphController);

  SolverGraphController.$inject = ['$location'];
  function SolverGraphController($location) {
    var vm = this;
    vm.goHome = goHome;

    function goHome() {
      $location.path('/data');
    }
  }

})();
