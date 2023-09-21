fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios custom_lane
```
fastlane ios custom_lane
```
Description of what the lane does

----

## Android
### android build
```
fastlane android build
```
Build the app
### android increment_app_distribution_version
```
fastlane android increment_app_distribution_version
```
Get the latest version number from Firebase App Distribution and increment it by 1
### android preview
```
fastlane android preview
```
Publish the app to Firebase App Distribution

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
