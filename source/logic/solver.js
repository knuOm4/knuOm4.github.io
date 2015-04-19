/**
 * moduled function for solving
 * @param  {function} L   function that represents diff operator (returns something)
 * @param  {function} G   Green function that returns double value with one parameter, binded with L, must be carryed, 1 par - s, 2 - sm, 3 - t = 0?
 * @param  {function} u    right side of equation
 * @param  {array} Yrl conditions to t = 0 in S0 Square length - L0
 * @param  {array} Ypl conditions to t = 0..T in Sr Square length - Lr
 * @param  {array} S0  Square of conditions
 * @param  {array} sm0  array of points in square
 * @param  {array} smr  array of points in edges
 * @param  {number} T  max T we looking out
 * @param  {function} y  optional in tested problem
 * @return {array}     point -> value + Analys
 */
function solver(L, G, u, Yrl, Ypl, S0, sm0, smr, T, y) {
    y = y || function () {};
    return (function () {
        var B = [], // 2x2 array with B11 str as M0 col 1, B12 str Mr and col 1, B21 str M0 col 1 and B22 str Mr col 1
            Y0 = Yrl, //coz r = 1
            Yr = Ypl, //coz p = 1
            Y = Y0.concat(Yr),
            By = []
            P2 = [],
            v = [],
            v0 = [],
            vr = [],
            u0 = [],
            ur = [],
            yInfinity = function () {},
            M0 = sm0.length,
            Mr = xmr.length,
            B11 = [],
            B12 = [],
            B21 = [],
            B22 = [],

            i = 0;
        //Finding B
        for (; i < M0; i+=1) {
            B11[i] = G(undefined, sm0[i], 0);
        }
        for (i = 0; i < Mr; i+=1) {
            B12[i] = G(undefined, smr[i], 0);
        }
        for (i = 0; i < M0; i+=1) {
            B21[i] = G(undefined, sm0[i]);
        }
        for (i = 0; i < Mr; i+=1) {
            B22[i] = G(undefined, smr[i]);
        }
        //found Y in var
        //TODO: By as integration
        //TODO: P2 same
        //TODO: set v0 vr and v as concatanation to 0 or 1
        //TODO: u0 as P2 and By multiplication
        //TODO: ur same
        //TODO: set yInfinity to integrate on S0T
        //TODO: find y`(s)
        //TODO: Check the solving
        //TODO: Output data and analysys
    }());
};
function loading(){
    var divWrapper = document.createElement('div'),
        divRow,
        divPoint;
    divWrapper.className = 'loading-loader';
    for (var j = 0; j < 4; j++) {
        divRow = divWrapper.appendChild(document.createElement("div"));
        divRow.className = 'row-loader';
        for (var i = 0; i < 4; i++) {
            divPoint = divRow.appendChild(document.createElement("div"));
            divPoint.className = 'point-loader';
        }
    }

    document.body.className = "loader";
    document.body.innerHTML = "";
    document.body.appendChild(divWrapper);
}
