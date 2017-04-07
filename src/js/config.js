(function () { 
 return angular.module("pds.environment")
.constant("config", {
  "env": "prd",
  "endPoint": {
    "productDataService": "https://pds-buderus.kittelberger.net/v2.1.1/",
    "searchService": "https://ss-buderus.kittelberger.net/v1.1.1/",
    "ocsMediaEndpoint": "/ocs_media/v2.1.1/"
  },
  "metaTags": {
    "siteName": "Buderus",
    "brand": "Buderus"
  },
  "navigationMaxElements": 6,
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();
