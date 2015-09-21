function location_redirect(ele) {
    var loc = jQuery(ele).attr("data-loc");
    var uri = jQuery('#all-ext').attr("data-uri");
    if (uri == '') {
        jQuery("#choose-form-warn").html("<b>Please select your form from the list.</b>");
        jQuery("#choose-form-warn").dialog({
            resizable: false,
            modal: true,
            buttons: {
                ok: function() {
                    jQuery(this).dialog("close");
                }
            }
        });
    }
    else {
        jQuery(ele).attr("href", loc);
        // jQuery(ele).attr("target", "_blank");
    }
}

function checkHeight() {
    if ($("#sidebar").length > 0) {
        var winSize = (window.innerHeight - 200);
        var sidebarSize = document.getElementById("sidebar").clientHeight;
        if (winSize <= sidebarSize)
            stuckSidebar(false);
        else
            stuckSidebar(true);
    }
}
function stuckSidebar(argument) {
    if (argument)
        $("#sidebar").waypoint("sticky");
    else
        $("#sidebar").waypoint("unsticky");
}

function email_api(ele) {
    var url = base_url + "form_api/first_button_call";
    var id = jQuery('#all-ext').attr("data-uri");
    var title = jQuery(ele).attr("id");
    if (jQuery(ele).prop("checked")) {
        jQuery.post(url, {'status_api': "on", 'title': title, 'form_id': id}, function(data) {
        });
    }
    else {
        jQuery.post(url, {'status_api': "off", 'title': title, 'form_id': id}, function(data) {
		});
    }
}

window.onload = function() {
	// fake path change
    jQuery("#choose-form").on('change', function() {
        // var base_url = ;
//       if(jQuery(this).val()!='0'){
        var funct = jQuery('#loc_href').attr("data-func");
        var path = base_url + 'extension/' + funct + '/' + jQuery(this).val();
        jQuery(location).attr('href', path);
        jQuery(this).val().setAttribute("selected", "selected");
//       }
    });

    // for changing heading in extension tab
    var url = jQuery(location).attr("href");
    var value = url.substring(url.lastIndexOf('/') + 1);
    if (value != 'all-1') {
        var txt = jQuery('#' + value).attr('data-head');
        jQuery('.all').find('h2').text(txt);
    }


    var val = jQuery('#all-ext').attr("data-uri");
    if (val == '') {
        jQuery('.switch-input').prop("disabled", "true");
    }
    //sidbar sticky
    $(window).resize(function() {
        checkHeight();
    });
    checkHeight();
}
jQuery("#testsms").submit(function() {
    var smsNumber = jQuery("#testsms").serializeArray();
	jQuery.ajax({url: base_url + "sms_setting/sms_count", type: "POST", data: {sendNumber: smsNumber}, success: function(result) {
            alert(result);
            //    jQuery("#div1").html(result);
        }});
});

   