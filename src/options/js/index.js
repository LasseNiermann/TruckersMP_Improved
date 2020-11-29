let inject_init = () => { // eslint-disable-line no-unused-vars
  // Saves options to chrome.storage
  function save_options(with_message = true, data = false) {
    var steamapi_group = $('#steamapi_group');
    steamapi_group.removeClass('has-error');

    if (!data) {
      data = {};
      data.steamapi = $('#steamapi').val();
      data.settings = {
        local_storage: $('#local_storage').is(':checked'),
        img_previews: $('#img_previews').is(':checked'),
        wide: $('#wide').is(':checked'),
        colouredstatus: $('#colouredstatus').is(':checked'),
        separator: $('#separator').val(),
        own_comment: $('#own_comment').val().trim(),
        autoinsertsep: $('#autoinsertsep').is(':checked'),
        localisedcomment: $('#localisedcomment').is(':checked'),
        enablelinknotifications: $('#enablelinknotifications').is(':checked'),
        viewappealblank: $('#viewappealblank').is(':checked'),
        viewreportblank: $('#viewreportblank').is(':checked'),
        enablebanlength: $('#enablebanlength').is(':checked'),
        defaultratings: $('#defaultratings').is(':checked'),
        enablefeedbackimprovement: $('#enablefeedbackimprovement').is(':checked'),
        viewfeedbackblank: $('#viewfeedbackblank').is(':checked')
      };

      data.OwnReasons = {
        prefixes: getReasons("prefixes"),
        reasons: getReasons("reasons"),
        postfixes: getReasons("postfixes"),
        accepts: getReasons("accepts"),
        declines: getReasons("declines"),
        declinesPositive: getReasons("declinesPositive"),
        declinesNegative: getReasons("declinesNegative"),
        comments: getReasons("comments"),
        reportsall: getReasons("reportsall"),
        declinesAppeals: getReasons("declinesAppeals"),
        commentsAppeals: getReasons("commentsAppeals"),
        acceptsAppeals: getReasons("acceptsAppeals"),
        modifyAppeals: getReasons("modifyAppeals"),
        appealsall: getReasons("appealsall"),
        feedbackComments: getReasons("feedbackComments"),
        all: getReasons("all")
      };

      data.OwnDates = {
        white: $('#white').val().trim(),
        yellow: $('#yellow').val().trim(),
        red: $('#red').val().trim(),
        other: $('#other').val().trim()
      }
    }

    var new_data = {
      steamapi: data.steamapi,
      OwnReasons: data.OwnReasons,
      OwnDates: data.OwnDates,
      settings: data.settings
    };

    // preserve skipped GitHub release
    chrome.storage.local.get((res) => {
      new_data.gitskip = res.gitskip;
    })

    var steamapi_error = false;
    if (data.steamapi && data.steamapi !== 'none') {
      alert(data.steamapi)
      if (data.steamapi.length !== 32) {
        steamapi_group.addClass('has-error');
        $('#steamapi_body').addClass('bg-danger');
        setTimeout(function () {
          $('#steamapi_body').removeClass('bg-danger');
        }, 2000);

        steamapi_error = true
      }
    } else {
      new_data.steamapi = null
    }

    if (steamapi_error) {
      return;
    }

    saveSettings(chrome.storage.local, new_data, with_message);

    function getReasons(reason) {
      var obj = [];
      $.each($('#' + reason).find(".option-section"), function (key, div) {
        var arr;
        if ($(div).data("columns") == 2) {
          arr = {}
        } else {
          arr = [];
        }
        $.each($(div).find(".sortable-div"), function (key, field) {
          var inputs = $(field).find("textarea");
          if (inputs.length == 2) {
            arr[$(inputs[0]).val()] = $(inputs[1]).val();
          } else {
            arr.push($(inputs[0]).val());
          }
        });
        obj[key] = arr;
      });
      return obj;
    }
  }

  function versionCompare(left, right) {
    if (typeof left + typeof right != 'stringstring')
      return false;

    var a = left.split('.'),
      b = right.split('.'),
      i = 0,
      len = Math.max(a.length, b.length);

    for (; i < len; i++) {
      if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
        return 1;
      } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
        return -1;
      }
    }

    return 0;
  }

  function restore_options() {
    $('#ext_name').html('<i class="fas fa-truck" aria-hidden="true"></i> <strong>TMP Improved</strong> ' + chrome.runtime.getManifest().version);

    function set_options(items) {
      try {
        console.log('TMP Improved (options/js/index.js)', items);
        $('#steamapi').val(items.steamapi);

        items.OwnReasons.prefixes.forEach(function (val) {
          var parent = createSection($('#prefixes'), 1);
          val.forEach(function (text) {
            createField(parent, text);
          });
        });
        items.OwnReasons.reasons.forEach(function (val) {
          var parent = createSection($('#reasons'), 1);
          val.forEach(function (text) {
            createField(parent, text);
          });
        });
        items.OwnReasons.postfixes.forEach(function (val) {
          var parent = createSection($('#postfixes'), 1);
          val.forEach(function (text) {
            createField(parent, text);
          });
        });

        items.OwnReasons.accepts.forEach(function (val) {
          var parent = createSection($('#accepts'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.declines.forEach(function (val) {
          var parent = createSection($('#declines'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.declinesPositive.forEach(function (val) {
          var parent = createSection($('#declinesPositive'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.declinesNegative.forEach(function (val) {
          var parent = createSection($('#declinesNegative'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.comments.forEach(function (val) {
          var parent = createSection($('#comments'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.reportsall.forEach(function (val) {
          var parent = createSection($('#reportsall'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });

        items.OwnReasons.declinesAppeals.forEach(function (val) {
          var parent = createSection($('#declinesAppeals'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.acceptsAppeals.forEach(function (val) {
          var parent = createSection($('#acceptsAppeals'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.modifyAppeals.forEach(function (val) {
          var parent = createSection($('#modifyAppeals'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.commentsAppeals.forEach(function (val) {
          var parent = createSection($('#commentsAppeals'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });
        items.OwnReasons.appealsall.forEach(function (val) {
          var parent = createSection($('#appealsall'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });

        items.OwnReasons.feedbackComments.forEach(function (val) {
          var parent = createSection($('#feedbackComments'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });

        items.OwnReasons.all.forEach(function (val) {
          var parent = createSection($('#all'), 2);
          $.each(val, function (key, text) {
            createField(parent, key, text);
          });
        });

        $('#white').val(items.OwnDates.white);
        $('#yellow').val(items.OwnDates.yellow);
        $('#red').val(items.OwnDates.red);
        $('#other').val(items.OwnDates.other);

        $('#separator').val(items.settings.separator);
        $('#own_comment').val(items.settings.own_comment);

        var local_storage = $('#local_storage');
        local_storage.prop("checked", items.settings.local_storage);
        if (!syncAllowed) {
          local_storage.prop("disabled", true);
          $('.storage-settings').addClass('panel-default').removeClass('panel-success');
        }

        $('#img_previews').prop("checked", items.settings.img_previews);
        $('#wide').prop("checked", items.settings.wide);
        $('#colouredstatus').prop("checked", items.settings.colouredstatus);
        $('#autoinsertsep').prop("checked", items.settings.autoinsertsep);
        $('#localisedcomment').prop("checked", items.settings.localisedcomment);
        $('#enablelinknotifications').prop("checked", items.settings.enablelinknotifications);
        $('#viewappealblank').prop("checked", items.settings.viewappealblank);
        $('#viewreportblank').prop("checked", items.settings.viewreportblank);
        $('#enablebanlength').prop("checked", items.settings.enablebanlength);
        $('#defaultratings').prop("checked", items.settings.defaultratings);
        $('#enablefeedbackimprovement').prop("checked", items.settings.enablefeedbackimprovement);
        $('#viewfeedbackblank').prop("checked", items.settings.viewfeedbackblank);
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings(set_options);
  }

  var import_file = $('#import_file');

  function import_data(event) {
    if (confirm("BEWARE! All of your data will be lost after importing!\nDo you really want to do that?")) {
      var files = event.target.files;
      var reader = new FileReader();
      reader.onload = _imp;
      reader.readAsText(files[0]);
    } else {
      import_file.value = '';
    }
  }

  function _imp() {
    var _data = JSON.parse(this.result[0] == '"' ? this.result.slice(1, -1).replaceAll('\\\\', '\\').replaceAll('\\"', '"').replaceAll("Â§", "§").replaceAll("ยง", "§") : this.result);

    var compare = versionCompare(_data.last_version, chrome.runtime.getManifest().version);
    if (compare === 1) {
      alert('Wait a second! JSON file version (' + _data.last_version + ') is newer that extension version (' + chrome.runtime.getManifest().version + ').\nPlease update extension before importing!');
    } else {
      if (compare === -1) {
        if (!confirm('Wait a second! JSON file version (' + _data.last_version + ') is older that extension version (' + chrome.runtime.getManifest().version + ').\nData can be corrupted.\nDid you really want to import data?')) {
          import_file.value = '';
          return null;
        }
      }
      save_options(false, _data);
      alert("Imported and saved! Nice job!\nYou can review new settings right now.");
      $(".option-section").remove();
      restore_options();
      $('#importExportModal').modal('hide');
    }
  }

  function createField(parent, input1 = "", input2 = "") {
    var obj = "<div class='sortable-div panel-body'>";

    if (parent.parent().data("columns") == 2) {
      obj += "<textarea style='width: 32%' id='input1'/><textarea style='width: 60%' id='input2'/>";
    } else {
      obj += "<textarea style='width: 93%;' id='input1'/>";
    }
    obj += "<button type='button' class='btn btn-danger delete-field'>X</button></div>";
    var $obj = $(obj).hide()

    $obj.insertBefore(parent);
    $obj.slideDown('fast');

    $("#input1").val(input1).removeAttr("id");
    $("#input2").val(input2).removeAttr("id");
  }

  function createSection(parent, numbercolumns) {
    var $new = $(`
     <div class='option-section panel panel-default' data-columns="` + numbercolumns + `">
        <div class='section-buttons panel-footer'>
          <button class='create-field btn btn-success'>Create field</button><button class='delete-section btn btn-danger'>Delete section</button>
        </div>
      </div>
    `).hide()

    parent.append($new);
    $new.slideDown('fast');
    return $(parent).find("div:last");
  }

  import_file.on('change', import_data);

  $('textarea').each(function () {
    this.setAttribute('style', 'overflow-y:hidden;');
  }).on('focus', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  }).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  $('#save').on('click', function (event) {
    event.preventDefault();
    save_options();
  });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  $('.version_detected').on('click', function (event) {
    event.preventDefault();
    window.open(chrome.runtime.getURL('src/options/new_version.html'), "_blank");
  });

  $('#steamapi').on('focus', function () {
    if ($(this).val() === 'null') {
      $(this).val('');
    }
    $(this).select();
  }).on('keydown', function () {
    if ($(this).val().length === 32 || $(this).val().length === 0) {
      $(this).parent().removeClass('has-error')
    } else {
      $(this).parent().addClass('has-error')
    }
  });

  $('#export').on('click', function (event) {
    event.preventDefault();
    save_options(false);
    loadSettings(function (items) {
      var data = JSON.stringify(items, null, 4);
      var vLink = document.createElement('a');
      var vBlob = new Blob([data], {
        type: 'octet/stream'
      });
      var vName = 'truckersmp_improved_' + Date.now() + '.json';
      var vUrl = window.URL.createObjectURL(vBlob);

      vLink.setAttribute('href', vUrl);
      vLink.setAttribute('download', vName);
      vLink.style.display = "none";

      document.body.appendChild(vLink);
      vLink.click();
      document.body.removeChild(vLink);
    });
  });

  $('#import').on('click', function (event) {
    event.preventDefault();
    import_file.click();
  });

  var body = $("body");
  body.on("click", ".delete-field", function (event) {
    event.preventDefault();

    if ($(this).siblings('textarea').val().length !== 0) {
      if (!confirm('Are you sure you want to delete a non-empty field?')) return;
    }

    var $target = $(this).parent()
    $target.slideUp('fast', function () {
      $target.remove();
    })
  });

  body.on("click", ".create-field", function (event) {
    event.preventDefault();
    if ($(this).parent().data("columns") == 2) {
      createField($(this).parent(), "", "");
    } else {
      createField($(this).parent());
    }
  });

  body.on("click", ".delete-section", function (event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete the WHOLE section?")) {
      var $target = $(this).parent().parent()
      $target.slideUp('fast', function () {
        $target.remove();
      })
    }
  });

  $(".create-section").click(function (event) {
    event.preventDefault();
    var div = $(this).parent().parent().find("div > div:first");
    var section = createSection(div, div.data("columns"));
    createField(section);
  });

  $('button#loadData').on('click', function () {
    if (confirm('Do you really want to rewrite your settings with Online data?')) {
      loadSettingsFromFirebase()
    }
  })

  if (window.location.protocol === 'moz-extension:') {
    $('.storage-settings').hide()
  }

  restore_options();
}

$(document).ready(function () {
  $('div.content-body').fadeIn('slow')
  $('div.loadingoverlay').fadeOut('slow')
})

$('a[data-toggle=collapse]').on('click', function () {
  var scrollTop = ($(this).offset().top - 80) + 'px'
  $('html, body').animate({
    scrollTop: scrollTop
  }, 'slow')
  return this;
})