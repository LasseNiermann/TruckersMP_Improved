let inject_init = () => { // eslint-disable-line no-unused-vars
  var is_add_ban = window.location.pathname.includes('/admin/ban/add/');

  var ban_time;
  var reason = $('input[name=reason]');
  if (is_add_ban) {
    ban_time = moment().utc();
  } else {
    $('<p class="help-block">Only change a Reason? Click <a href="#" id="changedReason" style="color: #72c02c; text-decoration: underline;"><b>--> here <--</b></a><br>Ban is by mistake? Click <a href="#" id="by_mistake" style="color: #72c02c; text-decoration: underline;"><b>--> here <--</b></a></p>').insertAfter('input[name=reason]');
    ban_time = $('#datetimeselect').val();
  }

  if (ban_time) {
    var now = moment(ban_time);

    $('#datetimeselect').val(now.format("YYYY-MM-DD HH:mm"));
    $(date_buttons).insertAfter('#datetimeselect');
    $('<button type="button" class="btn btn-link plusdate" data-plus="back" id="current_ban_time"><b>Current Ban time</b></button>').insertAfter($("#ownreasons_buttons").find("div:last-child > button:last-child"));

    $('.plusdate').on("click", function (event) {
      event.preventDefault();
      switch ($(this).data("plus")) {
        case 'back':
          now = moment(ban_time);
          break;
        case 'clear':
          now = moment().utc();
          break;
        default:
          var key = $(this).data('key');
          now.add($(this).data("number"), key);
          break;
      }
      $('#datetimeselect').val(now.format("YYYY-MM-DD HH:mm"));
    });

    $("#changedReason").click(function (event) {
      event.preventDefault();
      if (moment(ban_time).isBefore(moment().utc())) {
        $('input[id="perma.true"]').prop("checked", true);
        $('input[name=active]').prop('checked', false);
        perma_perform(this);
      } else {
        $('#datetimeselect').val(ban_time);
      }
      $('#ownreasons_buttons').remove();
    })
  } else {
    $('#datetimeselect').slideUp('fast');
    $('label[for=\'perma.true\']').addClass('text-uppercase');
  }

  $('input[type=radio][name=perma]').change(function () {
    perma_perform(this);
  });
  reason.attr('autocomplete', 'off');
  $('input[name=expire]').attr('autocomplete', 'off');

  $('#by_mistake').on('click', function (event) {
    event.preventDefault();
    reason.val('@BANBYMISTAKE');
    $('input[name=active]').prop('checked', false);
  });

  $(document).prop('title', 'Edit ' + $('body > div.wrapper > div.container.content-md > form > h2').text() + '\'s Ban - TruckersMP');

  $('[data-toggle="tooltip"]').tooltip();
  $("#loading-spinner").remove();

  function construct_buttons(OwnReasons) {
    var html = '';
    html += each_type_new('Reasons', OwnReasons.reasons);
    html += each_type_new('Prefixes', OwnReasons.prefixes);
    html += each_type_new('Postfixes', OwnReasons.postfixes);
    html += '<button type="button" class="btn btn-link" id="reason_clear">Clear</button>';
    return html;

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
      } else if (type == 'Postfixes') {
        place = 'after-wo';
        color = 'danger';
        change = 'reason';
      }
      var snippet = '<div class="btn-group dropdown mega-menu-fullwidth"><a class="btn btn-' + color + ' dropdown-toggle" data-toggle="dropdown" href="#">' + type + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="mega-menu-content disable-icons" style="padding: 4px 15px;"><div class="container" style="width: 800px !important;"><div class="row equal-height" style="display: flex;">';
      //var md = 12 / ((buttons.join().match(/\|/g) || []).length + 1); //?
      var md = 12 / (Math.max(buttons.length, 1))
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
      snippet += '</div></div></div></li></ul></div>     ';
      return snippet;
    }
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

  var reasonMax = 255;
  $("<div id='reasonCount'>" + reason.val().length + "/" + reasonMax + "</div>").insertAfter(reason);
  var reasonCount = $("#reasonCount");

  function reasonMaxLength() {
    if (reason.val().length > reasonMax) {
      reason.css({
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
      reason.css({
        'background-color': '',
        'color': ''
      });
    }
    reasonCount.html(reason.val().length + "/" + reasonMax);
  }
  reason.keyup(function () {
    reasonMaxLength();
  });

  function evidencePasteInit() {
    reason.bind('paste', function (e) {
      var self = this,
        data = e.originalEvent.clipboardData.getData('Text').trim(),
        dataLower = data.toLowerCase();
      if ((dataLower.indexOf('http://') == 0 || dataLower.indexOf('https://') == 0) && !checkDoubleSlash(this) && settings.autoinsertsep) {
        e.preventDefault();
        insertAtCaret($(self)[0], '- ' + data, true);
      }
    });
  }

  function perma_perform(el) {
    if (el.id == 'perma.true') {
      $('#ownreasons_buttons').slideUp('fast');
      $('#datetimeselect').slideUp('fast');
      $('label[for=\'perma.true\']').addClass('text-uppercase');
    } else if (el.id == 'perma.false') {
      $('#ownreasons_buttons').slideDown('fast');
      $('#datetimeselect').slideDown('fast');
      $('label[for=\'perma.true\']').removeClass('text-uppercase');
    }
  }

  var reason_buttons = construct_buttons(OwnReasons);
  $('<div class="ban-reasons">' + reason_buttons + '</div>').insertAfter('input[name=reason]');

  //check if input beginning is URL or non-alphanumeric
  function checkUrlOrDelimiter(str) {
    if (str.startsWith('http')) return true;
    var code = str.charCodeAt(0);
    if (!(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)) return true;// lower alpha (a-z)
    return false;
  }

  $('.plusreason').on('click', function (event) {
    event.preventDefault();

    var reason_val = reason.val();
    var sp = (settings.separator) ? settings.separator : ',';

    if ($(this).data('place') == 'before') { // prefixes
      reason.val(decodeURI(String($(this).data('text'))) + ' ' + reason_val.trimStart())
    } else if ($(this).data('place') == 'after-wo') { // suffixes
      reason.val(reason_val.trim() + ' ' + decodeURI(String($(this).data('text'))))
    } else if (reason_val.length) { // reasons non-empty
      var pos = reason.prop('selectionStart');
      
      if (!pos) { //cursor at start
        reason.val(reason_val.trimStart());
        reason[0].setRangeText(decodeURI(String($(this).data('text'))) + (checkUrlOrDelimiter(reason_val.trim()) ? '' : sp) + (reason_val[0] === ' ' ? '' : ' '), 0, 0, 'end');
      } else {
        //move cursor out of suffix
        if (reason_val.lastIndexOf(" // ") > reason_val.lastIndexOf(" || ")) {
          pos = Math.min(pos, reason_val.length - reason_val.split(" // ").pop().length - 4);
        } else if (reason_val.lastIndexOf(" // ") < reason_val.lastIndexOf(" || ")) {
          pos = Math.min(pos, reason_val.length - reason_val.split(" || ").pop().length - 4);
        }
        //move cursor behind current word
        var new_pos = reason_val.trimEnd().length;
        [',',' - http',' http',' /'].forEach(el => {
          if (reason_val.indexOf(el, pos-2) > -1) new_pos = Math.min(new_pos, reason_val.indexOf(el, pos-2));
        });
        pos = reason_val[new_pos] == ',' ? new_pos + 1 : new_pos;
        //Insert
        var before = reason_val.substring(0, pos).trimEnd();
        var len = before.length - 1
        switch (before[len]) {
          case ',':
            reason[0].setRangeText(before + ' ' + decodeURI(String($(this).data('text'))) + (checkUrlOrDelimiter(reason_val.substr(pos).trim()) ? '' : sp) + ' ', 0, pos + 1, 'end');
            break;
          case '/': case '+':
            if (before[len - 1] === " ") {
              reason[0].setRangeText(before + ' ' + decodeURI(String($(this).data('text'))) + (checkUrlOrDelimiter(reason_val.substr(pos).trim()) ? '' : sp) + ' ', 0, pos + 1, 'end');
              break;
            }
          default:
            if (before.split(" ").pop().startsWith('http')) reason[0].setRangeText(before + ' / ' + decodeURI(String($(this).data('text'))) + ' ', 0, pos + 1, 'end');
            else reason[0].setRangeText(before + sp + ' ' + decodeURI(String($(this).data('text'))) + ' ', 0, pos + 1, 'end');
            break;
        }
      }
    } else { // reasons empty
      reason.val(decodeURI(String($(this).data('text'))) + ' ')
    }
    reason.focus();
    reasonMaxLength();
  });
  $('button#reason_clear').on('click', function (event) {
    event.preventDefault();
    reason.val("");
  });
  try {
    /*var bans_template = `
      <label>Latest 5 bans</label>
      <h1 id="loading" class="text-center">Loading...</h1>
      <div class="table-responsive">
        <table class="table table-condensed table-hover" id="bans-table">
          <tbody>
          </tbody>
        </table>
      </div>
    `;*/

    $('body > div.wrapper > div.container.content > div > table').addClass('table-condensed table-hover');
    $('body > div.wrapper > div.container.content > div > table > tbody > tr:nth-child(1) > td:nth-child(1)').removeAttr('style');
    $('body > div.wrapper > div.container.content > div > table > tbody > tr > td:nth-child(1)').each(function () {
      $(this).css('font-weight', 'bold');
    });
    
    var steam_id = $('input[name="steam_id"]').val();

    $.ajax({
      url: "https://api.truckersmp.com/v2/bans/" + steam_id,
      type: 'GET',
      success: function (val) {
        $('#bans-table').find('tbody:last-child').append("<tr style=\"font-weight: bold;\"><th>Banned</th><th>Expires</th><th>Reason</th><th>By</th><th>Active</th></tr>");
        $(val.response).each(function () {
          var row = '<tr>';

          this.timeAdded = moment(this.timeAdded, "YYYY-MM-DD HH:mm:dd");
          this.timeAdded = this.timeAdded.format("DD MMM YYYY HH:mm");
          row += "<td>" + this.timeAdded + "</td>";

          if (this.expiration === null) {
            this.expiration = "Never"
          } else {
            this.expiration = moment(this.expiration, "YYYY-MM-DD HH:mm:dd");
            this.expiration = this.expiration.format("DD MMM YYYY HH:mm");
          }
          row += "<td>" + this.expiration + "</td>";

          row += "<td class='autolink'>" + this.reason + "</td>";
          row += "<td><a href='/user/" + this.adminID + "' target='_blank'>" + this.adminName + "</a></td>";

          if (this.active == false) {
            this.active = 'times';
          } else if (this.active == true) {
            this.active = 'check';
          }
          row += "<td><i class='fas fa-" + this.active + "'></i></td>";

          row += '</tr>';
          $('#bans-table').find('tbody:last-child').append(row);
        });
        $('#loading').remove();
      }
    });
  } catch (e) {
    console.error('TMP Improved (inject/ban-edit)', e);
  }
  reasonMaxLength();
  dropdown_enchancements();
  evidencePasteInit();
}