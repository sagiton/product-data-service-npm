(function () { 
 return angular.module("pds.environment")
.constant("config", {
  "metaTags": {
    "siteName": "BoschTT"
  },
  "urlSchema": {
    "trailingSlash": false
  },
  "pdsPathPrefix": "/ocs",
  "forceLanguage": null,
  "search": {
    "defaultImage": "default-search"
  }
});

})();
