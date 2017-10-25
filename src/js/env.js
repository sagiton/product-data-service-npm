(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "https://services-rvw.kittelberger.net/productdata/",
    "contentService": "http://localhost:8080/boschtt-cs-dev/",
    "searchService": "https://services-rvw.kittelberger.net/search/",
    "ocsMediaEndpoint": "https://services-rvw.kittelberger.net/asset/"
  },
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();
