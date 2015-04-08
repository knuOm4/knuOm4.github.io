/**
 * moduled function for solving
 * @param  {function} L   function that represents diff operator (returns something)
 * @param  {function} G   Green function that returns double value with one parameter, binded with L
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
        var B = [],
            Y = [],
            By = []
            P2 = [],
            v = [],
            v0 = [],
            vr = [],
            u0 = [],
            ur = [],
            yInfinity = function () {};
        //TODO: find B from G and sm0 and smr
        //TODO: find Y from Yrl and Ypl
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
