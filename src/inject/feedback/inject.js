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
    $('table').addClass('table');

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
      if (confirm('Are you sure you want to start over?')) manipulateTextarea($('form').find('textarea[name=comment]').prop('id'), '', 'clearReason'); //$('form').find('textarea[name=comment]').val("");
    });
    
    // Adds content by clicking a reason comment
    $('.pluscomment').on('click', function (event) {
      event.preventDefault();
      setReason($('form').find('textarea').not($('.modal-body').find('textarea')), decodeURI(String($(this).data("text"))));
    });

    // User information
    $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(1)');
    var userLink = $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a');
    var userId = $(userLink).attr('href').replace('https://truckersmp.com/user/', '');
    // Adds information about the user

  $.ajax({
    url: userLink.attr('href'),
    type: "GET",
    success: function(data) {
      var userAvatar = $(data).find('div.col-md-3.md-margin-bottom-40').find('a').find('img').attr('src');    
      userLink.after(' <img src="'+userAvatar+'" class="img-rounded" style="width: 32px; height: 32px" /><span class="badge badge-u" style="margin-left: 4px;">ID ' + userId + '</span><a style="margin-left: 1px;" id="copyid"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy TMP ID"></i></a>');
      
      var userProfile = $(data).find('div.profile-bio');
      var userRegDate = userProfile.text().substr(userProfile.text().indexOf('Member since:')).split("\n")[0].replace("Member since: ","");  
      var userSteamId = userProfile.text().substr(userProfile.text().indexOf('Steam ID:')).split("\n")[0].replace("Steam ID: ","");  
      $("body > div.wrapper > div.container.content > div.row > div > div.col-md-6.col-xs-12 > table > tbody > tr:nth-child(1) > td:nth-child(2)").append('<p class="mt-3"><kbd id="registerdate">Registered: '+userRegDate+'</kbd></p>').append('<tr><td><p class="mt-2">Steam ID: <a href="https://steamcommunity.com/profiles/'+userSteamId+'" target="_blank" rel="noreferrer">'+userSteamId+'</a><a id="copysteamid"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy SteamID" style="margin-left: 1px;"></i></a></td></tr>');

      $('#copyid').on('click', function (event) {
        event.preventDefault()
        copyToClipboard(userId)
        $(this).children().first().removeClass("fa-copy").addClass("fa-check");
        setTimeout(() => {
          $(this).children().first().removeClass("fa-check").addClass("fa-copy");
        },2000);
      })
      $('#copysteamid').on('click', function (event) {
        event.preventDefault()
        copyToClipboard(userSteamId)
        $(this).children().first().removeClass("fa-copy").addClass("fa-check");
        setTimeout(() => {
          $(this).children().first().removeClass("fa-check").addClass("fa-copy");
        },2000);
      })
      $("#loading-spinner").hide();
    }
  });

  // Sets the title
  $(document).prop('title', userLink.text() + ' - Feedback | TruckersMP');

  injectScript(chrome.extension.getURL('src/editor.js'), 'body');
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
      //$(textArea).css('margin-bottom', '10px')
      $(html).insertAfter(textArea.next().hasClass('EasyMDEContainer') ? textArea.next() : textArea)
    }
  }

  // Buttons
  function construct_buttons(type) {
    var html = '';
    switch (type) {
      case "feedbackComments":
        if (OwnReasons.feedbackComments.length > 0 && Object.keys(OwnReasons.feedbackComments[0]).length !== 0) html += each_type_new('Feedback comments', OwnReasons.feedbackComments) + ' ';
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('Global', OwnReasons.all) + ' ';
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

        case 'Global':
          place = 'after';
          color = 'dark';
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
  function manipulateTextarea (reason_id, reason_val, funct) {
    window.postMessage({ type: 'content_script_type', funct: funct, reason_id: reason_id, reason_val: reason_val }, '*' /* targetOrigin: any */ );
  }

  function setReason(reason, reason_val) {
    reason_val = updateMessageWithCannedVariables(reason_val);
    manipulateTextarea($(reason).prop('id'), reason_val, 'addReason');
  }

  // ===== Replace status text with a badge =====
  if (settings.colouredstatus === true) {
    $(function () {
      $("body > div.wrapper > div.container.content > div.row > div > div.col-md-6.col-xs-12 > table > tbody > tr:nth-child(5) > td:nth-child(2)").prop('class', 'feedback_status');
      $("#feedback > div > table > tbody > tr:nth-child(n) > td:nth-child(2)").prop('class', 'feedback_status');

      $('.feedback_status').each(function() {
        var status = $(this).text().trim();
        
        if (status === "New") {
          $(this).html('<span class="label" style="background-color: #3498DB">'+status+'</span>');
        }
        else if (status === "Finished") {
          $(this).html('<span class="label" style="background-color: #00B800">'+status+'</span>');
        }
        else if (status === "Closed") {
          $(this).html('<span class="label" style="background-color: #3E1278">'+status+'</span>');
        }
        else if (status === "Under Investigation" || status === "Under_investigation") {
          $(this).html('<span class="label" style="background-color: #ff0000">'+status+'</span>');
        }
        else {
          $(this).html('<span class="label" style="background-color: #555555">'+status+'</span>');
        }
      });

      $("#report > div > table > tbody > tr:nth-child(n) > td:nth-child(3)").prop('class', 'report_status');

      $('.report_status').each(function() {
        var status = $(this).text().trim();
        
        if (status === "New") {
          $(this).html('<span class="label" style="background-color: #3498DB">'+status+'</span>');
        }
        else if (status === "Accepted") {
          $(this).html('<span class="label" style="background-color: #03B500">'+status+'</span>');
        }
        else if (status === "Declined") {
          $(this).html('<span class="label" style="background-color: #FF0000">'+status+'</span>');
        }
        else if (status === "Waiting for admin") {
          $(this).html('<span class="label" style="background-color: #E8A600">'+status+'</span>');
        }
        else if (status === "Waiting for player") {
          $(this).html('<span class="label" style="background-color: #3E1278">'+status+'</span>');
        }
        else {
          $(this).html('<span class="label" style="background-color: #555555">'+status+'</span>');
        }
      });
    });
  }
}
