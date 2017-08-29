(function () { 
 return angular.module("pds.environment")
.constant("config", {
  "metaTags": {
    "siteName": "Buderus"
  },
  "urlSchema": {
    "trailingSlash": false
  },
  "pdsPathPrefix": "/ocs",
  "pdsTemplatePath": "/src/html",
  "forceLanguage": null,
  "search": {
    "defaultImage": "default-search"
  }
});

})();
