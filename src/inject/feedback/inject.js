let inject_init = () => { // eslint-disable-line no-unused-vars
  $(document).ready(function () {
    if (settings.enablefeedbackimprovement === false) {
      $("#loading-spinner").hide();
      return;
    }

    // Adds links to comments
    content_links();
    // Video modal
    $("body").append("<div class='modal fade ets2mp-modal' id='videoModal' tabindex='-1' role='dialog' aria-labelledby='videoModalLabel' aria-hidden='true'><div class='modal-dialog modal-lg' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='videoModalLabel'>Video preview</h4></div><div class='modal-body' style='padding:0;'></div></div></div></div>");
    // Adds buttons
    addButtons($('div.container.content').find('textarea[name=comment]'), construct_buttons('feedbackComments'));

    // Basic stuff
    if (settings.wide !== false) {
      $('div.container.content').css('width', '85%');
    }
    $(".youtube").YouTubeModal({
      autoplay: 0,
      width: 640,
      height: 480
    });
    var videoBtns = $(".video");
    var videoModal = $("#videoModal");
    videoBtns.click(function (e) {
      e.preventDefault();
      videoModal.find(".modal-body").html("<div class='embed-responsive-16by9 embed-responsive'><iframe src='" + $(this).attr('href') + "' width='640' height='480' frameborder='0' scrolling='no' allowfullscreen='true' style='padding:0; box-sizing:border-box; border:0; -webkit-border-radius:5px; -moz-border-radius:5px; border-radius:5px; margin:0.5%; width: 99%; height: 98.5%;'></iframe></div>");
      videoModal.modal('show');
    });
    videoModal.on("hidden.bs.modal", function () {
      videoModal.find(".modal-body").html("");
    });

    // Table improve
    $('table').addClass('table-condensed table-hover');

    // Comments improve
    $(".comment > p").each(function () {
      $('<hr style="margin: 10px 0 !important">').insertAfter(this);
      $(this).wrap("<blockquote></blockquote>");
      if (!$(this).text().length) {
        $(this).html('<i>Empty comment</i>');
      }
    });

    // Dropdown menu
    $('.form-group ul.dropdown-menu').css('top', '95%');
    $(".form-group .dropdown").hover(function () {
      $('.dropdown-menu', this).stop(true, true).fadeIn("fast");
      $(this).toggleClass('open');
      $('b', this).toggleClass("caret caret-up");
    }, function () {
      $('.dropdown-menu', this).stop(true, true).fadeOut("fast");
      $(this).toggleClass('open');
      $('b', this).toggleClass("caret caret-up");
    });
    $("a.hovery").hover(function (e) {
      $(this).css("background", e.type === "mouseenter" ? "#303030" : "transparent");
      $(this).css("color", e.type === "mouseenter" ? "#999!important" : "");
    });
    // Width of the dropdown menu. There was a person who wished it. Here it is :P
    $('.form-group .dropdown-menu .container').css("width", (parseInt($('form').find('textarea[name=comment]').width()) - 5) + 'px');

    // Clear content
    $('button#comments_clear').on('click', function (event) {
      event.preventDefault();
      $('form').find('textarea[name=comment]').val("");
    });
    // Adds content by clicking a reason comment
    $('.pluscomment').on('click', function (event) {
      event.preventDefault();
      setReason($('form').find('textarea').not($('.modal-body').find('textarea')), decodeURI(String($(this).data("text"))));
    });

    // User information
    $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(1)').css('text-align', 'right');
    var userLink = $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a');
    var userId = $(userLink).attr('href').replace('https://truckersmp.com/user/', '');
    // Adds information about the user

  //   let vtcstuff = '';
  //   let vtcnamelink = '';
  //   $.ajax({
  //     url: "https://api.truckersmp.com/v2/player/" + userId,
  //     type: "GET",
  //     success: function (tmpData) {
  //       if(tmpData.response.vtc.inVTC == true)
  //       {
  //         vtcnamelink = '<p>VTC: <a href="https://truckersmp.com/vtc/' + tmpData.response.vtc.id +'" target="_blank">' + tmpData.response.vtc.name + '</a></p>';
          
          
  //         let authorIsOwner = false;
  //         let generalRequirements = 'X';
  //         let verifiedMembers = 'X';
  //         let validatedMembers = 'X';
  //         $.ajax({
  //           url: "https://api.truckersmp.com/v2/vtc/" + tmpData.response.vtc.id,
  //           type: "GET",
  //           success: function (vtcData) {
  //             if(vtcData.response.owner_username == tmpData.response.name)
  //             {
  //               authorIsOwner = true;
  //             }
  //             if(vtcData.response.members_count > 49)
  //             {
  //               verifiedMembers = 'YES! ' + vtcData.response.members_count;
  //             }
  //             else if(vtcData.response.members_count > 9)
  //             {
  //               validatedMembers = 'YES! ' + vtcData.response.members_count;
  //             }
  //             if(vtcData.response.recruitment == 'Open' | )


  //             vtcstuff = vtcnamelink + '<p>Validation: ' + validatedMembers + '</p>' + '<p>Verification: ' + verifiedMembers + '</p>';
              

  //             userLink.after(' <img src="' + tmpData.response['smallAvatar'] + '" class="img-rounded" style="width: 32px; height: 32px" />' + vtcstuff);
  //           }
  //         });

          
  //       }
  //       else 
  //       {
  //         userLink.after(' <img src="' + tmpData.response['smallAvatar'] + '" class="img-rounded" style="width: 32px; height: 32px" />');
  //       }
  //       userLink.wrap('<kbd>');

  //       $("#loading-spinner").hide();
  //     },
  //   });
  //   // Sets the title
  //   $(document).prop('title', userLink.text() + ' - Feedback | TruckersMP');
  // });


  $.ajax({
    url: "https://api.truckersmp.com/v2/player/" + userId,
    type: "GET",
    success: function (tmpData) {
      if(tmpData.response.vtc.inVTC == true)
      {
        let vtcnamelink = '';
        let vtcowner = '';
        vtcnamelink = '<p>VTC: <a href="https://truckersmp.com/vtc/' + tmpData.response.vtc.id +'" target="_blank">' + tmpData.response.vtc.name + '</a></p>';
        
        
        let authorIsOwner;
        $.ajax({
          url: "https://api.truckersmp.com/v2/vtc/" + tmpData.response.vtc.id,
          type: "GET",
          success: function (vtcData) {
            if(vtcData.response.owner_username == tmpData.response.name)
            {
              authorIsOwner = true;
            }
            else
            {
              authorIsOwner = false;
              vtcowner = '<p><b>CAUTION! This person is not the owner!</b></p>';
            }
            

            userLink.after(' <img src="' + tmpData.response['smallAvatar'] + '" class="img-rounded" style="width: 32px; height: 32px" />' + vtcnamelink + vtcowner);
          }
        });

        
      }
      else 
      {
        userLink.after(' <img src="' + tmpData.response['smallAvatar'] + '" class="img-rounded" style="width: 32px; height: 32px" />');
      }
      //userLink.wrap('<kbd>');

      $("#loading-spinner").hide();
    },
  });
  // Sets the title
  $(document).prop('title', userLink.text() + ' - Feedback | TruckersMP');
});

  

  /*function copyToClipboard(text) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = "0";
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
  }*/

  function addButtons(textArea, html) {
    if (typeof textArea !== 'undefined' && html.length > 0) {
      $(textArea).css('margin-bottom', '10px');
      $(html).insertAfter(textArea);
    }
  }

  // Buttons
  function construct_buttons(type) {
    var html = '';
    switch (type) {
      case "feedbackComments":
        html += each_type_new('Feedback comments', OwnReasons.feedbackComments);
        html += '<button type="button" class="btn btn-link" id="comments_clear">Clear</button>';
        break;
    }

    return html;

    function each_type_new(type, buttons) {
      var place, color, change, action;
      switch (type) {
        case 'Feedback comments':
          place = 'after';
          color = 'u';
          change = 'comment';
          action = '';
          break;
      }

      var snippet = '<div class="btn-group dropdown mega-menu-fullwidth"><a class="btn btn-' + color + ' dropdown-toggle" data-toggle="dropdown" href="#">' + type + ' <span class="caret"></span></a><ul class="dropdown-menu feedback-comments-dropdown"><li><div class="mega-menu-content disable-icons" style="padding: 4px 15px;"><div class="container" style="width: 550px !important;"><div class="row equal-height" style="display: flex;">';
      var md = 12 / (Math.max(buttons.length, 1));
      $.each(buttons, function (key, val) {
        snippet += '<div class="col-md-' + md + ' equal-height-in" style="border-left: 1px solid #333; padding: 5px 0;"><ul class="list-unstyled equal-height-list">';
        if (Array.isArray(val)) {
          val.forEach(function (item) {
            snippet += '<li><a style="display: block; margin-bottom: 1px; position: relative; border-bottom: none; padding: 6px 12px; text-decoration: none" href="#" class="hovery plus' + change + '" data-place="' + place + '" data-action="' + action + '" data-text="' + encodeURI(item.trim()) + '">' + item.trim() + '</a></li>';
          });
        } else {
          $.each(val, function (title, item) {
            snippet += '<li><a style="display: block; margin-bottom: 1px; position: relative; border-bottom: none; padding: 6px 12px; text-decoration: none" href="#" class="hovery plus' + change + '" data-place="' + place + '" data-action="' + action + '" data-text="' + encodeURI(item.trim()) + '">' + title.trim() + '</a></li>';
          });
        }
        snippet += '</ul></div>';
      });
      snippet += '</div></div></div></li></ul></div>     ';
      return snippet;
    }
  }

  // Adding comment
  var lastinsertpos;

  function setReason(reason, reason_val) {
    if ($(reason).val() == "") {
      $(reason).val(reason_val);
    } else {
      var pos = $(reason).prop('selectionStart');
      $(reason)[0].setRangeText((lastinsertpos === pos ? "\n\n" : "") + reason_val, pos, pos, 'end');
      lastinsertpos = $(reason).prop('selectionStart');
    }
    $(reason).focus();
  }
}