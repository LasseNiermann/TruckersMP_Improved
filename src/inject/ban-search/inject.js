let inject_init = () => { // eslint-disable-line no-unused-vars
  try {

    $('body > div.wrapper > div.container.content-md > table > thead > tr > th:nth-child(2)').after('<th style="width: 6%">Length</th>');
    $('body > div.wrapper > div.container.content-md > table > tbody > tr:nth-child(n) > td:nth-child(2)').after('<td></td>');

    let bans = $('body > div.wrapper > div.container.content-md > table > tbody > tr:nth-child(n)');
    $.each(bans, function (index, ban) {
      let startDate = $(ban).find('td').first().text().trim();
      endDate = $(ban).find('td:nth-child(2)').text().trim();
      if (endDate !== "Never") {
        let start = moment(Date.parse(fixDate(startDate))), end = moment(Date.parse(fixDate(endDate)))
        let length = moment.duration(end.diff(start))
        let roundedLength = Math.round(length.asDays())
        let lengthDays = "" + roundedLength + (roundedLength === 1 ? " day" : " days")

        $(ban).find('td:nth-child(3)').append(lengthDays);
      }
      else {
        $(ban).find('td:nth-child(3)').append('<p style="color:#a94442">Permanent</p>');
      }
    })
    
    $(function() {
      if ($('table').length) {
        $("body > div.wrapper > div.container.content-md > form").append('<label style="width:14%" class="checkbox mt-5"><input type="checkbox" class="website_bans"><i></i>Hide website bans</label>');
        $("body > div.wrapper > div.container.content-md > form").append('<label style="width:14%" class="checkbox"><input type="checkbox" class="game_bans"><i></i>Hide in-game bans</label>');
      }

      $("input.website_bans").change(function() {
        if(this.checked) {
          $('body > div.wrapper > div.container.content-md > table > tbody > tr:nth-child(n)').each(function() {
            var server = $(this).find('td:eq(3)').text().trim();
          
            if (server === "WEBSITE") {
              $(this).hide();
            }
          })
        }
        else {
          $('body > div.wrapper > div.container.content-md > table > tbody > tr:nth-child(n)').each(function() {
            var server = $(this).find('td:eq(3)').text().trim();
          
            if (server === "WEBSITE") {
              $(this).show();
            }
          })
        }
      });

      $("input.game_bans").change(function() {
        if(this.checked) {
          $('body > div.wrapper > div.container.content-md > table > tbody > tr:nth-child(n)').each(function() {
            var server = $(this).find('td:eq(3)').text().trim();
          
            if (server !== "WEBSITE") {
              $(this).hide();
            }
          })
        }
        else {
          $('body > div.wrapper > div.container.content-md > table > tbody > tr:nth-child(n)').each(function() {
            var server = $(this).find('td:eq(3)').text().trim();
          
            if (server !== "WEBSITE") {
              $(this).show();
            }
          })
        }
      });
    });

  } catch (e) {
    console.error('TMP Improved (inject/ban-search)', e);
  }

  // ===== After All =====
  $(function () {
    $('#loading-spinner').hide()
  });
}