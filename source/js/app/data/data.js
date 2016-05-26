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

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

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
      maxValues: [
        new Point({
          type: 'text',
          placeholder: 'x1 мін',
          value: 1,
        }, {
          type: 'text',
          placeholder: 'x2 мін',
          value: 1
        }),
        new Point({
          type: 'text',
          placeholder: 'x1 макс',
          value: 10
        }, {
          type: 'text',
          placeholder: 'x2 макс',
          value: 10
        }),
        new Point(
          null,
          {
            type: 'text',
            placeholder: 'T макс',
            value: 10
          }
        )
      ],
      additions: [{
        type: 'text',
        value: 0,
        placeholder: 'Константа'
      }],
      boundaries: [{
        type: 'text',
        value: 0,
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
                vm.data.boundariesValues[i] = [
                  new Point(
                    {
                      type: 'text',
                      placeholder: 'x1 гран',
                      value: val ? getRandomArbitary(1, 10).toPrecision(3) : 1
                    }, {
                      type: 'text',
                      placeholder: 'x2 гран',
                      value: val ? getRandomArbitary(1, 10).toPrecision(3) : 1
                    }
                  ),
                  new Point(
                    null,
                    {
                      type: 'text',
                      placeholder: 'T гран',
                      value: val ? getRandomArbitary(1, 10).toPrecision(3) : 1
                    }
                  )
                ];
              }
            }
            return vm.data.boundariesValues;
          }
        }
      }],
      boundariesValues: [],
      starting: [{
        type: 'text',
        value: 0,
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
                vm.data.startingValues[i] = [
                  new Point(
                    {
                      type: 'text',
                      placeholder: 'x1 поч',
                      value: val ? getRandomArbitary(1, 10).toPrecision(3) : 1
                    }, {
                      type: 'text',
                      placeholder: 'x2 поч',
                      value: val ? getRandomArbitary(1, 10).toPrecision(3) : 1
                    }
                  )];
              }
            }
            return vm.data.startingValues;
          }
        }
      }],
      startingValues: [],
      buttonsSource: {
        next: {
          click: saveDataAndGoLoader,
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
          switch ((val.x && val.x.type || val.y && val.y.type) || val.type) {
            case 'radio':
              if (!val.disabled) {
                randData[valueKey][valKey].value = true;
                return true;
              }
              break;
            case 'text':
              if (val.x && !val.x.disabled) {
                randData[valueKey][valKey].x.value = getRandomArbitary(1, 10).toPrecision(3);
                if (val.x.round) {
                  randData[valueKey][valKey].x.value = Math.round(randData[valueKey][valKey].x.value);
                }
                if (val.x.onChange) {
                  randData[val.x.affectTo] = val.x.onChange(randData[valueKey][valKey].x.value);
                }
              }
              if (val.y && !val.y.disabled) {
                randData[valueKey][valKey].y.value = getRandomArbitary(1, 10).toPrecision(3);
                if (val.y.round) {
                  randData[valueKey][valKey].y.value = Math.round(randData[valueKey][valKey].y.value);
                }
                if (val.y.onChange) {
                  randData[val.y.affectTo] = val.y.onChange(randData[valueKey][valKey].y.value);
                }
              }
              if (_.has(val, 'value') && !val.disabled) {
                randData[valueKey][valKey].value = getRandomArbitary(1, 10).toPrecision(3);
                if (val.round) {
                  randData[valueKey][valKey].value = Math.round(randData[valueKey][valKey].value);
                }
                if (val.onChange) {
                  randData[val.affectTo] = val.onChange(randData[valueKey][valKey].value);
                }
              }
              return false;
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
            if (v.x) {
              switch (v.x.placeholder) {
                case 'x1 поч':
                case 'x1 гран':
                  x1.min = _.min([x1.min, v.x.value]);
                  x1.max = _.max([x1.max, v.x.value]);
                  break;
                case 'x2 поч':
                case 'x2 гран':
                  x2.min = _.min([x2.min, v.x.value]);
                  x2.max = _.max([x2.max, v.x.value]);
                  break;
                case 'T гран':
                  T.max = _.max([T.max, v.x.value]);
                default:
                  console.warn('UNHANDLED', v.x.placeholder);
              }
            }
            if (v.y) {
              switch (v.y.placeholder) {
                case 'x1 поч':
                case 'x1 гран':
                  x1.min = _.min([x1.min, v.y.value]);
                  x1.max = _.max([x1.max, v.y.value]);
                  break;
                case 'x2 поч':
                case 'x2 гран':
                  x2.min = _.min([x2.min, v.y.value]);
                  x2.max = _.max([x2.max, v.y.value]);
                  break;
                case 'T гран':
                  T.max = _.max([T.max, v.y.value]);
                default:
                  console.warn('UNHANDLED', v.y.placeholder);
              }
            }

          });
        });
      });
      randData.maxValues[0].x.value = x1.min;
      randData.maxValues[1].x.value = x1.max;
      randData.maxValues[0].y.value = x2.min;
      randData.maxValues[1].y.value = x2.max;
      randData.maxValues[2].y.value =T.max;
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
      $state.go('loader').then(
        function() {
          $timeout(function() {
             $state.go('graph');
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

  InputsDirective.$inject = ['helpers', '$timeout', '$uibModal'];

  function InputsDirective(helpers, $timeout, $uibModal) {
    return {
      restrict: 'AE',
      replace: false,
      templateUrl: '/inputs.html',
      scope: {
        source: '=',
        maxValues: '=',
        data: '='
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
        $scope.inputs.glyphHandler = glyphHandler;
        $scope.inputs.findMaxBounds = findMaxBounds;

        function findMaxBounds(item) {
          // var placeholder = item.placeholder;
          // var isX1 = /^x1/.test(placeholder);
          // var isX2 = /^x2/.test(placeholder);
          // var isT = /^T/.test(placeholder);
          // var isMin = /мін/.test(placeholder);
          // var isMax = /макс/.test(placeholder);
          var result = {
            x: [],
            y: []
          };
          // var x1 = {};
          // var x2 = {};
          // var T = {};
          // $scope.inputs.data && _.each($scope.inputs.data, function(value, valueKey) {
          //   _.each(value, function(val, valKey) {
          //     angular.isArray(val) && _.each(val, function(v, vKey) {
          //       switch (v.x && v.x.placeholder) {
          //         case 'x1 поч':
          //         case 'x1 гран':
          //           x1.min = _.min([x1.min, v.value]);
          //           x1.max = _.max([x1.max, v.value]);
          //           break;
          //         case 'x2 поч':
          //         case 'x2 гран':
          //           x2.min = _.min([x2.min, v.value]);
          //           x2.max = _.max([x2.max, v.value]);
          //           break;
          //         case 'T гран':
          //           T.max = _.max([T.max, v.value]);
          //           break;
          //         default:
          //           console.warn('UNHANDLED', v.placeholder);
          //       }
          //       switch (v.y && v.y.placeholder) {
          //         case 'x1 поч':
          //         case 'x1 гран':
          //           x1.min = _.min([x1.min, v.value]);
          //           x1.max = _.max([x1.max, v.value]);
          //           break;
          //         case 'x2 поч':
          //         case 'x2 гран':
          //           x2.min = _.min([x2.min, v.value]);
          //           x2.max = _.max([x2.max, v.value]);
          //           break;
          //         case 'T гран':
          //           T.max = _.max([T.max, v.value]);
          //           break;
          //         default:
          //           console.warn('UNHANDLED', v.placeholder);
          //       }
          //     });
          //   });
          // });

          // if (!isMin && !isMax) {
            result.x = $scope.inputs.maxValues[0];
            // result.x.push($scope.inputs.maxValues[0].y);
            result.y = $scope.inputs.maxValues[1];
            // result.y.push($scope.inputs.maxValues[1].y);
          // } else if (isMin) {
          //   result.x.push(null);
          //   result.x.push({value: x1.min});
          //   result.y.push(null);
          //   result.y.push({value: x2.min});
          // } else if (isMax) {
          //   result.x.push({value: x1.max});
          //   result.x.push(null);
          //   result.y.push({value: x2.max});
          //   result.y.push(null);
          // }

          return result;
        }

        function glyphHandler(item, maxBounds) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'chooseOnGraphModal.html',
            controller: function($scope, $uibModalInstance, item, $timeout, maxBounds) {
              $scope.itemX = item.x.value;
              $scope.itemY = item.y.value;
              $scope.item = item;
              function initChart() {
                var margin = 20;
                var size = {
                  height: 300,
                  width: 400
                };
                var svgSize = {
                  height: size.height - margin,
                  width: size.width - margin
                };
                var xScale = d3.scale.linear()
                  .domain([
                    (maxBounds.x.x && maxBounds.x.x.value) || Math.min((item.x.value - 2) * 2, (item.x.value - 2) / 2),
                    (maxBounds.y.x && maxBounds.y.x.value) || Math.max((item.x.value + 2) * 2, (item.x.value + 2) / 2)
                  ])
                  .range([margin * 2, svgSize.width]);
                var yScale = d3.scale.linear()
                  .domain([
                    (maxBounds.y.y && maxBounds.y.y.value) || Math.min((item.y.value - 2) * 2, (item.y.value - 2) / 2),
                    (maxBounds.x.y && maxBounds.x.y.value) || Math.max((item.y.value + 2) * 2, (item.y.value + 2) / 2)
                  ])
                  .range([margin, svgSize.height]);
                var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5);
                var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);
                var jsonCircles = [{
                  'x_axis': xScale(item.x.value),
                  'y_axis': yScale(item.y.value),
                  'radius': 5,
                  'color' : 'green'
                }];

                var svgContainer = d3.select('.modal-body').append('svg')
                  .attr('width', size.width)
                  .attr('height', size.height)
                  .attr('class', 'en')
                  .style('display', 'block')
                  .style('margin', 'auto')
                  .on('mousemove', function() {
                    var x = _.min([_.max([d3.mouse(this)[0], margin * 2]), svgSize.width]);
                    var y = _.min([_.max([d3.mouse(this)[1], margin * 2 - 10]), svgSize.height]);
                    d3.select(this)
                      .selectAll('circle')
                      .attr('cx', x)
                      .attr('cy', y);
                  })
                  .on('mouseout', function() {
                    var x = xScale($scope.itemX);
                    d3.select(this)
                      .selectAll('circle')
                      .attr('cx', x);
                  })
                  .on('click', function() {
                    var x = _.min([_.max([d3.mouse(this)[0], margin * 2]), svgSize.width]);
                    var y = _.min([_.max([d3.mouse(this)[1], margin * 2 - 10]), svgSize.height]);
                    $scope.$apply(function() {
                      $scope.itemX = item.round ? Math.round(xScale.invert(x)) : xScale.invert(x);
                      $scope.itemY = item.round ? Math.round(yScale.invert(y)) : yScale.invert(y);
                    });
                  });
                svgContainer.append("g")
                  .attr("class", "grid")
                  .attr("transform", "translate(0," + svgSize.height + ")")
                  .call(
                    xAxis
                      .tickSize(-svgSize.height, 0, 0)
                  );

                svgContainer.append("g")
                  .attr("class", "grid")
                  .call(
                    yAxis
                      .tickSize(-svgSize.width, 0, 0)
                  );
                var xAxisGroup = svgContainer.append('g')
                  .attr("transform", "translate(0," + svgSize.height + ")")
                  .call(xAxis)
                    .selectAll('text')
                      .attr('class', 'en');
                var yAxisGroup = svgContainer.append('g')
                  .attr("transform", "translate(" + (margin * 2 - 10) + ", 0)")
                  .call(yAxis)
                  .style('fill', function(d) { return 'black'; })
                    .selectAll('text')
                      .attr('class', 'en');
                var circles = svgContainer.selectAll('circle')
                  .data(jsonCircles)
                  .enter()
                  .append('circle');
                var circleAttributes = circles
                  .attr('cx', function (d) { return d.x_axis; })
                  .attr('cy', function (d) { return d.y_axis; })
                  .attr('r', function (d) { return d.radius; })
                  .style('fill', function(d) { return d.color; });
              }
              $scope.ok = function () {
                item.x.value = $scope.itemX.toPrecision(3);
                item.y.value = $scope.itemY.toPrecision(3);
                $uibModalInstance.close();
              };

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
              $uibModalInstance.rendered
                .then(initChart);
            },
            size: 'lg',
            resolve: {
              item: function () {
                return item;
              },
              maxBounds: function () {
                return maxBounds;
              }
            }
          });
        }
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
        maxValues: '=',
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
