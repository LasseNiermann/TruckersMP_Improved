let inject_init = () => { // eslint-disable-line no-unused-vars
  var accept_modal = $('#confirm-accept')
  var decline_modal = $('#confirm-decline')
  var injects = {
    header: $('body > div.wrapper > div.breadcrumbs > div > h1'),
    date_buttons: accept_modal.find('div > div > form > div.modal-body > div:nth-child(5) > label:nth-child(4)'),
    report_language: $('div.container.content > div > div > div > table.table > tbody > tr:nth-child(9) > td:nth-child(2)'),
    claim_report: $('div.container.content > div > div > div > table.table > tbody > tr:nth-child(10) > td:nth-child(2) > a'),
    spinner: $('#loading-spinner'),
    accept: {
      comment: accept_modal.find('div > div > form > div.modal-body > div:nth-child(7) > textarea'),
      form: accept_modal.find('div > div > form'),
      time: $('#datetimeselect'),
      reason: accept_modal.find('div > div > form > div.modal-body > div:nth-child(6) > input')
    },
    bans: {
      table: $('#ban > div > table > tbody > tr'),
      header: $('#bans > div:nth-child(1) > h4 > a'),
      ban_toggler: $('#expired_bans_toggler').find('i')
    },
    decline: {
      comment: decline_modal.find('div > div > form > div.modal-body > div > textarea'),
      form: decline_modal.find('div > div > form')
    },
    summary: {
      first_column: $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr > td:nth-child(1)'),
      perpetrator_link: $('table > tbody > tr:nth-child(2) > td:nth-child(2) > kbd > a'),
      perpetrator_label: $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(1)'),
      previous_usernames: $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(4) > td:nth-child(2)'),
      reporter_link: $('table > tbody > tr:nth-child(1) > td:nth-child(2) > kbd > a'),
      reporter_label: $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(1)')
    }
  }

  var token;

  const tbody = $('html').find('tbody').first();

  const users = {
   reporter: tbody.find("tr:nth-child(1) > td:nth-child(2) a:first-child"),
   perpetrator: tbody.find("tr:nth-child(2) > td:nth-child(2) a:first-child"),
   admin: tbody.find("tr:nth-child(7) > td:nth-child(2) > a:first-child")
  };

  let cannedVariables = {
    'report.language': tbody.find("tr:nth-child(9) > td:nth-child(2)").text().trim(),
    'report.reason': tbody.find('tr:nth-child(8) > td:nth-child(2) > strong').text(),
    'user.username': users.reporter.text(),
    'user.id': 0,
    'perpetrator.username': users.perpetrator.text(),
    'perpetrator.id': 0,
    'perpetrator.steam_id': tbody.find("tr:nth-child(3) > td > a").text().trim(),
    'admin.username': users.admin.text(),
    'admin.id': 0,
    'admin.group.name': 'Staff Member'
  };

  try {
    cannedVariables["user.id"] = users.reporter.attr('href').split('/')[4]
  } catch (e) {
    console.log("Couldn't set canned variables for reporter ID: " + e.toString())
  }
  try {
    cannedVariables["perpetrator.id"] = users.perpetrator.attr('href').split('/')[4]
  } catch (e) {
    cannedVariables["perpetrator.id"] = tbody.find("tr:nth-child(2) > td:nth-child(2)").text().replace(/[^0-9]/g, "")
    if (!cannedVariables["perpetrator.id"]) console.log("Couldn't set canned variables for perpetrator ID: " + e.toString())
  }
  try {
    cannedVariables["admin.id"] = (!users.admin.text() ? 0 : users.admin.attr('href').split('/')[4])
  } catch (e) {
    console.log("Couldn't set canned variables for admin ID: " + e.toString())
  }

  var perpetratorProfile;

  function fetchPerpetratorProfile () {
    if ($(injects.summary.perpetrator_link).attr('href')) $.ajax({
      url: $(injects.summary.perpetrator_link).attr('href'),
      type: 'GET',
      success: function (data) {
        perpetratorProfile = data;
        if (settings.enablebanlength === true) checkBanLength();
        registered();
        banTableV2();
      }
    });
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

  function registered () {
    var profile = $(perpetratorProfile).find('div.profile-bio');
    var regDate = profile.text().substr(profile.text().indexOf('Member since:')).split("\n")[0].replace("Member since: ","");
    injects.summary.perpetrator_label.next().find('#registerdate').text('Registered: ' + regDate);
  }

  // Fixes word dates
  var day = 60 * 60 * 24 * 1000
  /*var fixDate = function (date) {
    if (date === '' || date === undefined) {
      return
    }
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    var d = new Date()
    date = date.replace('Today,', d.getDate() + ' ' + months[d.getMonth()])

    var yesterday = new Date(d)
    yesterday.setTime(d.getTime() - day)
    date = date.replace('Yesterday,', yesterday.getDay() + ' ' + months[d.getMonth()])

    var tomorrow = new Date(d)
    tomorrow.setTime(d.getTime() + day)
    date = date.replace('Tomorrow,', tomorrow.getDay() + ' ' + months[d.getMonth()])

    if (!date.match(/20[0-9]{2}/)) {
      date += ' ' + (new Date()).getFullYear()
    }

    return date
  };*/

  // Escape HTML due to HTML tags in Steam usernames
  function escapeHTML(s) { // eslint-disable-line no-unused-vars
    return s.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  function accept_modal_init() {
    var reasonMax = 255
    var reasonLength = (injects.accept.reason.val() ? injects.accept.reason.val().length : 0)
    $('<div id="reasonCount">' + reasonLength + "/" + reasonMax + '</div>').insertAfter(injects.accept.reason)
    var reasonCount = $('#reasonCount')

    addButtons($('input[name=reason]'), '<div class="ban-reasons">' + construct_buttons('reason') + '</div>')
    addButtons($('div.container.content').find('textarea[name=comment]'), construct_buttons('comments'))
    addButtons($('body').find('#commentAccept'), construct_buttons('accept'))

    $(injects.date_buttons).html(construct_dates(OwnDates))
    //$('input[id="perma.false"]').prop('checked', true)

    // ===== DateTime and Reason inputs checking =====
    injects.accept.form.on('submit', function (event) {
      var time_check = injects.accept.time.val()
      var perm_check = $('input[id="perma.true"]').prop('checked')
      var reason_check = injects.accept.reason.val()
      var error_style = {
        'border-color': '#a94442',
        '-webkit-box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)',
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)'
      }
      var normal_style = {
        'border-color': '',
        '-webkit-box-shadow': '',
        'box-shadow': ''
      }

      if (!time_check && !perm_check) {
        injects.accept.time.css(error_style)
        event.preventDefault()
      } else {
        injects.accept.time.css(normal_style)
      }
      if (!reason_check) {
        injects.accept.reason.css(error_style)
        event.preventDefault()
      } else {
        injects.accept.reason.css(normal_style)
      }
    })
    // ===== Reasons FTW =====
    $('.plusreason').on('click', function (event) {
      event.preventDefault()

      var reason_val = injects.accept.reason.val(),
        sp = ''
      if (!checkDoubleSlash(injects.accept.reason[0])) {
        sp = (settings.separator) ? settings.separator : ',';
      }

      if ($(this).data('place') == 'before') { // prefixes
        injects.accept.reason.val(decodeURI(String($(this).data('text'))) + ' ' + reason_val.trimStart())
      } else if ($(this).data('place') == 'after-wo') { // suffixes
        injects.accept.reason.val(reason_val.trim() + ' ' + decodeURI(String($(this).data('text'))))
      } else if (reason_val.length) { // reasons non-empty
        var pos = injects.accept.reason.prop('selectionStart');
        
        if (!pos) { //cursor at start
          injects.accept.reason.val(reason_val.trimStart());
          injects.accept.reason[0].setRangeText(decodeURI(String($(this).data('text'))) + (checkUrlOrDelimiter(reason_val.trim()) ? '' : sp) + (reason_val[0] === ' ' ? '' : ' '), 0, 0, 'end');
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
              injects.accept.reason[0].setRangeText(before + ' ' + decodeURI(String($(this).data('text'))) + (checkUrlOrDelimiter(reason_val.substr(pos).trim()) ? '' : sp) + ' ', 0, pos + 1, 'end');
              break;
            case '/': case '+':
              if (before[len - 1] === " ") {
                injects.accept.reason[0].setRangeText(before + ' ' + decodeURI(String($(this).data('text'))) + (checkUrlOrDelimiter(reason_val.substr(pos).trim()) ? '' : sp) + ' ', 0, pos + 1, 'end');
                break;
              }
            default:
              if (before.split(" ").pop().startsWith('http')) injects.accept.reason[0].setRangeText(before + ' / ' + decodeURI(String($(this).data('text'))) + ' ', 0, pos + 1, 'end');
              else injects.accept.reason[0].setRangeText(before + sp + ' ' + decodeURI(String($(this).data('text'))) + ' ', 0, pos + 1, 'end');
              break;
          }
        }
      } else { // reasons empty
        injects.accept.reason.val(decodeURI(String($(this).data('text'))) + ' ')
      }
      injects.accept.reason.focus()
      checkReasonLength()
    })
    $('button#reason_clear').on('click', function (event) {
      event.preventDefault()
      injects.accept.reason.val('')
    })

    // ===== Timing FTW! =====
    var unban_time = moment.utc()
    if ($('#datetimeselect').length && $('#datetimeselect').val().length) {
      unban_time = moment($('#datetimeselect').val())
    }
    console.log('TMP Improved (inject/reports)', unban_time)
    $('.plusdate').on('click', function (event) {
      event.preventDefault()
      var number = $(this).data('number')
      switch (number) {
        case 'clear':
          unban_time = moment.utc()
          break;
        default:
          var key = $(this).data('key')
          unban_time.add(number, key)
          break;
      }
      injects.accept.time.val(unban_time.format('YYYY-MM-DD HH:mm'))
    })

    //Ban reason length check
    function checkReasonLength() {
      if (injects.accept.reason.val().length > reasonMax) {
        injects.accept.reason.css({
          'background-color': 'rgba(255, 0, 0, 0.5)',
          'color': '#fff'
        })
        reasonCount.css({
          'color': 'red',
          'font-weight': 'bold'
        })
      } else {
        reasonCount.css({
          'color': '',
          'font-weight': ''
        })
        injects.accept.reason.css({
          'background-color': '',
          'color': ''
        })
      }
      reasonCount.html(injects.accept.reason.val().length + '/' + reasonMax)
    }

    //check if input beginning is URL or non-alphanumeric
    function checkUrlOrDelimiter(str) {
      if (str.startsWith('http')) return true;
      var code = str.charCodeAt(0);
      if (!(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)) return true;// lower alpha (a-z)
      return false;
    }

    injects.accept.reason.keyup(function () {
      checkReasonLength()
    })
  }

  function decline_modal_init() {
    addButtons(injects.decline.comment, construct_buttons('decline'))

    injects.decline.form.on('submit', function (event) {
      var comment_check = injects.decline.comment.val()
      var error_style = {
        'border-color': '#a94442',
        '-webkit-box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)',
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)'
      }
      var normal_style = {
        'border-color': '',
        '-webkit-box-shadow': '',
        'box-shadow': ''
      }
      if (!comment_check) {
        injects.decline.comment.css(error_style)
        event.preventDefault()
      } else {
        injects.decline.comment.css(normal_style)
      }
    })
    $('.plusdecline').on('click', function (event) {
      event.preventDefault()
      setReason(injects.decline.comment, decodeURI(String($(this).data('text'))))

      switch ($(this).data('action')) {
        case 'negative':
          $("input[id='decline.rating.negative']").prop('checked', true)
          break;

        case 'positive':
          $("input[id='decline.rating.positive']").prop('checked', true)
          break;
      }
      injects.decline.comment.focus()
    })

    $('button#decline_clear').on('click', function (event) {
      event.preventDefault()
      if (confirm('Are you sure you want to start over?')) manipulateTextarea(injects.decline.comment.prop('id'), '', 'clearReason');
    })
  }

  function manipulateTextarea (reason_id, reason_val, funct) {
    window.postMessage({ type: 'content_script_type', funct: funct, reason_id: reason_id, reason_val: reason_val }, '*' /* targetOrigin: any */ );
  }

  function setReason(reason, reason_val) {
    reason_val = updateMessageWithCannedVariables(reason_val);
    manipulateTextarea($(reason).prop('id'), reason_val, 'addReason');
  }

  const updateMessageWithCannedVariables = original => {
    let new_msg = original;
    Object.keys(cannedVariables).forEach(k => {
      new_msg = new_msg.replace(`%${k}%`, cannedVariables[k]);
    });
    return new_msg;
  }

  $('body').append("<div class='modal fade ets2mp-modal' id='videoModal' tabindex='-1' role='dialog''TMP Improved (inject/reports)',  aria-labelledby='videoModalLabel' aria-hidden='true'><div class='modal-dialog 'TMP Improved (inject/reports)', modal-lg' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='videoModalLabel'>Video preview</h4></div><div class='modal-body' style='padding:0;'></div></div></div></div>")

  /*function copyToClipboard(text) {
    const input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.opacity = '0'
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
  }*/

  function comment_language() {
    var report_language = injects.report_language.text().trim()
    var comment

    if (!settings.own_comment) {
      switch (report_language) {
        case 'German':
          //comment = 'Wir bedanken uns für deinen Report :) Es ist zu bedenken, dass die zur Verfügung gestellten Beweise sowohl für die gesamte Dauer des Banns als auch einen Monat darüber hinaus verfügbar sein müssen.'
          comment = updateMessageWithCannedVariables("Hallo %user.username%,\n\nvielen Dank, dass Du Dir die Zeit genommen hast, eine Meldung einzureichen. Ich habe mir die Beweise angesehen und Maßnahmen gegen den Benutzer ergriffen. Bitte stelle sicher, dass Dein Beweismaterial für die gesamte Dauer des Banns und anschließend einen weiteren Monat verfügbar bleibt.\n\n---\n\n**§1.4 — Benutzer melden**  \n> Der beigefügte Beweis muss für die gesamte Dauer des vergebenen Banns, zuzüglich eines Monats, verfügbar sein. Beweise für permanente Banns müssen für immer verfügbar sein.\n\nDas vollständige Regelwerk findest Du hier: [DE](https://forum.truckersmp.com/index.php?/topic/85319-truckersmp-rules-german-truckersmp-regeln-deutsch-09112019/) / [EN](https://truckersmp.com/rules/)\n\n---\n\nMit freundlichen Grüßen,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        case 'Turkish':
          //comment = 'Raporunuz için teşekkürler :) Lütfen sunduğunuz kanıtın, yasağın uygulandığı ve takiben gelen bir(1) aylık süreç boyunca kullanılabilir olması gerektiğini lütfen unutmayın.'
          comment = updateMessageWithCannedVariables("Merhaba %user.username%,\n\nBizlere bir rapor gönderdiğin için teşekkür ederiz. Kanıtı inceledik ve kullanıcıya gereken işlemi uyguladık. Lütfen kanıtınızın yasağın süresinin bitiminden bir ay sonrasına kadar erişilebilir kalacağından emin olun. Lütfen kanıtınızın yasağın süresinin bitiminden bir ay sonrasına kadar erişilebilir kalacağından emin olun.\n\n---\n\n**§1.4 Oyuncu Raporu Oluşturmak**  \n> Raporunuzda kullanmış olduğunuz kanıt, raporun kabul edilip oyuncunun cezalandırıldığı tarihten itibaren 1 ay(30 gün) daha geçerliliğini korumalıdır. Kalıcı yasaklar için kanıtlar sonsuza kadar geçerli olmalıdır.\n\nKurallarımızın tamamına buradan: [TR](https://forum.truckersmp.com/index.php?/topic/77649-truckersmp-rules-turkish-truckersmp-kurallar%C4%B1-05082020/) / [EN](https://truckersmp.com/rules/) ulaşabilirsiniz.\n\n---\n\nSaygılarımla,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        /*case 'Norwegian':
          comment = 'Takk for rapporten :) Vennligst husk at bevis må være tilgjengelig for hele bannlysningspreioden pluss 1 måned'
          break;*/
        case 'Spanish':
          //comment = 'Muchas gracias por tu reporte :) Recuerda que las pruebas/evidencias deben estar disponibles durante toda la vigencia de la prohibicion y más 1 mes.'
          comment = updateMessageWithCannedVariables("Hola %user.username%,\n\nGracias por tomarse el tiempo de presentar un informe. Revisé las pruebas y tomé medidas contra el usuario. Asegúrese de que la evidencia que envió permanezca disponible durante toda la duración de la prohibición emitida, más un mes adicional.\n\n---\n\n**§1.4 — Reportando usuarios**  \n> La evidencia que nos proporcione debe estar disponible por la duración de la prohibición aplicada, más un mes. La evidencia de prohibiciones permanentes debe estar disponible para siempre.\n\nPuede encontrar el conjunto completo de nuestras reglas [aquí](https://truckersmp.com/rules/) y [aquí](https://forum.truckersmp.com/index.php?/topic/82688-truckersmp-rules-spanish-reglas-de-truckersmp-español-05082020/) en español.\n\n---\n\nSaludos cordiales,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        case 'Dutch':
          //comment = 'Bedankt voor je rapport :) Onthoud alsjeblieft dat het bewijs beschikbaar moet zijn voor de volledige lengte van de ban PLUS 1 maand.'
          comment = updateMessageWithCannedVariables("Hallo %user.username%,\n\nDank dat u de tijd hebt genomen om een speler te rapporteren. Ik heb het bewijs beoordeeld en besloten om actie te ondernemen. Zorg er alstublieft voor dat het bewijs beschikbaar blijft gedurende de tijd dat de ban actief is, plus één extra maand.\n\n---\n\n**§1.4 - Gebruikers rapporteren**  \n> Het bewijsmateriaal dat je aanlevert moet beschikbaar blijven gedurende de tijd dat de ban actief is, plus één maand. Bewijs dat resulteert in een permanente ban moet voor altijd beschikbaar blijven.\n\nJe kunt de volledige lijst aan regels [hier](https://truckersmp.com/rules) vinden. De Nederlandse vertaling van de regels kun je [hier](https://forum.truckersmp.com/index.php?/topic/88132-truckersmp-rules-dutch-truckersmp-regels-08022020/) vinden.\n\n---\n\nMet vriendelijke groet,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        case 'Polish':
          //comment = 'Dziękuję za report :) Proszę pamiętać o tym że dowód musi być dostępny przez cały okres bana, plus jeden miesiąc. '
          comment = updateMessageWithCannedVariables("Witaj %user.username%,\n\nDziękujemy za poświęcony czas na stworzenie tego zgłoszenia. Po sprawdzeniu dowodów, podjęto czynności przeciwko użytkownikowi. Upewnij się, że zamieszczone dowody pozostaną dostępne przez całą długość nałożonego bana, plus jeden miesiąc.\n\n---\n\n**§1.4 — Reportowanie użytkowników**  \n> Dowody, które nam dostarczasz, muszą być dostępne przez cały okres obowiązywania zakazu plus jeden miesiąc. Dowody na trwałe zakazy muszą być dostępne na zawsze.\n\nWszystkie zasady możesz znaleźć tutaj: [PL](https://forum.truckersmp.com/index.php?/topic/63659-truckersmp-rules-polish-regulamin-truckersmp-05082020/) / [EN](https://truckersmp.com/rules/)\n\n---\n\nZ poważaniem,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        case 'Russian':
          //comment = 'Спасибо за репорт :) Помните, что доказательства должны быть доступны весь период бана ПЛЮС 1 месяц.'
          comment = updateMessageWithCannedVariables("Здравствуйте %user.username%,\n\nСпасибо, что нашли время, чтобы отправить репорт. Я изучил ваши доказательства и принял меры в отношении данного пользователя. Убедитесь, что предоставленные вами доказательства останутся доступными в течение всего срока действия бана, плюс дополнительный месяц.\n\n---\n\n**§1.4 — Репорты**  \n> Доказательства, которые вы предоставляете в репортах, должны быть доступны в течение всего назначенного срока бана плюс один месяц. Доказательства для перманентного бана должны оставаться доступными всегда.\n\nПолные правила вы можете найти по ссылке здесь: [EN](https://truckersmp.com/rules/) / [RU](https://forum.truckersmp.com/index.php?/topic/77442-truckersmp-rules-russian-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-truckersmp-05-08-2020/)\n\n---\n\nС Уважением,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        case 'French':
          //comment = 'Merci pour votre rapport :) Notez que la preuve doit être disponible durant toute la durée du ban PLUS 1 mois.'
          comment = updateMessageWithCannedVariables("Bonjour %user.username%,\n\nMerci d'avoir pris le temps d'envoyer un signalement. J'ai examiné la preuve et pris les mesures nécessaires contre l'utilisateur. Veuillez vous assurer que la preuve que vous avez envoyée reste disponible pendant la durée du bannissement qui a été donné, plus un mois.\n\n---\n\n§1.4 — Signaler des utilisateurs  \n> La preuve que vous nous fournissez doit être disponible pendant la durée du bannissement, plus un mois. Les preuves pour les bannissements permanents doivent être disponibles pour toujours.\n\nVous pouvez trouver l'ensemble de nos règles ici: [FR](https://forum.truckersmp.com/index.php?/topic/78669-truckersmp-rules-french-r%C3%A8glement-de-truckersmp-05-08-2020/) / [EN](https://truckersmp.com/rules/)\n\n---\n\nCordialement,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        case 'Portuguese':
          //comment = 'Obrigado por seu relatório :) Por favor, lembre-se que as provas devem estar disponíveis para a duração total da proibição MAIS 1 mês.'
          comment = updateMessageWithCannedVariables("Olá %user.username%,\n\nObrigado por ter tido tempo para preencher um reporte. Analisei as evidências e tomei medidas contra o utilizador. Por favor, certifique-se de que as evidências que apresentou permanecem disponíveis durante toda a duração do banimento aplicado, mais um mês adicional.\n\n---\n\n**§1.4 - Reportar utilizadores**  \n> As evidências que nos forneceu têm de estar disponíveis durante a duração do banimento aplicado, mais um mês. As evidências para os banimentos permanentes devem estar disponíveis para sempre.\n\nPode encontrar o conjunto completo das nossas regras aqui: [PT](https://forum.truckersmp.com/index.php?/topic/84060-truckersmp-rules-portuguese-regras-truckersmp-05082020/) / [EN](https://truckersmp.com/rules/)\n\n---\n\nCom os melhores cumprimentos,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        /*case 'Romanian':
          comment = 'Thank you for your report :) Please, remember that evidence must be available for the full duration of the ban PLUS 1 month.'
          break;*/
        case 'Czech':
          //comment = 'Thank you for your report :) Please, remember that evidence must be available for the full duration of the ban PLUS 1 month.'
          comment = updateMessageWithCannedVariables("Zdravím Vás %user.username%,\n\nděkuji Vám za Váš čas, který jste strávil/a nad vyplňováním tohoto nahlášení. Zkrontroloval jsem Vámi zaslané důkazy a proti nahlášenému uživateli podnikl patřičné kroky. Prosím, zajistěte, aby Vámi zaslané důkazy byly k dispozici po celou dobu uděleného banu plus jeden měsíc poté.\n\n---\n\n**§1.4 — Nahlašování uživatelů**  \n> Poskytnuté důkazy musí být k dispozici po celou dobu trvání zákazu plus 1 měsíc. Důkazy pro trvalé bany musí být dostupné navždy.\n\n Celé znění našich pravidel můžete najít zde: [CZ](https://forum.truckersmp.com/index.php?/topic/83749-truckersmp-rules-czech-truckersmp-pravidla-5-8-2020/) / [EN](https://truckersmp.com/rules/)\n\n---\n\nS pozdravem,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        /*case 'Italian':
          comment = 'Thank you for your report :) Please, remember that evidence must be available for the full duration of the ban PLUS 1 month.'
          break;*/
        case 'Chinese':
          //comment = 'Thank you for your report :) Please, remember that evidence must be available for the full duration of the ban PLUS 1 month.'
          comment = updateMessageWithCannedVariables("你好 %user.username%,\n\n谢谢你腾出宝贵的时间提交举报. 在查看了你的证据后我对该玩家采取了措施. 请确保在封禁期间以及封禁解封后的一个月内证据依然有效.\n\n---\n\n**§1.4 — 举报玩家**  \n> 你提供的证据必须保存至封禁自动失效后的一个月为止. 对于永久封禁的证据必须永远存在.\n\n你可以在此处找到完整版的规则: [中文版](https://forum.truckersmp.com/index.php?/topic/77489-truckersmp-rules-chinese-truckersmp%E6%B8%B8%E6%88%8F%E8%A7%84%E5%AE%9A-05082020/) / [英文版](https://truckersmp.com/rules/)\n\n---\n\n真挚的祝福,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        /*case 'Finnish':
          comment = 'Thank you for your report :) Please, remember that evidence must be available for the full duration of the ban PLUS 1 month.'
          break;*/
        case 'Latvian':
          //comment = 'Thank you for your report :) Please, remember that evidence must be available for the full duration of the ban PLUS 1 month.'
          comment = updateMessageWithCannedVariables("Sveicināti %user.username%,\n\nPaldies ka veltijāt laiku, lai aizpildītu anketu. Esmu pārskatījis pierādījumus un veicis noteiktās darbības pret spēlētāju. Lūdzu pārliecinieties ka pierādījumi ir pieejami visu lieguma ilgumu, papildus viens mēnesis.\n\n---\n\n**§1.4 —Lietotāju nosūdzēšana**  \n> Pierādījumus, kurus sniedzat, jābūt derīgiem visu lieguma ilgumu, papildus vienu mēnesi. Pierādījumi mūžīgiem liegumiem jābūt pieejamiem visu mūžu.\n\nJūs varat atrast pilno noteikumu sarakstu [šeit](https://truckersmp.com/rules/)\n\n---\n\nAr cieņu,  \n%admin.username%  \nTruckersMP %admin.group.name%")
          break;
        default:
          //comment = 'Thank you for your report :) Please, remember that evidence must be available for the full duration of the ban PLUS 1 month.'
          comment = updateMessageWithCannedVariables("Hello %user.username%,\n\nThank you for taking the time to file a report. I've reviewed the evidence and took action against the user. Please make sure the evidence you submitted remains available for the entire length of the issued ban, plus an additional month.\n\n---\n\n**§1.4 — Reporting users**  \n> The evidence you provide us must be available for the length of the ban applied, plus one month. Evidence for permanent bans must be available forever.\n\nYou can find the full set of our rules [here](https://truckersmp.com/rules/)\n\n---\n\nKind regards,  \n%admin.username%  \nTruckersMP %admin.group.name%")
      }
    } else {
      comment = updateMessageWithCannedVariables(settings.own_comment);
    }
    manipulateTextarea(injects.accept.comment.prop('id'), comment, 'setReason');
  }

  function bans_count_fetch() {
    function getUnbanTime(unban_time_td, banned_reason_td) {
      var content = unban_time_td.split(/:\d\d/)
      unban_time_td = unban_time_td.replace(content[1], "")
      var unban_time
      now = moment.utc()
      if (unban_time_td.indexOf('Today') !== -1) {
        unban_time = now
      } else if (unban_time_td.indexOf('Tomorrow') !== -1) {
        unban_time = now.add(1, 'd')
      } else if (unban_time_td.indexOf('Yesterday') !== -1) {
        unban_time = now.add(1, 'd')
      } else {
        nb_parts = unban_time_td.split(' ').length
        if (nb_parts == 3) {
          unban_time = moment(unban_time_td, 'DD MMM HH:mm')
        } else if (nb_parts == 4) {
          unban_time = moment(unban_time_td, 'DD MMM YYYY HH:mm')
        } else {
          unban_time = moment(unban_time_td)
          console.log('TMP Improved (inject/reports)', [
            unban_time_td,
            nb_parts,
            unban_time
          ])
        }
      }
      if (unban_time.year() == '2001') {
        unban_time.year(now.year())
      }
      if (banned_reason_td == '@BANBYMISTAKE') {
        unban_time.year('1998')
      }

      return unban_time
    }

    var bans_count = 0
    var expired_bans_count = 0
    var nb_parts
    console.log(injects.bans.table)
    injects.bans.table.each(function () {
      var ban_time_td = $(this).find('td:nth-child(1)').text()
      var unban_time_td = $(this).find('td:nth-child(2)').text()
      var banned_reason_td = $(this).find('td:nth-child(3)').text()
      var unban_time
      if (unban_time_td == 'Never') {
        unban_time = getUnbanTime(ban_time_td, banned_reason_td)
      } else {
        unban_time = getUnbanTime(unban_time_td, banned_reason_td)
      }
      if (unban_time.isValid()) {
        if (Math.abs(unban_time.diff(now, 'd')) >= 365) {
          $(this).hide()
          $(this).addClass('expired_bans')
          $(this).find('td').css('color', '#555')
          expired_bans_count++
        } else {
          bans_count++
        }
      }
    })

    injects.bans.header.html(bans_count + ' counted bans<small>, including deleted. This is a website issue.</small>')
    if (bans_count >= 3) {
      injects.bans.header.css('color', '#d43f3a')
    }
    if (expired_bans_count > 0) {
      injects.bans.header.html(bans_count + ' counted bans<small>, including deleted. This is a website issue.</small> <a href="#" id="expired_bans_toggler"><i class="fas fa-toggle-off data-toggle="tooltip" title="Show/hide bans further than 12 months and @BANBYMISTAKE"></i></a>')
      $('#expired_bans_toggler').on('click', function (event) {
        event.preventDefault()
        $('.expired_bans').fadeToggle('slow')
        if (injects.bans.ban_toggler.hasClass('fa-toggle-off')) {
          injects.bans.ban_toggler.removeClass('fa-toggle-off')
          injects.bans.ban_toggler.addClass('fa-toggle-on')
        } else {
          injects.bans.ban_toggler.removeClass('fa-toggle-on')
          injects.bans.ban_toggler.addClass('fa-toggle-off')
        }
      })
    }

    if ($('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(2) > table.table.table-responsive > tbody > tr:nth-child(2) > td:nth-child(5) > i').hasClass('fa-check')) {
      $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(2) > table.table.table-responsive > tbody > tr:nth-child(2)').find('td').css({
        'color': '#d43f3a'
      })
    }
  }

  function banTableV2 () {
    let table = $("#bans").find('table')
    let bans = $(perpetratorProfile).find(".panel-profile .fa-graduation-cap").first().parent().parent().parent().find('.timeline-v2 > li')
    let activeCount = (bans.length === 0 ? 0 : table.find('tbody > tr').length)
    let totalCount = bans.length
    let bbmCount = 0
    let activeBbmCount = 0

    // fix activeCount and when there are old bans
    if (activeCount === 1 && table.find('tbody > tr > td').attr('colspan')) {
      activeCount = 0
      if (totalCount !== 0) {
        table.find('tbody > tr > td').text(table.find('tbody > tr > td').text().replace('No ban', 'No active ban')).addClass('expired_bans')
        table.prepend('<thead class="expired_bans"><tr><th>Banned</th><th>Expires</th><th>Reason</th><th>By</th><th>A?</th></tr></thead>')
        table.find('thead').toggle()
      }
    }

    // Shorten "Active" heading, add length column
    table.find('thead > tr > th:last-child').text('A?')
    if (settings.wide !== false) table.find('thead > tr > th:nth-child(2)').after('<th>Len.</th>')

    // add inactive bans & all lengths
    $.each(bans, function (index, ban) {
      let row = table.find('tbody > tr:nth-child(' + (index+1) + ')')

      // initialize ban data
      let issued = $(ban).find('time > span:first-child').text().trim().replaceAll(' UTC', '').replace(/(\d\d:\d\d):\d\d/, "$1")
      , expires = ""
      , reason = $(ban).find('.autolink').text().replaceAll(/(\s)+/g," ").replace("Reason: ","").trim()
      , admin = $(ban).find('h2 > small').text().replace('issued by', '').trim()
      if ($(ban).find('.autolink').next().text().includes('Permanent')) expires = 'Never'
      else expires = $(ban).find('.autolink').next().text().replaceAll(/(\s)+/g," ").replace('Expiration date: ', '').replace(' UTC', '').trim()
      
      if (index < activeCount) { // ban is already in table
        // calculate length in days
        let startStr = row.find('td:first-child').text(), endStr = row.find('td:nth-child(2)').text()
        let length
        if (endStr === 'Never') length = "∞"
        else length = "" + Math.round(moment.duration(moment(Date.parse(fixDate(endStr))).diff(moment(Date.parse(fixDate(startStr))))).asDays()) + " d"
        if (settings.wide !== false) table.find('tbody > tr:nth-child(' + (index+1) + ') > td:nth-child(2)').after('<td>' + length + '</td>')
        // shorten dates
        row.find('td:first-child').text(row.find('td:first-child').text().replace(' UTC', ''))
        row.find('td:first-child').html(row.find('td:first-child').html().replace(/(\d\d\d\d)/, "<small>$1</small>"))
        row.find('td:nth-child(2)').text(row.find('td:nth-child(2)').text().replace(' UTC', ''))
        row.find('td:nth-child(2)').html(row.find('td:nth-child(2)').html().replace(/(\d\d\d\d)/, "<small>$1</small>"))
        // count active BanByMistakes and change their icon
        if (reason === '@BANBYMISTAKE') {
          activeBbmCount++;
          row.addClass('expired_bans').toggle().find('td:last-child > i').removeClass('fa-times').removeClass('fa-minus').addClass('fa-ban')
        }
      } 
      
      else {
        // calculate length in days
        let length
        if (expires === 'Never') length = "∞"
        else length = "" + Math.round(moment.duration(moment(Date.parse(fixDate(expires))).diff(moment(Date.parse(fixDate(issued))))).asDays()) + " d"
        // prepare table row
        let html = '<tr class="expired_bans">'
        html += '<td style="color: #555;">' + issued.replace(/(\d\d\d\d)/, "<small>$1</small>") + '</td>'
        html += '<td style="color: #555;">' + expires.replace(/(\d\d\d\d)/, "<small>$1</small>") + '</td>'
        if (settings.wide !== false) html += '<td style="color: #555;">' + length + '</td>'
        html += '<td class="autolinklate" style="color: #555;">' + reason + '</td>'
        html += '<td style="color: #555;">' + admin + '</td>'
        html += '<td style="color: #555;"><i class="fas ' + (reason === '@BANBYMISTAKE' ? 'fa-ban' : 'fa-minus') + '"></i></td></tr>'
        table.find('tbody > tr:last-child').after(html)
        table.find('tbody > tr:last-child').toggle()
      }
      // count all BanByMistakes and change their icon
      if (reason === '@BANBYMISTAKE') {
        bbmCount++;
      }
    })

    // parse links in old ban reasons
    $('.autolinklate a').each(function () {
      $(this).contents().unwrap()
    })
    $(".autolinklate").each(function () {
      $(this).html($(this).html().replace(/((http|https):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank" rel="noopener" class="newlinks">$1</a> '))
    })
    content_links()
    table.find('.expired_bans').find('.youtube').YouTubeModal({
      autoplay: 0,
      width: 640,
      height: 480
    })
    var videoBtns = table.find('.expired_bans').find('.video')
    var videoModal = $('#videoModal')
    videoBtns.click(function (e) {
      e.preventDefault()
      videoModal.find('.modal-body').html("<div class='embed-responsive-16by9 embed-responsive'><iframe src='" + $(this).attr('href') + "' width='640' height='480' frameborder='0' scrolling='no' allowfullscreen='true' style='padding:0; box-sizing:border-box; border:0; -webkit-border-radius:5px; -moz-border-radius:5px; border-radius:5px; margin:0.5%; width: 99%; height: 98.5%;'></iframe></div>")
      videoModal.modal('show')
    })
    videoModal.on('hidden.bs.modal', function () {
      videoModal.find('.modal-body').html('')
    })
    table.find('.expired_bans').find('a.jmdev_ca').on('click', jmdevHandler)

    // make active ban red
    if (table.find('tbody > tr:first-child > td:last-child > i').hasClass('fa-check')) {
      table.find('tbody > tr:first-child').find('td').css({
        'background-color': '#4e1e19'
      })
    }

    // change table header
    let activeSansBbmCount = activeCount - activeBbmCount
    let totalSansBbmCount = totalCount - bbmCount

    if (activeBbmCount > 0 && activeSansBbmCount === 0) { // if all active bans are BBM, hide the heading
      table.find('thead').addClass('expired_bans').toggle()
      table.find('tbody').prepend('<tr class="expired_bans"><td colspan="6" class="text-center">No active bans found</td></tr>')
    }

    injects.bans.header.html((activeSansBbmCount === totalSansBbmCount ? activeSansBbmCount + ' total ' : activeSansBbmCount + '/' + totalSansBbmCount + ' active ') + 'bans' + (bbmCount === 0 && activeCount === totalCount ? '' : ' <a href="#" id="expired_bans_toggler"><i class="fas fa-toggle-off data-toggle="tooltip" title="Show/hide bans further than 12 months & BBM\'s"></i></a>'))
      $('#expired_bans_toggler').on('click', function (event) {
        event.preventDefault()
        $('.expired_bans').fadeToggle('fast')
        if ($('#expired_bans_toggler > i').hasClass('fa-toggle-off')) {
          $('#expired_bans_toggler > i').removeClass('fa-toggle-off')
          $('#expired_bans_toggler > i').addClass('fa-toggle-on')
        } else {
          $('#expired_bans_toggler > i').removeClass('fa-toggle-on')
          $('#expired_bans_toggler > i').addClass('fa-toggle-off')
        }
      })
  }

  function ban_history_table_improving() {
    // Make the table with other reports better
    $('#report > table > tbody > tr').each(function () {
      // Skip it when no reports have been found
      if ($(this).find('td:nth-child(1)').text().trim() === 'No reports found') {
        return
      }

      // View button
      $(this).find('td:nth-child(6) > a').addClass('btn btn-default btn-block btn-sm').text('View')

      // Claim button
      let claimButton = $(this).find('td:nth-child(5) > a')
      console.log('TMP Improved (inject/reports)', "Thing:", claimButton)
      claimButton.addClass('btn btn-primary btn-block btn-sm claim')

      let text = claimButton.text().replace('Report', '').trim()
      if (text === 'Claim') {
        claimButton.html(text + " <i class='fas fa-external-link-alt'></i>")
        if (settings.viewreportblank) {
          claimButton.attr('target', '_blank')
        }
      } else {
        claimButton.html(text)
      }

      // Already claimed
      if ($(this).find('td:nth-child(5)').text().trim() === 'Already claimed') {
        $(this).find('td').css('color', '#555')
      }

      // Date
      let dateColumn = $(this).find('td:nth-child(1)')
      text = dateColumn.text()
      if (text.split(' ').length !== 4) {
        text = text.replace('Today,', moment().format('DD MMM'))
        text = moment(text, 'DD MMM HH:mm').format('DD MMM YYYY HH:mm')
        dateColumn.text(text)
      }

      // Switch claim button
      $(this).children(':eq(5)').after($(this).children(':eq(4)'))
    })

    // Claim link click
    $('a.claim').click(function (event) {
      $(this).addClass('clicked')
      $(this).text('Claimed!')
      if (settings.viewreportblank) {
        event.preventDefault()
        if (event.ctrlKey) {
          window.open($(this).attr('href'), '_top')
        } else {
          window.open($(this).attr('href'), '_blank')
        }
      }
    })
  }

  function dropdown_enchancements() {
    $('ul.dropdown-menu').css('top', '95%')
    $('.dropdown').hover(function () {
      $('.dropdown-menu', this).stop(true, true).fadeIn('fast')
      $(this).toggleClass('open')
      $('b', this).toggleClass('caret caret-up')
    }, function () {
      $('.dropdown-menu', this).stop(true, true).fadeOut('fast')
      $(this).toggleClass('open')
      $('b', this).toggleClass('caret caret-up')
    })
    $('a.hovery').hover(function (e) {
      $(this).css('background', e.type === 'mouseenter' ? '#303030' : 'transparent')
      $(this).css('color', e.type === 'mouseenter' ? '#999!important' : '')
    })
  }

  function bannedInit() {
    var isBanned = $('body > div.wrapper > div.container.content > div > div > div.col-md-6:nth-child(2) > table').find('i.fa-check')
    if (isBanned.length > 0) {
      var perpetrator = $('body > div.wrapper > div.container.content > div > div > div.col-md-6:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)')
      $(perpetrator).append('<span class="badge badge-red badge-banned">Banned</span>')
    }
  }

  function viewReportBlankInit() {
    if (settings.viewreportblank) {
      $('#reports > #report > div:nth-child(1) > table').find('a:contains("View")').prop('target', '_blank');
    } else {
      $('#reports > #report > div:nth-child(1) > table').find('a:contains("View")').prop('target', '');
    }
  }

  function construct_buttons(type) {
    var html = ''
    switch (type) {
      case 'comments':
        if (OwnReasons.comments.length > 0 && Object.keys(OwnReasons.comments[0]).length !== 0) html += each_type_new('Comments', OwnReasons.comments) + ' '
        if (OwnReasons.reportsall.length > 0 && Object.keys(OwnReasons.reportsall[0]).length !== 0) html += each_type_new('cReports', OwnReasons.reportsall) + ' '
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('cGlobal', OwnReasons.all) + ' '
        html += '<button type="button" class="btn btn-link" id="comments_clear">Clear</button>'
        break;

      case 'reason':
        html += each_type_new('Reasons', OwnReasons.reasons) + ' '
        html += each_type_new('Prefixes', OwnReasons.prefixes) + ' '
        html += each_type_new('Postfixes', OwnReasons.postfixes) + ' '
        html += '<button type="button" class="btn btn-link" id="reason_clear">Clear</button>'
        break;

      case 'decline':
        if (OwnReasons.declines.length > 0 && Object.keys(OwnReasons.declines[0]).length !== 0) html += each_type_new('Declines', OwnReasons.declines) + ' '
        if (OwnReasons.declinesPositive.length > 0 && Object.keys(OwnReasons.declinesPositive[0]).length !== 0) html += each_type_new('Declines (Positive)', OwnReasons.declinesPositive) + ' '
        if (OwnReasons.declinesNegative.length > 0 && Object.keys(OwnReasons.declinesNegative[0]).length !== 0) html += each_type_new('Declines (Negative)', OwnReasons.declinesNegative) + ' '
        if (OwnReasons.reportsall.length > 0 && Object.keys(OwnReasons.reportsall[0]).length !== 0) html += each_type_new('dReports', OwnReasons.reportsall) + ' '
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('dGlobal', OwnReasons.all) + ' '
        html += '<button type="button" class="btn btn-link" id="decline_clear">Clear</button>'
        break;

      case 'accept':
        if (OwnReasons.accepts.length > 0 && Object.keys(OwnReasons.accepts[0]).length !== 0) html += each_type_new('Accepts', OwnReasons.accepts) + ' '
        if (OwnReasons.reportsall.length > 0 && Object.keys(OwnReasons.reportsall[0]).length !== 0) html += each_type_new('aReports', OwnReasons.reportsall) + ' '
        if (OwnReasons.all.length > 0 && Object.keys(OwnReasons.all[0]).length !== 0) html += each_type_new('aGlobal', OwnReasons.all) + ' '
        html += '<button type="button" class="btn btn-link" id="accept_clear">Clear</button>'
        break;
    }

    return html

    function each_type_new(type, buttons) {
      var place, color, change, action
      switch (type) {
        case 'Prefixes':
          place = 'before'
          color = 'warning'
          change = 'reason'
          action = ''
          break;

        case 'Reasons':
          place = 'after'
          color = 'default'
          change = 'reason'
          action = ''
          break;

        case 'Postfixes':
          place = 'after-wo'
          color = 'danger'
          change = 'reason'
          action = ''
          break;

        case 'Accepts':
          place = 'after'
          color = 'info'
          change = 'accept'
          action = ''
          break;

        case 'Declines':
          place = 'after'
          color = 'info'
          change = 'decline'
          action = ''
          break;

        case 'Declines (Positive)':
          place = 'after'
          color = 'warning'
          change = 'decline'
          action = 'positive'
          break;

        case 'Declines (Negative)':
          place = 'after'
          color = 'danger'
          change = 'decline'
          action = 'negative'
          break;

        case 'Comments':
          place = 'after'
          color = 'u'
          change = 'comment'
          action = ''
          break;

        case 'aReports':
          place = 'after'
          color = 'secondary'
          change = 'accept'
          action = ''
          type = 'Reports'
          break;

        case 'aGlobal':
          place = 'after'
          color = 'dark'
          change = 'accept'
          action = ''
          type = 'Global'
          break;

        case 'dReports':
          place = 'after'
          color = 'secondary'
          change = 'decline'
          action = ''
          type = 'Reports'
          break;

        case 'dGlobal':
          place = 'after'
          color = 'dark'
          change = 'decline'
          action = ''
          type = 'Global'
          break;

        case 'cReports':
          place = 'after'
          color = 'secondary'
          change = 'comment'
          action = ''
          type = 'Reports'
          break;

        case 'cGlobal':
          place = 'after'
          color = 'dark'
          change = 'comment'
          action = ''
          type = 'Global'
          break;
      }
      var snippet = '<div class="btn-group dropdown mega-menu-fullwidth"><a class="btn btn-' + color + ' dropdown-toggle" data-toggle="dropdown" href="#">' + type + ' <span class="caret"></span></a><ul class="dropdown-menu"><li><div class="mega-menu-content disable-icons" style="padding: 4px 15px;"><div class="container" style="width: 800px !important;"><div class="row equal-height" style="display: flex;">'
      var md = 12 / (Math.max(buttons.length, 1))
      $.each(buttons, function (key, val) {
        snippet += '<div class="col-md-' + md + ' equal-height-in" style="border-left: 1px solid #333; padding: 5px 0;"><ul class="list-unstyled equal-height-list">'
        if (Array.isArray(val)) {
          val.forEach(function (item) {
            snippet += '<li><a style="display: block; margin-bottom: 1px; position: relative; border-bottom: none; padding: 6px 12px; text-decoration: none" href="#" class="hovery plus' + change + '" data-place="' + place + '" data-action="' + action + '" data-text="' + encodeURI(item.trim()) + '">' + item.trim() + '</a></li>'
          })
        } else {
          $.each(val, function (title, item) {
            snippet += '<li><a style="display: block; margin-bottom: 1px; position: relative; border-bottom: none; padding: 6px 12px; text-decoration: none" href="#" class="hovery plus' + change + '" data-place="' + place + '" data-action="' + action + '" data-text="' + encodeURI(item.trim()) + '">' + title.trim() + '</a></li>'
          })
        }
        snippet += '</ul></div>'
      })
      snippet += '</div></div></div></li></ul></div>     '
      return snippet
    }
  }

  // function supportInit() {
  //   if (injects.claim_report.length == 0) {
  //     var select = $('select[name=visibility]')
  //     $(select).find('option:selected').removeProp('selected')
  //     $(select).find('option[value=Private]').prop('selected', 'selected')
  //   }
  // }

  function evidencePasteInit() {
    injects.accept.reason.bind('paste', function (e) {
      var self = this,
        data = e.originalEvent.clipboardData.getData('Text').trim(),
        dataLower = data.toLowerCase()
      if ((dataLower.indexOf('http://') == 0 || dataLower.indexOf('https://') == 0) && !checkDoubleSlash(this) && settings.autoinsertsep) {
        e.preventDefault()
        insertAtCaret($(self)[0], '- ' + data, true)
      }
    })
  }

  function fixModals() {
    var path = 'div.modal-body > div.form-group:last-child'

    var rateAccept = injects.accept.form.find(path)
    rateAccept.find("input[id='rating.positive']").attr('id', 'accept.rating.positive')
    rateAccept.find("input[id='rating.negative']").attr('id', 'accept.rating.negative')
    rateAccept.find("label[for='rating.positive']").attr('for', 'accept.rating.positive')
    rateAccept.find("label[for='rating.negative']").attr('for', 'accept.rating.negative')

    if (settings.defaultratings) rateAccept.find("input[id='accept.rating.positive']").prop("checked", true);

    var rateDecline = injects.decline.form.find(path)
    rateDecline.find("input[id='rating.positive']").attr('id', 'decline.rating.positive')
    rateDecline.find("input[id='rating.negative']").attr('id', 'decline.rating.negative')
    rateDecline.find("label[for='rating.positive']").attr('for', 'decline.rating.positive')
    rateDecline.find("label[for='rating.negative']").attr('for', 'decline.rating.negative')

    if (settings.defaultratings) rateDecline.find("input[id='decline.rating.negative']").prop("checked", true);

    $('#loading-spinner').hide()
  }

  function addButtons(textArea, html) {
    if (typeof textArea !== 'undefined' && html.length > 0) {
      //$(textArea).css('margin-bottom', '10px')
      $(html).insertAfter(textArea.next().hasClass('EasyMDEContainer') ? textArea.next() : textArea)
    }
  }

  var reqUrl = { "player_id": "", "truckersmp_id": "" };
  function lookupRequest(category, id, tmpid, name, date) {
    if (id < 0) alert(':LOL:');
    else switch (category) {
      case "player_id":
        if (!id) alert('Please enter a Player ID!');
        else $.ajax({
          url: reqUrl.player_id,
          type: 'POST',
          data: `_token=${token}&player_id=${id}&truckersmp_id=${tmpid}&date=`,
          success: function (data) {
            var result = $(data).find('tbody');
            var htmlSuccess = 'Verified <i class="fas fa-check"></i>';
            var htmlFail = 'Failed <i class="fas fa-times"></i>';

            if (result.find('tr:nth-child(2) > td').attr('colspan') != undefined) {
              $('#verifyDateSubmit').html(htmlFail);
              $('#verifyDateResult').html('<em style="color: red; margin-left: 20px; position: absolute;">No match found!</em>');
            } else {
              var actualDate = moment(result.find('tr:nth-child(2) > td:nth-child(3)').text());
              if (actualDate) $('#verifyDateSubmit').html(htmlSuccess);
              else console.error('TMP Improved (inject) > PlayerID Lookup returned unexpected results', actualDate);

              var color = 'black';
              if (actualDate.valueOf() < moment().subtract(1, 'M').valueOf()) color = 'red';
              else if (Math.abs(actualDate.valueOf() - date) > day) color = 'yellow';
              else color = 'green';
              $('#verifyDateResult').html('<em style="color: ' + color + '; margin-left: 20px; position: absolute;" data-toggle="tooltip" title="" data-original-title="' + result.find('tr:nth-child(2) > td:nth-child(3)').text() + '">' + actualDate.format("DD MMM YYYY") + '</em>');
            }
          }
        });
        break;
      case "truckersmp_id":
        if (!id || !name || name.length < 3) alert('Please enter a ' + (id && name.length > 0 ? 'longer ' : '') + (!id ? 'Player ID!' : 'username!'));
        else $.ajax({
          url: reqUrl.truckersmp_id,
          type: 'POST',
          data: `_token=${token}&player_id=${id}&player_name=${name}&date=${date}`,
          success: function (data) {
            $('#findResult').html($(data).find('table').html());
          }
        });
        break;
    }
  }

  /*
      INIT SCRIPT
   */

  function init() {
    content_links()
    fetchPerpetratorProfile()
    //if (settings.localisedcomment) comment_language()
    //bans_count_fetch()
    ban_history_table_improving()
    accept_modal_init()
    decline_modal_init()
    dropdown_enchancements()
    // supportInit()
    bannedInit()
    viewReportBlankInit()
    evidencePasteInit()
    fixModals()
    injectScript(chrome.extension.getURL('src/editor.js'), 'body')
    if (users.admin.text()) fetchAdminGroupName()
  }

  var now = moment.utc() // Moment.js init
  $(document).ready(function () {
    if (settings.wide !== false) {
      $('div.container.content').css('width', '85%')
    }

    if ($(injects.summary.perpetrator_link).attr('href')) injects.summary.perpetrator_label.next().append('<br><kbd id="registerdate" style="margin-left: 2px;">Registered: ...</kbd>');
    injects.summary.perpetrator_label.next().find('kbd:nth-child(1)').after('<a style="margin-left: 1px;" id="copyname"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy username"></i></a>');
    injects.summary.perpetrator_label.next().find('span').after('<a style="margin-left: 1px;" id="copyid"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy TMP ID"></i></a>');
    tbody.find('tr:nth-child(3) > td > a').append('<a id="copysteamid"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy SteamID"></i></a>');
    injects.summary.reporter_label.next().find('span').after('<a style="margin-left: 1px;" id="copyrepid"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy TMP ID"></i></a>');
    users.admin.append(' <a id="copyadminid" style="color: inherit;"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="" data-original-title="Copy TMP ID"></i></a>')
    injects.accept.reason.attr('autocomplete','off');
    
    $('#copyname').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["perpetrator.username"])
      $(this).children().first().removeClass("fa-copy").addClass("fa-check");
      setTimeout(() => {
        $(this).children().first().removeClass("fa-check").addClass("fa-copy");
      },2000);
    })
    $('#copyid').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["perpetrator.id"])
      $(this).children().first().removeClass("fa-copy").addClass("fa-check");
      setTimeout(() => {
        $(this).children().first().removeClass("fa-check").addClass("fa-copy");
      },2000);
    })
    $('#copysteamid').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["perpetrator.steam_id"])
      $(this).children().first().removeClass("fa-copy").addClass("fa-check");
      setTimeout(() => {
        $(this).children().first().removeClass("fa-check").addClass("fa-copy");
      },2000);
    })
    $('#copyrepid').on('click', function (event) {
      event.preventDefault()
      copyToClipboard(cannedVariables["user.id"])
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

    $('#bans').next().children().first().children().first().on('click', function (event) {
      setTimeout(() => {
        if (settings.localisedcomment) comment_language()
      }, 200)
      $('#bans').next().children().first().children().first().off('click')
    })

    $('.youtube').YouTubeModal({
      autoplay: 0,
      width: 640,
      height: 480
    })
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
    if (injects.summary.perpetrator_link.parent().html() !== undefined) $('body').find('h4.modal-title').after('<span style="margin-left: 10px;"><kbd>' + injects.summary.perpetrator_link.parent().html() + '</kbd> / Previous usernames: ' + injects.summary.previous_usernames.html() + '</span>')

    var occurred = tbody.find('tr:nth-child(5) > td:nth-child(2)');
    var occurdate = Date.parse(fixDate(occurred.text()));
    var now = (new Date()).getTime();
    if (now - occurdate >= day * 32) occurred.css('color', '#a94442');
    else if (now - occurdate >= day * 27) occurred.css('color', '#8a6d3b');
    else occurred.css('color', '#3c763d');

    // get token
    token = $('body').find('input[name=_token]').attr('value');
    reqUrl.player_id = $('.header').find('.mega-menu').find('.fa-history').parent().attr('href') + '/player-id';
    reqUrl.truckersmp_id = $('.header').find('.mega-menu').find('.fa-history').parent().attr('href') + '/truckersmp-id';

    // verify occurdate
    occurred.append('<span id="verifyDateResult"></span><button type="button" class="btn-warning pull-right" style="width: 75px; height: 24px; padding: 2px; border-width: 0px; vertical-align: top;" id="verifyDateSubmit">Verify</button><input type="number" id="verifyDate" placeholder="Player ID" class="form-control pull-right" style="width: 6em; height: 24px; display: inline; margin-right: 4px; padding: 2px;"></input>');
    $('#verifyDateSubmit').click(function (e) {
      e.preventDefault();
      lookupRequest('player_id', $('#verifyDate').val(), cannedVariables["perpetrator.id"], undefined, occurdate);
    });
    // find correct tmpid
    $('#perpetrator').find('div.modal-body').append('<br><label>Lookup</label><br><input type="number" id="findId" placeholder="Player ID" class="form-control" style="width: 8em; display: inline;"></input><input type="text" id="findName" placeholder="Username" class="form-control" style="width: 14em; display: inline; margin-left: 4px;"></input><button type="button" class="btn btn-info" style="vertical-align: top; margin-left: 4px;" id="findSubmit">Search</button><br><table id="findResult" class="table table-responsive margin-top-20"></table>');
    $('#findSubmit').click(function (e) {
      e.preventDefault();
      var reqDate = moment(occurdate).subtract(1, 'w').format('YYYY-MM-DD') + '+to+' + moment(occurdate).add(1, 'd').format('YYYY-MM-DD');
      lookupRequest('truckersmp_id', $('#findId').val(), undefined, $('#findName').val().replace(/[^A-Za-z0-9]/g, '*'), reqDate);
    });

    // Ban length calculator
    if (settings.enablebanlength === true && $(injects.summary.perpetrator_link).attr('href')) {
      $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(2)').append('<hr class="small" /><h4>Recommended Ban length</h4><div style="display: flex"><div class="col-md-12"><div class="text-center"><div class="loading-for-bans" style="display: none;">Loading...</div>' + /*<a class="btn btn-block btn-success" href="#" id="check-ban-length">Check the recommended length of the next ban</a> + */'</div></div>');
    }
    /*$('#check-ban-length').click(function (e) {
      e.preventDefault()
      checkBanLength()
    })*/
  })

  function checkBanLength () {
    $('#loading-spinner').show()
    //$('#check-ban-length').remove()
    $('div.loading-for-bans').show()

    // Gets all bans
    var bans = $(perpetratorProfile).find(".panel-profile .fa-graduation-cap").first().parent().parent().parent().find('.timeline-v2 > li')
    var activeBans = 0,
      bans1m = 0,
      bans3m = 0,
      totalBans = 0
    var active1m = false,
      two_active_hist_bans = false,
      active3m = false
    // If the user is banned
    var banned = false
    if ($(perpetratorProfile).find('.profile-body .panel-profile .profile-bio .label-red').text().toLowerCase().includes('banned')) {
      banned = true
    }

    $.each(bans, function (index, ban) {
      // @BANBYMISTAKE is not counted
      var reason = $(ban).find('.autolink').text().replaceAll(/(\s)+/g," ").replace("Reason: ","").trim()
      if (reason === '@BANBYMISTAKE' || $(ban).find('.cbp_tmicon').css('background-color') === 'rgb(255, 0, 38)') {
        return
      }

      var date = $(ban).find('time').attr('datetime') //$(ban).find('.cbp_tmtime span:last-of-type').text()
      var issuedOn = Date.parse(fixDate(date))
      
      var dateExp = $(ban).find('.autolink').next().text().replaceAll(/(\s)+/g," ").trim() //getKeyValueByNameFromBanRows($(ban).find('.cbp_tmlabel > p'), "Expires", ': ')[1]
      if (dateExp.includes('Never') || dateExp.includes('Permanent')) {
        dateExp = date
      } else {
        $(ban).find('.autolink').next().find('strong').each((i, ent) => {
          dateExp = dateExp.replace($(ent).text(), "");
        })
      }
      var expires = Date.parse(fixDate(dateExp))

      totalBans++;
      if (expires - issuedOn >= day * 85) {
        bans3m++
      } else if (expires - issuedOn >= day * 27 && reason.toLowerCase().includes('hist')) {
        bans1m++
      }
      if ((new Date()).getTime() - day * 365 <= expires) {
        activeBans++
        if (expires - issuedOn >= day * 85) {
          if (active3m || active1m) two_active_hist_bans = true;
          active3m = true
        } else if (expires - issuedOn >= day * 27 && reason.toLowerCase().includes('hist')) {
          if (active1m || active3m) two_active_hist_bans = true;
          active1m = true
        }
      }
    })

    var html = '<div class="col-md-6 text-center" style="align-self: center"><kbd'
    if (banned) {
      html += ' style="color: rgb(212, 63, 58)">The user is already banned!</kbd><br />Length of the next ban: <kbd'
    }
    // Length checks
    if (two_active_hist_bans || (activeBans >= 4 && active1m)) {
      html += ' style="color: rgb(212, 63, 58)">Permanent'
    } else if (activeBans >= 3) {
      html += ' style="color: rgb(212, 63, 58)">1 month'
    } else {
      html += '>You can choose :)'
    }
    html += '</kbd><br /><br /><em>This tool is very accurate, but please check the profile to avoid mistakes.</em></div>'
    // Information
    html += '<div class="col-md-6 text-center">'
    //html += 'Banned: <kbd' + (banned ? ' style="color: rgb(212, 63, 58)">yes' : '>no') + '</kbd><br />'
    html += 'Active bans: ' + activeBans + '<br />'
    html += 'Total bans: ' + totalBans + '<br />'
    html += '1 month bans: ' + bans1m + '<br />'
    html += '3 month bans: ' + bans3m + '<br />'
    html += 'Active 1 month ban: ' + (active1m || active3m)/* + '<br />'
    html += 'Active 3 month ban: ' + active3m*/
    //html += '<br/><br/></div><div class="text-center"><em>This tool is very accurate, but please check the profile to avoid mistakes.</em></div></div>'
    html += '</div>'
    $('body > div.wrapper > div.container.content > div > div.clearfix > div:nth-child(2)').append(html)

    $('#loading-spinner').hide()
    $('div.loading-for-bans').hide()
  }

  init()

  $('.pluscomment').on('click', function (event) {
    event.preventDefault()
    setReason($('form').find('textarea').not($('.modal-body').find('textarea')), decodeURI(String($(this).data('text'))))
  })

  $('button#comments_clear').on('click', function (event) {
    event.preventDefault()
    if (confirm('Are you sure you want to start over?')) manipulateTextarea($('form').find('textarea[name=comment]').prop('id'), '', 'clearReason');
  })

  $('.plusaccept').on('click', function (event) {
    event.preventDefault()
    setReason($('#commentAccept'), decodeURI(String($(this).data('text'))))
    $('#commentAccept').focus()
  })

  $('button#accept_clear').on('click', function (event) {
    event.preventDefault()
    if (confirm('Are you sure you want to start over?')) manipulateTextarea($('form').find('#commentAccept').prop('id'), '', 'clearReason');
  })

  // ===== Replace status text with a badge =====
  if (settings.colouredstatus === true) {
    $(function () {
      var rating_tr = $("table.table.table-condensed.table-hover > tbody > tr:nth-child(9) > td:nth-child(1)").text();

      if (rating_tr === "Rating") {
        $("table.table.table-condensed.table-hover > tbody > tr:nth-child(11) > td:nth-child(2)").prop('class', 'report_status');
      }
      else {
        $("table.table.table-condensed.table-hover > tbody > tr:nth-child(10) > td:nth-child(2)").prop('class', 'report_status');
      }

      $("#report > div > table > tbody > tr:nth-child(n) > td:nth-child(4)").prop('class', 'report_status');

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