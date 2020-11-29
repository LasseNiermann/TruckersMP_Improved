let inject_init = () => { // eslint-disable-line no-unused-vars
  try {
    var table = $('table.table');

    // ===== Init bootstrapping =====
    table.addClass('table-condensed table-hover');

    var colsHead = $('table.table th');
      colsBody = $('table.table > tbody > tr:nth-child(1) > td');

    $(colsHead).each(function (idx, item) {
      if ($(item).text().length == 8) // 8 prevents sorting by Position and Username
        $(item).addClass('no-sort');
    });

    var colsHeadTr = $('table.table tr');
    if (colsHead.length < colsBody.length) {
      for (var i = 0; i < colsBody.length - colsHead.length; i++)
        $(colsHeadTr).append('<th class="no-sort"></th>');
    }

    // ==== ? =====
    $('.form-control').each(function () {
      $(this).css('width', 'auto').css('max-width', '190px')
    });
    $('form > button').addClass('btn-sm');

    var columns_html = '<br/><div><label style="margin-right: 5px;">Column visibility</label><div class="btn-group btn-group-xs" id="toggle_column">';
    colsHead.each(function (index, el) {
      var text = $.trim($(el).text());
      if (text) {
        columns_html += '<button type="button" class="btn btn-primary toggle-vis" data-column="' + index + '">' + text + '</button>'
      }
    });
    columns_html += '</div></div>';

    table.before(columns_html);
    table.css('width', '100%');

    var datatable = table.DataTable({
      paging: false,
      stateSave: false,
      order: [],
      columnDefs: [{
        "targets": 'no-sort',
        "orderable": false,
      }],
      language: {
        search: "<i class='fas fa-fw fa-search'></i>"
      }
    });

    datatable.on('order.dt', function () {
      datatable.column(0, {order:'applied'}).nodes().each(function (cell, i) {
        cell.innerHTML = i+1;
      });
    }).draw();

  } catch (e) {
    console.error('TMP Improved (inject/ban-activity)', e);
  }

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
    $('#loading-spinner').hide()
  });
}