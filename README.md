# TruckersMP Improved
For TruckersMP Staff members only!

# For Contributors
1) Check any changes on your clients before submitting a pull request. Grab .zip of this repository, then add the extension in Chrome with enabled Developer Mode ([see how](https://developer.chrome.com/extensions/getstarted#unpacked)).
2) If you want to update extension for all admins, Collaborators should change the version in [manifest file](manifest.json), add information about new stuff in [changelog file](src/options/new_version.html).
3) To update the extension for Firefox, temporarily add the following lines to the manifest, make another .zip and submit it to [Firefox for signing](https://addons.mozilla.org/developers/addon/). Then, add a new version to the hosted .json file which links to the file download. Make sure to remove the manifest changes for the Chrome version as it will produce unnecessary warnings.

```

    "browser_specific_settings": {
        "gecko": {
            "update_url": "https://link.to/updaterfile.json",
            "strict_min_version": "77.0"
        }
    },
```