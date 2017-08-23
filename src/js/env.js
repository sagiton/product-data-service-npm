(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "https://dev02.sagiton.pl/catalog-service-dev/",
    "contentService": "http://localhost:8082/boschtt-cs-dev/",
    "searchService": "https://services.kittelberger.net/search/v1/",
    "ocsMediaEndpoint": "https://dev02.sagiton.pl/asset-service-dev/asset/"
  },
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();
