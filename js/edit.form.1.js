

//create_form_array();
function loading()
{
    //alert(base_url+'images/home_load.gif');	
}

jQuery(document).ready(function() {
    // Field sorting
     jQuery("#element_container").sortable({
           axis: "y",
           containment: ".fg-left"
           });
    jQuery("#element_container").disableSelection();
    jQuery("#field_setting_sub").hide();
    jQuery(".upgrade-wrapper_s_f :first").hide("blind", 700);

    // tipsy
    jQuery('.field_desc').tipsy({gravity: 's'});

});

function show_message() {
    jQuery(".upgrade-wrapper_s_f").find('h1 :first').html("Form Limit Exceeded.");
    jQuery('.updrade-info').html("Upgrade to FormGet Pro to create more than 3 forms in your account.  FormGet Pro account pricing starts from $9.95 per month.");
    jQuery(".upgrade-wrapper_s_f :first").show('blind', 700);
}
function  route_to_dashboard() {
    window.location.assign(base_url + 'your_form');
}
//jQuery(function() {
//    jQuery("#element_container").sortable();
//    jQuery("#element_container").disableSelection();
//});
//jQuery("#field_setting_sub").hide();
