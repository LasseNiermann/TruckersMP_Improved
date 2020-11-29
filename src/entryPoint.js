var settings, storage, steamapi, OwnReasons, OwnDates, last_version, date_buttons; // eslint-disable-line no-unused-vars
var version = chrome.runtime.getManifest().version;
var syncAllowed = false;

console.log('TMP Improved (entryPoint)');
/*if (window.location.protocol === 'chrome-extension:' && window.location.pathname !== '/src/bg/background.html') {
  var database = firebase.database();
}*/

storage = chrome.storage.local;

var default_OwnReasons = {
  prefixes: [
    ["Intentional"]
  ],
  reasons: [
    ["Ramming", "Blocking", "Incorrect Way", "Inappropriate Overtaking", "Reckless Driving", "Insulting", "Hacking"],
    ["Ban Evading", "Spamming chat", "CB Abuse", "Impersonating staff", "Sharing unsafe content"],
    ["Change your Ingame Tag and appeal", "Change your License Plate and appeal", "Excessive Save Editing"]
  ],
  postfixes: [
    ["// 1 month due to history", "// Permanent due to history"],
    ["Permanent per GMM (§2.9)", "Permanent per §2.1", "Permanent per §1.2"]
  ],
  accepts: [{}],
  declines: [{
    "BanEvading no match": "Unfortunately, we were unable to unambiguously determine whether the reported player is really ban evading. In order to prevent false punishments, I will not take action.",
    "Double report": "You have created multiple identical reports by accident. I will decline this report, the first report will be dealt with as usual."
  }],
  declinesNegative: [{
    "No evidence": "Unfortunately, the evidence you linked seems to be unavailable. Without any evidence I cannot take action. Please feel free to create another report with working evidence.",
    "Only screenshot": "The offence you reported requires a video as evidence in order for us to be able to take any action. You can use software like OBS or NVIDIA Share to record your gameplay. See the forums for more information."
  }],
  declinesPositive: [{
    "Already banned for situation": "The player you reported has already been reported for the situation from your evidence. The ban has however run out by now and they will not be banned again."
  }],
  comments: [{
    "BanEvading lookup": "Link to lookup: []()"
  }],
  reportsall: [{}],
  declinesAppeals: [{}],
  acceptsAppeals: [{
    "@BANBYMISTAKE": "The ban will be marked with \"@BANBYMISTAKE\" and will be removed"
  }],
  commentsAppeals: [{
    "Change your tag": "Change your tag and prove with a screenshot that it was changed"
  }],
  modifyAppeals: [{
    "Ban decreased": "Due to the lack of violations in your history I shorten your ban period. However be careful in the future and follow the rules of MP.",
    "Ban increased": "Due to newly emerged circumstances the period of the ban increased."
  }],
  appealsall: [{}],
  feedbackComments: [{
    "Closing feedback on user's request.": "Closing feedback on user's request."
  }],
  all: [{}]
};

var default_OwnDates = {
  white: "1,d,+1 day; 2,d,+2 days; 3,d,+3 days",
  yellow: "1,w,+1 week; 2,w,+2 weeks",
  red: "1,M,+1 month; 30,d,+30 days",
  other: "current_utc"
};

var default_settings = {
  local_storage: true,
  img_previews: true,
  wide: true,
  colouredstatus: true,
  autoinsertsep: true,
  localisedcomment: true,
  enablelinknotifications: true,
  viewappealblank: true,
  viewreportblank: true,
  enablebanlength: true,
  defaultratings: false,
  enablefeedbackimprovement: true,
  viewfeedbackblank: true,
  separator: ','
};

function checkDoubleSlash(input) { // eslint-disable-line no-unused-vars
  if (!input) {
    return;
  }
  var val = input.value,
    valLength = val.length;
  if (valLength > 1) {
    var strPos = 0;
    var br = ((input.selectionStart || input.selectionStart == '0') ?
      "ff" : (document.selection ? "ie" : false));
    if (br == "ie") {
      input.focus();
      var range = document.selection.createRange();
      range.moveStart('character', -input.value.length);
      strPos = range.text.length;
    } else if (br == "ff") {
      strPos = input.selectionStart;
    }
    if (strPos > 1) {
      var result = false;
      if (strPos > 2)
        result = val.substring(strPos - 3, strPos) == '// ';
      if (!result)
        result = val.substring(strPos - 2, strPos) == '//';
      return result;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function insertAtCaret(input, text, firstSpace) { // eslint-disable-line no-unused-vars
  if (!input) {
    return;
  }

  var strPos = 0;
  var br = ((input.selectionStart || input.selectionStart == '0') ?
    "ff" : (document.selection ? "ie" : false));
  if (br == "ie") {
    input.focus();
    var range = document.selection.createRange();
    range.moveStart('character', -input.value.length);
    strPos = range.text.length;
  } else if (br == "ff") {
    strPos = input.selectionStart;
  }

  var front = (input.value).substring(0, strPos),
    back = (input.value).substring(strPos, input.value.length),
    textVal = text;

  if (firstSpace) {
    if (front.length > 0) {
      var flOld = front.length;
      front = front.replace(/\s+$/, '');
      strPos = strPos - (flOld - front.length);
    }
    textVal = ' ' + text;
  }

  input.value = front + textVal + back;
  strPos = strPos + textVal.length;
  if (br == "ie") {
    input.focus();
    var ieRange = document.selection.createRange();
    ieRange.moveStart('character', -input.value.length);
    ieRange.moveStart('character', strPos);
    ieRange.moveEnd('character', 0);
    ieRange.select();
  } else if (br == "ff") {
    input.selectionStart = strPos;
    input.selectionEnd = strPos;
    input.focus();
  }
}

$('body > div.wrapper > div.breadcrumbs > div > h1').append(' <span class="badge" data-toggle="tooltip" title="TruckersMP Improved">' + version + '</span> <a href="#" id="go_to_options"><i class="fas fa-cog data-toggle="tooltip" title="Script settings"></i></a> <a href="#" id="version_detected"><i class="fas fa-question data-toggle="tooltip" title="Changelog"></i></a>  <i class="fas fa-spinner fa-spin" id="loading-spinner" data-toggle="tooltip" title="Loading...">');

$(function () {
  $('#go_to_options').on('click', function (event) {
    event.preventDefault();
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('src/options/index.html'), "_blank");
    }
  });

  $('#version_detected').on('click', function (event) {
    event.preventDefault();
    window.open(chrome.runtime.getURL('src/options/new_version.html'), "_blank");
  });
});

function parseItems(object) {
  var toObjects = ["accepts", "declines", "declinesPositive", "declinesNegative", "comments", "reportsall", "declinesAppeals", "commentsAppeals", "acceptsAppeals", "modifyAppeals", "appealsall", "feedbackComments", "all"];
  var ret = {};
  $.each(object, function (key, val) {
    if (typeof val == "string") {
      var arr = val.split("|");
      var global_tab = [];
      arr.forEach(function (val) {
        var tab;

        if (toObjects.indexOf(key) == -1) {
          tab = [];
          val.split(";").forEach(function (v) {
            tab.push(v.trim());
          });
        } else {
          tab = {};
          val.split(";").forEach(function (v) {
            tab[v.trim()] = v.trim();
          });
        }

        global_tab.push(tab);
      });
      ret[key] = global_tab;
    } else {
      ret[key] = val;
    }
  });
  return ret;
}

function loadSettings(callBack) {
  if (callBack) {
    storage.get({
      steamapi: null,
      OwnReasons: default_OwnReasons,
      OwnDates: default_OwnDates,
      last_version: version,
      settings: default_settings,
      gitskip: undefined
    }, function (items) {
      items.OwnReasons = Object.assign(default_OwnReasons, items.OwnReasons); // Firefox applies default values only shallow
      items.settings = Object.assign(default_settings, items.settings);

      items.OwnReasons = parseItems(items.OwnReasons);
      if (syncAllowed && items.settings.local_storage) {
        chrome.storage.local.get(items, function (items) {
          callBack(items);
        });
      } else {
        callBack(items);
      }
    });
  }
}

/*function loadSettingsFromFirebase() { // eslint-disable-line no-unused-vars
  if (isSignedIn) { // eslint-disable-line no-undef
    database.ref('data/' + firebase.auth().currentUser.uid).once('value')
      .then(function (snapshot) {
        var json = JSON.parse(snapshot.val());
        console.log('TMP Improved (entryPoint)', json);

        if (json === null) {
          alert('Online storage is empty for your account :(')
          return
        }

        storage.set(json, function () {
          if (chrome.runtime.lastError) {
            alert('Save settings ERROR!\n\t\n\t' + chrome.runtime.lastError.message + '\n\t\n\tFor save large data you can use "Local Storage".');
          } else {
            window.location.reload()
          }
        });
      })
  } else {
    alert('Stop! You are not logged in!')
  }
}*/

function saveSettings(storage, data, with_message) { // eslint-disable-line no-unused-vars
  data.OwnReasons = parseItems(data.OwnReasons);
  storage.set(data, function () {
    if (chrome.runtime.lastError) {
      alert('Save settings ERROR!\n\t\n\t' + chrome.runtime.lastError.message + '\n\t\n\tFor save large data you can use "Local Storage".');
    } else {
      if (with_message) {
        alert('Settings are saved! Please reload all TruckersMP tabs in order to fetch new settings.');
      }
    }
  });

  /*if (isSignedIn) { // eslint-disable-line no-undef
    database.ref('data/' + firebase.auth().currentUser.uid).set(JSON.stringify(data));
  }*/
}

function val_init() {
  return new Promise(function (resolve) {
    loadSettings(resolve);
  });
}

function construct_dates(OwnDates) {
  var html = '<div id="ownreasons_buttons">';

  html += each_type('default', OwnDates.white.split(';'));
  html += each_type('warning', OwnDates.yellow.split(';'));
  html += each_type('danger', OwnDates.red.split(';'));
  html += each_type('other', OwnDates.other.split(';'));

  html += '</div>';
  return html;

  function each_type(type, buttons) {
    var snippet = '<div class="btn-group" role="group">';
    buttons.forEach(function (item) {
      item = item.split(',');
      var number = item[0].trim();
      var key = (item[1]) ? item[1].trim() : undefined;
      var title = (item[2]) ? item[2].trim() : ('+' + number);

      if (type == 'other') {
        if (number == 'current_utc') {
          snippet += '<button type="button" class="btn btn-link plusdate" data-number="clear" data-plus="clear">Current UTC time</button>'
        }
      } else {
        snippet += '<button type="button" class="btn btn-' + type + ' plusdate" data-number="' + number + '" data-key="' + key + '">' + title + '</button>';
      }
    });
    snippet += '</div>   ';
    return snippet;
  }
}

function version_checker(last_version) {
  if (last_version != chrome.runtime.getManifest().version) {
    window.open(chrome.runtime.getURL('src/options/new_version.html'));
    storage.set({
      last_version: chrome.runtime.getManifest().version
    });
    return false;
  } else {
    return true;
  }
}

String.prototype.contains = function (needle) {
  for (var i = needle.length - 1; i >= 0; i--) {
    if (this.includes(needle[i])) {
      return true;
    }
  }
};

function urlShorter(link) {
  let spinner = $("#loading-spinner");
  spinner.show();
  chrome.runtime.sendMessage({"action": "url_shortener", data: {
    "url": encodeURIComponent(link),
    "private": true
  }}, (response) => {
    if (!response || response.error) {
      console.error("Unable to shorten URL - falling back instead.", response.error);
      copyToClipboard(link);
    } else {
      copyToClipboard(response.href);
      console.log(`Copied to clipboard: ${response.href}`);
    }
    spinner.hide();
  });
}

$('.autolink a').each(function () {
  $(this).contents().unwrap()
})

$('.autolink').removeClass('autolink').addClass('autolinkage')

$(".autolinkage").each(function () {
  $(this).html($(this).html().replace(/((http|https):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank" rel="noopener" class="newlinks">$1</a> '));
});


function content_links() { // eslint-disable-line no-unused-vars
  $('a.newlinks').each(function () {
    var sub = $(this).text();

    if (sub.length > 60) {
      $(this).text(sub.substring(0, 40) + '...');
    }

    if (sub.contains(["youtube.com", "youtu.be"]) && !sub.contains(["img.youtube.com"])) {
      $(this).append('<a data-link="' + sub + '" href="#" class="youtube">  <i class="fab fa-youtube fa-fw" data-toggle="tooltip" title="Watch this video in modal"></i></a>');
    } else if (sub.contains(["clips.twitch.tv", "medal.tv/clips", "dailymotion.com", "vimeo.com", "twitch.tv/videos", "streamable.com", "twitch.tv", "bilibili.com"])) {
      var clipid, embedlink;
      if (sub.contains(["clips.twitch.tv"])) {
        clipid = sub.match(/^.*clips\.twitch\.tv\/(.*)/)[1];
        embedlink = "https://clips.twitch.tv/embed?clip=" + clipid + "&autoplay=false&parent=truckersmp.com";
      } else if (sub.contains(["medal.tv/clips"])) {
        clipid = sub.match(/^.*medal\.tv\/clips\/(.*)/)[1];
        embedlink = "https://medal.tv/clip/" + clipid + "?autoplay=0&muted=0&loop=0";
      } else if (sub.contains(["dailymotion.com"])) {
        clipid = sub.match(/^.*dailymotion\.com\/video\/(.*)/)[1];
        embedlink = "https://www.dailymotion.com/embed/video/" + clipid;
	  } else if (sub.contains(["https://www.bilibili.com"])) {
        clipid = sub.match(/^.*bilibili\.com\/video\/(.*)/)[1];
        embedlink = "https://player.bilibili.com/player.html?aid=753848162&bvid=" + clipid.replace("/","") + "&page=1";
      } else if (sub.contains(["vimeo.com"])) {
        clipid = sub.match(/^.*vimeo\.com\/(.*)/)[1];
        embedlink = "https://player.vimeo.com/video/" + clipid;
      } else if (sub.contains(["streamable.com"])) {
        clipid = sub.match(/^.*streamable\.com\/(.*)/)[1];
        embedlink = "https://streamable.com/s/" + clipid + '/truckersmp'
      } else if (sub.contains(["twitch.tv/videos"])) {
        var result = sub.match(/^.*twitch.tv\/videos\/(.*)/)[1];
        var vidinfos = result.split("?t=");
        embedlink = "https://player.twitch.tv/?autoplay=false&video=" + vidinfos[0] + "&parent=truckersmp.com";
        if (vidinfos.length == 2) {
          embedlink += "&t=" + vidinfos[1]
        }
      } else if (sub.contains(["twitch.tv"])) {
        clipid =  sub.match(/^.*twitch.tv\/.*\/clip\/(.*)/);
        if (clipid) {
          embedlink = `https://clips.twitch.tv/embed?clip=${clipid[1]}&autoplay=false&parent=truckersmp.com`;
        }
      }
      $(this).append('<a href="' + embedlink + '" class="video"><i class="fas fa-play-circle fa-fw" data-toggle="tooltip" title="Watch this video in modal"></i></a>');
    }

    $(this).append(`<a href="#" class="jmdev_ca" data-link="${sub}"><i class="fas fa-copy fa-fw" data-toggle="tooltip" title="Shorted + to clipboard"></i></a>`);
    $(this).html('<nobr>' + $(this).html() + '</nobr>').removeClass('newlinks');
  });

  if (settings.img_previews !== false) {
    $('div.comment .autolinkage > a').each(function () {
      var sub = $(this).attr('href');

      if ((sub.match(/\.(jpeg|jpg|gif|png)$/) !== null || sub.contains(['images.akamai.', 'img.youtube.com']))) {
        $('<img src="' + sub + '" class="img-responsive img-thumbnail" alt="' + sub + '"><br>').insertBefore($(this));
      }
    });
  }


  $('a.jmdev_ca').on('click', jmdevHandler);
}

function jmdevHandler(event) {
  event.preventDefault();
  //var spinner = $("#loading-spinner");
  //spinner.show();
  var link = String($(this).data("link"));
  var length = link.length;

  if (length < 30) {
    copyToClipboard($(this).data("link"));
    if (settings.enablelinknotifications) {
      chrome.runtime.sendMessage({
        msg: "This URL is short enough. Check your clipboard!",
        contextMessage: moment().format("YYYY-MM-DD HH:mm:ss"),
        timeout: 3000
      });
    }
    //spinner.hide();
  } else {
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      copyToClipboard('https://youtu.be/' + getYouTubeIdFromUrl(link) + checkTimestamps(link));
      if (settings.enablelinknotifications) {
        chrome.runtime.sendMessage({
          msg: "URL just being shorted! Check your clipboard!",
          contextMessage: moment().format("YYYY-MM-DD HH:mm:ss")
        });
      }
    } else {
      urlShorter(link);
    }
  }
  $(this).children().first().removeClass("fa-copy").addClass("fa-check"); //displaying a check mark after copying shortened or not shortened link
  setTimeout(() => {
    $(this).children().first().removeClass("fa-check").addClass("fa-copy");
  },2000);
}


function getYouTubeIdFromUrl(youtubeUrl) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = youtubeUrl.match(regExp);
  console.log('TMP Improved (entryPoint)', youtubeUrl);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return false;
  }
}

function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i, n, v, nv;

  if (query === url || query === "") {
    return;
  }

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=");
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) {
      parms[n] = [];
    }

    parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
}

function checkTimestamps(url) {
  var params = parseURLParams(url);
  if (params) {
    if (params.t) {
      var start = params.t[0];
      if (start.includes('s')) {
        var hrs, min, sec;

        var spl = start.split('h');
        if (spl.length == 2) {
          hrs = Number(spl[0]);
          spl = spl[1];
        } else {
          hrs = 0;
          spl = spl[0];
        }
        spl = spl.split('m');
        if (spl.length == 2) {
          min = Number(spl[0]);
          spl = spl[1];
        } else {
          min = 0;
          spl = spl[0];
        }
        spl = spl.split('s');
        sec = Number(spl[0]);

        hrs = hrs * 3600;
        min = min * 60;
        start = hrs + min + sec;
      }
    } else if (params['time_continue']) {
      start = params['time_continue'][0];
    } else {
      start = params[0];
    }
    if (start) {
      return '?t=' + start + 's';
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function copyToClipboard(text) {
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
}

function escapeHTML(s) { // eslint-disable-line no-unused-vars
  return s.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

let day = 60 * 60 * 24 * 1000;
let fixDate = function (date) {
  let timezone = $('body > div.wrapper > div.header > div.container > div > ul > li:nth-child(3) > a').text().split(':')[1].trim(); //get current timezone setting from page header
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let d = moment.tz(timezone);
  date = date.replace('Today,', d.format("DD MMM") /*d.date() + ' ' + months[d.getMonth()]*/);

  let yesterday = d.clone().subtract(1,'d');
  date = date.replace('Yesterday,', yesterday.format("DD MMM") /*yesterday.getDate() + ' ' + months[d.getMonth()]*/);

  let tomorrow = d.clone().add(1,'d');
  date = date.replace('Tomorrow,', tomorrow.format("DD MMM") /*tomorrow.getDate() + ' ' + months[d.getMonth()]*/);

  if (!date.match(/20[0-9]{2}/)) {
      //date += " " + (new Date()).getFullYear();
      date = date.trim().substr(0,6) + d.format(" YYYY") + date.trim().substr(6);
  }
  let res = moment.tz(date, "DD MMM YYYY HH:mm", timezone);
  if (res.isValid()) return res.format("DD MMM YYYY HH:mm UTCZZ");
  else return date;
};

let checkBans = (removeFirstBan) => { // eslint-disable-line no-unused-vars

  let bans = $(document).find(".panel-profile .fa-graduation-cap").first().parent().parent().parent().find('.timeline-v2 > li');
  if (removeFirstBan === true) {
      bans = bans.slice(1);
  }
  
  let banStats = {
      activeBans: 0,
      bans1m: 0,
      bans3m: 0,
      active1m: false,
      twoActiveHistBans: false,
      nextBan: ""
  };

  if ($(document).find('.profile-body .panel-profile .profile-bio .label-red').text() === 'Banned') {
      console.log("User is banned, BTW");
  }

  if (bans.length > 0) {
      $.each(bans, function(i, ban) {
          let reason = $(ban).find('.autolinkage').text().replaceAll(/(\s)+/g," ").replace("Reason: ","").trim();
  
          if (reason === '@BANBYMISTAKE' || $(ban).find('.cbp_tmicon').css('background-color') === "rgb(255, 0, 38)") {
              return;
          }
          let date = $(ban).find('time').attr('datetime') //$(ban).find('.cbp_tmtime span:last-of-type').text();
          let issuedOn = Date.parse(fixDate(date));
          let dateExp = $(ban).find('.autolinkage').next().text().replaceAll(/(\s)+/g," ").trim() //getKeyValueByNameFromBanRows($(ban).find('.cbp_tmlabel > p'), "Expires", ': ')[1];
  
          if (dateExp.includes('Never') || dateExp.includes('Permanent')) {
              dateExp = date;
          } else {
            $(ban).find('.autolinkage').next().find('strong').each((i, ent) => {
              dateExp = dateExp.replace($(ent).text(), "");
            })
          }
  
          let expires = Date.parse(fixDate(dateExp));
          console.log(i, ban, "\n", date, fixDate(date), issuedOn, "\n", dateExp, fixDate(dateExp), expires)
          if (expires - issuedOn >= day * 85) {
            banStats.bans3m++
          } else if (expires - issuedOn >= day * 27 && reason.toLowerCase().includes('hist')) {
              banStats.bans1m++;
          }
  
          if ((new Date()).getTime() - day * 365 <= expires) {
              banStats.activeBans++;
              if (expires - issuedOn >= day * 27 && reason.toLowerCase().includes('hist')) {
                if (banStats.active1m) banStats.twoActiveHistBans = true;  
                banStats.active1m = true;
              }
          }
  
          if (banStats.twoActiveHistBans || banStats.activeBans >= 4 && banStats.active1m) {
              banStats.nextBan = "Permanent";
          } else if (banStats.activeBans >= 3) {
              banStats.nextBan = "1 month";
          } else {
              banStats.nextBan = "your discretion";
          }
      });
  } else {
      banStats.nextBan = "Your discretion";
  }

  return banStats;
}

// This is for if any more items are added to the specific ban items, it (shouldn't) break
let getKeyValueByNameFromBanRows = (elements, key, delimiter) => { // eslint-disable-line no-unused-vars
  let data = null;
  if (!delimiter) {
    delimiter = ' : ';
  }

  key = key.toLowerCase();

  for (let i = 0; i < elements.length; i++) {
    let li_split = $(elements[i]).text().trim().split(delimiter);
    if (li_split.length > 1) {
      if (li_split[0].toLowerCase() === key) {
        data = li_split;
        break;
      }
    }
  }

  return data;
};

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

$("#favicon").attr("href", chrome.extension.getURL("/icons/icon48.png"));

val_init().then(function (v) {
  if (v.OwnReasons == null || v.OwnDates == null) {
    alert("Hello! Looks like this is your first try in TruckersMP Improved! I'll open the settings for you...");
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('src/options/index.html'), "_blank");
    }
  } else {
    OwnReasons = v.OwnReasons;
    OwnDates = v.OwnDates;
    last_version = v.last_version;
    steamapi = v.steamapi;
    settings = v.settings;
    date_buttons = construct_dates(OwnDates);
    if (version_checker(last_version)) {
      chrome.runtime.sendMessage({}, function () {
        var readyStateCheckInterval = setInterval(function () {
          if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            storage = chrome.storage.local;
            if (typeof inject_init() === "function") { // eslint-disable-line no-undef
              inject_init(); // eslint-disable-line no-undef
            }
          }
        }, 10);
      });
    }
  }
}).catch(function (v) {
  console.error('TMP Improved (entryPoint)', v);
});