/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var classes = {
    x1_beg: '_x1_beg_input_clause',
    x2_beg: '_x2_beg_input_clause',
    x1_bord: '_x1_brd_input_clause',
    x2_bord: '_x2_brd_input_clause',
    t_bord: '_t_brd_input_clause'
};

var must_fill = [['r1','r2'],['r3','r4'],'input-9','input-10','input-12',['r5','r6'],'input-11','input-13','input-19','input-20'];

var beg_clause = "Початкове спостереження";

var border_clause = "Граничне спостереження";

var f_factor = "Права частина";

$(document).ready(function () {
    $('#input-13').change(function (e) {
        var num = $(this).val();
        var num_inputs = $('#for_inputs').children().length;
        if (num < num_inputs) {
            for (var i = num_inputs; i > num; --i) {
                delete_row();
            }
        }
        else {
            for (var i = num_inputs; i < num; ++i) {
                insert_new_row(i + 1)
            }
        }
    });
    $('#input-13').change();
    $('#next').click(input);
});

function insert_new_row(i) {
    var new_div = document.createElement('div');
    var new_div1 = new_div.cloneNode();
    $(new_div1).html(beg_clause + ' ' + i + ':');
    var new_div2 = new_div.cloneNode();
    $(new_div2).html(border_clause + ' ' + i + ':');
    $(new_div).addClass('row');
    var new_input1 = document.createElement('input');
    new_input1.type = 'text';
    var new_input2 = new_input1.cloneNode();
    var new_input3 = new_input2.cloneNode();
    var new_input4 = new_input3.cloneNode();
    var new_input5 = new_input4.cloneNode();
    new_input1.id = i + '' + classes.x1_beg;
    new_input1.placeholder = 'Введіть X1';
    new_input2.id = i + '' + classes.x1_bord;
    new_input2.placeholder = 'Введіть X1';
    new_input3.id = i + '' + classes.t_bord;
    new_input3.placeholder = 'Введіть T';
    new_input4.id = i + '' + classes.x2_beg;
    new_input4.placeholder = 'Введіть X2';
    new_input5.id = i + '' + classes.x2_bord;
    new_input5.placeholder = 'Введіть X2';    
    $(new_div).append(new_div1, new_input1, new_input4, new_div2, new_input2, new_input5, new_input3);
    $(new_div).find('#' + new_input2.id + ', #' + new_input3.id).toggleClass("col-md-3").addClass('col-md-1');
    $(new_div).find('input').addClass('form-control');
    $(new_div).find('*').addClass('col-md-3');
    $('#for_inputs').append(new_div);
}

function delete_row() {
    $('#for_inputs').children('.row').last().remove();
}

function input(e) {
    var interface = new Interface();
    if(interface.error)
        return false;
}

function Interface() {
    var def_a = 0;
    var def_b = 1;
    var def_T = 1;
    
    this.a.x1 = +$('#input-9').val() || def_a;
    this.b.x1 = +$('#input-10').val() || def_b;
    this.a.x2 = +$('#input-19').val() || def_a;
    this.b.x2 = +$('#input-20').val() || def_b;    
    if (this.a.x1 > this.b.x1) {
        this.a.x1 = this.b.x1;
        $('#input-9').val(this.b.x1)
    }
    if (this.a.x2 > this.b.x2) {
        this.a.x2 = this.b.x2;
        $('#input-19').val(this.b.x2)
    }    
   
    this.T = +$('#input-12').val() || def_T;
    this.const = +$('#input-11').val() || 1;
    this.begin_conition = [];
    this.border_conition = [];
    this.right_side = [];
    if($('#r5')[0].checked)
        this.answer = function(x1, x2, t){
            return Math.sin(x1*x1+x2*x2) * t * t;
        }
    else if($('#r6')[0].checked){
        this.answer = function(x,t){
            return Math.sin(x1) * x2 * x2 + t * t;
        }        
    }
    parse_arrays(this);
    if(!check_fields()){
        alert('Введіть усі данні!');
        this.error = true;
        return false;
    }
}

function check_fields(){
    var length = must_fill.length;
    for(var i = 0; i < length; ++i){
        if((!Array.isArray(must_fill[i]))){
            if(($('#' + must_fill[i]).val() == ''))
                return false;
        }
        else{
            var len2 = must_fill[i].length;
            var k = 0;
            for(var j = 0; j < len2; ++j){
                if($('#' + must_fill[i][j])[0].checked)
                    break;
            }
            if(j == len2)
                return false;
        }
    }
    return true;
}

function try_funk(str, x, t) {
    str.replace(/x/g, '' + x);
    str.replace(/t/g, '' + t);
    return eval(str);
}

function diff_f_x1(f, x1, x2, t) {
    var dx = 0.0001;
    return (f(x1 + dx, x2, t) - f(x1 - dx, x2, t)) / 2 / dx;
}

function diff_f_x2(f, x1, x2, t) {
    var dx = 0.0001;
    return (f(x1, x2 + dx, t) - f(x1, x2 - dx, t)) / 2 / dx;
}

function diff_f_t(f, x1, x2, t) {
    var dt = 0.0001;
    return (f(x1, x2, t + dt) - f(x1, x2, t - dt)) / 2 / dt;
}

function diff_f_x1_x1(f, x1, x2, t) {
    var dx = 0.0001;
    return (diff_f_x1(f, x1 + dx, x2, t) - diff_f_x1(f, x1 - dx, x2, t)) / 2 / dx;
}

function diff_f_x2_x2(f, x1, x2, t) {
    var dx = 0.0001;
    return (diff_f_x2(f, x1, x2 + dx, t) - diff_f_x2(f, x1, x2 - dx, t)) / 2 / dx;
}

function diff_f_t_t(f, x1, x2, t) {
    var dt = 0.0001;
    return (diff_f_t(f, x1, x2, t + dt) - diff_f_t(f, x1, x2, t - dt)) / 2 / dt;
}

function diff_f_t_x1(f, x1, x2, t) {
    var dt = 0.0001;
    var dx = 0.0001;
    return (diff_f_x1(f, x1, x2, t + dt) - diff_f_x1(f, x1, x2, t - dt)) / 2 / dx;
}

function diff_f_t_x2(f, x1, x2, t) {
    var dt = 0.0001;
    var dx = 0.0001;
    return (diff_f_x2(f, x1, x2, t + dt) - diff_f_x2(f, x1, x2, t - dt)) / 2 / dx;
}

function diff_f_x1_x2(f, x1, x2, t) {
    var dt = 0.0001;
    var dx = 0.0001;
    return (diff_f_x2(f, x1 + dx, x2, t) - diff_f_x2(f, x1 - dx, x2, t)) / 2 / dx;
}

function parse_arrays(obj) {
    var el = $('#for_inputs');
    var len = el.children().length;
    var fun = obj.answer;
    
    for (var i = 0; i < len; ++i) {
        obj.begin_conition[i] = new Array();
        obj.border_conition[i] = new Array();
        obj.right_side[i] = new Array();
        obj.begin_conition[i][0] = +el.find('#' + (i + 1) + classes.x1_beg).val();
        obj.begin_conition[i][1] = +el.find('#' + (i + 1) + classes.x2_beg).val();        
        obj.begin_conition[i][2] = fun(obj.begin_conition[i][0], obj.begin_conition[i][0], 0);
        obj.border_conition[i][0] = +el.find('#' + (i + 1) + classes.x1_bord).val();
        obj.border_conition[i][1] = +el.find('#' + (i + 1) + classes.x2_bord).val();        
        obj.border_conition[i][2] = +el.find('#' + (i + 1) + classes.t_bord).val();
        obj.border_conition[i][3] = fun(obj.border_conition[i][0],obj.border_conition[i][1],obj.border_conition[i][2]);
        obj.right_side[i][0] = obj.border_conition[i][0];
        obj.right_side[i][1] = obj.border_conition[i][1];
        obj.right_side[i][2] = obj.border_conition[i][2];        
        obj.right_side[i][3] = obj.const * obj.const * (diff_f_x1_x1(fun, obj.right_side[i][0], obj.right_side[i][1], obj.right_side[i][2]) + diff_f_x2_x2(fun, obj.right_side[i][0], obj.right_side[i][1], obj.right_side[i][2])) - diff_f_t_t(fun, obj.right_side[i][0], obj.right_side[i][1], obj.right_side[i][2]);
    }
}

function get_f(x,t){
    return try_funk($('#answer').val(),x,t);
}

function get_answer_array(a ,b, t, f){
    //сетка - параметр n из MathBox
    var n1 = 180;
    //Сетка моделирующих функций.
    var n2 = 8;
    //Шаг на 1-й сетке от i-го узла 2-й сетки до (i+1)-го узла 2-й сетки
    var h = 20;
   
    var step_x = (b.x - a.x) / (n1 - 1);
    
    var step_y = (b.y - a.y) / (n1 - 1);
    
    var result = [];
    
    var epsilon = 0.1;
    //помним что краевые условия удовлетваряют среднеквадратично:
    for(var i = 0; i < n1; ++i){
        var r = Math.random() * 2 - 1;
        result[i][0]  = f(a.x + i * step_x, a.y, t) + r * epsilon / 2;
        result[0][i]  = f(a.x, a.y + i * step_y, t) + r * epsilon / 2;
        result[i][n1 - 1]  = f(a.x + i * step_x, b.y, t) + r * epsilon / 2;
        result[n1 - 1][i]  = f(b.x, a.y + i * step_y, t) + r * epsilon / 2;
    }
}
