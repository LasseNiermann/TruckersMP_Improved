let inject_init = () => { // eslint-disable-line no-unused-vars
  let CheckBanButtonClicked = () => {
    renderBanModal(false);
  };

  let renderBanModal = (checked) => {
    let dict = {
      "keys": {
        "active1m": "Active 1 month ban",
        "activeBans": "Total active bans",
        "banned": "Currently banned",
        "bans1m": "Total 1 month bans",
        "bans3m": "Total 3 month bans",
        "twoActiveHistBans": "Two active history bans",
        "nextBan": "Next ban"
      },
      "vals": {
        "true": "Yes",
        "false": "No",
        "your discretion": "Your discretion :-)"
      }
    };

    let banStats = checkBans(checked);

    let html = "";

    Object.keys(banStats).forEach((key) => {
      let val = (dict.vals[banStats[key].toString().toLowerCase()] ? dict.vals[banStats[key].toString().toLowerCase()] : banStats[key]);
      html += `<b>${dict.keys[key]}:</b> ${val} <br />`;
    });

    $(".modal#banStats .modal-body .inner").html(html);
  };

  let injectUserModal = () => {
    $("body").append(`<div class="modal fade" id="banStats" tabindex="-1" role="dialog" aria-labelledby="banStats" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Ban Stats</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="inner"></div>
          <hr class="removeFirstBanHr" />
          <input class="form-check-input" type="checkbox" id="removeFirstBan">
          <label class="form-check-label" for="removeFirstBan">Remove latest ban</label><br />
          <div><b>Note: </b>This is based on if the previous bans were extending correctly. Please double check.</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>`);
    return new Promise((resolve) => {
      resolve();
    });
  };

  let injectCheckBanButtonToUserPage = () => {
    $(".profile-body").find(".fa-graduation-cap").first().parent().parent().append(`<a href="" class="btn btn-primary btn-sm truckersmp-ban-helper check-ban" onclick="event.preventDefault()" data-toggle="modal" data-target="#banStats">Next ban</a>`);
    injectUserModal()
      .then(registerCheckBanEvents());
  };

  let registerCheckBanEvents = () => {
    $(".truckersmp-ban-helper.check-ban").click(() => {
      CheckBanButtonClicked();
    });

    $("#removeFirstBan").click(() => {
      let checked = $("#removeFirstBan").is(":checked");
      renderBanModal(checked);
    });

    return new Promise((resolve) => {
      resolve();
    });
  };

  let displayBanLength = () => {
    let bans = $('body').find(".panel-profile .fa-graduation-cap").first().parent().parent().parent().find('.timeline-v2 > li')
    $.each(bans, function (index, ban) {
      let startStr = $(ban).find('time').first().attr('datetime'), 
      endStr = $(ban).find('div > div > p:nth-child(2)').text().replace($(ban).find('div > div > p:nth-child(2) > strong').text(), "").trim()
      if (endStr) {
        let start = moment(startStr), end = moment(Date.parse(fixDate(endStr)))
        let length = moment.duration(end.diff(start))
        let roundedLength = Math.round(length.asDays())
        let lengthStr = "" + roundedLength + (roundedLength === 1 ? " day" : " days")

        $(ban).find('div > div > p:nth-child(2)').append('<strong>(' + lengthStr + ')</strong>')
      }
    })
  }

  displayBanLength()
  injectCheckBanButtonToUserPage();
};
