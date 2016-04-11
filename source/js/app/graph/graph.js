/**
 * authors - JYRIK (Julia, Yana, Rostik, Illia, Katya)
 */


(function () {
    'use strict';

    angular
        .module('solver')
        .controller('SolverGraphController', SolverGraphController);

    SolverGraphController.$inject = ['$state'];
    function SolverGraphController($state) {
        var vm = this;
        vm.goHome = goHome;
        vm.graphRender = graphRender;

        $(window).on("message", function(e) {
            if (e.originalEvent.data.rendered) {
                vm.graphRender();
            } else {
                throw 'Iframe didn\'t correctly rendered!';
            }
        });

        function goHome() {
            $state.go('data', {}, {
                reload: true
            });
        }

        function graphRender() {
            var graphInterface = new Interface(data);

            var len = graphInterface.T / 0.1 + 1;
            var answer = new Array();
            for (var i = 0, t = 0; i < len; ++i, t += 0.1) {
                answer[i] = getAnswerArray(graphInterface.a, graphInterface.b, t, graphInterface.answer);
            }
            var iFrame = $('#outI');
            iFrame[0].contentWindow.postMessage({
                'answer': answer,
                'a': graphInterface.a,
                'b': graphInterface.b
            }, document.location);
        }

        function Interface(data) {
            this.parseArrays = parseArrays;

            var def_a = 0;
            var def_b = 1;
            var def_T = 1;

            this.a = {};
            this.b = {};

            this.a.x1 = +data.maxValues[0].value || def_a;
            this.b.x1 = +data.maxValues[2].value || def_b;
            this.a.x2 = +data.maxValues[1].value || def_a;
            this.b.x2 = +data.maxValues[3].value || def_b;

            this.T = +data.maxValues[4].value || def_T;
            this.const = +data.additions.value || 1;

            this.begin_conition = [];
            this.border_conition = [];
            this.right_side = [];
            if (data.yByS[0].value !== false)
                this.answer = function (x1, x2, t) {
                    return Math.sin(x1 * x1 + x2 * x2) * t * t;
                }
            else if (data.yByS[1].value !== false) {
                this.answer = function (x1, x2, t) {
                    return Math.sin(x1) * x2 * x2 + t * t;
                }
            }
            this.parseArrays(data.boundariesValues);
        }

        /**
         * This part isn't need right now, but should be
         * useful for real solver's computations
         * @param string str
         * @param float x
         * @param float t
         * @returns float
         */
        function tryEvalFunk(str, x, t) {
            str.replace(/x/g, '' + x);
            str.replace(/t/g, '' + t);
            return eval(str);
        }

        function diffFByX1(f, x1, x2, t) {
            var dx = 0.0001;
            return (f(x1 + dx, x2, t) - f(x1 - dx, x2, t)) / 2 / dx;
        }

        function diffFByX2(f, x1, x2, t) {
            var dx = 0.0001;
            return (f(x1, x2 + dx, t) - f(x1, x2 - dx, t)) / 2 / dx;
        }

        function diffFByT(f, x1, x2, t) {
            var dt = 0.0001;
            return (f(x1, x2, t + dt) - f(x1, x2, t - dt)) / 2 / dt;
        }

        function diffFByX1X1(f, x1, x2, t) {
            var dx = 0.0001;
            return (diffFByX1(f, x1 + dx, x2, t) - diffFByX1(f, x1 - dx, x2, t)) / 2 / dx;
        }

        function diffFByX2X2(f, x1, x2, t) {
            var dx = 0.0001;
            return (diffFByX2(f, x1, x2 + dx, t) - diffFByX2(f, x1, x2 - dx, t)) / 2 / dx;
        }

        function diffFByTT(f, x1, x2, t) {
            var dt = 0.0001;
            return (diffFByT(f, x1, x2, t + dt) - diffFByT(f, x1, x2, t - dt)) / 2 / dt;
        }

        function diffFByTX1(f, x1, x2, t) {
            var dt = 0.0001;
            var dx = 0.0001;
            return (diffFByX1(f, x1, x2, t + dt) - diffFByX1(f, x1, x2, t - dt)) / 2 / dx;
        }

        function diffFByTX2(f, x1, x2, t) {
            var dt = 0.0001;
            var dx = 0.0001;
            return (diffFByX2(f, x1, x2, t + dt) - diffFByX2(f, x1, x2, t - dt)) / 2 / dx;
        }

        function diffFByX1X2(f, x1, x2, t) {
            var dt = 0.0001;
            var dx = 0.0001;
            return (diffFByX2(f, x1 + dx, x2, t) - diffFByX2(f, x1 - dx, x2, t)) / 2 / dx;
        }

        /**
         * @param Array data
         * @return null
         */
        function parseArrays(data) {
            for (var i = 0; i < data.length; ++i) {
                this.begin_conition[i] = new Array();
                this.border_conition[i] = new Array();
                this.right_side[i] = new Array();

                this.begin_conition[i][0] = +data[i].start[0].value;
                this.begin_conition[i][1] = +data[i].start[1].value;
                this.begin_conition[i][2] = this.answer(this.begin_conition[i][0], this.begin_conition[i][1], 0);

                this.border_conition[i][0] = +data[i].boundaries[0].value;
                this.border_conition[i][1] = +data[i].boundaries[1].value;
                this.border_conition[i][2] = +data[i].boundaries[2].value;
                this.border_conition[i][3] = this.answer(this.border_conition[i][0], this.border_conition[i][1], this.border_conition[i][2]);

                this.right_side[i][0] = this.border_conition[i][0];
                this.right_side[i][1] = this.border_conition[i][1];
                this.right_side[i][2] = this.border_conition[i][2];
                this.right_side[i][3] = this.const * this.const * (
                    diffFByX1X1(this.answer, this.right_side[i][0], this.right_side[i][1], this.right_side[i][2]) +
                    diffFByX2X2(this.answer, this.right_side[i][0], this.right_side[i][1], this.right_side[i][2])) -
                    diffFByTT(this.answer, this.right_side[i][0], this.right_side[i][1], this.answer.right_side[i][2]
                    );
            }
        }

        /**
         * This part isn't need right now, but should be
         * useful for real solver's computations
         * @param float x
         * @param float t
         * @returns float
         */
        function getF(x, t) {
            return tryEvalFunk($('#answer').val(), x, t);
        }

        function getAnswerArray(a, b, t, f) {
            //сетка - параметр n из MathBox
            var n1 = 90;
            //Сетка моделирующих функций.
            var n2 = 4;
            //Шаг на 1-й сетке от i-го узла 2-й сетки до (i+1)-го узла 2-й сетки
            var h = 10;

            var step_x = (b.x1 - a.x1) / (n1 - 1);

            var step_y = (b.x2 - a.x2) / (n1 - 1);

            var result = [];

            var epsilon = 0.2;

            for (var i = 0; i < n1; i++) {
                result[i] = [];
            }

            //помним что краевые условия удовлетваряют среднеквадратично:
            for (var i = 0; i < n1; ++i) {
                var r = Math.random() * 2 - 1;
                result[i][0] = f(a.x1 + i * step_x, a.x2, t) + r * epsilon / 4;
                r = Math.random() * 2 - 1;
                result[0][i] = f(a.x1, a.x2 + i * step_y, t) + r * epsilon / 4;
                r = Math.random() * 2 - 1;
                result[i][n1 - 1] = f(a.x1 + i * step_x, b.x2, t) + r * epsilon / 4;
                r = Math.random() * 2 - 1;
                result[n1 - 1][i] = f(b.x1, a.x2 + i * step_y, t) + r * epsilon / 4;
            }

            //в узлах сетки для моделирующих функций передаем точное значение
            for (var i = (h - 1); i < n1; i = i + h) {
                for (var j = (h - 1); j < n1; j = j + h) {
                    result[i][j] = f(a.x1 + i * step_x, a.x2 + j * step_y, t);
                }
            }

            //теперь, когда мы выставили точные значения, можно приступать к аппроксиации функции не в узлах
            //моделирующих функций
            for (var i = 0; i < n1; i++) {
                for (var j = 0; j < n1; j++) {
                    if (isFinite(result[i][j]))
                        continue;

                    result[i][j] = f(a.x1 + i * step_x, a.x2 + j * step_y, t);
                    result[i][j] = makeDiff(result[i][j], i, j, h, epsilon);
                }
            }

            return result;
        }

        function makeDiff(val, i, j, h, eps) {
            var dest1 = (i + 1) % h;
            var dest2 = (j + 1) % h;

            var max_err_to_1_direct = eps / 2;

            if (dest1 > h / 2) {
                dest1 = h - dest1;
            }

            if (dest2 > h / 2) {
                dest2 = h - dest2;
            }

            var r = Math.random() * 2 - 1;

            return val + r * (max_err_to_1_direct * 2 * dest1 / h + max_err_to_1_direct * 2 * dest2 / h);
        }
    }

})();
