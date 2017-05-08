(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "https://pds-buderus.kittelberger.net/stg/v2.1.1/",
    "searchService": "https://ss-buderus.kittelberger.net/stg/v1.1.1/",
    "ocsMediaEndpoint": "https://pds-buderus.kittelberger.net/stg/v2.1.1/"
  },
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();
