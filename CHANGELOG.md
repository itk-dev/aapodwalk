# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

- [PR-50](https://github.com/itk-dev/aapodwalk/pull/50)
  - Sort route list by proximity
  - Replace arrow with "see on map"
  - Simplify geo location stuff, trusting if the browser provides to info we can use the info
- [PR-48](https://github.com/itk-dev/aapodwalk/pull/48)
  - Downgrade react router dom to make "back-button" work
  - Make locked points unclickable

## [1.0.6] - 2024-12-11

- [PR-47](https://github.com/itk-dev/aapodwalk/pull/47)
  - Added skeletons for tag filters, routes and points
  - Added very simple "error handling"

- [PR-46](https://github.com/itk-dev/aapodwalk/pull/46)
  - Create the actual route page
  - Create link to list of points
  - Fix squashed and round image -> not it fits and is less round (in `PointList`)
- [PR-45](https://github.com/itk-dev/aapodwalk/pull/45)
  - Save tag filter in url
- [PR-44](https://github.com/itk-dev/aapodwalk/pull/44)
  - Remove an error with id of undefined
  - Rename localstorage key
  - Delete unused files
- [PR-43](https://github.com/itk-dev/aapodwalk/pull/43)
  - Big design rewrite
  - Simplified `helper.js`
  - Tried to bundle the responsibility into components (like `DistanceComponent` now does the "703 m" stuff)
  - Renamed `PointOfInterest` to `Point`
  - added and removed some `svg`s
  - added a `RouteContext` to isolate the route state
- [PR-42](https://github.com/itk-dev/aapodwalk/pull/42)
  - Add faq page
- [PR-41](https://github.com/itk-dev/aapodwalk/pull/41)
  - Add landing page component
  - Add tags as a filter instead of as a "landing"
  - Add routes + proximity to route
  - Add question mark button that, as of now, does nothing
  - Add support for fontawesome
  - Save if the user closes the "landing-page" in `localstorage`

## [1.0.5] - 2024-12-05

- [PR-40](https://github.com/itk-dev/aapodwalk/pull/40)
  - Default dark mode
  - Make consent readable when not on dark mode
- [PR-39](https://github.com/itk-dev/aapodwalk/pull/39)
  - Remove cache from usefetch and cache context

## [1.0.4] - 2024-12-05

- [PR-38](https://github.com/itk-dev/aapodwalk/pull/38)
  - Added consent banner (`MapConsentBanner.jsx`)
  - Updated permission context to include open street map permission
  - Used localstorage to save yes/no from user
  - Added route with extra consent info (`PersonalInformationPolicyPage.jsx`)
- [PR-37](https://github.com/itk-dev/aapodwalk/pull/37)
  - Update linting
- [PR-36](https://github.com/itk-dev/aapodwalk/pull/36)
  - Open street map added
- [PR-33](https://github.com/itk-dev/aapodwalk/pull/33)
  - Improved readme
  - Added watch of files on docker compose up

- [PR-34](https://github.com/itk-dev/aapodwalk/pull/34)
  - Readd apple icon

## [1.0.3] - 2024-12-02

- [PR-32](https://github.com/itk-dev/aapodwalk/pull/32)
  - Style `<img` instead of `div` to actually spin arrow

## [1.0.2] - 2024-12-02

- [PR-30](https://github.com/itk-dev/aapodwalk/pull/30)
  - Load map faster with preload attribute
- [PR-29](https://github.com/itk-dev/aapodwalk/pull/29)
  - Readd location arrow
- [PR-28](https://github.com/itk-dev/aapodwalk/pull/28)
  - White background on icons
- [PR-27](https://github.com/itk-dev/aapodwalk/pull/27)
  Fix permalinks in build files

## [1.0.1] - 2024-11-19

- [PR-25](https://github.com/itk-dev/aapodwalk/pull/25)
  - Make `svg` import work again

## [1.0.0] - 2024-07-11

- Vite + react setup
- The podwalk app
- Added changelog
- Added GA
