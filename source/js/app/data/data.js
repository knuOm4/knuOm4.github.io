/**
 * authors - JYRIK (Julia, Yana, Rostik, Illia, Katya)
 */

/**
 * this global shit is needed for passing data
 * from entry form to graph
 * Angular Integration TODO: Extremally needed replace it with Angular opportunities
 */
var data;

(function() {
  'use strict';

  angular
    .module('solver')
    .controller('SolverDataController', SolverDataController)
    .service('helpers', HelpersService)
    .service('states', StateService)
    .service('datas', DataService)
    .directive('checkbox', CheckboxDirective)
    .directive('inputs', InputsDirective)
    .directive('buttons', ButtonsDirective)
    .directive('inputsDynamic', InputsDynamicDirective)
    .directive('changeOnModel', ChangeOnModelDirective)
    .filter('trustedAsHtml', TrustedAsHtmlFilter);

  SolverDataController.$inject = ['$scope', 'states', '$rootScope', '$state', 'CacheFactory', 'helpers'];

  function SolverDataController($scope, states, $rootScope, $state, CacheFactory, helpers) {
    var vm = this;
    var dataCache = CacheFactory.get('dataCache') || CacheFactory.createCache('dataCache');
    var defaultData = vm.defaultData = {
      typeSource: {
        test: {
          label: 'Тестова задача',
          class: 'rus',
          type: 'radio',
          name: 'type',
          value: false
        },
        real: {
          label: 'Реальні данні',
          disabled: true,
          class: 'rus',
          type: 'radio',
          name: 'type',
          value: false
        }
      },
      yByS: [{
        label: 'sin(x<sub>1</sub><sup>2</sup>+x<sub>2</sub><sup>2</sup>)t<sup>2</sup>',
        class: 'en',
        type: 'radio',
        name: 'yByS',
        onChange: function() {
          vm.changeOut('./graph/3-d/plot.html');
        },
        value: false
      }, {
        label: 'sin(x<sub>1</sub>)x<sub>2</sub><sup>2</sup> + t<sup>2</sup>',
        class: 'en',
        type: 'radio',
        name: 'yByS',
        onChange: function() {
          vm.changeOut('./graph/3-d/plot.html');
        },
        value: false
      }],
      diffOper: [{
        label: 'L(&part;s)=c<sup>2</sup>(&part;x<sub>1</sub><sup>2</sup>+&part;x<sub>2</sub><sup>2</sup>)-&part;t<sup>2</sup>',
        type: 'radio',
        name: 'diff',
        class: 'en',
        value: false
      }, {
        label: 'L(&part;s)=c<sup>2</sup>(&part;x<sub>1</sub><sup>2</sup>)+&part;t<sup>2</sup>',
        type: 'radio',
        disabled: true,
        name: 'diff',
        class: 'en',
        value: false
      }],
      maxValues: [{
        type: 'text',
        placeholder: 'x1 мін',
        value: '',
      }, {
        type: 'text',
        placeholder: 'x1 макс',
        value: ''
      }, {
        type: 'text',
        placeholder: 'x2 мін',
        value: ''
      }, {
        type: 'text',
        placeholder: 'x2 макс',
        value: ''
      }, {
        type: 'text',
        placeholder: 'T макс',
        value: ''
      }],
      additions: [{
        type: 'text',
        value: '',
        placeholder: 'Константа'
      }],
      boundaries: [{
        type: 'text',
        value: '',
        placeholder: 'Кількість',
        round: true,
        affectTo: 'boundariesValues',
        onChange: function(val) {
          var newV = parseInt(this.value || val),
            oldV = vm.data.boundariesValues.length;
          if (angular.isNumber(newV)) {
            vm.data.boundariesValues.length = newV || 0;
            if (newV > oldV) {
              for (var i = oldV; i < vm.data.boundariesValues.length; i++) {
                vm.data.boundariesValues[i] = [{
                  type: 'text',
                  placeholder: 'x1 гран',
                  value: val ? getRandomArbitary(1, 10) : ''
                }, {
                  type: 'text',
                  placeholder: 'x2 гран',
                  value: val ? getRandomArbitary(1, 10) : ''
                }, {
                  type: 'text',
                  placeholder: 'T гран',
                  value: val ? getRandomArbitary(1, 10) : ''
                }];
              }
            }
            return vm.data.boundariesValues;
          }
        }
      }],
      boundariesValues: [],
      starting: [{
        type: 'text',
        value: '',
        placeholder: 'Кількість',
        round: true,
        affectTo: 'startingValues',
        onChange: function(val) {
          var newV = parseInt(this.value || val),
            oldV = vm.data.startingValues.length;
          if (angular.isNumber(newV)) {
            vm.data.startingValues.length = newV || 0;
            if (newV > oldV) {
              for (var i = oldV; i < vm.data.startingValues.length; i++) {
                vm.data.startingValues[i] = [{
                  type: 'text',
                  placeholder: 'x1 поч',
                  value: val ? getRandomArbitary(1, 10) : ''
                }, {
                  type: 'text',
                  placeholder: 'x2 поч',
                  value: val ? getRandomArbitary(1, 10) : ''
                }];
              }
            }
            return vm.data.startingValues;
          }
        }
      }],
      startingValues: [],
      buttonsSource: {
        next: {
          click: goLoader,
          caption: 'Далі'
        }
      },
      setters: {
        reset: {
          click: reset,
          caption: 'Видалити',
          ngIf: isDefaulted
        },
        defaulted: {
          click: defaulted,
          caption: 'Заповнити'
        }
      }
    };

    function isDefaulted() {
      var result = true;
      _.some(defaultData, function(value, valueKey) {
        _.some(value, function(val, valKey) {
          if (!angular.equals(val.value, vm.data[valueKey][valKey].value)) {
            result = false;
            return !result;
          }
        });
        return !result;
      });
      return result;
    }
    function getRandomArbitary(min, max) {
      return Math.random() * (max - min) + min;
    }
    function reset() {
      vm.data = angular.copy(defaultData);
    }
    function defaulted() {
      var randData = angular.copy(defaultData);
      var def = {
        max: 1,
        min: 10
      };
      var T = angular.copy(def);
      var x1 = angular.copy(def);
      var x2 = angular.copy(def);

      _.each(defaultData, function(value, valueKey) {
        _.some(value, function(val, valKey) {
          switch (val.type) {
            case 'radio':
              if (!val.disabled) {
                randData[valueKey][valKey].value = true;
                return true;
              }
              break;
            case 'text':
              if (!val.disabled) {
                randData[valueKey][valKey].value = getRandomArbitary(1, 10);
                if (val.round) {
                  randData[valueKey][valKey].value = Math.round(randData[valueKey][valKey].value);
                }
                if (val.onChange) {
                  randData[val.affectTo] = val.onChange(randData[valueKey][valKey].value);
                }
                return false;
              }
              break;
            default:
              return false;
          }
          return false;
        });
      });
      _.each(randData, function(value, valueKey) {
        _.each(value, function(val, valKey) {
          angular.isArray(val) && _.each(val, function(v, vKey) {
            switch (v.placeholder) {
              case 'x1 поч':
              case 'x1 гран':
                x1.min = _.min([x1.min, v.value]);
                x1.max = _.max([x1.max, v.value]);
                break;
              case 'x2 поч':
              case 'x2 гран':
                x2.min = _.min([x2.min, v.value]);
                x2.max = _.max([x2.max, v.value]);
                break;
              case 'T гран':
                T.max = _.max([T.max, v.value]);
                break;
              default:
                console.warn('UNHANDLED', v.placeholder);
            }
          })
        })
      });
      randData.maxValues[0].value = x1.min;
      randData.maxValues[1].value = x1.max;
      randData.maxValues[2].value = x2.min;
      randData.maxValues[3].value = x2.max;
      randData.maxValues[4].value = T.max;
      dataCache.put('data', randData);
      states.goData();
    }

    vm.changeOut = changeOut;

    vm.data = angular.merge({}, defaultData, dataCache.get('data'));
    $scope.$watch('data.data', function(newValue, oldValue) {
      if (!angular.equals(newValue, oldValue)) {
        dataCache.put('data', newValue);
      }
    }, true);

    function saveDataAndGoLoader() {
      /**
       * Angular Integration TODO: Extremally needed replace it with Angular opportunities
       * @type {SolverDataController}
       */
      data = vm.data;
      states.goLoader();
    }
    function changeOut(value) {
      vm.graphSrc = value;
    }
  }

  HelpersService.$inject = ['$location', '$anchorScroll', '$document', '$rootScope', '$state'];

  function HelpersService($location, $anchorScroll, $document, $rootScope, $state) {
    var appendedScripts = [];
    function appendScript(src) {
      if (!_.contains(appendedScripts, src) && _.isString(src)) {
        appendedScripts.push(src);
        return $document.find('body').append((angular.element('<script src="' + src + '"></script>')));
      }
    }
    function moveTo(index) {
      $location.hash('s' + index);
      $anchorScroll();
    }
    function clearScript() {
      appendedScripts = [];
    }
    function readdScripts() {
      var aS = angular.copy(appendedScripts);

      clearScript();
      _.each(aS, function(elem) {
        appendScript(elem);
      });
    }

    $rootScope.$on('$stateChangeSuccess',
      function() {
        if ($state.is('data')) {
          clearScript();
        }
      }
    );
    return {
      appendScript: appendScript,
      moveTo: moveTo,
      clear: clearScript,
      readdScripts: readdScripts
    };
  }

  StateService.$inject = ['$state', '$timeout'];

  function StateService($state, $timeout) {
    function goLoader() {
      $state.go("loader").then(
        function() {
          $timeout(function() {
             $state.go("graph");
          }, 2000);
        }
      );
    }
    function goData() {
      $state.reload();
    }
    return {
      goLoader: goLoader,
      goData: goData
    };
  }

  DataService.$inject = [];

  function DataService() {
    var savedData = {};
    function saveData(key, data) {
      savedData[key] = data;
    }
    function getData(key) {
      return savedData[key];
    }
    return {
      saveData: saveData,
      getData: getData
    };
  }

  CheckboxDirective.$inject = ['helpers', '$timeout'];

  function CheckboxDirective(helpers, $timeout) {
    return {
      restrict: 'AE',
      replace: false,
      templateUrl: '/checkbox.html',
      scope: {
        source: '=',
        index: '='
      },
      controllerAs: 'checkbox',
      bindToController: true,
      link: function($scope, element, attrs) {
        $timeout(function() {
          helpers.appendScript('./source/js/libs/checkbox/svgcheckbx.js');
        });
      },
      controller: function($scope) {}
    };
  }

  ChangeOnModelDirective.$inject = ['$timeout'];

  function ChangeOnModelDirective($timeout) {
    return {
      restrict: 'AE',
      priority: -1,
      scope: false,
      link: function($scope, element, attrs) {
        $timeout(function() {
          $scope.$watch(attrs.ngModel,
            function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue) || newValue) {
                $timeout(
                  function() {
                    var event = new Event('change');
                    element[0].dispatchEvent(event);
                  }
                );
              }
            }
          );
        });
      }
    };
  }

  InputsDirective.$inject = ['helpers', '$timeout'];

  function InputsDirective(helpers, $timeout) {
    return {
      restrict: 'AE',
      replace: false,
      templateUrl: '/inputs.html',
      scope: {
        source: '='
      },
      controllerAs: 'inputs',
      bindToController: true,
      link: function($scope, element, attrs) {
        function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + s4() + s4() +
            s4() + s4() + s4() + s4();
        }
        _.each($scope.inputs.source, function(elem) {
          elem.id = guid();
        });
        $timeout(
          function() {
            helpers.appendScript('./source/js/libs/input/classie.js');
            helpers.appendScript('./source/js/libs/input/add.script.js');
          }
        );
      },
      controller: function($scope) {}
    };
  }

  ButtonsDirective.$inject = ['helpers', '$timeout'];

  function ButtonsDirective(helpers, $timeout) {
    return {
      restrict: 'AE',
      replace: false,
      templateUrl: '/buttons.html',
      scope: {
        buttonsSource: '='
      },
      controllerAs: 'buttons',
      bindToController: true,
      link: function($scope, element, attrs) {
        $timeout(
          function() {
            helpers.appendScript('./source/js/libs/button/snap.svg-min.js');
            helpers.appendScript('./source/js/libs/button/add.button.js');
          }
        );
      },
      controller: function($scope) {}
    };
  }

  InputsDynamicDirective.$inject = ['helpers'];

  function InputsDynamicDirective(helpers) {
    return {
      restrict: 'AE',
      replace: false,
      templateUrl: '/inputs-dynamic.html',
      scope: {
        source: '=',
        text: '='
      },
      controllerAs: 'inputsDynamic',
      bindToController: true,
      link: function($scope, element, attrs) {},
      controller: function($scope) {}
    };
  }

  TrustedAsHtmlFilter.$inject = ['$sce'];

  function TrustedAsHtmlFilter($sce) {
    return function(value) {
      return $sce.trustAsHtml(value);
    };
  }
})();
