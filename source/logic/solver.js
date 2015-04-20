/**
 * moduled function for solving
 * @param  {function} L   function that represents diff operator (returns something)
 * @param  {function} G   Green function that returns double value with one parameter, binded with L, must be carryed, 1 par - s, 2 - sm, 3 - t = 0?
 * @param  {function} u    right side of equation
 * @param  {array} Yrl conditions to t = 0 in S0 Square length - L0
 * @param  {array} Ypl conditions to t = 0..T in Sr Square length - Lr
 * @param  {array} S0  Square of conditions
 * @param  {array} sm0  array of points in square same length as L0 prob
 * @param  {array} smr  array of points in edges same length as Lr prob
 * @param  {number} T  max T we looking out
 * @param  {function} y  optional in tested problem
 * @return {array}     point -> value + Analys
 */
function solver(L, G, u, Yrl, Ypl, S0, sm0, smr, T, y) {
    y = y || function () {};
    return (function () {
        var B = [], // 2x2 array with B11 str as M0 col 1, B12 str Mr and col 1, B21 str M0 col 1 and B22 str Mr col 1
            BT = [[],[]],
            Y0 = Yrl, //coz r = 1
            Yr = Ypl, //coz p = 1
            Y = Y0.concat(Yr),
            By = []
            P2 = [],
            P2plus = [],
            v = [],
            v0 = [], // filled with 0
            vr = [], // filled with 0
            u0 = [],
            ur = [],
            yInfinity = function () {},
            M0 = sm0.length,
            Mr = smr.length,
            B11 = [],
            B12 = [],
            B21 = [],
            B22 = [],
            i = 0, j = 0
            temp = undefined,
            Sr;//means S without body and from 0 to T

        //Finding B
        for (i = 0; i < M0; i+=1) {
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
        B[0] = B11.concat(B12);
        B[1] = B21.concat(B22);

        //found Y in var

        //Transpaning B
        for (j = 0; j < B.length; j+=1)
            for (i = 0; i < B[j].length; i+=1) {
                BT[i][j] = B[j][i];
            }
        //Finding By
        temp = mulMatrVector(BT, Y);
        By = integrate(temp, S0, Sr);
        //Finding P2 and P2plus
        temp = mulMatrMatr(BT, B);
        P2 = integrate(temp, S0, Sr);
        P2plus = pseudoMatr(P2);
        //Finding V
        v = v0.concat(vr);
        //Finding u
        u = plusVectorVector(mulMatrVector(P2plus, plusVectorVector(By, v)), v);
        //here we can split u into u0 and ur if we need such
        //Finding yInfinity
        yInfinity = function (G, u, sm) {
            var Sum = 0;
            for (var i = 0; i < sm.length; i++) {
                Sum += G(undefined, sm[i]) * u(sm[i]);
            }
            return Sum;
        };
        //TODO: find y`(s)
        //TODO: Check the solving
        //TODO: Output data and analysys
    }());
};

/**
 * makes pretty loader page
 * @return nothing
 */
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

function integrate () {
    //TODO: fill
    return [];
}
function mulMatrVector () {
    //TODO: fill
    return [];
}
function mulMatrMatr () {
    //TODO: fill
    return [];
}
function pseudoMatr () {
    //TODO: fill
    return [];
}
function plusVectorVector () {
    //TODO: fill
    return [];
}