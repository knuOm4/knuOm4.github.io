/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var beg_clause="Початкове спостереження";

var border_clause="Граничне спостереження";

var f_factor="Права частина";

$(document).ready(function(){
    $('#array_number').change(function(e){
        var num = $(this).val();
        var num_inputs = $('#for_inputs').children().length;
        if (num<num_inputs){
            for(var i=num_inputs;i>num;--i){
                delete_row();
            }
        }
        else{
            for(var i = num_inputs; i < num; ++i){
                insert_new_row(i+1)
            }
        }
    });
    $('#array_number').change();
});

function insert_new_row(i){
    var new_div = document.createElement('div');
    var new_div1 = new_div.cloneNode();
    $(new_div1).html(beg_clause+' '+i+':');
    var new_div2 = new_div.cloneNode();
    $(new_div2).html(border_clause+' '+i+':');
    var new_div3 = new_div.cloneNode();
    $(new_div3).html(f_factor+' '+i+':');        
    $(new_div).addClass('row');
    var new_input1 = document.createElement('input');
    new_input1.type = 'text';
    var new_input2 = new_input1.cloneNode();
    var new_input3 = new_input1.cloneNode();
    new_input1.id = i + '_beg_input_clause';
    new_input2.id = i + '_brd_input_clause';
    new_input3.id = i + '_fun_input_clause';
    $(new_div).append(new_div1,new_input1,new_div2,new_input2,new_div3,new_input3);
    $(new_div).find('*').addClass('col-md-2');
    $('#for_inputs').append(new_div);    
}

function delete_row(){
    $('#for_inputs').children().last().remove();
}