function bodyLoader () {
    // Объект, где будут храниться контроллеры
    var pages = {},
        GuideRouter,
        Guide,
        first = true;

    // Контроллер для главной страницы
    pages.index = Pilot.View.extend({
        el: "#pt-index",

        onRoute: function (evt, req){
            // Метод вызывается при routerstart и routeend
            document.body.className = "";
            if (!first) {
                show("pt-index");
            } else {
                first = false;
            }
        }
    });
    pages.loader = Pilot.View.extend({
        el: "#pt-loader",

        onRoute: function (evt, req){
            first = false;
            // Метод вызывается при routerstart и routeend
            document.body.className = "loader";
            show("pt-loader");
            setTimeout(function () {
                Guide.go("graph", {});
            }, getRandomInt(3000, 10000));

        }
    });
    pages.graph = Pilot.View.extend({
        el: "#pt-graph",

        onRoute: function (evt, req){
            first = false;
            // Метод вызывается при routerstart и routeend
            // var board = JXG.JSXGraph.initBoard("jxgbox", {
            //     keepaspectratio: true,
            //     boundingbox: [-5, 5, 5, -5],
            //     axis:true
            // }),
            // x, y, x1, x2, y1, y2;
            // board.suspendUpdate();
            // x = [-4,-3,-2,-1,0,1,2,3,5];
            // y = [-3,2,3,-1,0,2,1,4,0];
            // board.create("curve", [x,y], {strokeWidth:2});
            // 
            // x1 = [0,1,2,3,5];
            // y1 = [0,3,2,5,1];
            // board.create("curve", [x1,y1], {strokeWidth:2});
            // 
            // x2 = [0,1,2,3,5];
            // y2 = [0,1,0,3,-1];
            // board.create("curve", [x2,y2], {strokeWidth:2});
            // board.unsuspendUpdate();

            document.body.className = "";
            show("pt-graph");
        }
    });

    GuideRouter = Pilot.extend({
        init: function (){
            // Задаем маршруты и их контроллеры:
            this
                .route("index", "/knuom4.github.io/", pages.index)
                .route("loader", "loader", pages.loader)
                .route("graph", "graph", pages.graph)
            ;
        }
    });

    Guide = new GuideRouter({
         // Указываем элемент, внутри которого перехватываем клики на ссылках
         el: "#pt-main",

         // Используем HistoryAPI
         useHistory: true
    });

    // Запускаем роутер
    Guide.start();
    // Guide.go("index");
}

// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function show (s) {

    PageTransitions.nextPage(getRandomInt(1, 67));
}