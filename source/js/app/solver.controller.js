/**
 * authors - JYRIK (Julia, Yana, Rostik, Illia, Katya)
 */


(function() {
  'use strict';

  angular
    .module('solver')
    .controller('SolverController', SolverController);

  SolverController.$inject = ['$location'];
  function SolverController($location) {
    var vm = this;
    vm.pageClass = pageClass;

    function pageClass() {
      switch ($location.path()) {
        case '/data':
          return 'blue-page';
        case '/graph':
          return 'green-page';
        default:
          return '';
      }
    }
  }

})();
