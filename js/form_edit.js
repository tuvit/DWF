/**
 * FormGet
 *
 * js file use create form-data json for edit page
 * package		app_js
 * Version		 1.0
 */


/**
 * FormGet function Form 
 * base function use to contains form attribute and all element attribute for creating json
 */
 $(function() {
    jQuery('.form_desc').tipsy({
        gravity: 's'
    });
});
function Form()
{
    this.id = 0;
    this.title = "Untitled Form";
    this.label = document.getElementById('form_setting_para_1').innerHTML;
    this.description = document.getElementById('form_setting_para_2').innerHTML;
    this.submit_text = document.getElementById('submit_label').value;
    this.redirect_url = document.getElementById('form_setting').getAttribute('data-redirect');
    this.conditionLogic = "";
    this.fields = new Array();
}

/**
 * FormGet function cat_box
 * base function use to contains only checkbox attribute  for creating json-cat
 */
function cat_box()
{
    this.field = new Array();
}

/**
 * FormGet function Fields
 *function reserve further enhancement
 */
function Section_break()
{
    this.id = "";
    this.title = "";
    this.type = "";
    this.title = "";
    this.label = "";
    this.error_message = "";
}

/**
 * FormGet function Choice
 * function use to contains select,checkbox,radio option's attribute provides for there parent element 
 */
function Choice(text, value, price)
{
    this.id = "";
    this.type = "";
    this.text = "";
    this.value = false;
    this.label_id = "";
}

/**
 * FormGet function Field
 * base function use to contains element attribute of all element 
 */
function Field(id, type)
{//"id", "type", "elemet_type", "label_name", "required", "error_message"
    this.id = id;
    this.type = "";
    this.title = "";
    this.label = "";
    this.required = "";
    this.error_message = "";
    //NOTE: other properties will be added dynamically using associative array syntax
}

/**
 * FormGet function create_form_array 
 * function use to collect all attribute of form and element and create json variable
 */
function create_edit_form_array() {
	window.onbeforeunload = null;
     jQuery("#save_form_button").css({display:"none"});
     jQuery("#loadingImage").css({display:"block"});
    var form = new Form();
    var created_form = document.getElementsByTagName("form");
    var element_div = created_form[0].getElementsByTagName("div");
    var element_type;
    var element_container_array = new Array();
    var radio_checkbox_select_array = new Array();
    form.id = created_form[0].id;
    if (element_div.length == 0)
    {
        alert('add at least one element');
        return;
    }else{
        fg_loader_show();
    }

    if (jQuery("#conditionWrapper").length > 0)
    {
        if (jQuery("#conditionWrapper").attr('data-logicapply') == "true")
        {
            var selectArray = jQuery("#conditionWrapper").find('select');
            for (var m = 0; m < selectArray.length; m++)
            {
                jQuery(selectArray[m]).find(":selected").attr('selected', 'true');
            }
            form.conditionLogic = jQuery("#Logic_container").html();
            var allConditionDiv = jQuery(".conditionLogicDiv");
            for (var k = 0; k < allConditionDiv.length; k++)
            {
                var globalLogicalString = 'if(';
                var boolLogic = '';
                var allsource = jQuery(allConditionDiv[k]).find(".sourceCondition");
                for (var l = 0; l < allsource.length; l++)
                {
                    var sourceId = jQuery(allsource[l]).find(".sourceSelect:first").find(":selected").data('sourceid');
                    var li_id = jQuery(allConditionDiv[k]).find(".targetSelect:first").find(":selected").data('targetid');
                    var logicValue = jQuery(allsource[l]).find(".logicSelect:first").val();
                    var conditionValue = jQuery(allsource[l]).find(".valueInput:first").val();
                    if (l != 0)
                    {
                        boolLogic = jQuery(allsource[l]).find(".boolLogic:first").children(":selected").data('sign');
                    }
                    if (allsource.length == 1)
                    {
                        globalLogicalString += 'valueContains(\'' + sourceId + '\',\'' + logicValue + '\',\'' + conditionValue + '\',\'' + li_id + '\') )';
                    } else
                    {
                        globalLogicalString += '' + boolLogic + ' valueContains(\'' + sourceId + '\',\'' + logicValue + '\',\'' + conditionValue + '\',\'' + li_id + '\')';
                    }
                }
                if (allsource.length >= 2)
                {
                    globalLogicalString += ')';
                }
                var visibleValue = jQuery(allConditionDiv[k]).find(".visibleSelect:first").val();
                var targetId = jQuery(allConditionDiv[k]).find(".targetSelect:first").children(":selected").data('targetid');
                if (visibleValue === "show")
                {
                    globalLogicalString += '{jQuery(\'#' + targetId + '\').show(400);}else{jQuery(\'#' + targetId + '\').hide(400);jQuery(\'#' + targetId +" input[type=text]"+'\').val(\'\');jQuery(\'#' + targetId +" textarea"+'\').val(\'\');jQuery(\'#' + targetId + '\').find(\'input[type=checkbox]:checked\').removeAttr(\'checked\');jQuery(\'#' + targetId + '\').find(\'input[type=radio]:checked\').removeAttr(\'checked\');}';
                    jQuery("#"+targetId).data("visible",'none');
                }
                else
                {
                    globalLogicalString += '{jQuery(\'#' + targetId + '\').hide(400);}else{jQuery(\'#' + targetId + '\').show(400);}';
                    jQuery("#"+targetId).data("visible",'block');
                }
                // alert(globalLogicalString);
                for (var l = 0; l < allsource.length; l++)
                {
                    var sourceLiId = jQuery(allsource[l]).find(".sourceSelect:first").find(":selected").data('targetid');
                    if (jQuery(allsource[l]).find(".sourceSelect:first").find(":selected").data('type') == "CheckBox")
                    {
                        var sourceId = jQuery(allsource[l]).find(".sourceSelect:first").find(":selected").data('sourceid');
						if (document.getElementById(sourceId).getAttribute('data-conditionLogic'))
                     	{
							var old_logic = document.getElementById(sourceId).getAttribute('data-conditionLogic');
							document.getElementById(sourceId).setAttribute('data-conditionLogic', old_logic+globalLogicalString);
                        } else
                        {
							document.getElementById(sourceId).setAttribute('data-conditionLogic', globalLogicalString);
                        }
                        //alert(document.getElementById(sourceId));
                        //document.getElementById(sourceId).setAttribute('data-conditionLogic', globalLogicalString);
                    } else
                    {
                        if (jQuery("#" + sourceLiId).data('conditionLogic'))
                        {
                            jQuery("#" + sourceLiId).data('conditionLogic', jQuery("#" + sourceLiId).data('conditionLogic') + " " + globalLogicalString);
                        } else
                        {
                            jQuery("#" + sourceLiId).data('conditionLogic', globalLogicalString);
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < element_div.length; i++)
    {
        var div_id = element_div[i].id;
        var li_container_id = div_id.substring(4, div_id.length);
        element_type = element_div[i].title;
	    var field = new Field("", "");
		if (element_type == 'Captcha')
			{
			var elements = element_div[i].getElementsByTagName("img");
			field.id = elements[0].id;
			field.type = "captcha";
			field.title = element_type;
			field.label = "Captcha";
			field.visible = jQuery("#" + li_container_id).data('visible');
			field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
			field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
			element_container_array.push(field);
			}
		/**			
        if (element_type == 'Captcha')
        {
            var elements = element_div[i].getElementsByTagName("input");
            field.id = elements[1].id;
            field.type = elements[1].type;
            field.title = element_type;
            field.label = elements[1].getAttribute('placeholder');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            element_container_array.push(field);
        }
		**/

        if (element_type == 'Date' || element_type == 'Name' || element_type == 'Email' || element_type == 'Number' || element_type == 'Password' || element_type == 'Input')
        {
            var elements    = element_div[i].getElementsByTagName("input");
            field.id        = elements[0].id;
            field.type      = elements[0].type;
            field.title     = element_type;
            field.label     = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            if (elements[0].required)
            {
               field.required  = "true";
            }
            else
            {
                field.required = "false";
            }
            if (element_type === 'Date')
            {
                field.date_formet = document.getElementById('element_date_hidden' + li_container_id).value;
                field.time_required = document.getElementById('element_date_hidden' + li_container_id).title;
            }
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            element_container_array.push(field);
        }

        if (element_type == "Payment")
        {
            var elements = element_div[i].getElementsByTagName("input");
            field.id = elements[0].id;
			  if(element_div[i].getAttribute('data-npay')=='new_payment'){
            field.npay=element_div[i].getAttribute('data-npay');
            }
            field.type = "payment";
            field.title = element_type;
            field.paypal_email = document.getElementById("div_" + li_container_id).getAttribute('data-email');
            field.pament_value = document.getElementById("div_" + li_container_id).getAttribute('data-value');
            field.currency = document.getElementById("div_" + li_container_id).getAttribute('data-currency');
            field.label = elements[0].getAttribute('placeholder');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.paypal_product = document.getElementById("div_" + li_container_id).getAttribute('data-product');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            element_container_array.push(field);
        }

        if (element_type == 'Message')
        {
            var elements = element_div[i].getElementsByTagName("textarea");
            field.id = elements[0].id;
            field.type = elements[0].type;
            field.title = element_type;
            if (elements[0].required)
            {
                field.required = "true";
            }
            else
            {
                field.required = "false";
            }
            field.label = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            element_container_array.push(field);
        }
        if (element_type == "Section Break")
        {
            var section_break = new Section_break();
            var elements = element_div[i].getElementsByTagName("hr");
            section_break.id = elements[0].id;
            section_break.type = "hr";
            section_break.title = "Section Break";
            section_break.label = document.getElementById("label_element" + li_container_id).innerHTML;
            section_break.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            element_container_array.push(section_break);
        }

        if (element_type == "TextArea") {

            var elements = element_div[i].getElementsByTagName("textarea");
            field.id = elements[0].id;
            field.type = elements[0].type;
            field.title = element_type;
            field.label = elements[0].getAttribute('placeholder');
            if (elements[0].required)
            {
                field.required = "true";
            }
            else
            {
                field.required = "false";
            }
            field.maxlength = elements[0].getAttribute('maxlength');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            element_container_array.push(field);
        }

        if (element_type == "Select")
        {
            var Select = element_div[i].getElementsByTagName("select");
            field.id = Select[0].id;
            field.type = "select";
            field.title = element_type;
            field.label = document.getElementById("label_element" + li_container_id).innerHTML;
            if (Select[0].required)
            {
                field.required = "true";
            }
            else
            {
                field.required = "false";
            }

            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            var Select_option_array = new Array();
            var option_for_Select = Select[0].getElementsByTagName("option");
            // alert(option_for_Select.length);
            for (var k = 0; k < option_for_Select.length; k++)
            {
                var choic_function_object = new Choice("","");
                choic_function_object.id = option_for_Select[k].id;
                choic_function_object.type = "option";
                choic_function_object.text = option_for_Select[k].innerHTML;
                choic_function_object.value = "false";
                Select_option_array.push(choic_function_object);
            }
            field.option = Select_option_array;
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            element_container_array.push(field);
            radio_checkbox_select_array.push(field);
        }

        if (element_type == "Checkboxes")
        {
            var checkbox_ul = element_div[i].getElementsByTagName("ul");
            field.id = checkbox_ul[0].id;
            field.type = "checkbox";
            field.title = element_type;
            field.label = document.getElementById("label_element" + li_container_id).innerHTML;
            if (document.getElementById("break_line" + li_container_id).title === 'true')
            {
                field.required = "true";
            }
            else
            {
                field.required = "false";
            }
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            var check_box_array = new Array();
            var li_for_checkbox_ul = checkbox_ul[0].getElementsByTagName("li");
            for (var k = 0; k < li_for_checkbox_ul.length; k++)
            {
                var choic_function_object = new Choice("", "");
                var checkbox_for_li = li_for_checkbox_ul[k].getElementsByTagName("input");
                var checkbox_label_for_li = li_for_checkbox_ul[k].getElementsByTagName("label");
                choic_function_object.id = checkbox_for_li[0].id;
                choic_function_object.type = checkbox_for_li[0].type;
                choic_function_object.text = checkbox_label_for_li[0].innerHTML;
                choic_function_object.value = checkbox_for_li[0].checked;
                choic_function_object.label_id = checkbox_label_for_li[0].id;
                if (checkbox_for_li[0].hasAttribute('data-conditionlogic'))
                {
                    if (checkbox_for_li[0].getAttribute('data-conditionlogic') != '')
                    {
                        choic_function_object.conditionLogic = checkbox_for_li[0].getAttribute('data-conditionlogic');
                    }
                }
                check_box_array.push(choic_function_object);
            }
            field.checkbox = check_box_array;
            element_container_array.push(field);
            radio_checkbox_select_array.push(field);
        }

        if (element_type == "Radio Button")
        {
            var radio_button_ul = element_div[i].getElementsByTagName("ul");
            field.id = radio_button_ul[0].id;
            field.type = "radio";
            field.title = element_type;
            field.label = document.getElementById("label_element" + li_container_id).innerHTML;
            if (document.getElementById("break_line" + li_container_id).title === 'true')
            {
                field.required = "true";
            }
            else
            {
                field.required = "false";
            }

            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            var radio_button_array = new Array();
            var li_radio_button_ul = radio_button_ul[0].getElementsByTagName("li");
            for (var k = 0; k < li_radio_button_ul.length; k++)
            {
                var choic_function_object = new Choice("", "");
                var radio_for_li = li_radio_button_ul[k].getElementsByTagName("input");
                var radio_label_for_li = li_radio_button_ul[k].getElementsByTagName("label");
                choic_function_object.id = radio_for_li[0].id;
                choic_function_object.type = radio_for_li[0].type;
                choic_function_object.text = radio_label_for_li[0].innerHTML;
                choic_function_object.value = radio_for_li[0].checked;
                choic_function_object.label_id = radio_label_for_li[0].id;
                radio_button_array.push(choic_function_object);
            }
            field.radio = radio_button_array;
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            element_container_array.push(field);
            radio_checkbox_select_array.push(field);
        }

        if (element_type == "FileUpload")
        {
            var elements = element_div[i].getElementsByTagName("input");
            field.id = elements[0].id;
            field.type = elements[0].type;
            field.title = element_type;
            field.label = document.getElementById("file_upload_button" + li_container_id).value;
            if (elements[0].required)
            {
                field.required = "true";
            }
            else
            {
                field.required = "false";
            }
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            element_container_array.push(field);
        }
		//Paragraph**
        if (element_type == "Paragraph") {

          var elements = element_div[i].getElementsByTagName("div");
            field.id = elements[1].id;
            field.type = elements[1].tagName;
            field.title = element_type;
            var para_head = element_div[i].getElementsByTagName("h3");
            var textdata={
                'heading_border':para_head[0].style.borderBottom,
                'heading_padding':para_head[0].style.paddingBottom,
                'heading_size':para_head[0].style.fontSize,
                'para_text_color':'rgb(0,0,0)',
                'heading':para_head[0].innerHTML,
                'para_text':elements[1].innerHTML
            };


            field.label = JSON.stringify(textdata);
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            /*logicedit end*/
            element_container_array.push(field);
        }


    }
    /**
     * FormGet function Button
     * function use to contains submitt button attribute
     */
    function Button()
    {
        this.id    = "save_button";
        this.type  = "submit";
        this.title = "Button";
    }
    var submit = new Button();
    element_container_array.push(submit);
    form.fields = element_container_array;
    var gforms_original_json = jQuery.toJSON(form);
    var json_varible = jQuery.toJSON(form);
	 if(json_varible == ''){
		alert("Unable to update your form.Please try again.");
		location.reload();
		}else{
    //alert(json_varible);
    if (radio_checkbox_select_array == '')
    {
        request_database_cat("cat", json_varible);
    }
    else
    {
        var form_cat = new cat_box();
        form_cat.field = radio_checkbox_select_array;
        var json_cat = jQuery.toJSON(form_cat);
        request_database_cat(json_cat, json_varible);
    }
	}//*/
}


/**
 * FormGet function request_database_query_edit
 * function use to send form-json across server 
 */
 
function request_database_query_edit(json) {
    var height = document.getElementById('element_container').scrollHeight;
    height = height + 230;
    jQuery.ajax({
        type: "POST",
        url: base_url + "edit_form/update_client_form/" + id,
        data: {json_data: json,
            page_height: height,
            fi: id},
        success: function(data) {
            if (data) {
                window.location.assign(data);
            }
            else {
                // alert('error');
            }
        }, complete: function()
        {
            jQuery("#save_form_button").css("background-image", "url('" + base_url + "images/green-submit.png')");
            fg_loader_hide();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // alert("req_error");
        }
    });
}

/**
 * FormGet function cat_insert
 *function use to determine category array in not null
 */
function request_database_cat(json, temp) {
    jQuery.ajax({
        url: base_url + "edit_form/update_cat_form/" + id,
        type: "POST",
        async: true,
        data: {json_cat: json},
        success: function(data) {
            if (data) {
                request_database_query_edit(temp);
            }
            else {
                // alert('error123');
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // alert("error_cat");
        }
    });

}

//anonymous function that made element sortable
jQuery(function() {
       jQuery("#conditionWrapper").draggable(); 
       jQuery("#element_container").sortable();
       jQuery("#element_container").disableSelection();
       jQuery("#logic_close").click(function() {
       jQuery("#Logic_container").css({display: "none"});
    });
});

            