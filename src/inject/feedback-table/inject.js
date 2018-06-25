function inject_init() {
  if (settings.enablefeedbackimprovement === false) {
    $("#loading-spinner").hide();
    return;
  }

  var table = $('table.table');

  // ===== Init bootstrapping =====
  table.addClass('table-condensed table-hover');

  $('table.table > tbody > :first(tr)').wrap('<thead class="TEMP"></thead>');
  $('table.table > tbody > thead').clone().prependTo('table.table').removeClass('TEMP');
  $('.TEMP').remove();

  var colsHead = $('body > div.wrapper > div.container.content > div > table > thead > tr > th'),
    colsBody = $('body > div.wrapper > div.container.content > div > table > tbody > tr:nth-child(1) > td');

  $(colsHead).each(function (idx, item) {
    if ($(item).text().length == 0)
      $(item).addClass('no-sort');
  });

  if (colsHead.length < colsBody.length) {
    var colsHeadTr = $('body > div.wrapper > div.container.content > div > table > thead > tr');
    for (var i = 0; i < colsBody.length - colsHead.length; i++)
      $(colsHeadTr).append('<th class="no-sort"></th>');
  }

  // ===== Add claim buttons to TIGAs =====
  var admin_name = $("a[href='/profile']:first").html();
  var admins = [];

  $.each($("select[name='admin_id']").find("option"), function (index, admin) {
    var name = $(admin).text();
    if (index > 2) {
      admins.push(name);
    }
  });

  if ($.inArray(admin_name, admins) > -1) {
    $.each(table.find('tbody > tr'), function (index, row) {
      if ($(row).find("td:nth-child(9)").html() == "") {
        var view_link = $(row).find("td:nth-child(8) > a")[0];
        var report_id = $(view_link).attr("href").split("/")[3];
        var report_admin = $(row).find("td:nth-child(3)")[0];
        var report_status = $(row).find("td:nth-child(5)")[0];
        var report_claim = $(row).find("td:nth-child(9)")[0];
        //if ($.inArray($(report_status).text(), ["Closed", "Finished", "Under_investigation"]) == -1) {
        switch ($(report_admin).text()) {
          case admin_name:
            $(report_claim).html("<a href='/feedback/claim/" + report_id + "'>Un-claim feedback</a>");
            break;

          case "Nobody":
            $(report_claim).html("<a href='/feedback/claim/" + report_id + "'>Claim feedback</a>");
            break;
        }
        //}
      }
    })
  }

  // ===== Transform links =====
  $('table.table > tbody > tr > td:nth-child(8) > a').each(function () {
    $(this).addClass('btn btn-default btn-block btn-sm');
    $(this).text("View");
    if (settings.viewfeedbackblank) {
      $(this).attr('target', '_blank');
      $('.claim').tooltip({
        title: "Press Ctrl to open report in the same tab",
      });
    }
  });

  $('table.table > tbody > tr > td:nth-child(9) > a').each(function () {
    $(this).addClass('btn btn-primary btn-block btn-sm claim');

    var text = $(this).text().replace(" report", "").trim();

    if (text == "Claim") {
      $(this).html(text + " <i class=\"fa fa-external-link\"></i>");
      if (settings.viewfeedbackblank) {
        $(this).attr('target', '_blank');
      }
    } else {
      $(this).html(text);
    }
  });

  //Claim link click
  $('a.claim').click(function (event) {
    $(this).addClass('clicked');
    $(this).text('Claimed!');
    if (settings.viewfeedbackblank) {
      event.preventDefault();
      if (event.ctrlKey) {
        window.open($(this).attr('href'), "_top");
      } else {
        window.open($(this).attr('href'), "_blank");
      }
    }
  });

  // ==== ? =====
  $('.form-control').each(function () {
    $(this).addClass('input-sm');
    $(this).css('width', 'auto').css('max-width', '140px')
  });
  $('form > button').addClass('btn-sm');

  table.find('tbody > tr').each(function () {
    var status = $(this).find('td:nth-child(5)').text();
    var claimedBy = $(this).find('td:nth-child(3)').text();
    var repliedBy = $(this).find('td:nth-child(7)').text();
    if (!(status == 'New' || (claimedBy == 'Nobody' && status != 'Finished') || repliedBy == 'User')) {
      $(this).find('td').css('color', '#555');
    }
  });

  var columns_html = '<div><label style="margin-right: 5px;">Column visibility</label><div class="btn-group btn-group-xs" id="toggle_column">';
  $('table.table th').each(function (index, el) {
    var text = $.trim($(el).text());
    if (text) {
      columns_html += '<button type="button" class="btn btn-primary toggle-vis" data-column="' + index + '">' + text + '</button>'
    }
  });
  columns_html += '</div></div>';

  table.before(columns_html);
  table.css('width', '100%');

  // ===== Manipulation =====
  $('table.table > tbody > tr > td:nth-child(6)').each(function () {
    var text = $(this).text();
    if (text.split(" ").length != 4) {
      text = text.replace("Today,", moment().format("DD MMM"));
      text = moment(text, "DD MMM HH:mm").format("DD MMM YYYY HH:mm");
      $(this).text(text);
    }
  });
  $.fn.dataTable.moment("DD MMM YYYY HH:mm");
  var datatable = table.DataTable({
    paging: false,
    stateSave: true,
    //TEMP BUGFIX
    /*
    fixedHeader: {
      header: true,
      footer: true
    },
    */
    order: [],
    columnDefs: [{
      "targets": 'no-sort',
      "orderable": false,
    }],
    language: {
      search: "<i class='fa fa-fw fa-search'></i>"
    }
  });

  $('#toggle_column').find('button').each(function () {
    var column = datatable.column($(this).attr('data-column'));
    if (!column.visible()) {
      $(this).removeClass('btn-primary').addClass('btn-danger')
    }
  });

  $('button.toggle-vis').on('click', function (e) {
    e.preventDefault();
    var column = datatable.column($(this).attr('data-column'));
    column.visible(!column.visible());

    if (!column.visible()) {
      $(this).removeClass('btn-primary').addClass('btn-danger')
    } else {
      $(this).addClass('btn-primary').removeClass('btn-danger')
    }
  });

  // ===== After All =====
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
    if (settings.viewfeedbackblank) {
      $('.claim').tooltip({
        title: "Press Ctrl to open report in the same tab",
      });
    }

    var page = $('div.row').find('li.active').text();
    if (!page) {
      page = 1
    }
    $(document).prop('title', 'Page ' + page + ' - Feedbacks | TruckersMP');
    $("#loading-spinner").hide();
  });
}