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
    
  } catch (e) {
    console.error('TMP Improved (inject/ban-latest)', e);
  }

  // ===== After All =====
  $(function () {
    $('#loading-spinner').hide()
  });
}