jQuery(document).ready(function($) {

    /*-----------------------------------------------------------------------------
     |	Profile Picture dropdown function
     |------------------------------------------------------------------------------
     */
    $(function() {
        var config = {
            sensitivity: 3, // number = sensitivity threshold (must be 1 or higher)    
            interval: 50, // number = milliseconds for onMouseOver polling interval    
            over: doOpen, // function = onMouseOver callback (REQUIRED)    
            timeout: 200, // number = milliseconds delay before onMouseOut    
            out: doClose    // function = onMouseOut callback (REQUIRED)    
        };
        function doOpen() {
            jQuery("#fg-dropdown").stop().animate({height: "toggle", opacity: "toggle"}, 300);
        }
        function doClose() {
            jQuery("#fg-dropdown").stop().animate({height: "toggle", opacity: "toggle"}, 300);
        }
        $("#user-img").hoverIntent(config);
    });

    // header tab active
    var t = "" + window.location;
    var your_form = t.substr(t.lastIndexOf('/') + 1, t.length);
    var fg_extension = t.indexOf("fg_extension");
    var active_extension = t.indexOf("extension");
    var single_extension = t.indexOf("single_extension");

    if (your_form == "your_form") {
        document.getElementById('yourforms').setAttribute('class', "active");
    } else if (fg_extension > 1 || single_extension > 1) {
        document.getElementById('extension').setAttribute('class', "active");
    } else if (active_extension > 1) {
        document.getElementById('active_ext').setAttribute('class', "active");
    }

    $('body').on('click', function(event) {
        if (!($(event.target).hasClass('edit-btn')) && $('ul.edit-dropdown').hasClass('show-menu')) {
            $('ul.edit-dropdown').removeClass('show-menu');
        }
    });

    $(".edit-btn").on('click', this, function(event) {
        if ($(this).next('ul.edit-dropdown').hasClass('show-menu')) {
            $(this).next('ul.edit-dropdown').removeClass('show-menu');
            $('ul.edit-dropdown').removeClass('show-menu');
        } else {
            $('ul.edit-dropdown').removeClass('show-menu');
            $(this).next('ul.edit-dropdown').addClass('show-menu');
        }
        event.stopPropagation();
    });

    $('#reply-dropdown').click(function(event) {
        replyDropReset();
        $('#send-dropdown').css('display', 'block').animate({marginTop: "2px", opacity: 1}, 160);
        event.stopPropagation();
    });
    $('#auto-text-pop').click(function(event) {
        replyDropReset();
        $('#macro-pop').css('display', 'block').animate({marginTop: "2px", opacity: 1}, 160);
        event.stopPropagation();
    });

    $('body').on('click', function(event) {
        if (!($(event.target).is('#auto-text-pop') || $(event.target).is('#reply-dropdown')))
            replyDropReset();
    });

    function replyDropReset() {
        $('#send-dropdown').css({
            display: 'none',
            opacity: '0',
            marginTop: '15px'
        });
        $('#macro-pop').css({
            display: 'none',
            opacity: '0',
            marginTop: '15px'
        });
    }
		jQuery('input[type=file]').on('change', function() { 
var path = jQuery(this).val().replace('C:\\fakepath\\','');
jQuery(this).next().val(path); 
});
});

//Single Payment Url Change
function change_pay_link(ele_ref) {
    document.getElementById('purchase_now').setAttribute('href', ele_ref.value);
    // alert(ele_ref.value);
}
function fg_loader_hide() {
    jQuery("#form_builder_load").delay(600).effect('fade', {direction: 'left', mode: 'hide'}, 500);
}
function fg_loader_show() {
    jQuery("#form_builder_load").show();
}
