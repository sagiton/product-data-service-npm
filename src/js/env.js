(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "https://services.kittelberger.net/productdata/buderus/",
    "searchService": "https://services.kittelberger.net/search/v1/",
    "ocsMediaEndpoint": "https://services.kittelberger.net/productdata/buderus/"
  },
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();
