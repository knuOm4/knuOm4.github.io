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
 * @param  {number} y  constant for diff operator or other arr of constants
 * @return {array}     point -> value + Analys
 */
function solver(L, G, u, Yrl, Ypl, S0, sm0, smr, T, y, c) {
    //for defaults look in sheat
    c = c || 2;
    y = y || function (s) {
        s = s || [0, 0, 0];
        //s[0] = x1
        //s[1] = x2
        //s[2] = t
        return s[0] * s[1] * s[1] + s[2] * s[2];
    };
    u = u || function (s) {
        s = s || [0, 0, 0];
        //s[0] = x1
        //s[1] = x2
        //s[2] = t
        return c * c * 2 * s[0] - 2;
    };
    G = G || function (s) {
        s = s || [0, 0, 0];
        //s[0] = x1 - x1`
        //s[1] = x2 - x2`
        //s[2] = t - t`
        var H = ((c * (s[2] - Math.sqrt(s[0] * s[0] + s[1] * s[1]))) > 0) ? 1 : 0,
            del = 2 * Math.PI * c * (c * c * (s[2] * s[2] - Math.sqrt(s[0] * s[0] + s[1] * s[1])));
        return (-H ) / del;
    };
    Yrl = Yrl || [0.081, 0.162, 0.243];
    Ypl = Ypl || [1, 2, 5];
    S0 = S0 || [[0, 1], [0, 1], [0]];
    sm0 = sm0 || [[0.5, 0.5, -1], [0.5, 0.5, -2], [0.5, 0.5, -3]];
    smr = smr || [[1.5, 1.5, 0], [0.5, 1.5, 1], [1.5, 0.5, 2]];
    T = T || 2;
    return (function () {
        var B = [], // 2x2 array with B11 str as M0 col 1, B12 str Mr and col 1, B21 str M0 col 1 and B22 str Mr col 1
            BT = [[],[]],
            Y0 = [Yrl], //coz r = 1
            Yr = [Ypl], //coz p = 1
            Y = Y0.concat(Yr),
            By = []
            P2 = [],
            P2plus = [],
            M0 = sm0.length,
            Mr = smr.length,
            v0 = new Array(M0), // filled with 0
            vr = new Array(Mr), // filled with 0
            v = v0.concat(vr),
            u0 = [],
            ur = [],
            um0 = [],
            umr = [],
            yInfinity = function (G, u, s, smor) {
                var sum = 0;
                for (var i = 0; i < smor.length; i++) {
                    sum += G([s[0] - smor[0], s[1] - smor[1], s[2] - smor[2]]) * u(smor);
                }
                return sum;
            },
            yVector = function (G, um, s, sm) {
                var sum = 0;
                for (var i = 0; i < sm.length; i++) {
                    sum += G([s[0] - sm[0], s[1] - sm[1], s[2] - sm[2]]) * um[i];
                }
                return sum;
            },
            B11 = [],
            B12 = [],
            B21 = [],
            B22 = [],
            i = 0, j = 0
            temp = undefined,
            smor = sm0.concat(smr);
            Sr = Sr || [[0, 1], [0, 1], [0, T]];;//means S without body and from 0 to T
        for (i = 0; i < M0; i++) {
            v0[i] = 0;
        }
        for (i = 0; i < Mr; i++) {
            vr[i] = 0;
        }
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
        return function (s) {
            return yInfinity(G, u, s, smor) + yVector(G, um0, s, sm0) + yVector(G, umr, s, smr);
        };
    }());
};

/**
 * makes pretty loader page
 * @return null
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