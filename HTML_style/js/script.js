/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var classes = {
    beg: '_beg_input_clause',
    x_bord: '_x_brd_input_clause',
    t_bord: '_t_brd_input_clause'
};

var beg_clause = "Початкове спостереження";

var border_clause = "Граничне спостереження";

var f_factor = "Права частина";

$(document).ready(function () {
    $('#array_number').change(function (e) {
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
    $('#array_number').change();
    $('#submit').click(input);
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
    new_input1.id = i + '' + classes.beg;
    new_input2.id = i + '' + classes.x_bord;
    new_input3.id = i + '' + classes.t_bord;
    $(new_div).append(new_div1, new_input1, new_div2, new_input2, new_input3);
    $(new_div).find('*').addClass('col-md-3');
    $(new_div).find('#' + new_input2.id + ', #' + new_input3.id).toggleClass("col-md-3").addClass('col-md-1');
    $('#for_inputs').append(new_div);
}

function delete_row() {
    $('#for_inputs').children('.row').last().remove();
}

function input(e) {
    var interface = new Interface();

    return false;
}

function Interface() {
    var def_a = 0;
    var def_b = 1;
    var def_T = 1;
    this.a = +$('#left_border').val() || def_a;
    this.b = +$('#right_border').val() || def_b;
    if (this.a > this.b) {
        this.a = this.b;
        $('#left_border').val(this.b)
    }
    this.T = +$('#t_limit').val() || def_T;
    this.const = +$('#c_const').val() || 1;
    this.begin_conition = [];
    this.border_conition = [];
    this.right_side = [];
    parse_arrays(this);
}

function try_funk(str, x, t) {
    str.replace(/x/g, '' + x);
    str.replace(/t/g, '' + t);
    return eval(str);
}

function diff_f_x(f, x, t) {
    var dx = 0.0001;
    return (f(x + dx, t) - f(x - dx, t)) / 2 / dx;
}

function diff_f_t(f, x, t) {
    var dt = 0.0001;
    return (f(x, t + dt) - f(x, t - dt)) / 2 / dt;
}

function diff_f_x2(f, x, t) {
    var dx = 0.0001;
    return (diff_f_x(f, x + dx, t) - diff_f_x(f, x - dx, t)) / 2 / dx;
}

function diff_f_t2(f, x, t) {
    var dt = 0.0001;
    return (diff_f_t(f, x, t + dt) - diff_f_t(f, x, t - dt)) / 2 / dt;
}

function diff_f_tx(f, x, t) {
    var dt = 0.0001;
    var dx = 0.0001;
    return (diff_f_x(f, x, t + dt) - diff_f_x(f, x, t - dt)) / 2 / dt;
}

function parse_arrays(obj) {
    var el = $('#for_inputs');
    var len = el.children().length;
    var fun = function(x,t){
        return try_funk($('#answer').val(),x,t);
    }
    
    for (var i = 0; i < len; ++i) {
        obj.begin_conition[i] = new Array();
        obj.border_conition[i] = new Array();
        obj.right_side[i] = new Array();
        obj.begin_conition[i][0] = +el.find('#' + (i + 1) + classes.beg).val();
        obj.begin_conition[i][1] = get_f(obj.begin_conition[i][0],0);
        obj.border_conition[i][0] = +el.find('#' + (i + 1) + classes.x_bord).val();
        obj.border_conition[i][1] = +el.find('#' + (i + 1) + classes.t_bord).val();
        obj.border_conition[i][2] = get_f(obj.border_conition[i][0],obj.border_conition[i][1]);
        obj.right_side[i][0] = obj.border_conition[i][0];
        obj.right_side[i][1] = obj.border_conition[i][1];
        obj.right_side[i][2] = obj.const * obj.const * diff_f_x2(fun, obj.right_side[i][0], obj.right_side[i][1]) - diff_f_t2(fun, obj.right_side[i][0], obj.right_side[i][1]);
    }
}

function get_f(x,t){
    return try_funk($('#answer').val(),x,t);
}