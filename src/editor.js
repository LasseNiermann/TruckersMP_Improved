var lastinsertpos;

function addReason (reason_id, reason_val) {
    // easyMDE
    if (window.editors && window.editors[reason_id]) {
        var doc = window.editors[reason_id].codemirror.doc;
        doc.replaceRange((lastinsertpos == doc.getCursor() ? "\n\n" : "") + reason_val, doc.getCursor());
        lastinsertpos = doc.getCursor();
        doc.cm.focus();
    }
    // other input
    else {
        if ($('#' + reason_id).val() == "") {
            $('#' + reason_id).val(reason_val);
            lastinsertpos = $('#' + reason_id).prop('selectionStart');
        } else {
            var pos = $('#' + reason_id).prop('selectionStart');
            $('#' + reason_id)[0].setRangeText((lastinsertpos === pos ? "\n\n" : "") + reason_val, pos, pos, 'end');
            lastinsertpos = $('#' + reason_id).prop('selectionStart');
        }
        $('#' + reason_id).focus();
    }
}

function setReason (reason_id, reason_val) {
    // easyMDE
    if (window.editors && window.editors[reason_id]) {
        window.editors[reason_id].value(reason_val);
    }
    // other input
    else {
        $('#' + reason_id).val(reason_val);
    }
}

function clearReason (reason_id) {
    // easyMDE
    if (window.editors && window.editors[reason_id]) {
        window.editors[reason_id].value('');
    }
    // other input
    else {
        $('form').find('textarea[name=' + reason_id + ']').val('');
    }
}

window.addEventListener('message', function(event) {
    if (event && event.data && event.data.funct) {
        switch (event.data.funct) {
            case 'addReason':
                addReason(event.data.reason_id, event.data.reason_val);
                break;
            case 'setReason':
                setReason(event.data.reason_id, event.data.reason_val);
                break;
            case 'clearReason':
                clearReason(event.data.reason_id);
                break;
        }
    }
});