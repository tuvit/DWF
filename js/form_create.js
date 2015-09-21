/**
 * FormGet
 *
 * js file use create form-data json for create page
 * package		app_js
 * Version		 1.0
 */


/**
 * FormGet function Form 
 * base function use to contains form attribute and all element attribute for creating json
 */
function Form() {
    this.id = 0;
    this.title = "Contact Form";
    this.label = document.getElementById('form_setting_para_1').innerHTML;
    this.description = document.getElementById('form_setting_para_2').innerHTML;
    this.submit_text = document.getElementById('submit_label').value;
    this.redirect_url = document.getElementById('form_setting').getAttribute('data-redirect');
    /*logicedit start*/
    this.conditionLogic = "";
    /*logicedit end*/
    this.fields = new Array();
}

/**
 * FormGet function cat_box
 * base function use to contains only checkbox attribute  for creating json-cat
 */
function cat_box() {
    this.field = new Array();
}

//flage used to find use to form contains default title
var global_title_flage = 0;

/**
 * FormGet function Fields
 *function reserve further enhancement
 */
function Section_break() {
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
function Choice(text, value, price) {
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
function Field(id, type)  {
    //"id", "type", "elemet_type", "label_name", "required", "error_message"
    this.id = id;
    this.type = "";
    this.title = "";
    this.label = "";
    this.required = "";
    this.error_message = "";
    //NOTE: other properties will be added dynamically using associative array syntax
}


function get_form_json() {
	var created_form = document.getElementById("element_container");
    var element_div  = created_form.getElementsByTagName("div");
    var element_type;
    var element_container_array = new Array();
    /*logicedit start*/
    var form = new Form();
    /*logicedit end*/
    var radio_checkbox_select_array = new Array();
    if (element_div.length == 0)
    {
        alert('Your form is blank. Add at least one element in it.');
        return;
    }else{
        fg_loader_show();
    }
    /*logicedit start*/
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
                    jQuery("#" + targetId).data("visible", 'none');
                }
                else
                {
                    globalLogicalString += '{jQuery(\'#' + targetId + '\').hide(400);}else{jQuery(\'#' + targetId + '\').show(400);}';
                    jQuery("#" + targetId).data("visible", 'block');
                }

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
    /*logicedit end*/
    for (var i = 0; i < element_div.length; i++) {
        var div_id = element_div[i].id;
        var li_container_id = div_id.substring(4, div_id.length);
        element_type = element_div[i].title;
        var field = new Field("", "");

		//royb
		if (element_type == 'PersonConfirm')
        {
			var elements = element_div[i].getElementsByTagName("img");
            field.title = element_type;
            field.label = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            field.id = elements[0].id;
			if(field.maxlength == null)
			{
				saveProcces = 1;
				elements[0].src = "http://localhost/dynamicform/images/PersonRed.png";
			}
			
            /*logicedit start*/
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/
            if (elements[0].required)
            {
                field.required = "true";
            }
            else
            {
                field.required = "false";
            }

            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
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
		
		if (element_type == 'Form_Field')
        {
			var elements = element_div[i].getElementsByTagName("img");
            field.title = element_type;
            field.label = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            field.id = elements[0].id;
			if(field.maxlength == null)
			{
				saveProcces = 1;
				elements[0].src = "http://localhost/dynamicform/images/PersonRed.png";
			}
			
            /*logicedit start*/
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/

            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
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
		
		if (element_type == 'If_Question')
        {
			var elements = element_div[i].getElementsByTagName("img");
            field.title = element_type;
            field.label = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            field.id = elements[0].id;
			if(field.maxlength == null)
			{
				saveProcces = 1;
				elements[0].src = "http://localhost/dynamicform/images/PersonRed.png";
			}
			
            /*logicedit start*/
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/

            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
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
		
		if (element_type == 'Timer_Notification')
        {
			var elements = element_div[i].getElementsByTagName("input");
            field.title = element_type;
            field.label = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            field.id = elements[0].id;
			if(field.maxlength == null)
			{
				saveProcces = 1;
				elements[0].src = "http://localhost/dynamicform/images/PersonRed.png";
			}
			
            /*logicedit start*/
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/

            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
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
		
		if (element_type == 'Email_Notification')
        {
			var elements = element_div[i].getElementsByTagName("img");
            field.title = element_type;
            field.label = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            field.id = elements[0].id;
			if(field.maxlength == null)
			{
				saveProcces = 1;
				elements[0].src = "http://localhost/dynamicform/images/PersonRed.png";
			}
			
            /*logicedit start*/
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/

            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
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
		
        if (element_type == 'Date' || element_type == 'Name' || element_type == 'Email' || element_type == 'Number' || element_type == 'Password' || element_type == 'Input')
        {
            var elements = element_div[i].getElementsByTagName("input");
            field.title = element_type;
            field.label = elements[0].getAttribute('placeholder');
            field.maxlength = elements[0].getAttribute('maxlength');
            field.id = elements[0].id;
            field.type = elements[0].type;
            /*logicedit start*/
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/
            if (elements[0].required)
            {
                field.required = "true";
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

            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
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

        if (element_type == "Payment")
        {
            var elements = element_div[i].getElementsByTagName("input");
            field.id = elements[0].id;
			 //new payment start
             if(element_div[i].getAttribute('data-npay')=='new_payment'){
            field.npay=element_div[i].getAttribute('data-npay');
            }
            //new payment end
            field.type = "payment";
            field.title = element_type;
            field.paypal_email = document.getElementById("div_" + li_container_id).getAttribute('data-email');
            field.pament_value = document.getElementById("div_" + li_container_id).getAttribute('data-value');
            field.currency = document.getElementById("div_" + li_container_id).getAttribute('data-currency');
            field.label = elements[0].getAttribute('placeholder');
            field.error_message = document.getElementById("info" + li_container_id).getAttribute('original-title');
            field.paypal_product = document.getElementById("div_" + li_container_id).getAttribute('data-product');
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
            /*logicedit end*/
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
            /*logicedit start*/

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
            ;
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
            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/
            var Select_option_array = new Array();
            var option_for_Select = Select[0].getElementsByTagName("option");
            for (var k = 0; k < option_for_Select.length; k++)
            {
                var choic_function_object = new Choice("", "");
                choic_function_object.id = option_for_Select[k].id;
                choic_function_object.type = "option";
                choic_function_object.text = option_for_Select[k].innerHTML;
                choic_function_object.value = "false";
                Select_option_array.push(choic_function_object);
            }
            field.option = Select_option_array;
            /*logicedit start*/
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            }
            /*logicedit end*/
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
            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/

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
                /*logicedit start*/
                if (checkbox_for_li[0].hasAttribute('data-conditionlogic'))
                {
                    if (checkbox_for_li[0].getAttribute('data-conditionlogic') != '')
                    {
                        choic_function_object.conditionLogic = checkbox_for_li[0].getAttribute('data-conditionlogic');
                    }
                }
                /*logicedit end*/
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
            /*logicedit start*/
            field.visible = jQuery("#" + li_container_id).data('visible');
            field.dataTarget = document.getElementById(li_container_id).getAttribute('data-targetlogic');
            field.datasource = document.getElementById(li_container_id).getAttribute('data-Sourcelogic');
            /*logicedit end*/
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
            
            /*logicedit start*/
            if (jQuery("#" + li_container_id).data('conditionLogic'))
            {
                if (jQuery("#" + li_container_id).data('conditionLogic').trim() != '')
                {
                    field.conditionLogic = jQuery("#" + li_container_id).data('conditionLogic');
                }
            } 
            /*logicedit end*/
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
        this.id = "save_button";
        this.type = "submit";
        this.title = "Button";

    }
    var submit = new Button();
    element_container_array.push(submit);
    //condition check the default title of form
    /*if (form.label === 'Contact Form' && global_title_flage == 0)
     {
     alert('To Personalise Your Form, You Can Change Form Title.');
     jQuery("html, body").animate({scrollTop: 0}, "slow", function() {
     jQuery("#form_setting").css({
     background: "#fee9e6",
     border: "1px dashed #ffacac"
     });
     jQuery("#form_setting").effect("shake", 500);
     form_setting();
     global_title_flage = 1;
     });
     }*/
    
    form.fields = element_container_array;
	
	body_form_json = form;
	
    var json_variable = jQuery.toJSON(form);
	return {"json_variable": json_variable, "radio_checkbox_select_array": radio_checkbox_select_array};
}

/**
 * FormGet function create_form_array 
 * function use to collect all attribute of form and element and create json variable
 */
function create_form_array(create_method) {
    var json_obj = get_form_json();
	var json_variable = json_obj.json_variable
	if(json_variable == ''){
	    alert("Unable to save your form. Please try again.")
		location.reload();
	}
	else{
	//debug
	create_method();
	
    jQuery("#save_form_button").removeClass('save_form');
    jQuery("#save_form_button").addClass('loadding_button');
    fg_loader_hide();
    request_database_query(json_variable, json_obj.radio_checkbox_select_array);
    }
	return false;
}

/**
 * FormGet function request_database_query
 * function use to send form-json across server 
 */
function request_database_query(json,radio_checkbox_select_array) {
    var height = document.getElementById('element_container').scrollHeight;
        height = height + 230;
    var form_log = new cat_box();
    form_log.field = radio_checkbox_select_array;
    var json_varible_log = jQuery.toJSON(form_log);
    jQuery.ajax({
        type: "POST",
        url: base_url + "home/ajax_insert",
        data: {json_data: json,
            page_height: height,
            json_cat: json_varible_log
        },
        async: false,
        success: function(data) {
			window.onbeforeunload = null;
            if ($.trim(data) == 'login') {
                //alert("data inserted successfully...");      
                cat_insert(radio_checkbox_select_array);				
            }
            else if ($.trim(data) == 'logout') {
             		/* popup comment start here */
					
				/*
                jQuery.noConflict();
                jQuery().colorbox({
                    iframe: true,
                    href: base_url + "popup",
                    innerWidth: 752,
                    innerHeight: 290
                });
                jQuery("#save_form_button").removeClass('loadding_button');
                jQuery("#save_form_button").addClass('save_form');
				*/
					
			   /* popup comment end here */
			   
			   /*new code start*/
	       jQuery("#save_form_button").removeClass('loadding_button');
               jQuery("#save_form_button").addClass('save_form');
			   
			   window.location.assign(base_url+"login?p=popup");
            } else if (data == 'limit-over') {

                show_message();
            }
            else
            {
                // alert('error');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           // alert("error");
        }
    });
}

/**
 * FormGet function cat_insert
 *function use to determine category array in not null
 */
 
 
function cat_insert(radio_checkbox_select_array) {
    //condition check form containes at least one checkbox
    if (radio_checkbox_select_array == '')
    {
        request_database_query_1("cat");
    }
    else
    {
        var form_1 = new cat_box();
        form_1.field = radio_checkbox_select_array;
        var json_varible_1 = jQuery.toJSON(form_1);
        request_database_query_1(json_varible_1);

    }
}

/**
 * FormGet function request_database_query_1
 * function use to send category-json across server
 */
 
function request_database_query_1(json) {
    jQuery.ajax({
        url: base_url + "home/ajax_insert_cat",
        type: "POST",
        data: {json_cat: json},
        success: function(data) {
            if (data == 'limit-over') {
                show_message();
            }
            else {
                window.location.assign(data);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           // alert("error");
        }
    });
}

/** 
 * checking form heading changed or not 
 * */   
function heading_check(){
    var created_form = document.getElementById("element_container");
    var element_div  = created_form.getElementsByTagName("div");
    if (element_div.length === 0)
    {
        alert('Your form is blank. Add at least one element in it.');
        return;
    }
    else if (element_div.length > 0)
    {        
        var heading = document.getElementById('form_setting_para_1').innerHTML;
    if( heading === "Untitled Form"){ 
            jQuery(".home-popup-div").html("Give a suitable Title and Description to your <b style='font-size:16px'>Untitled Form.</b>");
            jQuery(".home-popup-div").dialog({
                resizable: true,
                modal: true
            });
            form_setting();      
			move_loader(); 			
            jQuery('.heading-pointer').css('display','block');
            return;
    }
        else{
            create_form_array();
        }
    }
}



 