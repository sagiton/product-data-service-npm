## Product Data Service ##

#### Prerequisites
- NodeJS + NPM

#### Installation
1. `npm i` | Install Npm dependencies
2. `bower i` | Install bower libraries
3. `gulp build watch` | build project with default profile (prd) and listen on changes
4. `npm run serve --consumer=...` | Deploys a mock static node server on localhost:3000 use consumer buderus or boschtt to test the project on live template

#### Gulpfile build task
gulpfile.js defines build task which does the following:
* Compiles & minifies external (vendor) libraries into `vendor.min.js` based on [bower.json](./bower.json) dependencies
* Injects [config.json](./config.json) into `constant` Angular module. Values differ based on building profile
* Compiles & minifies application scripts into `pds.min.js`. Sources are located in ./src/js/**_

Config.json defines project properties, eg. product data service endpoint \
Set building profile with _env_ flag: `gulp build --env rvw`

#### Installing JS libraries
If you need to install new JS library, please use `bower i {library-name} --save`, usually all of libraries hosted on Github have bower package registered you only need to find a package name.
After installation rebuild the app with `gulp build` task, it will concatenate your new library into `vendor.min.js`


#### Usage
- Use _\<catalog-template catalog-id="id"\>_ directive to fetch the catalog and attach it to the template scope.
- Listen on `pds.catalog.loaded` scope event to handle additional catalog logic after fetch
- Example integration can be found in `./src/test/project/buderus`

#### New version release
- Bump a new version \
  `gulp bump --type={type}` \
  _type_ parameter can be prerelease (default), patch, minor, major
- Push most recent changes
- Tag and push commit: \
  `git tag -a v1.2.3 -m "v1.2.3"` \
  `git push --tags`
- Update dependent project with new PDS version
