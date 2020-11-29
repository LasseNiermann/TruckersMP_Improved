'use strict'

var links = document.getElementsByClassName('autolinks')
var openLink = function (e) {
  e.preventDefault()
  if (e.target.href !== undefined || e.target.href !== '#') {
    chrome.tabs.create({
      url: e.target.href
    })
  }
}
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', openLink, false)
}

var optionsLink = document.getElementById('go_to_options')
optionsLink.addEventListener('click', function (e) {
  e.preventDefault()

  window.open(chrome.runtime.getURL('src/options/index.html'));
})

var changelogLink = document.getElementById('go_to_changelog')
changelogLink.addEventListener('click', function (e) {
  e.preventDefault()

  window.open(chrome.runtime.getURL('src/options/new_version.html'));
})