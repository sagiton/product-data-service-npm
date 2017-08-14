(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "http://localhost:8080/catalog-service-dev/",
    "contentService": "http://localhost:8082/boschtt-cs-dev/",
    "searchService": "https://services.kittelberger.net/search/v1/",
    "ocsMediaEndpoint": "http://localhost:8081/asset-service-dev/"
  },
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();
