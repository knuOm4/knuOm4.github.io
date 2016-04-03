/**
 * authors - JYRIK (Julia, Yana, Rostik, Illia, Katya)
 */


(function() {
  'use strict';

  angular
    .module('solver')
    .controller('SolverGraphController', SolverGraphController);

  SolverGraphController.$inject = ['$state'];

  function SolverGraphController($state) {
    var vm = this;
    vm.goHome = goHome;

    function goHome() {
      $state.go('data', {}, {
        reload: true
      });
    }
  }

})();