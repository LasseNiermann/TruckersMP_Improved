let inject_init = () => { // eslint-disable-line no-unused-vars
  // var steam_id = $('input[name="steam_id"]').val();
  var steam_id = 0;
  var perpetrator_link = $('body > div.wrapper > div.container.content > div.row > div.row > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a')
  console.log('TMP Improved (inject/appeals)', perpetrator_link)

  var injects = {
    header: $('body > div.wrapper > div.breadcrumbs > div > h1'),
    spinner: $("#loading-spinner"),
    accept: $('#confirm-accept'),
    decline: $('#confirm-decline'),
    modify: $('#confirm-modify'),
    reason: $('input[name="reason"]'),
    summary: {
      perpetrator_link: $('.summary > table > tbody > tr:nth-child(1) > td:nth-child(2) > a'),
    }
  };

  const tbody = $("body > div.wrapper > div.container.content > div.row > div.row > div:nth-child(1) > table > tbody");


  const users = {
   banned: tbody.find("tr:nth-child(1) > td:nth-child(2) a"),
   admin: tbody.find("tr:nth-child(4) > td:nth-child(2) a")
  };

  let cannedVariables = {
   'ban.expires': tbody.find("tr:nth-child(5) > td:nth-child(2) > strong").text(),
   'ban.reason': tbody.find('.autolinkage').text(),
   'ban.user.username': users.banned.text(),
   'ban.user.id': (!users.banned.text() ? 0 : users.banned.attr('href').split('/')[4]),
   'ban.user.steam_id': tbody.find("tr:nth-child(2) > td:nth-child(2) > a").text().trim()
  };

  if (users.admin.length === 0) {
    cannedVariables['admin.username'] = $("span.label.label-default").text().trim();
    cannedVariables['admin.id'] = "";
  } else {
    cannedVariables['admin.username'] = users.admin.text();
    cannedVariables['admin.id'] = users.admin.attr('href').split('/')[4];
    fetchAdminGroupName();
  }

  function fetchAdminGroupName () {
    switch (users.admin.css('color').replaceAll(" ","")){
      case 'rgb(244,67,54)':
        cannedVariables["admin.group.name"] = 'Game Moderator';
        break;
      case 'rgb(255,82,82)':
        cannedVariables["admin.group.name"] = 'Report Moderator';
        break;
      case 'rgb(211,47,47)':
        cannedVariables["admin.group.name"] = 'Game Moderation Manager';
        break;
      case 'rgb(183,28,28)':
        cannedVariables["admin.group.name"] = 'Senior Game Moderation Manager';
        break;
      case 'rgb(0,184,212)':
        cannedVariables["admin.group.name"] = 'Translation Manager';
        break;
      case 'rgb(0,166,212)':
        cannedVariables["admin.group.name"] = 'Senior Translation Manager';
        break;
      case 'rgb(21,101,192)':
        cannedVariables["admin.group.name"] = 'Event Manager';
        break;
      case 'rgb(13,71,161)':
        cannedVariables["admin.group.name"] = 'Senior Event Manager';
        break;
      case 'rgb(255,143,0)':
        cannedVariables["admin.group.name"] = 'Media Manager';
        break;
      case 'rgb(0,131,143)':
        cannedVariables["admin.group.name"] = 'Community Moderation Manager';
        break;
      case 'rgb(0,96,100)':
        cannedVariables["admin.group.name"] = 'Senior Community Moderation Manager';
        break;
      case 'rgb(236,64,122)':
        cannedVariables["admin.group.name"] = 'Support Manager';
        break;
      case 'rgb(216,27,96)':
        cannedVariables["admin.group.name"] = 'Senior Support Manager';
        break;
      case 'rgb(230,74,25)':
        cannedVariables["admin.group.name"] = 'Community Manager';
        break;
      case 'rgb(191,54,12)':
        cannedVariables["admin.group.name"] = 'Senior Community Manager';
        break;
      case 'rgb(126,87,194)':
        cannedVariables["admin.group.name"] = 'Add-On Manager';
        break;
      case 'rgb(96,125,139)':
        cannedVariables["admin.group.name"] = 'Service and Data Analyst';
        break;
      case 'rgb(103,58,183)':
        cannedVariables["admin.group.name"] = 'Developer';
        break;
      default:     
        setTimeout(() => {
          $.ajax({
            url: users.admin.attr('href'),
            type: 'GET',
            success: function (data) {
              console.log('admin role unknown or ambiguous, profile fetched');
              var profile = $(data).find('div.profile-bio');
              cannedVariables["admin.group.name"] = profile.text().substr(profile.text().indexOf('Rank:')).split("\n")[0].replace("Rank: ","");
            }
          });
        }, 500);
        break;
    }
  }

  function construct_buttons(type) {
    var html = '';
    switch (type) {
      case "comments":
        if (OwnReasons.commentsAppeals.length > 0 && Object.keys(OwnReasons.commentsAppeals[0]).length !== 0) html += each_type_new('Comments', OwnReasons.commentsAppeals) + ' ';
        if (OwnReasons.appealsall.length > 0 && Object.keys(OwnReasons.appealsall[0]).length !== 0) html += each_type_new('cAppeals', OwnReasons.appealsall) + ' ';
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('cGlobal', OwnReasons.all) + ' ';
        html += '<button type="button" class="btn btn-link" id="comments_clear">Clear</button>';
        break;

      case "declines":
        if (OwnReasons.declinesAppeals.length > 0 && Object.keys(OwnReasons.declinesAppeals[0]).length !== 0) html += each_type_new('Declines', OwnReasons.declinesAppeals) + ' ';
        if (OwnReasons.appealsall.length > 0 && Object.keys(OwnReasons.appealsall[0]).length !== 0) html += each_type_new('dAppeals', OwnReasons.appealsall) + ' ';
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('dGlobal', OwnReasons.all) + ' ';
        html += '<button type="button" class="btn btn-link" id="decline_clear">Clear</button>';
        break;

      case "accepts":
        if (OwnReasons.acceptsAppeals.length > 0 && Object.keys(OwnReasons.acceptsAppeals[0]).length !== 0) html += each_type_new('Accepts', OwnReasons.acceptsAppeals) + ' ';
        if (OwnReasons.appealsall.length > 0 && Object.keys(OwnReasons.appealsall[0]).length !== 0) html += each_type_new('aAppeals', OwnReasons.appealsall) + ' ';
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('aGlobal', OwnReasons.all) + ' ';
        html += '<button type="button" class="btn btn-link" id="accept_clear">Clear</button>';
        break;

      case "reasons":
        html += each_type_new('Reasons', OwnReasons.reasons) + ' ';
        html += each_type_new('Prefixes', OwnReasons.prefixes) + ' ';
        html += each_type_new('Postfixes', OwnReasons.postfixes) + ' ';
        html += '<button type="button" class="btn btn-link" id="reason_clear">Clear</button>';
        break;

      case "modify":
        if (OwnReasons.modifyAppeals.length > 0 && Object.keys(OwnReasons.modifyAppeals[0]).length !== 0) html += each_type_new('Modify', OwnReasons.modifyAppeals) + ' ';
        if (OwnReasons.appealsall.length > 0 && Object.keys(OwnReasons.appealsall[0]).length !== 0) html += each_type_new('mAppeals', OwnReasons.appealsall) + ' ';
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('mGlobal', OwnReasons.all) + ' ';
        html += '<button type="button" class="btn btn-link" id="modify_clear">Clear</button>';
        break;
    }

    function each_type_new(type, buttons) {
      var place, color, change;
      if (type == 'Prefixes') {
        place = 'before';
        color = 'warning';
        change = 'reason';
      } else if (type == 'Reasons') {
        place = 'after';
        color = 'default';
        change = 'reason';
      } else if (type == 'Modify') {
        place = 'after';
        color = 'default';
        change = 'modify';
      } else if (type == 'Postfixes') {
        place = 'after-wo';
        color = 'danger';
        change = 'reason';
      } else if (type == 'Declines') {
        place = 'after';
        color = 'info';
        change = 'decline';
      } else if (type == 'Accepts') {
        place = 'after';
        color = 'u';
        change = 'accept';
      } else if (type == 'Comments') {
        place = 'after';
        color = 'u';
        change = 'comment';
      } else if (type == 'aAppeals') {
        place = 'after';
        color = 'dark';
        change = 'accept';
        type = 'Appeals';
      } else if (type == 'aGlobal') {
        place = 'after';
        color = 'dark';
        change = 'accept';
        type = 'Global';
      } else if (type == 'dAppeals') {
        place = 'after';
        color = 'dark';
        change = 'decline';
        type = 'Appeals';
      } else if (type == 'dGlobal') {
        place = 'after';
        color = 'dark';
        change = 'decline';
        type = 'Global';
      } else if (type == 'mAppeals') {
        place = 'after';
        color = 'dark';
        change = 'modify';
        type = 'Appeals';
      } else if (type == 'mGlobal') {
        place = 'after';
        color = 'dark';
        change = 'modify';
        type = 'Global';
      } else if (type == 'cAppeals') {
        place = 'after';
        color = 'dark';
        change = 'comment';
        type = 'Appeals';
      } else if (type == 'cGlobal') {
        place = 'after';
        color = 'dark';
        change = 'comment';
        type = 'Global';
      }
      var snippet = '<div class="btn-group dropdown mega-menu-fullwidth"><a class="btn btn-' + color + ' dropdown-toggle" data-toggle="dropdown" href="#">' + type + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="mega-menu-content disable-icons" style="padding: 4px 15px;"><div class="container" style="width: 800px !important;"><div class="row equal-height" style="display: flex;">';
      var md = 12 / ((buttons.join().match(/\|/g) || []).length + 1);
      $.each(buttons, function (key, val) {
        snippet += '<div class="col-md-' + md + ' equal-height-in" style="border-left: 1px solid #333; padding: 5px 0;"><ul class="list-unstyled equal-height-list">';
        if (Array.isArray(val)) {
          val.forEach(function (item) {
            snippet += '<li><a style="display: block; margin-bottom: 1px; position: relative; border-bottom: none; padding: 6px 12px; text-decoration: none" href="#" class="hovery plus' + change + '" data-place="' + place + '" data-text="' + encodeURI(item.trim()) + '">' + item.trim() + '</a></li>';
          });
        } else {
          $.each(val, function (title, item) {
            snippet += '<li><a style="display: block; margin-bottom: 1px; position: relative; border-bottom: none; padding: 6px 12px; text-decoration: none" href="#" class="hovery plus' + change + '" data-place="' + place + '" data-text="' + encodeURI(item.trim()) + '">' + title.trim() + '</a></li>';
          });
        }
        snippet += '</ul></div>';
      });
      snippet += '</div></div></div></li></ul></div>';
      return snippet;
    }

    return html;
  }

  function dropdown_enchancements() {
    $('ul.dropdown-menu').css('top', '95%');
    $(".dropdown").hover(function () {
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
  }

  function manipulateTextarea (reason_id, reason_val, funct) {
    window.postMessage({ type: 'content_script_type', funct: funct, reason_id: reason_id, reason_val: reason_val }, '*' /* targetOrigin: any */ );
  }

  function setReason(reason, reason_val) {
    reason_val = updateMessageWithCannedVariables(reason_val);
    manipulateTextarea($(reason).prop('id'), reason_val, 'addReason');
  }

  function table_impoving() {
    $('table').addClass('table-condensed table-hover');

    // if (steamapi !== null && steamapi !== 'none') {
    //   $.ajax({
    //     url: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + steamapi + "&format=json&steamids=" + steam_id,
    //     type: 'GET',
    //     success: function (val) {
    //       if (val === undefined) {
    //         $("#loading-error").show();
    //         injects.spinner.hide();
    //         return;
    //       }
    //       var player_data = val;
    //       var tmpname = summary.find('table > tbody > tr:nth-child(2) > td:nth-child(2)');
    //       var steam_name = escapeHTML(player_data.response.players[0].personaname);
    //       summary.find('table > tbody > tr:nth-child(2) > td:nth-child(1)').text('TruckersMP');
    //       tmpname.html('<kbd>' + tmpname.text() + '</kbd>');

    //       var steam_link = '<tr><td>Steam</td><td> <a href="https://steamcommunity.com/profiles/' + steam_id + '" target="_blank"><kbd>' + steam_name + '</kbd></a> <img src="' + player_data.response.players[0].avatar + '" class="img-rounded"></td></tr>';
    //       $(steam_link).insertAfter('.summary > table > tbody > tr:nth-child(2)');
    //     }
    //   });
    // }

    var perpetrator_id = cannedVariables["ban.user.id"];
    $.ajax({
      url: "https://api.truckersmp.com/v2/player/" + perpetrator_id,
      type: "GET",
      success: function (tmp_data) {
        if (tmp_data !== true) {
          perpetrator_link.next().after(' <img src="' + tmp_data.response['smallAvatar'] + '" class="img-rounded" style="width: 32px; height: 32px;">');
          perpetrator_link.wrap('<kbd>');

          var steam_link = '<tr><td>Steam</td><td> <kbd><a href="https://steamcommunity.com/profiles/' + steam_id + '" target="_blank" rel="noreferrer nofollow noopener">' + steam_id + '</a></kbd></td></tr>';
          if (typeof steam_data !== 'undefined') {
            var steam_link = '<tr><td>Steam</td><td> <kbd><a href="https://steamcommunity.com/profiles/' + steam_id + '" target="_blank" rel="noreferrer nofollow noopener">Steam Profile</a></kbd> <img src="' + steam_data.response['players'][0]['avatar'] + '" class="img-rounded"></td></tr>';
          }
          $(steam_link).insertAfter('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2)');

          $('[data-toggle="tooltip"]').tooltip();
        }
      }
    })

    $('input[type=radio][name=perma]').change(function () {
      permcheck()
    });
    $('input[name=reason]').attr('autocomplete', 'off');
    $('input[name=expire]').attr('autocomplete', 'off');
  }

  $('body').append("<div class='modal fade ets2mp-modal' id='videoModal' tabindex='-1' role='dialog''TMP Improved (inject/reports)',  aria-labelledby='videoModalLabel' aria-hidden='true'><div class='modal-dialog 'TMP Improved (inject/reports)', modal-lg' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='videoModalLabel'>Video preview</h4></div><div class='modal-body' style='padding:0;'></div></div></div></div>")

  function aftermath() {
    // $(document).prop('title', $('table.table > tbody > tr:nth-child(1) > td:nth-child(2) > a').text() + '\'s Ban Appeal - TruckersMP');

    $(".comment > p").each(function () {
      $('<hr style="margin: 10px 0 !important;">').insertAfter(this);
      $(this).wrap("<blockquote></blockquote>");
      if (!$(this).text().length) {
        $(this).html('<i>Empty comment</i>');
      }
    });

    if (settings.wide !== false) {
      $('div.container.content').css('width', '85%');
    }

    $(function () {
      $(".youtube").YouTubeModal({
        autoplay: 0,
        width: 640,
        height: 480
      });
      var videoBtns = $('.video')
      var videoModal = $('#videoModal')
      videoBtns.click(function (e) {
        e.preventDefault()
        videoModal.find('.modal-body').html("<div class='embed-responsive-16by9 embed-responsive'><iframe src='" + $(this).attr('href') + "' width='640' height='480' frameborder='0' scrolling='no' allowfullscreen='true' style='padding:0; box-sizing:border-box; border:0; -webkit-border-radius:5px; -moz-border-radius:5px; border-radius:5px; margin:0.5%; width: 99%; height: 98.5%;'></iframe></div>")
        videoModal.modal('show')
      })
      videoModal.on('hidden.bs.modal', function () {
        videoModal.find('.modal-body').html('')
      })
    });

    injects.spinner.hide();
  }

  function permcheck() {
    if ($("input[id='perma.true']").prop("checked")) {
      $('#ownreasons_buttons').slideUp('fast');
      $('#datetimeselect').slideUp('fast');
      $('label[for=\'perma.true\']').addClass('text-danger').addClass('lead').addClass('text-uppercase');
    } else {
      $('#ownreasons_buttons').slideDown('fast');
      $('#datetimeselect').slideDown('fast');
      $('label[for=\'perma.true\']').removeClass('text-danger').removeClass('lead').removeClass('text-uppercase');
    }
  }

  function init() {
    $('body > div.wrapper > div.container.content > div > table').addClass('table-condensed table-hover');
    $('body > div.wrapper > div.container.content > div > table > tbody > tr:nth-child(1) > td:nth-child(1)').removeAttr('style');
    $('body > div.wrapper > div.container.content > div > table > tbody > tr > td:nth-child(1)').each(function () {
      $(this).css('font-weight', 'bold');
    });
    
    // Add user's ID to the table
    var banned_id = cannedVariables["ban.user.id"];
    perpetrator_link.parent().append('<a style="margin-left: 1px;" id="copyname"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy username"></i></a> <span class="badge badge-u">ID ' + banned_id + '</span> <a style="margin-left: 1px;" id="copyid"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy TMP ID"></i></a>');

    // $.ajax({
    //   url: "https://api.truckersmp.com/v2/bans/" + steam_id,
    //   type: 'GET',
    //   success: function (val) {
    //     $('#bans-table').find('tbody:last-child').append("<tr style=\"font-weight: bold;\"><th>Banned</th><th>Expires</th><th>Reason</th><th>By</th><th>Active</th></tr>");
    //     $(val.response).each(function () {
    //       var row = '<tr>';

    //       this.timeAdded = moment(this.timeAdded, "YYYY-MM-DD HH:mm:dd");
    //       this.timeAdded = this.timeAdded.format("DD MMM YYYY HH:mm");
    //       row += "<td>" + this.timeAdded + "</td>";

    //       if (this.expiration === null) {
    //         this.expiration = "Never"
    //       } else {
    //         this.expiration = moment(this.expiration, "YYYY-MM-DD HH:mm:dd");
    //         this.expiration = this.expiration.format("DD MMM YYYY HH:mm");
    //       }
    //       row += "<td>" + this.expiration + "</td>";

    //       row += "<td class='autolink'>" + this.reason + "</td>";
    //       row += "<td><a href='/user/" + this.adminID + "' target='_blank'>" + this.adminName + "</a></td>";

    //       if (this.active == false) {
    //         this.active = 'times';
    //       } else if (this.active == true) {
    //         this.active = 'check';
    //       }
    //       row += "<td><i class='fas fa-" + this.active + "'></i></td>";

    //       row += '</tr>';
    //       $('#bans-table').find('tbody:last-child').append(row);
    //     });
    //     $('#loading').remove();
    content_links();
    table_impoving();
    aftermath();
    //   }
    // });

    function addButtons(textArea, html) {
      if (typeof textArea !== 'undefined' && html.length > 0) {
        //$(textArea).css('margin-bottom', '10px')
        $(html).insertAfter(textArea.next().hasClass('EasyMDEContainer') ? textArea.next() : textArea)
      }
    }

    function checkReasonLength() {
      if (injects.reason.val().length > reasonMax) {
        injects.reason.css({
          'background-color': 'rgba(255, 0, 0, 0.5)',
          'color': '#fff'
        });
        reasonCount.css({
          'color': 'red',
          'font-weight': 'bold'
        });
      } else {
        reasonCount.css({
          'color': '',
          'font-weight': ''
        });
        injects.reason.css({
          'background-color': '',
          'color': ''
        });
      }
      reasonCount.html(injects.reason.val().length + "/" + reasonMax);
    }

    var reasonMax = 255;
    $("<div id='reasonCount'>0/" + reasonMax + "</div>").insertAfter(injects.reason);
    var reasonCount = $('#reasonCount');
    injects.reason.keyup(function () {
      checkReasonLength();
    });
    var dateTimeSelect = $('#datetimeselect');

    addButtons(injects.accept.find('textarea[name=comment]'), construct_buttons("accepts"));
    addButtons($('input[name=reason]'), '<div class="ban-reasons">' + construct_buttons('reasons') + '</div>');
    addButtons(dateTimeSelect, construct_dates(OwnDates));
    addButtons(injects.modify.find('textarea[name=comment]'), construct_buttons("modify"));
    addButtons(injects.decline.find('textarea[name=comment]'), construct_buttons("declines"));
    addButtons($('div.container.content').find('textarea[name=comment]'), construct_buttons("comments"));

    $('.pluscomment').on('click', function (event) {
      event.preventDefault();
      setReason($('form').find('textarea[name=comment]'), decodeURI($(this).data("text")));
    });
    $('.plusaccept').on('click', function (event) {
      event.preventDefault();
      setReason(injects.accept.find('textarea[name=comment]'), decodeURI($(this).data("text")));
    });
    $('.plusmodify').on('click', function (event) {
      event.preventDefault();
      setReason(injects.modify.find('textarea[name=comment]'), decodeURI($(this).data("text")));
    });
    $('.plusdecline').on('click', function (event) {
      event.preventDefault();
      setReason(injects.decline.find('textarea[name=comment]'), decodeURI($(this).data("text")));
    });

    var unban_time = moment.utc();
    if (dateTimeSelect.val()) {
      if (dateTimeSelect.val().length) {
        unban_time = moment(dateTimeSelect.val())
      }
    }
    $('.plusdate').on("click", function (event) {
      event.preventDefault();
      var number = $(this).data('number');
      switch (number) {
        case 'clear':
          unban_time = moment.utc();
          break;
        default:
          var key = $(this).data('key');
          unban_time.add(number, key);
          break;
      }
      $("#datetimeselect").val(unban_time.format("YYYY-MM-DD HH:mm"));
    });

    $('button#comments_clear').on('click', function (event) {
      event.preventDefault();
      if (confirm('Are you sure you want to start over?')) manipulateTextarea($('form').find('textarea[name=comment]').prop('id'), '', 'clearReason'); //$('form').find('textarea[name=comment]').val("");
    });
    $('button#accept_clear').on('click', function (event) {
      event.preventDefault();
      if (confirm('Are you sure you want to start over?')) manipulateTextarea(injects.accept.find('textarea[name=comment]').prop('id'), '', 'clearReason'); //injects.accept.find('textarea[name=comment]').val("");
    });
    $('button#modify_clear').on('click', function (event) {
      event.preventDefault();
      if (confirm('Are you sure you want to start over?')) manipulateTextarea(injects.modify.find('textarea[name=comment]').prop('id'), '', 'clearReason'); //injects.modify.find('textarea[name=comment]').val("");
    });
    $('button#decline_clear').on('click', function (event) {
      event.preventDefault();
      if (confirm('Are you sure you want to start over?')) manipulateTextarea(injects.decline.find('textarea[name=comment]').prop('id'), '', 'clearReason'); //injects.decline.find('textarea[name=comment]').val("");
    });

    if ($('div.container.content > div.row').find('a.btn').length == 0) {
      var select = $('select[name=visibility]');
      $(select).find('option:selected').removeProp('selected');
      $(select).find('option[value=Private]').prop('selected', 'selected');
    }

    $('.plusreason').on('click', function (event) {
      event.preventDefault();

      var reason_val = injects.reason.val(),
        sp = '';
      if (!checkDoubleSlash(injects.reason[0]))
        sp = (settings.separator) ? settings.separator : ',';

      if ($(this).data('place') == 'before') {
        injects.reason.val(decodeURI(String($(this).data("text"))) + ' ' + reason_val.trim() + ' ');
      } else if ($(this).data('place') == 'after-wo') {
        injects.reason.val(reason_val.trim() + ' ' + decodeURI(String($(this).data("text"))) + ' ');
      } else if (reason_val.length) {
        injects.reason.val(reason_val.trim() + sp + ' ' + decodeURI(String($(this).data("text"))) + ' ');
      } else {
        injects.reason.val(decodeURI(String($(this).data("text"))) + ' ');
      }
      injects.reason.focus();
      checkReasonLength();
    });

    dropdown_enchancements();
    permcheck();
    injectScript(chrome.extension.getURL('src/editor.js'), 'body');

    tbody.find('tr:nth-child(2) > td:last-child > a').append('<a id="copysteamid"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy SteamID"></i></a>');
    users.admin.append(' <a id="copyadminid" style="color: inherit;"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy TMP ID"></i></a>')
    
    $('#copyname').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["ban.user.username"])
      $(this).children().first().removeClass("fa-copy").addClass("fa-check");
      setTimeout(() => {
        $(this).children().first().removeClass("fa-check").addClass("fa-copy");
      },2000);
    })
    $('#copyid').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["ban.user.id"])
      $(this).children().first().removeClass("fa-copy").addClass("fa-check");
      setTimeout(() => {
        $(this).children().first().removeClass("fa-check").addClass("fa-copy");
      },2000);
    })
    $('#copysteamid').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["ban.user.steam_id"])
      $(this).children().first().removeClass("fa-copy").addClass("fa-check");
      setTimeout(() => {
        $(this).children().first().removeClass("fa-check").addClass("fa-copy");
      },2000);
    })
    $('#copyadminid').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["admin.id"])
      $(this).children().first().removeClass("fa-copy").addClass("fa-check");
      setTimeout(() => {
        $(this).children().first().removeClass("fa-check").addClass("fa-copy");
      },2000);
    })
  }

  const updateMessageWithCannedVariables = original => {
    let new_msg = original;
    Object.keys(cannedVariables).forEach(k => {
      new_msg = new_msg.replace(`%${k}%`, cannedVariables[k]);
    });
    return new_msg;
  }

  init();
}