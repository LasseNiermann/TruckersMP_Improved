chrome.runtime.onMessage.addListener(
  function (request, sender, senderResponse = null) {
    if (request.action === 'url_shortener') {
      fetch("https://url.jmdev.ca/api", {
        method: 'POST',
        body: JSON.stringify(request.data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(json => senderResponse(json))
        .catch(error => {
          senderResponse({error: 'Unable to shorten URL'});
          console.error(error)
        });
        return true;
    }
    else if (request.msg) {
      var notification = {
        type: 'basic',
        iconUrl: chrome.extension.getURL('icons/icon128.png'),
        title: 'This is a notification',
        message: request.msg,
        contextMessage: request.contextMessage || 'Happy trucking!'
      };

      var notificationID = null
      chrome.notifications.create(notification, function (id) {
        notificationID = id
      })

      setTimeout(() => {
        chrome.notifications.clear(notificationID)
      }, request.timeout);
    }
  }
);

var notificationID = null
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('TMP Improved (bg/background)', details)
  if (details.reason === 'update' && chrome.runtime.getManifest().version !== details.previousVersion) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.extension.getURL('icons/icon128.png'),
      title: "TruckersMP Improved has been updated",
      message: "New version: " + chrome.runtime.getManifest().version,
      contextMessage: "Previous version: " + details.previousVersion,
      buttons: [{
          title: 'Options',
          iconUrl: chrome.extension.getURL('icons/notification/options.png')
        },
        {
          title: 'Changelog',
          iconUrl: chrome.extension.getURL('icons/notification/changelog.png')
        }
      ],
      requireInteraction: true
    }, function (id) {
      notificationID = id
    })

    chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
      if (notifId === notificationID) {
        if (btnIdx === 0) {
          window.open(chrome.runtime.getURL('src/options/index.html'))
        } else if (btnIdx === 1) {
          window.open(chrome.runtime.getURL('src/options/new_version.html'))
        }
      }

      chrome.notifications.clear(notificationID)
    })
  } else {
    if (details.reason === 'install') {
      window.open(chrome.runtime.getURL('src/options/index.html'));
    }
  }

  chrome.browserAction.setBadgeText({
    "text": chrome.runtime.getManifest().version,
  })
  chrome.browserAction.setBadgeBackgroundColor({
    "color": [0, 113, 197, 255]
  })
});

function updateNotification (json) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.extension.getURL('icons/icon128.png'),
    title: "TruckersMP Improved Update",
    message: "A new version has been released. Would you like to visit GitHub?",
    contextMessage: "v" + chrome.runtime.getManifest().version + " => " + json.tag_name,
    buttons: [{
        title: 'Yes'
      },
      {
        title: 'Skip this version'
      }
    ],
    requireInteraction: true
  }, function (id) {
    notificationID = id
  })

  chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
    if (notifId === notificationID) {
      if (btnIdx === 0) {
        window.open('https://github.com/Flybel/TruckersMP_Improved/releases')
      } else if (btnIdx === 1) {
        chrome.storage.local.set({gitskip: json.id})
      }
    }

    chrome.notifications.clear(notificationID)
  })
}

function versionGt (greater, smaller) {
  greater = greater.split(".");
  smaller = smaller.split(".");
  for (var i = 0; i < Math.min(greater.length, smaller.length); i++) {
    if (parseInt(greater[i]) > parseInt(smaller[i])) return true;
    else if (parseInt(greater[i]) < parseInt(smaller[i])) return false;
  }
  return greater.length > smaller.length;
}

chrome.storage.local.get(function (res) {
  //get latest GitHub release for Flybel repo
  fetch("https://api.github.com/repos/Flybel/TruckersMP_Improved/releases/latest", {
        method: 'GET'
      })
        .then(response => response.json())
        .then(json => {
          if (json.tag_name != "v" + chrome.runtime.getManifest().version && versionGt(json.tag_name.replace("v", ""), chrome.runtime.getManifest().version) && json.id !== res.gitskip) updateNotification(json);
        });
})