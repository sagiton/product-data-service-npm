/*! product-data-service - v2.0.0-SNAPSHOT.2 - 2017-08-28T14:24:50.533Z */ 

(function (angular) {
    angular.module('pds.environment', []);
    angular.module('product-data-service', ['pds.catalog', 'pds.navigation', 'pds.environment', 'pds.search', 'pds.common', 'ui.router', 'ngSanitize']);
})(angular);

(function () { 
 return angular.module("pds.environment")
.constant("config", {
  "metaTags": {
    "siteName": "Buderus"
  },
  "urlSchema": {
    "trailingSlash": true
  },
  "pdsPathPrefix": "/ocs",
  "pdsTemplatePath": "/src/html",
  "forceLanguage": null,
  "search": {
    "defaultImage": "default-search"
  }
});

})();

(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "https://services.kittelberger.net/productdata/buderus/",
    "contentService": "https://dev02.sagiton.pl/content-service-dev/",
    "searchService": "https://services.kittelberger.net/search/v1/",
    "ocsMediaEndpoint": "https://services.kittelberger.net/productdata/buderus/"
  },
  "search": {
    "cmsChannelDiscriminator": "deCHCmsDiscriminator",
    "pdsChannelDiscriminator": "buderusPdsDiscriminator"
  }
});

})();

(function (angular) {
    angular.module('pds.common.route', ['ui.router', 'ncy-angular-breadcrumb', 'pds.environment']);
    angular.module('pds.common.service', []);
    angular.module('pds.common.config', ['pascalprecht.translate']);
    angular.module('pds.common.controller', ['ngAnimate', 'ngSanitize', 'datatables', 'hl.sticky', 'dcbImgFallback', 'slickCarousel']);
    angular.module('pds.common.model', []);
    angular.module('pds.common.factory', []);
    angular.module('pds.common.directive', []);
    angular.module('pds.common.filter', ['pds.environment']);
    angular.module('pds.common', ['pds.common.controller', 'pds.common.route', 'pds.common.service', 'pds.common.config', 'pds.common.model']);
})(angular);

(function (angular, $) {
    angular
        .module('pds.common.config')
        .config(function () {
            $(document).ready(function () {
                $('a')
                    .filter(function (idx, el) {
                        return !$(el).attr('target');
                    })
                    .attr('target', '_self');
            })
        })
})(angular, $);

(function (angular, window) {
    angular
        .module('pds.common.config')
        .config(['$translateProvider', function ($translateProvider) {
            if (window.cmsTranslations) {
                $translateProvider
                    .translations('this', window.cmsTranslations)
                    .useSanitizeValueStrategy('sanitize')
                    .preferredLanguage('this')
                    .use('this');
            }
        }]);

})(angular, window);

(function (angular) {
    angular
        .module('pds.common.config')
        .provider('locale', LocaleProvider);


    function LocaleProvider() {
        var discoveryMethods = [];

        this.addDiscoveryMethod = function (method) {
            discoveryMethods.push(method);
            return this;
        };

        this.$get = ['_', function (_) {
            return new Locale(_, discoveryMethods);
        }];
    }

    function Locale(_, discoveryMethods) {
        var method = _.find(discoveryMethods, _.attempt);
        var result =  method ? method() : [];
        var country = result[1];
        var language = result[2];
        return {
            country: country,
            language: language,
            toString: function() {
                return this.language.toLowerCase() + "_" + this.country.toUpperCase();
            }
        };
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.config')
        .factory('_', ['$window', function ($window) {
            return $window._;
        }]);

})(angular);

(function (angular) {
    angular
        .module('pds.common.config')
        .factory('ocsChannel', OcsChannel);

    function OcsChannel() {
        return angular.element('meta[name="ocs-channel"]').attr('content');
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.config')
        .config(['localeProvider', function (localeProvider) {
            var localeUrlPattern = /^\/([a-zA-Z]{2})\/([a-zA-Z]{2})/;
            localeProvider.addDiscoveryMethod(function () {
                return localeUrlPattern.exec(new URI().path());
            });
        }]);

})(angular);

(function (angular) {

    angular
        .module('pds.common.config')
        .decorator('$window', ['$delegate', WindowDecorator]);

    function WindowDecorator($delegate) {
        $delegate.navigate = function (uri) {
            if (uri.indexOf('/') != 0) {
                uri = '/'.concat(uri);
            }
            $delegate.location.href = getBasePath() + uri;
        };
        $delegate.getBasePath = function getBasePath() {
            var basePath = angular.element('base').attr('href-override');

            if (!basePath)
                basePath = angular.element('base').attr('href');

            if (basePath.lastIndexOf('/') == (basePath.length - 1)) {
                basePath = basePath.slice(0, basePath.length - 1);
            }
            return basePath;
        };
        return $delegate;
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('ContentController', ContentController);

    ContentController.$inject = ['SpinnerService'];

    function ContentController(spinnerService) {
        var vm = this;

        vm.isSpinning = spinnerService.isLoading;
    }

})(angular);

(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('headerController', HeaderController);

    HeaderController.$inject = ['$scope', '$location', 'locale', 'config', 'jsonFilter', '_', 'BreadcrumbService'];
    var contentGroups = ['WT.cg_n', 'WT.cg_s', 'WT.z_cg3', 'WT.z_cg4', 'WT.z_cg5', 'WT.z_cg6', 'WT.z_cg7', 'WT.z_cg8', 'WT.z_cg9', 'WT.z_cg10'];

    function HeaderController($scope, $location, locale, config, jsonFilter, _, BreadcrumbService) {
        var rootContentGroup = {name: config.metaTags.siteName};
        var vm = this;
        vm.url = $location.absUrl();
        vm.locale = locale.toString();
        vm.brand = config.metaTags.brand;
        vm.country = locale.country;
        vm.language = locale.language;

        $scope.$on('pds.header.update', function (event, params) {
            vm.title = params.title;
            vm.description = params.description;
            vm.image = params.image;
            vm.webTrends = params.webTrends;
            vm.siteName = params.siteName;
            vm.canonicalUrl = params.canonicalUrl;
        });

        $scope.$on('pds.header.update', function (event, params) {
            buildJsonLD({
                "@context": "http://schema.org/",
                "@type": "Product",
                "name" : params.title,
                "image": params.image,
                "description": params.description,
                "brand": config.metaTags.siteName
            });
        });

        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.catalogId)
                .then(function (breadcrumbs) {
                    buildJsonLD({
                        "@context": "http://schema.org/",
                        "@type": "BreadcrumbList",
                        "itemListElement": _.map(breadcrumbs, function (crumb, index) {
                            return {
                                '@type': 'ListItem',
                                position: index,
                                item: {
                                    '@id': crumb.url,
                                    name: crumb.name
                                }
                            }
                        })
                    });
                    return breadcrumbs;
                })
                .then(buildContentGroups);
        });

        function buildJsonLD(model) {
            angular
                .element('<script>')
                .attr('type', 'application/ld+json')
                .text(jsonFilter(model))
                .appendTo('head');
        }

        function buildContentGroups(tree) {
            tree.unshift(rootContentGroup);
            _.forEach(tree, function (element, idx) {
                addMeta(contentGroups[idx], element.name);
            });
        }


        function addMeta(name, content) {
            angular
                .element('meta[name="' + name + '"')
                .remove();
            angular
                .element('<meta>')
                .attr('name', name)
                .attr('content', content)
                .appendTo('head');
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.common.controller')
        .controller('jsonLdController', JsonLdController);

    JsonLdController.$inject = ['$scope', '$location', 'BreadcrumbService', 'CatalogService', 'jsonFilter'];

    function JsonLdController($scope, $location, BreadcrumbService, CatalogService, jsonFilter) {
        var vm = this;
        vm.url = $location.absUrl();


    }

})(angular);

(function(angular) {
    angular
        .module('pds.common.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', '$locationProvider', 'config'];

    function RouteConfig($stateProvider, $locationProvider, config) {
        $locationProvider.html5Mode(true);
        $stateProvider.pdsRoute = function (route) {
            route.url = urlPath(route.url);
            route.templateUrl = htmlPath(route.templateUrl);
            $stateProvider.state(route);
        };

        function urlPath(path) {
            return config.pdsPathPrefix + '/' + path;
        }

        function htmlPath(path) {
            return config.pdsTemplatePath + '/' + path;
        }
    }
})(angular);

(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('cliplister', CliplisterDirective);

    CliplisterDirective.$inject = ['$filter', '$sce'];

    function CliplisterDirective($filter, $sce) {
        return {
            restrict: 'E',
            template: '<div id="video" style="height:400px;"></div>',
            scope: {
                videoId: '=videoId'
            },
            link: function(scope, element, attrs) {
                new CliplisterControl.Viewer({
                    parentId: "video",
                    customer: 157893,
                    assets: [scope.videoId],
                    keyType: 10000,
                    fsk: 18,
                    autoplay: false,
                    plugins: {
                        InnerControls: {
                            layer: 2,
                            mobileDefaultControls: true,
                            id: "controls",
                            blacklist: ["share","quality","playback-speed"],
                            template: {
                                type: "external",
                                source: "https://mycliplister.com/static/viewer/assets/skins/default/controls.html"
                            }
                        },
                        ClickableVideo: {layer: 1},
                        PlayButton: {
                            id: "playButton",
                            layer: 7,
                            image: "https://mycliplister.com/static/viewer/assets/skins/default/playButton.png",
                            width: 100,
                            height: 100
                        },
                        PreviewImage: {layer: 6}
                    }
                });
            },
            replace: true
        }
    };

})(angular);

(function (angular) {
    angular
        .module('pds.common.directive')
        .directive('jsonld', JsonLdDirective);

    JsonLdDirective.$inject = ['$filter', '$sce'];

    function JsonLdDirective($filter, $sce) {
        return {
            restrict: 'E',
            template: '<script type="application/ld+json" ng-bind-html="onGetJson()"></script>',
            scope: {
                json: '=json'
            },
            link: function(scope, element, attrs) {
                scope.onGetJson = function() {
                    return $sce.trustAsHtml($filter('json')(scope.json));
                }
            },
            replace: true
        }
    };

})(angular);

(function (angular) {
  angular
    .module('pds.common.directive')
    .directive('simpleSubmenu', function () {
      return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
          initNavCollapse(element);
        }
      }
    })

})(angular);

(function (angular) {

    angular
        .module('pds.common.filter')
        .filter('convertWhitespaces', function () {
            return function (input) {
                return input && input
                        .replace(/\n/g, '</br>')
                        .replace(/<!--.*language.*missing.*-->/g, '');
            }
        });
})(angular);

(function (angular) {
    angular
        .module('pds.common.filter')
        .filter('imageUrl', ImageUrlFilter);

    ImageUrlFilter.$inject = ['env', 'locale', 'ocsChannel'];

    var defaultImages = {
        'img-sm': '/src/media/default-460x460.jpg',
        'img-md': '/src/media/default-640x372.jpg',
        'img-lg': '/src/media/default-680x440.jpg',
        'img-xlg': '/src/media/default-1600x560.jpg'
    };

    function ImageUrlFilter(env, locale, ocsChannel) {
        return function (mediaObject, size) {
            return mediaObject ? env.endPoint.ocsMediaEndpoint + ocsChannel + "/" + locale.toString() + "/" + mediaObject : defaultImages[size || 'img-sm'];
        }
    }
})(angular);

(function (angular) {
    var CHARACTER_MAP = {
        '\u002E':   '',  //.
        '\u0020':   '-', //SPACE
        '\u002C':   '-', //,
        '\u0026':   '-', //&
        '\u005C':   '-', //\
        '\u201E':   '-', //„
        '\u0022':   '-', //'
        '\u0027':   '-', //'
        '\u00B4':   '-', //´
        '\u0060':   '-', //`
        '\u00BB':   '-', //»
        '\u00AB':   '-', //«
        '\u002F':   '-', ///
        '\u003A':   '-', //:
        '\u0021':   '-', //!
        '\u002A':   '-', //*
        '\u0028':   '-', //(
        '\u0029':   '-', //)
        '\u2122':   '-', //™
        '\u00AE':   '-', //®
        '\u00E1':   'a', //á
        '\u00F3':   'o', //ó
        '\u00ED':   'i', //í
        '\u00E9':   'e', //é
        '\u00E4':   'ae',//ä
        '\u00F6':   'oe',//ö
        '\u0151':   'o', //ő
        '\u00FC':   'u', //ü
        '\u00FA':   'u', //ú
        '\u0171':   'u', //ű
        '\u00DF':   'ss',//ß
        '\u00EE':   'i', //î
        '\u00E2':   'a', //â
        '\u0103':   'a', //ă
        '\u021B':   't', //ț
        '\u0163':   't', //ţ
        '\u015F':   't', //ş
        '\u0219':   's', //ș
        '\u0159':   'r', //ř
        '\u016f':   'u', //ů
        '\u00FD':   'y', //ý
        '\u010D':   'c', //č
        '\u011B':   'e', //ě
        '\u017E':   'z', //ž
        '\u0161':   's', //š
        '\u0165':   't', //ť
        '\u0148':   'n', //ň
        '\u2019':   '-', //’
        '\u00e0':   'a'  //à
    };
    var characterRegex = _
        .map(CHARACTER_MAP, function (val, key) {
            return '\\' + key;
        })
        .join('|');
    var regExp = new RegExp(characterRegex, 'g');

    angular
        .module('pds.common.filter')
        .filter('simplifyCharacters', ['_', function (_) {
            return function (val) {
                return val && val
                        .toLowerCase()
                        .replace(regExp, function (match) {
                            return CHARACTER_MAP[match];
                        });
            }
        }])

})(angular);

(function (angular) {
    angular.module('pds.catalog.route', ['pds.common.route', 'ui.router', 'ncy-angular-breadcrumb']);
    angular.module('pds.catalog.service', ['pds.common.filter']);
    angular.module('pds.catalog.config', ['pds.environment', 'ngResource', 'pds.common.config']);
    angular.module('pds.catalog.controller', ['ngSanitize', 'datatables', 'hl.sticky', 'dcbImgFallback', 'slickCarousel', 'pds.catalog.service', 'pds.catalog.directive', 'pds.navigation.service']);
    angular.module('pds.catalog.model', []);
    angular.module('pds.catalog.factory', ['pds.catalog.service']);
    angular.module('pds.catalog.directive', []);
    angular.module('pds.catalog', ['pds.catalog.controller', 'pds.catalog.route', 'pds.catalog.service', 'pds.catalog.config', 'pds.catalog.model']);
})(angular);

(function (angular) {
    angular
        .module('pds.common.service')
        .service('SpinnerService', SpinnerService);

    SpinnerService.$inject = ['$http'];

    function SpinnerService($http) {
        var self = this;

        self.isLoading = function () {
            return $http.pendingRequests.length > 0;
        }

    }

})(angular);

(function (angular) {
  angular.module('pds.search.route', ['pds.common.route', 'ui.router']);
  angular.module('pds.search.service', ['pds.navigation.model', 'pds.common.config']);
  angular.module('pds.search.config', []);
  angular.module('pds.search.controller', ['pds.search.service', 'ui.bootstrap']);
  angular.module('pds.search.model', []);
  angular.module('pds.search.directive', []);
  angular.module('pds.search', ['pds.search.controller', 'pds.search.route', 'pds.search.service', 'pds.search.config', 'pds.search.model']);
})(angular);

(function (angular) {
  angular.module('pds.navigation.route', ['ui.router']);
  angular.module('pds.navigation.service', ['pds.navigation.model', 'pds.common.service']);
  angular.module('pds.navigation.config', []);
  angular.module('pds.navigation.controller', ['pds.navigation.service', 'pds.common.service']);
  angular.module('pds.navigation.model', []);
  angular.module('pds.navigation.directive', []);
  angular.module('pds.navigation', ['pds.navigation.controller', 'pds.navigation.route', 'pds.navigation.service', 'pds.navigation.config', 'pds.navigation.model']);
})(angular);

(function (angular) {

    angular
        .module('pds.catalog.factory')
        .factory('urlBuilder', UrlBuilder);

    UrlBuilder.$inject = ['$injector'];

    function UrlBuilder($injector) {
        return $injector.get('seoFriendlyUrlBuilder');
    }
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.controller')
        .controller('BreadcrumbController', BreadcrumbController);

    BreadcrumbController.$inject = ['$scope', 'BreadcrumbService'];

    function BreadcrumbController($scope, BreadcrumbService) {
        var vm = this;

        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.categoryId)
                .then(function (res) {
                    vm.breadcrumbs = res;
                    if (_.last(vm.breadcrumbs).type == 'product_details') {
                        angular.element('#nav-breadcrumbs').addClass('dark-breadcrumb');
                    }
                });
        });
    }

})(angular);

(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$scope', '$rootScope', 'urlParserService', '_', 'MetaService'];

    function CatalogController($scope, $rootScope, urlParserService, _, MetaService) {
        var vm = this;
        vm.catalogId = urlParserService.getCatalogId();
        vm.anyProductHasValue = anyProductHasValue;
        vm.tableDefinitionContains = tableDefinitionContains;

        MetaService.updateMetaByCategory(vm.catalogId);
        $rootScope.$broadcast('pds.breadcrumb.update', {catalogId: vm.catalogId});

        $scope.$on('pds.catalog.loaded', function (event, params) {
            return initCatalog(params.catalog);
        });

        $scope.$on('pds.catalog.loaded', function () {
            angular
                .element('#nav-primary-collapse')
                .find('li')
                .removeClass('active');
            angular
                .element('#ocs-nav')
                .addClass('active');
        });

        function initCatalog(catalog) {
            vm.catalog = catalog;
            if (_.get(vm.catalog, 'redirectCategory.id') > 0) {
                return CatalogService.redirectTo(vm.catalog.redirectCategory.id.value);
            }
            vm.catalog.energyEfficiency = vm.catalog.energyEfficiency || {};
            var technicalDataTable = vm.catalog.technicalDataTable();
            if (technicalDataTable) {
                var tableDefinition = technicalDataTable.tableDefinition;
                technicalDataTable.tableDefinition = _
                    .chain(tableDefinition)
                    .filter(function(attr) {
                        return technicalDataTable.showAttributesWithNoValues || anyProductHasValue(technicalDataTable.products, attr);
                    })
                    .filter(isNotHeaderAttribute.bind(this, technicalDataTable.products))
                    .value();
            }
        }

        function isNotHeaderAttribute(products, attr) {
            return !isHeaderAttribute(products, attr);
        }

        function isHeaderAttribute(products, attr) {
            return _.some(products, function (product) {
                return product.header.key == attr.key;
            });
        }

        function anyProductHasValue(products, attribute) {
            return _.some(products, attribute.key);
        }

        function tableDefinitionContains(definition, key) {
            return _.some(definition, {key: key});
        }
    }

})(angular);

(function(angular) {
    angular
        .module('pds.catalog.controller')
        .controller("NewProductController", NewProductController);

    NewProductController.$inject = ['CatalogService', '_'];

    function NewProductController(catalogService, _) {
        var vm = this;

        vm.productsLoaded = false;
        vm.slickSettings = {
            "arrows": false,
            "dots": true,
            "infinite": false,
            "speed": 1000,
            "cssEase": "ease-in-out",
            "slidesToShow": 4,
            "slidesToScroll": 4,
            "responsive": [
                {
                    "breakpoint": 992,
                    "settings": {
                        "slidesToShow": 2,
                        "slidesToScroll": 2
                    }
                },
                {
                    "breakpoint": 768,
                    "settings": {
                        "slidesToShow": 1,
                        "slidesToScroll": 1
                    }
                }
            ]
        };

        catalogService
            .getNewProductFamilies()
            .then(function (result) {
                vm.productFamilies = result;
                vm.productsLoaded = true;
            });
    }
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$httpProvider', HttpConfig]);

    function HttpConfig($httpProvider) {
        $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
            return {
                responseError: function(rejection) {
                    $injector.get('$state').go('error');
                    return $q.reject(rejection);
                }
            }
        }]);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$sceDelegateProvider', SceConfig]);

    function SceConfig($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://pds-bosch-tt.kittelberger.net/**',
            'https://ss-bosch-tt.kittelberger.net/**',
            'https://mycliplister.com/**'
        ]);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.model')
        .factory('CatalogHelper', CatalogHelper);

    function CatalogHelper() {
        this.toView = function (catalog) {
            catalog.description = catalog.descriptionLong;
            catalog.title = catalog.descriptionShort;
            catalog.image = catalog.keyVisual || catalog.productimage;
            catalog.showImage = function () {
                return !!catalog.keyVisual;
            };
            catalog.showTiles = function () {
                return catalog.isRootCatalog() || catalog.isSubCatalog();
            };
            catalog.tiles = _.map(catalog.children, function (child) {
                return {
                    id: child.id,
                    name: child.name,
                    title: child.headline,
                    description: child.descriptionShort,
                    image: child.categoryImage
                }
            });
            catalog.showList = catalog.isLeafCatalog;
            catalog.list = _.map(catalog.children, function (child) {
                return {
                    id: child.id,
                    name: child.name,
                    title: child.productname,
                    image: child.productcategoryimage,
                    new: child.new,
                    bullets: _.has(child, 'highlightCatOverview.value.elements') && child.highlightCatOverview.value.elements

                }
            });
            catalog.showTeaser = catalog.isProductFamily;
            catalog.new = catalog.neuheitOcs;
            catalog.newImage = '/media/new.png';
            catalog.name = catalog.headline || catalog.productname;
            catalog.energyEfficiency = {
                image: catalog.mainErpLabel
            };
            catalog.showTechnicalInformation = function () {
                return _.has(catalog, 'highlights.value.elements') && catalog.highlights.value.elements.length;
            };
            catalog.technicalInformation = _.has(catalog, 'highlights.value.elements')  && catalog.highlights.value.elements;
            catalog.showMoreDetails = function () {
                return _.size(catalog.subheadlines) > 0;
            };
            catalog.subheadlines = (function (catalog) {
                var i = 1;
                var subheadline = catalog.detailsSubheadline1;
                var description = catalog.detailsDescription1;
                var image = catalog.detailsImage1;
                var subheadlines = [];
                while(subheadline != null || description != null) {
                    subheadlines.push({title: subheadline && subheadline.value, description: description && description.value, image: image && image.value});
                    i++;
                    description = catalog['detailsDescription' + i];
                    subheadline = catalog['detailsSubheadline' + i];
                    image = catalog['detailsImage' + i];
                }
                return subheadlines;
            })(catalog);
            catalog.moreDetails = {
                title: catalog.headlineOverview,
                elements: catalog.subheadlines
            };

            catalog.showTechnicalTable = function () {
                return catalog.productTableDefinition && catalog.children; //FIXME Take logic from controller, Make this customizable
            };
            catalog.showFootnotes = function () {
                return catalog.footnotesTechData;
            };
            catalog.footnotes = catalog.footnotesTechData;
            return catalog;
        };

        this.toTemplateView = function (template) {
            return template;
        };

        function findSection(sections, name) {
            return _.find(sections, {name: name});
        }

        return this;
    }

})(angular);

(function(angular) {
    angular
        .module('pds.catalog.model')
        .config(CatalogConfig);

    CatalogConfig.$inject = ['env', 'CatalogProvider'];

    function CatalogConfig(env, catalogModelProvider) {
        catalogModelProvider
            .productDataServiceEndPoint(env.endPoint.productDataService)
            .contentServiceEndPoint(env.endPoint.contentService);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.model')
        .provider('Catalog', function CatalogProvider() {
            var pdsUrl = null;
            var csUrl = null;

            this.productDataServiceEndPoint = function (value) {
                pdsUrl = value;
                return this;
            };

            this.contentServiceEndPoint = function (value) {
                csUrl = value;
                return this;
            };

            this.$get = ['$resource', '$cacheFactory', 'locale', '$http', '_', 'CatalogHelper', function ($resource, $cacheFactory, locale, $http, _, CatalogHelper) {
                return new Catalog($resource, $cacheFactory, locale, pdsUrl, csUrl, $http, _, CatalogHelper);
            }];
        });

    function Catalog($resource, $cacheFactory, locale, pdsUrl, csUrl, $http, _, catalogHelper) {
        var catalogCache = $cacheFactory("catalog");
        var customTransformations = [redirectChildren];
        var transformations = $http.defaults.transformResponse.concat(customTransformations);
        var transformResponse = function (data, headers, status) {
            var result = data;
            _.each(transformations, function (t) {
                result = t(result, headers, status);
            });
            return result;
        };
        var CatalogResource = $resource(pdsUrl + ':locale/:type/:queryType/:id', null, {
                get: {
                    method: 'GET',
                    params: {locale: locale, queryType: 'id'},
                    cache: catalogCache,
                    transformResponse: function (data, headers, status) {
                        return toCatalogView(transformResponse(data, headers, status))
                    }
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    params: {locale: locale},
                    cache: catalogCache
                },
                template: {
                    method: 'POST',
                    url: csUrl + 'rest/document/display',
                    transformResponse: function (data, headers, status) {
                        return toCatalogTemplateView(transformResponse(data, headers, status));
                    }
                }
            }
        );

        function redirectChildren(data, headers, status) {
            data.children = _.map(data.children, function (child) {
                return child.redirectCategory ? child.redirectCategory : child;
            });
            return data;
        }

        function toCatalogView(catalog) {
            return catalogHelper.toView(catalog);
        }

        function toCatalogTemplateView(catalog) {
            return catalogHelper.toTemplateView(catalog);
        }

        CatalogResource.prototype.isLeafCatalog = function () {
            return this.getType() == 'leaf_category';
        };

        CatalogResource.prototype.isProductFamily = function () {
            return this.getType() == 'product_family';
        };

        CatalogResource.prototype.isSubCatalog = function () {
            return this.getType() == 'sub_category';
        };

        CatalogResource.prototype.isRootCatalog = function () {
            return this.getType() == 'root_category';
        };

        CatalogResource.prototype.getType = function() {
            return this.type ? this.type.value.toLowerCase() : String();
        };

        CatalogResource.prototype.technicalDataTable = function () {
            var section = _.find(this.sections, {name: 'TECHNICAL_DATA_TABLE'});
            return section && section.params;
        };

        CatalogResource.fallbackType = function () {
            return 'PRODUCT_FAMILY';
        };

        return CatalogResource;
    }

})(angular);

(function (angular) {
    var VALUE_TEMPLATE = '<span>{{value.value || \'-\'}}</span>';
    var IMAGE_MEDIA_TEMPLATE = '<img ng-src="{{value.value}}" alt="{{alt.value}}" title="{{title.value}}"/>';
    var OTHER_MEDIA_TEMPLATE = '<span><a ng-href="{{value.value | imageUrl}}" title="{{title.value}}" target="_blank"><span translate="DOWNLOAD.NOW"></span>&nbsp;<i class="glyphicon glyphicon-download-alt"></i></a></span>';
    var IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg', '.gif'];
    var DOT = '.';

    var templateStrategy = [
        {
            isApplicable: function (val, type) {
                return type && type.toLowerCase() == 'string' && IMAGE_EXTENSIONS.indexOf(val.slice(val.lastIndexOf(DOT))) >= 0;
            },
            template: IMAGE_MEDIA_TEMPLATE
        },
        {
            isApplicable: function (val, type) {
                return type && type.toLowerCase() == 'asset';
            },
            template: OTHER_MEDIA_TEMPLATE
        },
        {
            isApplicable: function () {
                return true;
            },
            template: VALUE_TEMPLATE
        }
    ];

    angular
        .module('pds.catalog.directive')
        .directive('attributeValue', ['$compile', '$sce', function ($compile, $sce) {
            return {
                restrict: 'EA',
                scope: {
                    value: '=attributeValue',
                    alt: "=attributeAlt",
                    title: "=attributeTitle"
                },
                link: function (scope, element, attrs, ctrl) {
                    scope.$sce = $sce;
                    for (var i = 0; i < templateStrategy.length; i++) {
                        if (scope.value && templateStrategy[i].isApplicable(scope.value.value, scope.value.type)) {
                            return element.html($compile(templateStrategy[i].template)(scope));
                        }
                    }
                }
            }
        }]);

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('catalogTemplate', ['CatalogService', '$rootScope', '_' ,function (CatalogService, $rootScope, _) {
            return {
                restrict: 'EA',
                scope: {
                    catalogId: '='
                },
                transclude: true,
                template: '<div class="catalog-template" ng-transclude></div>',
                link: function (scope, element, attrs, ctrl) {
                    scope.$watch('catalogId', function (val) {
                        val && CatalogService
                            .getTemplate(val)
                            .then(function (catalog) {
                                scope.$catalog = catalog;
                                $rootScope.$broadcast('pds.catalog.loaded', {catalog: catalog});
                            });
                    });
                }
            }
        }]);

})(angular);

(function (angular, $) {
    angular
        .module('pds.catalog.directive')
        .directive('equalizeTeaserHeight', ['$timeout', EqualizeTeaserHeight]);

    function EqualizeTeaserHeight($timeout) {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (scope.$last) {
                    $timeout(function() {
                        var maxHeight = 0;
                        var cardBlock = $(".card .card-block");

                        $(cardBlock).each(function() {
                            if ($(this).height() > maxHeight) {
                                maxHeight = $(this).height();
                            }
                        });

                        $(cardBlock).height(maxHeight);
                    }, 0);
                }
            }]
        }
    }

})(angular, jQuery);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsBreadcrumb', OcsBreadcrumb);

    var crumbTemplate = "<li ng-repeat=\"crumb in $breadcrumbs\" ng-class=\"{'active': $last}\">"
            + "<a ocs-navigate=\"crumb.id\">{{crumb.name}}</a>"
        + "</li>";

    function OcsBreadcrumb() {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: ['$scope', '$compile', 'BreadcrumbService', '_', BreadcrumbController]
        }
    }

    function BreadcrumbController($scope, $compile, BreadcrumbService, _) {
        $scope.$on('pds.breadcrumb.update', function (event, params) {
            BreadcrumbService
                .build(params.catalogId)
                .then(function (res) {
                    $scope.$breadcrumbs = res || {};
                    var breadcrumbs = $compile(crumbTemplate)($scope);
                    var breadcrumbsContainer = angular.element('#nav-breadcrumbs');
                    breadcrumbsContainer.find('.dropdown-menu').append(breadcrumbs);

                    //TODO Move this stuff, but where.......................................................................
                    if (_.last($scope.$breadcrumbs).type == 'PRODUCT_FAMILY') {
                        breadcrumbsContainer.addClass('dark-breadcrumb');
                    }

                    breadcrumbsContainer
                        .find('.dropdown-toggle')
                        .text(_.last($scope.$breadcrumbs).name);
                });
        });
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsNavigate', OcsNavigateDirective);

    OcsNavigateDirective.$inject = ['CatalogService'];

    function OcsNavigateDirective(CatalogService) {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                scope.$watch('ocsNavigate', function (val) {
                    val && CatalogService
                        .resolveUriFromHierarchy(val)
                        .then(function (uri) {
                            element.attr('href', uri);
                        });
                    element.filter(function (idx, el) {
                        return !$(el).attr('target');
                    })
                    .attr('target', '_self');
                })
            }]
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('scrollableTableCard', ScrollableTableCard);

    function ScrollableTableCard() {
        return {
            restrict: 'EA',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                $('.fs-table-scrollable .js-slick-slider').each(function() {
                    var $thisTable = $(this);
                    var viewportWidth = $(window).width();
                    var tableSliderElements = $thisTable.find(".card");
                    var tableSliderElementsAmount = $(tableSliderElements).length;

                    //desktop
                    if (viewportWidth > 991) {
                        if (tableSliderElementsAmount < 3) {
                            $thisTable.addClass("js-full-width-slick-track");
                        } else {
                            $thisTable.removeClass("js-full-width-slick-track");
                        }
                    }

                    //tablet
                    if ((viewportWidth < 992) && (viewportWidth > 767)) {
                        if (tableSliderElementsAmount < 2) {
                            $thisTable.addClass("js-full-width-slick-track");
                        } else {
                            $thisTable.removeClass("js-full-width-slick-track");
                        }
                    }

                });
                if (scope.$last) {
                    //scrollable table slider-wrapper instance
                    var tableSlider = $(".fs-table-scrollable .scrollable-table-wrapper");

                    //scrollable table slider-wrapper instance (element)
                    var tableSliderElement = $(tableSlider).find(".card");


                    if (tableSlider.length > 0) {

                        //loop through ALL available Table-Elements
                        $(tableSliderElement).each(function() {
                            var $thisElement = $(this);

                            //add table-row-[row-count]-class to ALL Table-Elements
                            $thisElement.find("tr").each(function(i) {
                                var $thisRow = $(this);
                                $thisRow.addClass("table-row-" + (i + 1));
                            });

                        });

                        //function to equalize table rows
                        var equalHeightsRow = function() {

                            //loop through all table sliders
                            $(tableSlider).each(function() {
                                var $thisSlider = $(this);
                                var rowsCount = $(this).find(".card:first-of-type tr").length;

                                //loop through amount of table rows in table element
                                var i;
                                for (i = 1; i <= rowsCount; i++) {

                                    var $thisSliderRows = $(this).find("tr.table-row-" + i);
                                    var maxHeight = 0;

                                    $thisSliderRows.each(function() {
                                        if ($(this).height() > maxHeight) {
                                            maxHeight = $(this).height();
                                        }
                                    });

                                    $thisSliderRows.height(maxHeight);

                                }

                            });

                        }

                        var resetHeightsRow = function() {
                            //reset heights for window change
                            $(".fs-table-scrollable .scrollable-table-wrapper .card tr").height(0);
                        }
                        resetHeightsRow();
                        equalHeightsRow();
                    }
                }
            }]
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('navLang', SwitchLanguage);

    SwitchLanguage.$inject = ['urlParserService', 'CatalogService', 'locale', '$window'];

    function SwitchLanguage(urlParserService, catalogService, locale, $window) {
        return {
            restrict: 'EAC',
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                if (urlParserService.isOCS()) {
                    element
                        .children('li')
                        .each(function (index, el) {
                            var link = angular.element(el).children('a');

                            link.click(function (e) {
                                e.preventDefault();
                                var language = link.children('span').text().toLowerCase();
                                var newLocale = locale.toString().replace(locale.language, language);
                                catalogService
                                    .resolveUriFromHierarchy(catalogService.getIdFromLocation(), newLocale)
                                    .then(function (uri) {
                                        $window.location.href = urlParserService.setLanguage(uri, language);
                                    });
                            });
                        });
                }
            }]
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('synchronizeHeight', SynchronizeHeight);

    SynchronizeHeight.$inject = ['$timeout'];

    function SynchronizeHeight($timeout) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    angular
                        .element(document)
                        .find('.card.card-column table tr')
                        .eq(scope.$index + 1)
                        .css('height', element.css('height'));
                }, 500);
            }
        }
    }

})(angular);

(function(angular) {
    angular
        .module('pds.catalog.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider'];

    function RouteConfig($stateProvider) {
        $stateProvider.pdsRoute({
            name: 'catalog',
            url: '{catUrl:.*-[cp]$}',
            templateUrl: 'catalog3.html',
            controller: 'CatalogController as vm',
            resolve: {
                redirect: ['MetaService', function (metaService) {
                    return metaService.redirectOnInvalidUrl();
                }]
            }
        });
    }
})(angular);

(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("BreadcrumbService", BreadcrumbService);

    BreadcrumbService.$inject = ['CatalogService', '_', '$q'];

    function BreadcrumbService(CatalogService, _, $q) {
        return {
            build: build
        };

        function build(categoryId) {
            return CatalogService
                .travelUpNavigationHierarchy(categoryId)
                .then(decorateWithUrls)
                .then(function (tree) {
                    return _
                        .chain(tree)
                        .map(function (node) {
                            return {
                                id: node.id,
                                name: node.name,
                                url: node.url,
                                type: node.type
                            }
                        })
                        .reverse()
                        .value();
                });
        }

        function decorateWithUrls(tree) {
            return $q
                .all(_.map(tree, function (node) {
                    return CatalogService
                        .resolveUriFromHierarchy(node.id)
                        .then(function (url) {
                            node.url = url;
                        });
                }))
                .then(function () {
                    return tree;
                })
        }
    }

})(angular);

(function(angular) {
    angular
        .module("pds.catalog.service")
        .service("CatalogService", CatalogService);

    CatalogService.$inject = ['$window', 'Catalog', 'MenuService', 'SeoFriendlyUrlBuilder', 'catalogSearchListener', '_', '$q', 'locale'];

    function CatalogService($window, Catalog, menuService, SeoFriendlyUrlBuilder, catalogSearchListener, _, $q, locale) {
        var self = this;
        var productPrefix = 'p';
        var categoryPrefix = 'c';

        catalogSearchListener
            .listen()
            .then(function (params) {
                return resolveUriFromHierarchy(params.target.resourceId);
            })
            .then(function (uri) {
                $window.location.href = uri;
            });

        return {
            getByTag: getByTag,
            getNewProductFamilies: getNewProductFamilies,
            getById: getById,
            getTemplate: getTemplate,
            getByIdAndType: getByIdAndType,
            redirectTo: navigateTo,
            navigateTo: navigateTo,
            travelUpHierarchy: travelUpHierarchy,
            travelUpNavigationHierarchy: travelUpNavigationHierarchy,
            getIdFromLocation: getIdFromLocation,
            resolveUri: resolveUri,
            resolveUriFromHierarchy: resolveUriFromHierarchy,
            getProductFamily: getProductFamily
        };

        function getByTag(type, tag) {
            return Catalog.query({type: type, id: tag, queryType: 'tag'}).$promise;
        }

        function getNewProductFamilies() {
            return getByTag(Catalog.fallbackType(), "new");
        }

        function getById(categoryId) {
            return getTypeFromHierarchy(categoryId)
                .then(function (type) {
                    return Catalog.get({id: categoryId, type: type}).$promise;
                });
        }

        function getTemplate(catalogId) {
            return getTypeFromHierarchy(catalogId)
                .then(function (type) {
                    var catalog = new Catalog({
                        template: {name: type},
                        model: {
                            locale: locale.toString(),
                            channel: getOCSChannel(),
                            catalogRequest: {
                                id: catalogId,
                                channel: getOCSChannel(),
                                type: type
                            }
                        }
                    });
                    return catalog.$template();
                });
        }

        function getOCSChannel() {
            return angular.element('meta[name="ocs-channel"]').attr('content')
        }

        function getByIdAndType(id, type) {
            return Catalog.get({id: id, type: type}).$promise;
        }

        function getTypeFromHierarchy(id) {
            return menuService
                .findInNavigation(id)
                .then(function (catalog) {
                    return catalog ? catalog.type : Catalog.fallbackType();
                });
        }

        function travelUpHierarchy(categoryId, tree) {
            tree = tree || [];
            return getById(categoryId)
                .then(function (data) {
                    tree.push({
                        id: data.id.value,
                        type: data.type.value,
                        name: data.name.value
                    });
                    if (data && data.parentId) {
                        return travelUpHierarchy(data.parentId.value, tree);
                    }
                    return tree;
                });
        }

        function travelUpNavigationHierarchy(categoryId, locale) {
            return menuService
                .findInNavigation(categoryId, locale)
                .then(function (item) {
                    var tree = [];
                    while(item != null) {
                        tree.push(item);
                        item = menuService.findParentInNavigation(item.id, locale);
                    }
                    return $q.all(tree);
                });
        }

        function navigateTo(id) {
            return resolveUri(id)
                .then(function (uri) {
                    $window.location.href = uri;
                });
        }

        function resolveUri(categoryId) {
            return travelUpHierarchy(categoryId).then(buildUri);
        }

        function buildUri(tree) {
            var builder = new SeoFriendlyUrlBuilder();
            _.forEachRight(tree, function (node) {
                var fragments = [node.name];
                if (tree.indexOf(node) == 0) {
                    fragments.push(node.id, categoryPrefix);
                }
                builder.addPath(fragments);

                if (node.type == Catalog.fallbackType()) {
                    builder.setPath([node.name, node.id, productPrefix]);
                }
            });
            return builder.build();
        }

        function resolveUriFromHierarchy(categoryId, locale) {
            return travelUpNavigationHierarchy(categoryId, locale).then(buildUri);
        }

        function getIdFromLocation(uri) {
            uri = uri || new URI().toString();
            var parts = uri.split('-');
            return parts[parts.length - 2];
        }

        function getProductFamily(product) {
            if (!product) {
                return $q.resolve(null);
            }
            var elements = product.parentId.value.elements || [product.parentId.value];
            return $q
                .all(_.map(elements, function (parentId) {
                    return menuService.findInNavigation(parentId) || {};
                }))
                .then(function (nodes) {
                    return _.find(nodes, function (node) {
                        return node.type === Catalog.fallbackType();
                    });
                });
        }
    }

})(angular);

(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('MetaService', MetaService);

    MetaService.$inject = ['$rootScope', '$q', '$location', '$window', 'CatalogService', 'imageUrlFilter', 'config', 'urlParserService'];

    var TITLE_DELIMITER = ' | ';
    var LOCALE_DELIMITER = '-';
    var LOCALE_PROPER_DELIMITER = '_';
    var PATH_SEPARATOR = '/';

    function MetaService($rootScope, $q, $location, $window, CatalogService, imageUrlFilter, config, urlParserService) {

        return {
            updateMetaByCategory: updateMetaByCategory,
            redirectOnInvalidUrl: redirectOnInvalidUrl
        };

        function updateMetaByCategory(catalogId) {
            var excludeHreflangs = false;
            CatalogService
                .getTemplate(catalogId)
                .then(function (currentCatalog) {
                    return CatalogService
                        .travelUpNavigationHierarchy(catalogId)
                        .then(function (tree) {
                            tree[0] = currentCatalog;
                            return tree;
                        });
                })
                .then(function (tree) {
                    var q = $q.defer();
                    var currentNode = tree[0];
                    tree[0].name = tree[0].name.value;
                    var headerTitle = [];

                    for (var i = 0; i < tree.length; i++) {
                        if (tree[i] && tree[i].name) {
                            headerTitle.push(tree[i].name);
                        }
                    }
                    headerTitle.push(config.metaTags.siteName);

                    var image = (currentNode.keyVisual || currentNode.productimage || {}).value;
                    var event = {
                        title: headerTitle.join(TITLE_DELIMITER),
                        description: (currentNode.seoMetaText || currentNode.descriptionLong || currentNode.descriptionShort || {}).value,
                        image: image ? imageUrlFilter(image) : undefined,
                        siteName: config.metaTags.siteName,
                        webTrends: {
                            cg_s: tree[0] ? tree[0].name : null,
                            z_cg3: tree[1] ? tree[1].name : null,
                            z_cg4: tree[2] ? tree[2].name : null
                        },
                        canonicalUrl: $location.absUrl()
                    };

                    if (!(currentNode.blockCanonicalTag || {}).value) {
                        var canonicalRef = (currentNode.canonicalRef || {}).value;
                        if(canonicalRef) {
                            excludeHreflangs = canonicalRef != catalogId;
                            CatalogService
                                .resolveUriFromHierarchy(canonicalRef)
                                .then(function (url) {
                                    event.canonicalUrl = url;
                                    q.resolve(event);
                                });
                        } else {
                            q.resolve(event);
                        }
                    }

                    return q.promise;
                })
                .then(function (params) {
                    $rootScope.$broadcast('pds.header.update', params);
                })
                .then(function () {
                    if (excludeHreflangs) {
                        angular.element('link[hreflang]').remove();
                        return false;
                    }
                    angular
                        .element('link[hreflang]')
                        .each(function (index, link) {
                            var linkObject = angular.element(link);
                            var locale = linkObject.attr('hreflang');
                            locale = locale.split(LOCALE_DELIMITER);
                            CatalogService
                                .resolveUriFromHierarchy(catalogId, locale[0] + LOCALE_PROPER_DELIMITER + locale[1])
                                .then(function (url) {
                                    linkObject.attr('href', url.replace(/\/[a-z]{2}\/[a-z]{2}\//, PATH_SEPARATOR + locale[1].toLowerCase() + PATH_SEPARATOR + locale[0].toLowerCase()  + PATH_SEPARATOR));
                                    return !!url;
                                })
                                .then(function (result) {
                                    return result || linkObject.remove();
                                });
                        });
                });
        }

        function redirectOnInvalidUrl() {
            return CatalogService
                .resolveUriFromHierarchy(urlParserService.getCatalogId())
                .then(function (url) {
                    if (encodeURI(url) != URI().toString()) {
                        $window.location.href = url;
                    }
                })
        }
    }
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.service')
        .service('catalogSearchListener', CatalogSearchListener);

    CatalogSearchListener.$inject = ['$rootScope', '$q', 'env'];

    function CatalogSearchListener($root, $q, env) {
        this.listen = function () {
            var def = $q.defer();
            $root.$on('pds.search.navigate', function (event, params) {
                if (params.target.channelDiscriminator == env.search.pdsChannelDiscriminator || params.target.resourceId) {
                    def.resolve(params);
                }
            });
            return def.promise;
        }
    }
})(angular);

(function (angular, URI) {
    angular
        .module('pds.catalog.service')
        .factory('SeoFriendlyUrlBuilder', SeoFriendlyUrlBuilderFactory);

    SeoFriendlyUrlBuilderFactory.$inject = ['$window', '_', 'simplifyCharactersFilter', 'config'];

    var fragmentSeparator = '-';
    var pathSeparator = '/';

    function SeoFriendlyUrlBuilderFactory($window, _, simplifyCharactersFilter, config) {
        function SeoFriendlyUrlBuilder(options) {
            this.path = buildBasePath();
            this.simplifyCharactersFilter = simplifyCharactersFilter;
            this.options = options;
        }

        SeoFriendlyUrlBuilder.prototype.addPath = function(fragments) {
            if (!fragments) {
                return this;
            }
            var args = _.compact([].concat(fragments));
            this.path += pathSeparator + this.simplifyCharactersFilter(args.join(fragmentSeparator));
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.setPath = function (fragments) {
            this.path = buildBasePath();
            this.addPath(fragments);
            return this;
        };

        SeoFriendlyUrlBuilder.prototype.build = function () {
            return this.path + (this.options.trailingSlash ? '/' : '');
        };

        return SeoFriendlyUrlBuilder;

        function buildBasePath() {
            return URI().origin() + $window.getBasePath() + config.pdsPathPrefix;
        }
    }


})(angular, URI);

(function (angular) {

    angular
        .module('pds.catalog.service')
        .service('urlParserService', UrlParser);

    UrlParser.$inject = ['config'];

    var countryMatchIndex = 1;
    var languageMatchIndex = 2;
    var rootSegmentMatchIndex = 3;
    var catalogIdMatchIndex = 4;

                      /**  {1}{2}   {3}                                    {4}    **/
                      /** /ch/de/residential.html/qwe/asd/qwe/asd/poiuuy-134233-c **/
    var pathPattern = /^\/([a-z]{2})\/([a-z]{2})\/(?:ocs\/)?([^\/]*)(?:\.html)?\/(?:.*-([0-9]*)-[pc]\/?$)?/i;
    var languagePattern = /(\/[a-z]{2}\/)([a-z]{2})(.*)/i;

    function UrlParser(config) {
        this.config = config;
    }

    UrlParser.prototype.isOCS = function() {
        return !!this.getCatalogId();
    };

    UrlParser.prototype.getRootSegment = function getRootSegment() {
        return matchForIndex(rootSegmentMatchIndex) || this.config.metaTags.siteName;
    };

    UrlParser.prototype.getCatalogId = function () {
        return matchForIndex(catalogIdMatchIndex);
    };

    UrlParser.prototype.getLanguage = function () {
        return matchForIndex(languageMatchIndex);
    };

    UrlParser.prototype.setLanguage = function (url, language) {
        var uri = new URI(url);
        uri.path(uri.path().replace(languagePattern, '$1' + language + '$3'));
        return uri.toString();
    };

    function matchForIndex(index) {
        var match = new URI().path().match(pathPattern);
        return match && match[index];
    }

})(angular);

(function(angular) {
    angular
        .module('pds.search.model')
        .config(SearchProvider);

    SearchProvider.$inject = ['env', 'SearchProvider'];

    function SearchProvider(env, SearchProvider) {
        SearchProvider.searchEndpoint(env.endPoint.searchService);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.search.model')
        .provider('Search', function () {
            var url = null;

            this.searchEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', 'locale', function ($resource, locale) {
                return new Search($resource, locale, url);
            }];
        });

    function Search($resource, locale, url) {
        var methods = {
            localize: {method: 'GET', isArray: true, params: {type: 'localize'}}
        };
        return $resource(url + '/resource/:type/:locale', {locale: locale}, methods);
    }
})(angular);

(function(angular) {
    angular
        .module("pds.search.controller")
        .controller("QuicksearchController", QuicksearchController);

    QuicksearchController.$inject = ['$location', '$state', '$rootScope', 'SearchService', '$window'];

    function QuicksearchController($location, $state, $rootScope, SearchService, $window) {
        var vm = this;
        vm.suggest = suggest;
        vm.goTo = goTo;
        vm.doSearch = doSearch;

        //FIXME a hack to proceed to state `search` after entering search.html
        var path = $location.path();
        if (path && path.indexOf('search.html') > -1 && !$state.is('search')) {
            $state.go('search');
        }

        function suggest() {
            return SearchService
                .suggest(vm.quicksearch)
                .then(function(data) {
                    return vm.autosuggest = data;
                });
        }

        function goTo(target) {
            $rootScope.$broadcast('pds.search.navigate', {target: target});
        }

        function doSearch($item) {
            if (!$item || $item.which === 13) {
                $window.navigate('search.html?terms=' + vm.quicksearch);
            }
        }
    }
})(angular);

(function(angular) {
    angular
        .module("pds.search.controller")
        .controller("SearchController", SearchController);

    SearchController.$inject = ['$anchorScroll', 'SearchService', 'cmsSearchListener', '$rootScope', '$location', '$window', '_', 'translateFilter'];

    function SearchController($anchorScroll, SearchService, cmsSearchListener, $rootScope, $location, $window, _, translateFilter) {
        var vm = this;
        vm.finalSearchResults = [];
        vm.searchTerm = $location.search().terms;
        vm.contactText = translateFilter('SEARCH.NO.RESULT.CHECKLIST.3', {contactLink: "<a href='" + translateFilter('SEARCH.CONTACT.URL') + "' class='link-inline' target='_self'>" + translateFilter('SEARCH.CONTACT') + "</a>"});
        vm.onSearchInput = onSearchInput;
        vm.goToAnchor = goToAnchor;
        vm.goMore = goMore;

        cmsSearchListener
            .listen()
            .then(function (param) {
                $window.location.href = param.target.resourceLocation;
            });
        search();

        function search() {
            if (!vm.searchTerm) {
                return;
            }
            vm.totalLength = false;
            $location.search('terms', vm.searchTerm);

            return SearchService
                .search(vm.searchTerm)
                .then(function(data) {
                    vm.totalLength = data.length;
                    vm.finalSearchResults = _.groupBy(data, 'channelDiscriminator');
                });
        }

        function onSearchInput(keyEvent) {
            if (keyEvent.which === 13) {
                search();
            }
        }

        function goToAnchor(idToGo) {
            $location.hash(idToGo);
            $anchorScroll.yOffset = 80;
            $anchorScroll();
        }

        function goMore(param) {
            $rootScope.$broadcast('pds.search.navigate', {target: param});
        }
    }
})(angular);

(function (angular) {
    angular
        .module('pds.search.service')
        .service('cmsSearchListener', CmsSearchListener);

    CmsSearchListener.$inject = ['$rootScope', '$q', 'config'];

    function CmsSearchListener($root, $q, config) {
        this.listen = function () {
            var def = $q.defer();
            $root.$on('pds.search.navigate', function (event, params) {
                if (!!params.target.resourceLocation) {
                    def.resolve(params);
                }
            });
            return def.promise;
        }
    }
})(angular);

(function(angular) {
	angular
		.module("pds.search.service")
		.service("SearchService", SearchService);

	SearchService.$inject = ['$q', 'Search', 'locale'];

    var MIN_AUTOSUGGEST_TERM_LENGTH = 2;

    function SearchService($q, Search, locale) {
		return {
			search: search,
			suggest: suggest
		};

		function search(search) {
			return Search.query({locale: locale, searchTerm: search}).$promise;
		}

		function suggest(searchTerm) {
            if (searchTerm && searchTerm.length > MIN_AUTOSUGGEST_TERM_LENGTH) {
                return Search.localize({locale: locale, searchTerm: searchTerm}).$promise;
            }
			return $q.resolve([]);
		}

	}

})(angular);

(function(angular) {
    angular
        .module('pds.search.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider', 'config'];

    function RouteConfig($stateProvider, config) {
        $stateProvider.pdsRoute({
            name: 'search',
            params: {
                terms: null
            },
            templateUrl: 'search.html',
            controller: 'SearchController as vm'
        });
    }
})(angular);

(function(angular) {
    angular
        .module("pds.navigation.controller")
        .controller("MenuController", MenuController);

    MenuController.$inject = ['MenuService', '_', 'config'];

    function MenuController(menuService, _, config) {
        var vm = this;
        vm.itemLimit = config.navigationMaxElements;
        vm.menu = vm.menu || {
            name: angular.element('#ocs-nav').children('a').text()
        };

        menuService
            .getMenu()
            .then(function(menu) {
                vm.menu = menu;
            });
    }
})(angular);

(function(angular) {
    angular
        .module('pds.navigation.model')
        .config(NavigationConfig);

    NavigationConfig.$inject = ['env', 'NavigationProvider'];

    function NavigationConfig(env, NavigationProvider) {
        NavigationProvider.navigationEndpoint(env.endPoint.contentService);
    }

})(angular);

(function (angular) {
    angular
        .module('pds.navigation.model')
        .provider('Navigation', function () {
            var url = null;

            this.navigationEndpoint = function (value) {
                url = value;
                return this;
            };

            this.$get = ['$resource', '$cacheFactory', function ($resource, $cacheFactory) {
                return new Navigation($resource, $cacheFactory, url);
            }]
        });

    function Navigation($resource, $cacheFactory, url) {
        var catalogCache = $cacheFactory("navigation");
        var methods = {
            get: {method: 'GET', cache: catalogCache}
        };
        return $resource(url + 'rest/document/display', null, methods);
    }
})(angular);

(function(angular) {
	angular
		.module("pds.navigation.service")
		.service("MenuService", MenuService);

	MenuService.$inject = ['urlParserService', '_', 'Navigation', 'locale', '$q'];

	function MenuService(urlParserService, _, Navigation, locale, $q) {
        var NAVIGATION_TEMPLATE_NAME = 'CATALOG_HIERARCHY';
        var self = this;
        self.currentLocale = locale.toString();
        self.flatNavigation = {};
        self.getMenu = getMenu;
        self.findInNavigation = findInNavigation;
        self.findParentInNavigation = findParentInNavigation;

		function getMenu(locale) {
            var properLocale = locale || self.currentLocale;
            var nav = new Navigation({
                template: {
                    name: NAVIGATION_TEMPLATE_NAME,
                    channel: getOCSChannel()
                },
                model: {
                    locale: properLocale,
                    channel: getOCSChannel()
                }
            });
			return Navigation
                .get({query: nav})
                .$promise
				.then(function (res) {
                    if(!res.root) {
                        return {};
                    }
                    return res.root.children[0];
				})
		}


        function getOCSChannel() {
            return angular.element('meta[name="ocs-channel"]').attr('content')
        }

		function getFlatMenu(locale) {
            return getMenu(locale)
                .then(function (menu) {
                    locale = locale || self.currentLocale;
                    self.flatNavigation[locale] = self.flatNavigation[locale] || flatMenu(menu);
                    return self.flatNavigation[locale];
                })
        }

        function flatMenu(menu, flat) {
            flat = flat || [];
            flat.push(menu);
            _.each(menu.children, function (item) {
                flatMenu(item, flat);
            });
            return flat;
        }

        function findInNavigation(id, locale) {
            return getFlatMenu(locale)
                .then(function(flat) {
                    return _.find(flat, {id: String(id)});
                });
        }

        function findParentInNavigation(childId, locale) {
            return _.find(self.flatNavigation[locale || self.currentLocale], function (val) {
                return !!_.find(val.children, {id: childId});
            });
        }
	}

})(angular);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImVudi5qcyIsImNvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwiY29tbW9uL2NvbmZpZy9hbmNob3IuY29uZmlnLmpzIiwiY29tbW9uL2NvbmZpZy9pMThuLmNvbmZpZy5qcyIsImNvbW1vbi9jb25maWcvbG9jYWxlLmRpc2NvdmVyeS5qcyIsImNvbW1vbi9jb25maWcvbG9kYXNoLmZhY3RvcnkuanMiLCJjb21tb24vY29uZmlnL29jcy5jaGFubmVsLnByb3ZpZGVyLmpzIiwiY29tbW9uL2NvbmZpZy91cmwucGF0dGVybi5sb2NhbGUuZGlzY292ZXJ5Lm1ldGhvZC5qcyIsImNvbW1vbi9jb25maWcvd2luZG93LmRlY29yYXRvci5qcyIsImNvbW1vbi9jb250cm9sbGVyL2NvbnRlbnQuY29udHJvbGxlci5qcyIsImNvbW1vbi9jb250cm9sbGVyL2hlYWRlci5jb250cm9sbGVyLmpzIiwiY29tbW9uL2NvbnRyb2xsZXIvanNvbmxkLmNvbnRyb2xsZXIuanMiLCJjb21tb24vcm91dGUvcm91dGUuY29uZmlnLmpzIiwiY29tbW9uL2RpcmVjdGl2ZS9jbGlwbGlzdGVyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9kaXJlY3RpdmUvanNvbmxkLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9kaXJlY3RpdmUvc2ltcGxlLnN1Ym1lbnUuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2ZpbHRlci9jb252ZXJ0LndoaXRlc3BhY2VzLmZpbHRlci5qcyIsImNvbW1vbi9maWx0ZXIvaW1hZ2UudXJsLmZpbHRlci5qcyIsImNvbW1vbi9maWx0ZXIvc2ltcGxpZnkuY2hhcmFjdGVycy5maWx0ZXIuanMiLCJkb21haW4vY2F0YWxvZy9jYXRhbG9nLm1vZHVsZS5qcyIsImNvbW1vbi9zZXJ2aWNlL3NwaW5uZXIuc2VydmljZS5qcyIsImRvbWFpbi9zZWFyY2gvc2VhcmNoLm1vZHVsZS5qcyIsImRvbWFpbi9uYXZpZ2F0aW9uL25hdmlnYXRpb24ubW9kdWxlLmpzIiwiZG9tYWluL2NhdGFsb2cvZmFjdG9yeS91cmwuYnVpbGRlci5mYWN0b3J5LmpzIiwiZG9tYWluL2NhdGFsb2cvY29udHJvbGxlci9icmVhZGNydW1iLmNvbnRyb2xsZXIuanMiLCJkb21haW4vY2F0YWxvZy9jb250cm9sbGVyL2NhdGFsb2cuY29udHJvbGxlci5qcyIsImRvbWFpbi9jYXRhbG9nL2NvbnRyb2xsZXIvbmV3LXByb2R1Y3QuY29udHJvbGxlci5qcyIsImRvbWFpbi9jYXRhbG9nL2NvbmZpZy9odHRwLmludGVyY2VwdG9yLmNvbmZpZy5qcyIsImRvbWFpbi9jYXRhbG9nL2NvbmZpZy9zYW5pdGl6ZS5jb25maWcuanMiLCJkb21haW4vY2F0YWxvZy9tb2RlbC9jYXRhbG9nLmhlbHBlci5qcyIsImRvbWFpbi9jYXRhbG9nL21vZGVsL2NhdGFsb2cubW9kZWwuY29uZmlnLmpzIiwiZG9tYWluL2NhdGFsb2cvbW9kZWwvY2F0YWxvZy5yZXNvdXJjZS5qcyIsImRvbWFpbi9jYXRhbG9nL2RpcmVjdGl2ZS9hdHRyaWJ1dGUudmFsdWUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL2NhdGFsb2cudGVtcGxhdGUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL2VxdWFsaXplLnRlYXNlci5oZWlnaHQuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL29jcy5icmVhZGNydW1iLmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL2RpcmVjdGl2ZS9vY3MubmF2aWdhdGUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL3Njcm9sbGFibGUudGFibGUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL3N3aXRjaC5sYW5ndWFnZS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvc3luY2hyb25pemUuaGVpZ2h0LmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL3JvdXRlL2NhdGFsb2cucm91dGUuY29uZmlnLmpzIiwiZG9tYWluL2NhdGFsb2cvc2VydmljZS9icmVhZGNydW1iLnNlcnZpY2UuanMiLCJkb21haW4vY2F0YWxvZy9zZXJ2aWNlL2NhdGFsb2cuc2VydmljZS5qcyIsImRvbWFpbi9jYXRhbG9nL3NlcnZpY2UvbWV0YS5zZXJ2aWNlLmpzIiwiZG9tYWluL2NhdGFsb2cvc2VydmljZS9zZWFyY2gubGlzdGVuZXIuanMiLCJkb21haW4vY2F0YWxvZy9zZXJ2aWNlL3Nlby5mcmllbmRseS51cmwuYnVpbGRlci5qcyIsImRvbWFpbi9jYXRhbG9nL3NlcnZpY2UvdXJsLnBhcnNlci5zZXJ2aWNlLmpzIiwiZG9tYWluL3NlYXJjaC9tb2RlbC9zZWFyY2gubW9kZWwuY29uZmlnLmpzIiwiZG9tYWluL3NlYXJjaC9tb2RlbC9zZWFyY2gucmVzb3VyY2UuanMiLCJkb21haW4vc2VhcmNoL2NvbnRyb2xsZXIvcXVpY2tzZWFyY2guY29udHJvbGxlci5qcyIsImRvbWFpbi9zZWFyY2gvY29udHJvbGxlci9zZWFyY2guY29udHJvbGxlci5qcyIsImRvbWFpbi9zZWFyY2gvc2VydmljZS9jbXMuc2VhcmNoLmxpc3RlbmVyLmpzIiwiZG9tYWluL3NlYXJjaC9zZXJ2aWNlL3NlYXJjaC5zZXJ2aWNlLmpzIiwiZG9tYWluL3NlYXJjaC9yb3V0ZS9zZWFyY2gucm91dGUuY29uZmlnLmpzIiwiZG9tYWluL25hdmlnYXRpb24vY29udHJvbGxlci9tZW51LmNvbnRyb2xsZXIuanMiLCJkb21haW4vbmF2aWdhdGlvbi9tb2RlbC9uYXZpZ2F0aW9uLm1vZGVsLmNvbmZpZy5qcyIsImRvbWFpbi9uYXZpZ2F0aW9uL21vZGVsL25hdmlnYXRpb24ucmVzb3VyY2UuanMiLCJkb21haW4vbmF2aWdhdGlvbi9zZXJ2aWNlL21lbnUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5lbnZpcm9ubWVudCcsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncHJvZHVjdC1kYXRhLXNlcnZpY2UnLCBbJ3Bkcy5jYXRhbG9nJywgJ3Bkcy5uYXZpZ2F0aW9uJywgJ3Bkcy5lbnZpcm9ubWVudCcsICdwZHMuc2VhcmNoJywgJ3Bkcy5jb21tb24nLCAndWkucm91dGVyJywgJ25nU2FuaXRpemUnXSk7XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoKSB7IFxuIHJldHVybiBhbmd1bGFyLm1vZHVsZShcInBkcy5lbnZpcm9ubWVudFwiKVxuLmNvbnN0YW50KFwiY29uZmlnXCIsIHtcbiAgXCJtZXRhVGFnc1wiOiB7XG4gICAgXCJzaXRlTmFtZVwiOiBcIkJ1ZGVydXNcIlxuICB9LFxuICBcInVybFNjaGVtYVwiOiB7XG4gICAgXCJ0cmFpbGluZ1NsYXNoXCI6IHRydWVcbiAgfSxcbiAgXCJwZHNQYXRoUHJlZml4XCI6IFwiL29jc1wiLFxuICBcInBkc1RlbXBsYXRlUGF0aFwiOiBcIi9zcmMvaHRtbFwiLFxuICBcImZvcmNlTGFuZ3VhZ2VcIjogbnVsbCxcbiAgXCJzZWFyY2hcIjoge1xuICAgIFwiZGVmYXVsdEltYWdlXCI6IFwiZGVmYXVsdC1zZWFyY2hcIlxuICB9XG59KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7IFxuIHJldHVybiBhbmd1bGFyLm1vZHVsZShcInBkcy5lbnZpcm9ubWVudFwiKVxuLmNvbnN0YW50KFwiZW52XCIsIHtcbiAgXCJlbmRQb2ludFwiOiB7XG4gICAgXCJwcm9kdWN0RGF0YVNlcnZpY2VcIjogXCJodHRwczovL3NlcnZpY2VzLmtpdHRlbGJlcmdlci5uZXQvcHJvZHVjdGRhdGEvYnVkZXJ1cy9cIixcbiAgICBcImNvbnRlbnRTZXJ2aWNlXCI6IFwiaHR0cHM6Ly9kZXYwMi5zYWdpdG9uLnBsL2NvbnRlbnQtc2VydmljZS1kZXYvXCIsXG4gICAgXCJzZWFyY2hTZXJ2aWNlXCI6IFwiaHR0cHM6Ly9zZXJ2aWNlcy5raXR0ZWxiZXJnZXIubmV0L3NlYXJjaC92MS9cIixcbiAgICBcIm9jc01lZGlhRW5kcG9pbnRcIjogXCJodHRwczovL3NlcnZpY2VzLmtpdHRlbGJlcmdlci5uZXQvcHJvZHVjdGRhdGEvYnVkZXJ1cy9cIlxuICB9LFxuICBcInNlYXJjaFwiOiB7XG4gICAgXCJjbXNDaGFubmVsRGlzY3JpbWluYXRvclwiOiBcImRlQ0hDbXNEaXNjcmltaW5hdG9yXCIsXG4gICAgXCJwZHNDaGFubmVsRGlzY3JpbWluYXRvclwiOiBcImJ1ZGVydXNQZHNEaXNjcmltaW5hdG9yXCJcbiAgfVxufSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5yb3V0ZScsIFsndWkucm91dGVyJywgJ25jeS1hbmd1bGFyLWJyZWFkY3J1bWInLCAncGRzLmVudmlyb25tZW50J10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLnNlcnZpY2UnLCBbXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJywgWydwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLmNvbnRyb2xsZXInLCBbJ25nQW5pbWF0ZScsICduZ1Nhbml0aXplJywgJ2RhdGF0YWJsZXMnLCAnaGwuc3RpY2t5JywgJ2RjYkltZ0ZhbGxiYWNrJywgJ3NsaWNrQ2Fyb3VzZWwnXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24ubW9kZWwnLCBbXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24uZmFjdG9yeScsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5kaXJlY3RpdmUnLCBbXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24uZmlsdGVyJywgWydwZHMuZW52aXJvbm1lbnQnXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24nLCBbJ3Bkcy5jb21tb24uY29udHJvbGxlcicsICdwZHMuY29tbW9uLnJvdXRlJywgJ3Bkcy5jb21tb24uc2VydmljZScsICdwZHMuY29tbW9uLmNvbmZpZycsICdwZHMuY29tbW9uLm1vZGVsJ10pO1xufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIsICQpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJylcbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnYScpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGlkeCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhJChlbCkuYXR0cigndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX3NlbGYnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG59KShhbmd1bGFyLCAkKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhciwgd2luZG93KSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycpXG4gICAgICAgIC5jb25maWcoWyckdHJhbnNsYXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmNtc1RyYW5zbGF0aW9ucykge1xuICAgICAgICAgICAgICAgICR0cmFuc2xhdGVQcm92aWRlclxuICAgICAgICAgICAgICAgICAgICAudHJhbnNsYXRpb25zKCd0aGlzJywgd2luZG93LmNtc1RyYW5zbGF0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnc2FuaXRpemUnKVxuICAgICAgICAgICAgICAgICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ3RoaXMnKVxuICAgICAgICAgICAgICAgICAgICAudXNlKCd0aGlzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcblxufSkoYW5ndWxhciwgd2luZG93KTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnKVxuICAgICAgICAucHJvdmlkZXIoJ2xvY2FsZScsIExvY2FsZVByb3ZpZGVyKTtcblxuXG4gICAgZnVuY3Rpb24gTG9jYWxlUHJvdmlkZXIoKSB7XG4gICAgICAgIHZhciBkaXNjb3ZlcnlNZXRob2RzID0gW107XG5cbiAgICAgICAgdGhpcy5hZGREaXNjb3ZlcnlNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgICAgICBkaXNjb3ZlcnlNZXRob2RzLnB1c2gobWV0aG9kKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJGdldCA9IFsnXycsIGZ1bmN0aW9uIChfKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExvY2FsZShfLCBkaXNjb3ZlcnlNZXRob2RzKTtcbiAgICAgICAgfV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTG9jYWxlKF8sIGRpc2NvdmVyeU1ldGhvZHMpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IF8uZmluZChkaXNjb3ZlcnlNZXRob2RzLCBfLmF0dGVtcHQpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gIG1ldGhvZCA/IG1ldGhvZCgpIDogW107XG4gICAgICAgIHZhciBjb3VudHJ5ID0gcmVzdWx0WzFdO1xuICAgICAgICB2YXIgbGFuZ3VhZ2UgPSByZXN1bHRbMl07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3VudHJ5OiBjb3VudHJ5LFxuICAgICAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxuICAgICAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlLnRvTG93ZXJDYXNlKCkgKyBcIl9cIiArIHRoaXMuY291bnRyeS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycpXG4gICAgICAgIC5mYWN0b3J5KCdfJywgWyckd2luZG93JywgZnVuY3Rpb24gKCR3aW5kb3cpIHtcbiAgICAgICAgICAgIHJldHVybiAkd2luZG93Ll87XG4gICAgICAgIH1dKTtcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJylcbiAgICAgICAgLmZhY3RvcnkoJ29jc0NoYW5uZWwnLCBPY3NDaGFubmVsKTtcblxuICAgIGZ1bmN0aW9uIE9jc0NoYW5uZWwoKSB7XG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoJ21ldGFbbmFtZT1cIm9jcy1jaGFubmVsXCJdJykuYXR0cignY29udGVudCcpO1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycpXG4gICAgICAgIC5jb25maWcoWydsb2NhbGVQcm92aWRlcicsIGZ1bmN0aW9uIChsb2NhbGVQcm92aWRlcikge1xuICAgICAgICAgICAgdmFyIGxvY2FsZVVybFBhdHRlcm4gPSAvXlxcLyhbYS16QS1aXXsyfSlcXC8oW2EtekEtWl17Mn0pLztcbiAgICAgICAgICAgIGxvY2FsZVByb3ZpZGVyLmFkZERpc2NvdmVyeU1ldGhvZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZVVybFBhdHRlcm4uZXhlYyhuZXcgVVJJKCkucGF0aCgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJylcbiAgICAgICAgLmRlY29yYXRvcignJHdpbmRvdycsIFsnJGRlbGVnYXRlJywgV2luZG93RGVjb3JhdG9yXSk7XG5cbiAgICBmdW5jdGlvbiBXaW5kb3dEZWNvcmF0b3IoJGRlbGVnYXRlKSB7XG4gICAgICAgICRkZWxlZ2F0ZS5uYXZpZ2F0ZSA9IGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgICAgIGlmICh1cmkuaW5kZXhPZignLycpICE9IDApIHtcbiAgICAgICAgICAgICAgICB1cmkgPSAnLycuY29uY2F0KHVyaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkZGVsZWdhdGUubG9jYXRpb24uaHJlZiA9IGdldEJhc2VQYXRoKCkgKyB1cmk7XG4gICAgICAgIH07XG4gICAgICAgICRkZWxlZ2F0ZS5nZXRCYXNlUGF0aCA9IGZ1bmN0aW9uIGdldEJhc2VQYXRoKCkge1xuICAgICAgICAgICAgdmFyIGJhc2VQYXRoID0gYW5ndWxhci5lbGVtZW50KCdiYXNlJykuYXR0cignaHJlZi1vdmVycmlkZScpO1xuXG4gICAgICAgICAgICBpZiAoIWJhc2VQYXRoKVxuICAgICAgICAgICAgICAgIGJhc2VQYXRoID0gYW5ndWxhci5lbGVtZW50KCdiYXNlJykuYXR0cignaHJlZicpO1xuXG4gICAgICAgICAgICBpZiAoYmFzZVBhdGgubGFzdEluZGV4T2YoJy8nKSA9PSAoYmFzZVBhdGgubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICBiYXNlUGF0aCA9IGJhc2VQYXRoLnNsaWNlKDAsIGJhc2VQYXRoLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGJhc2VQYXRoO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJGRlbGVnYXRlO1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbnRyb2xsZXInKVxuICAgICAgICAuY29udHJvbGxlcignQ29udGVudENvbnRyb2xsZXInLCBDb250ZW50Q29udHJvbGxlcik7XG5cbiAgICBDb250ZW50Q29udHJvbGxlci4kaW5qZWN0ID0gWydTcGlubmVyU2VydmljZSddO1xuXG4gICAgZnVuY3Rpb24gQ29udGVudENvbnRyb2xsZXIoc3Bpbm5lclNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5pc1NwaW5uaW5nID0gc3Bpbm5lclNlcnZpY2UuaXNMb2FkaW5nO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29udHJvbGxlcicpXG4gICAgICAgIC5jb250cm9sbGVyKCdoZWFkZXJDb250cm9sbGVyJywgSGVhZGVyQ29udHJvbGxlcik7XG5cbiAgICBIZWFkZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnbG9jYWxlJywgJ2NvbmZpZycsICdqc29uRmlsdGVyJywgJ18nLCAnQnJlYWRjcnVtYlNlcnZpY2UnXTtcbiAgICB2YXIgY29udGVudEdyb3VwcyA9IFsnV1QuY2dfbicsICdXVC5jZ19zJywgJ1dULnpfY2czJywgJ1dULnpfY2c0JywgJ1dULnpfY2c1JywgJ1dULnpfY2c2JywgJ1dULnpfY2c3JywgJ1dULnpfY2c4JywgJ1dULnpfY2c5JywgJ1dULnpfY2cxMCddO1xuXG4gICAgZnVuY3Rpb24gSGVhZGVyQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgbG9jYWxlLCBjb25maWcsIGpzb25GaWx0ZXIsIF8sIEJyZWFkY3J1bWJTZXJ2aWNlKSB7XG4gICAgICAgIHZhciByb290Q29udGVudEdyb3VwID0ge25hbWU6IGNvbmZpZy5tZXRhVGFncy5zaXRlTmFtZX07XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLnVybCA9ICRsb2NhdGlvbi5hYnNVcmwoKTtcbiAgICAgICAgdm0ubG9jYWxlID0gbG9jYWxlLnRvU3RyaW5nKCk7XG4gICAgICAgIHZtLmJyYW5kID0gY29uZmlnLm1ldGFUYWdzLmJyYW5kO1xuICAgICAgICB2bS5jb3VudHJ5ID0gbG9jYWxlLmNvdW50cnk7XG4gICAgICAgIHZtLmxhbmd1YWdlID0gbG9jYWxlLmxhbmd1YWdlO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3Bkcy5oZWFkZXIudXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHZtLnRpdGxlID0gcGFyYW1zLnRpdGxlO1xuICAgICAgICAgICAgdm0uZGVzY3JpcHRpb24gPSBwYXJhbXMuZGVzY3JpcHRpb247XG4gICAgICAgICAgICB2bS5pbWFnZSA9IHBhcmFtcy5pbWFnZTtcbiAgICAgICAgICAgIHZtLndlYlRyZW5kcyA9IHBhcmFtcy53ZWJUcmVuZHM7XG4gICAgICAgICAgICB2bS5zaXRlTmFtZSA9IHBhcmFtcy5zaXRlTmFtZTtcbiAgICAgICAgICAgIHZtLmNhbm9uaWNhbFVybCA9IHBhcmFtcy5jYW5vbmljYWxVcmw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3Bkcy5oZWFkZXIudXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgIGJ1aWxkSnNvbkxEKHtcbiAgICAgICAgICAgICAgICBcIkBjb250ZXh0XCI6IFwiaHR0cDovL3NjaGVtYS5vcmcvXCIsXG4gICAgICAgICAgICAgICAgXCJAdHlwZVwiOiBcIlByb2R1Y3RcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIiA6IHBhcmFtcy50aXRsZSxcbiAgICAgICAgICAgICAgICBcImltYWdlXCI6IHBhcmFtcy5pbWFnZSxcbiAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IHBhcmFtcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBcImJyYW5kXCI6IGNvbmZpZy5tZXRhVGFncy5zaXRlTmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3Bkcy5icmVhZGNydW1iLnVwZGF0ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICBCcmVhZGNydW1iU2VydmljZVxuICAgICAgICAgICAgICAgIC5idWlsZChwYXJhbXMuY2F0YWxvZ0lkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChicmVhZGNydW1icykge1xuICAgICAgICAgICAgICAgICAgICBidWlsZEpzb25MRCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkBjb250ZXh0XCI6IFwiaHR0cDovL3NjaGVtYS5vcmcvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkB0eXBlXCI6IFwiQnJlYWRjcnVtYkxpc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbUxpc3RFbGVtZW50XCI6IF8ubWFwKGJyZWFkY3J1bWJzLCBmdW5jdGlvbiAoY3J1bWIsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0B0eXBlJzogJ0xpc3RJdGVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQGlkJzogY3J1bWIudXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY3J1bWIubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBicmVhZGNydW1icztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGJ1aWxkQ29udGVudEdyb3Vwcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkSnNvbkxEKG1vZGVsKSB7XG4gICAgICAgICAgICBhbmd1bGFyXG4gICAgICAgICAgICAgICAgLmVsZW1lbnQoJzxzY3JpcHQ+JylcbiAgICAgICAgICAgICAgICAuYXR0cigndHlwZScsICdhcHBsaWNhdGlvbi9sZCtqc29uJylcbiAgICAgICAgICAgICAgICAudGV4dChqc29uRmlsdGVyKG1vZGVsKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJ2hlYWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkQ29udGVudEdyb3Vwcyh0cmVlKSB7XG4gICAgICAgICAgICB0cmVlLnVuc2hpZnQocm9vdENvbnRlbnRHcm91cCk7XG4gICAgICAgICAgICBfLmZvckVhY2godHJlZSwgZnVuY3Rpb24gKGVsZW1lbnQsIGlkeCkge1xuICAgICAgICAgICAgICAgIGFkZE1ldGEoY29udGVudEdyb3Vwc1tpZHhdLCBlbGVtZW50Lm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZE1ldGEobmFtZSwgY29udGVudCkge1xuICAgICAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgICAgIC5lbGVtZW50KCdtZXRhW25hbWU9XCInICsgbmFtZSArICdcIicpXG4gICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuICAgICAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgICAgIC5lbGVtZW50KCc8bWV0YT4nKVxuICAgICAgICAgICAgICAgIC5hdHRyKCduYW1lJywgbmFtZSlcbiAgICAgICAgICAgICAgICAuYXR0cignY29udGVudCcsIGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdoZWFkJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbnRyb2xsZXInKVxuICAgICAgICAuY29udHJvbGxlcignanNvbkxkQ29udHJvbGxlcicsIEpzb25MZENvbnRyb2xsZXIpO1xuXG4gICAgSnNvbkxkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ0JyZWFkY3J1bWJTZXJ2aWNlJywgJ0NhdGFsb2dTZXJ2aWNlJywgJ2pzb25GaWx0ZXInXTtcblxuICAgIGZ1bmN0aW9uIEpzb25MZENvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIEJyZWFkY3J1bWJTZXJ2aWNlLCBDYXRhbG9nU2VydmljZSwganNvbkZpbHRlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS51cmwgPSAkbG9jYXRpb24uYWJzVXJsKCk7XG5cblxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5yb3V0ZScpXG4gICAgICAgIC5jb25maWcoUm91dGVDb25maWcpO1xuXG4gICAgUm91dGVDb25maWcuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnY29uZmlnJ107XG5cbiAgICBmdW5jdGlvbiBSb3V0ZUNvbmZpZygkc3RhdGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsIGNvbmZpZykge1xuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnBkc1JvdXRlID0gZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICByb3V0ZS51cmwgPSB1cmxQYXRoKHJvdXRlLnVybCk7XG4gICAgICAgICAgICByb3V0ZS50ZW1wbGF0ZVVybCA9IGh0bWxQYXRoKHJvdXRlLnRlbXBsYXRlVXJsKTtcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKHJvdXRlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB1cmxQYXRoKHBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcucGRzUGF0aFByZWZpeCArICcvJyArIHBhdGg7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBodG1sUGF0aChwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnBkc1RlbXBsYXRlUGF0aCArICcvJyArIHBhdGg7XG4gICAgICAgIH1cbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdjbGlwbGlzdGVyJywgQ2xpcGxpc3RlckRpcmVjdGl2ZSk7XG5cbiAgICBDbGlwbGlzdGVyRGlyZWN0aXZlLiRpbmplY3QgPSBbJyRmaWx0ZXInLCAnJHNjZSddO1xuXG4gICAgZnVuY3Rpb24gQ2xpcGxpc3RlckRpcmVjdGl2ZSgkZmlsdGVyLCAkc2NlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGlkPVwidmlkZW9cIiBzdHlsZT1cImhlaWdodDo0MDBweDtcIj48L2Rpdj4nLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICB2aWRlb0lkOiAnPXZpZGVvSWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgbmV3IENsaXBsaXN0ZXJDb250cm9sLlZpZXdlcih7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudElkOiBcInZpZGVvXCIsXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbWVyOiAxNTc4OTMsXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0czogW3Njb3BlLnZpZGVvSWRdLFxuICAgICAgICAgICAgICAgICAgICBrZXlUeXBlOiAxMDAwMCxcbiAgICAgICAgICAgICAgICAgICAgZnNrOiAxOCxcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwbHVnaW5zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBJbm5lckNvbnRyb2xzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXI6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9iaWxlRGVmYXVsdENvbnRyb2xzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImNvbnRyb2xzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhY2tsaXN0OiBbXCJzaGFyZVwiLFwicXVhbGl0eVwiLFwicGxheWJhY2stc3BlZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJleHRlcm5hbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IFwiaHR0cHM6Ly9teWNsaXBsaXN0ZXIuY29tL3N0YXRpYy92aWV3ZXIvYXNzZXRzL3NraW5zL2RlZmF1bHQvY29udHJvbHMuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIENsaWNrYWJsZVZpZGVvOiB7bGF5ZXI6IDF9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUGxheUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcInBsYXlCdXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllcjogNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogXCJodHRwczovL215Y2xpcGxpc3Rlci5jb20vc3RhdGljL3ZpZXdlci9hc3NldHMvc2tpbnMvZGVmYXVsdC9wbGF5QnV0dG9uLnBuZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxMDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBQcmV2aWV3SW1hZ2U6IHtsYXllcjogNn1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgICAgfVxuICAgIH07XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2pzb25sZCcsIEpzb25MZERpcmVjdGl2ZSk7XG5cbiAgICBKc29uTGREaXJlY3RpdmUuJGluamVjdCA9IFsnJGZpbHRlcicsICckc2NlJ107XG5cbiAgICBmdW5jdGlvbiBKc29uTGREaXJlY3RpdmUoJGZpbHRlciwgJHNjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNjcmlwdCB0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiIG5nLWJpbmQtaHRtbD1cIm9uR2V0SnNvbigpXCI+PC9zY3JpcHQ+JyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAganNvbjogJz1qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHNjb3BlLm9uR2V0SnNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbCgkZmlsdGVyKCdqc29uJykoc2NvcGUuanNvbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9O1xuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgncGRzLmNvbW1vbi5kaXJlY3RpdmUnKVxuICAgIC5kaXJlY3RpdmUoJ3NpbXBsZVN1Ym1lbnUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIGluaXROYXZDb2xsYXBzZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uZmlsdGVyJylcbiAgICAgICAgLmZpbHRlcignY29udmVydFdoaXRlc3BhY2VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dCAmJiBpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnPC9icj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwhLS0uKmxhbmd1YWdlLiptaXNzaW5nLiotLT4vZywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmZpbHRlcicpXG4gICAgICAgIC5maWx0ZXIoJ2ltYWdlVXJsJywgSW1hZ2VVcmxGaWx0ZXIpO1xuXG4gICAgSW1hZ2VVcmxGaWx0ZXIuJGluamVjdCA9IFsnZW52JywgJ2xvY2FsZScsICdvY3NDaGFubmVsJ107XG5cbiAgICB2YXIgZGVmYXVsdEltYWdlcyA9IHtcbiAgICAgICAgJ2ltZy1zbSc6ICcvc3JjL21lZGlhL2RlZmF1bHQtNDYweDQ2MC5qcGcnLFxuICAgICAgICAnaW1nLW1kJzogJy9zcmMvbWVkaWEvZGVmYXVsdC02NDB4MzcyLmpwZycsXG4gICAgICAgICdpbWctbGcnOiAnL3NyYy9tZWRpYS9kZWZhdWx0LTY4MHg0NDAuanBnJyxcbiAgICAgICAgJ2ltZy14bGcnOiAnL3NyYy9tZWRpYS9kZWZhdWx0LTE2MDB4NTYwLmpwZydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gSW1hZ2VVcmxGaWx0ZXIoZW52LCBsb2NhbGUsIG9jc0NoYW5uZWwpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZWRpYU9iamVjdCwgc2l6ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1lZGlhT2JqZWN0ID8gZW52LmVuZFBvaW50Lm9jc01lZGlhRW5kcG9pbnQgKyBvY3NDaGFubmVsICsgXCIvXCIgKyBsb2NhbGUudG9TdHJpbmcoKSArIFwiL1wiICsgbWVkaWFPYmplY3QgOiBkZWZhdWx0SW1hZ2VzW3NpemUgfHwgJ2ltZy1zbSddO1xuICAgICAgICB9XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICB2YXIgQ0hBUkFDVEVSX01BUCA9IHtcbiAgICAgICAgJ1xcdTAwMkUnOiAgICcnLCAgLy8uXG4gICAgICAgICdcXHUwMDIwJzogICAnLScsIC8vU1BBQ0VcbiAgICAgICAgJ1xcdTAwMkMnOiAgICctJywgLy8sXG4gICAgICAgICdcXHUwMDI2JzogICAnLScsIC8vJlxuICAgICAgICAnXFx1MDA1Qyc6ICAgJy0nLCAvL1xcXG4gICAgICAgICdcXHUyMDFFJzogICAnLScsIC8v4oCeXG4gICAgICAgICdcXHUwMDIyJzogICAnLScsIC8vJ1xuICAgICAgICAnXFx1MDAyNyc6ICAgJy0nLCAvLydcbiAgICAgICAgJ1xcdTAwQjQnOiAgICctJywgLy/CtFxuICAgICAgICAnXFx1MDA2MCc6ICAgJy0nLCAvL2BcbiAgICAgICAgJ1xcdTAwQkInOiAgICctJywgLy/Cu1xuICAgICAgICAnXFx1MDBBQic6ICAgJy0nLCAvL8KrXG4gICAgICAgICdcXHUwMDJGJzogICAnLScsIC8vL1xuICAgICAgICAnXFx1MDAzQSc6ICAgJy0nLCAvLzpcbiAgICAgICAgJ1xcdTAwMjEnOiAgICctJywgLy8hXG4gICAgICAgICdcXHUwMDJBJzogICAnLScsIC8vKlxuICAgICAgICAnXFx1MDAyOCc6ICAgJy0nLCAvLyhcbiAgICAgICAgJ1xcdTAwMjknOiAgICctJywgLy8pXG4gICAgICAgICdcXHUyMTIyJzogICAnLScsIC8v4oSiXG4gICAgICAgICdcXHUwMEFFJzogICAnLScsIC8vwq5cbiAgICAgICAgJ1xcdTAwRTEnOiAgICdhJywgLy/DoVxuICAgICAgICAnXFx1MDBGMyc6ICAgJ28nLCAvL8OzXG4gICAgICAgICdcXHUwMEVEJzogICAnaScsIC8vw61cbiAgICAgICAgJ1xcdTAwRTknOiAgICdlJywgLy/DqVxuICAgICAgICAnXFx1MDBFNCc6ICAgJ2FlJywvL8OkXG4gICAgICAgICdcXHUwMEY2JzogICAnb2UnLC8vw7ZcbiAgICAgICAgJ1xcdTAxNTEnOiAgICdvJywgLy/FkVxuICAgICAgICAnXFx1MDBGQyc6ICAgJ3UnLCAvL8O8XG4gICAgICAgICdcXHUwMEZBJzogICAndScsIC8vw7pcbiAgICAgICAgJ1xcdTAxNzEnOiAgICd1JywgLy/FsVxuICAgICAgICAnXFx1MDBERic6ICAgJ3NzJywvL8OfXG4gICAgICAgICdcXHUwMEVFJzogICAnaScsIC8vw65cbiAgICAgICAgJ1xcdTAwRTInOiAgICdhJywgLy/DolxuICAgICAgICAnXFx1MDEwMyc6ICAgJ2EnLCAvL8SDXG4gICAgICAgICdcXHUwMjFCJzogICAndCcsIC8vyJtcbiAgICAgICAgJ1xcdTAxNjMnOiAgICd0JywgLy/Fo1xuICAgICAgICAnXFx1MDE1Ric6ICAgJ3QnLCAvL8WfXG4gICAgICAgICdcXHUwMjE5JzogICAncycsIC8vyJlcbiAgICAgICAgJ1xcdTAxNTknOiAgICdyJywgLy/FmVxuICAgICAgICAnXFx1MDE2Zic6ICAgJ3UnLCAvL8WvXG4gICAgICAgICdcXHUwMEZEJzogICAneScsIC8vw71cbiAgICAgICAgJ1xcdTAxMEQnOiAgICdjJywgLy/EjVxuICAgICAgICAnXFx1MDExQic6ICAgJ2UnLCAvL8SbXG4gICAgICAgICdcXHUwMTdFJzogICAneicsIC8vxb5cbiAgICAgICAgJ1xcdTAxNjEnOiAgICdzJywgLy/FoVxuICAgICAgICAnXFx1MDE2NSc6ICAgJ3QnLCAvL8WlXG4gICAgICAgICdcXHUwMTQ4JzogICAnbicsIC8vxYhcbiAgICAgICAgJ1xcdTIwMTknOiAgICctJywgLy/igJlcbiAgICAgICAgJ1xcdTAwZTAnOiAgICdhJyAgLy/DoFxuICAgIH07XG4gICAgdmFyIGNoYXJhY3RlclJlZ2V4ID0gX1xuICAgICAgICAubWFwKENIQVJBQ1RFUl9NQVAsIGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuICdcXFxcJyArIGtleTtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJ3wnKTtcbiAgICB2YXIgcmVnRXhwID0gbmV3IFJlZ0V4cChjaGFyYWN0ZXJSZWdleCwgJ2cnKTtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5maWx0ZXInKVxuICAgICAgICAuZmlsdGVyKCdzaW1wbGlmeUNoYXJhY3RlcnMnLCBbJ18nLCBmdW5jdGlvbiAoXykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsICYmIHZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKHJlZ0V4cCwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENIQVJBQ1RFUl9NQVBbbWF0Y2hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY2F0YWxvZy5yb3V0ZScsIFsncGRzLmNvbW1vbi5yb3V0ZScsICd1aS5yb3V0ZXInLCAnbmN5LWFuZ3VsYXItYnJlYWRjcnVtYiddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cuc2VydmljZScsIFsncGRzLmNvbW1vbi5maWx0ZXInXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbmZpZycsIFsncGRzLmVudmlyb25tZW50JywgJ25nUmVzb3VyY2UnLCAncGRzLmNvbW1vbi5jb25maWcnXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbnRyb2xsZXInLCBbJ25nU2FuaXRpemUnLCAnZGF0YXRhYmxlcycsICdobC5zdGlja3knLCAnZGNiSW1nRmFsbGJhY2snLCAnc2xpY2tDYXJvdXNlbCcsICdwZHMuY2F0YWxvZy5zZXJ2aWNlJywgJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScsICdwZHMubmF2aWdhdGlvbi5zZXJ2aWNlJ10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY2F0YWxvZy5tb2RlbCcsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cuZmFjdG9yeScsIFsncGRzLmNhdGFsb2cuc2VydmljZSddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJywgW10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY2F0YWxvZycsIFsncGRzLmNhdGFsb2cuY29udHJvbGxlcicsICdwZHMuY2F0YWxvZy5yb3V0ZScsICdwZHMuY2F0YWxvZy5zZXJ2aWNlJywgJ3Bkcy5jYXRhbG9nLmNvbmZpZycsICdwZHMuY2F0YWxvZy5tb2RlbCddKTtcbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLnNlcnZpY2UnKVxuICAgICAgICAuc2VydmljZSgnU3Bpbm5lclNlcnZpY2UnLCBTcGlubmVyU2VydmljZSk7XG5cbiAgICBTcGlubmVyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddO1xuXG4gICAgZnVuY3Rpb24gU3Bpbm5lclNlcnZpY2UoJGh0dHApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuaXNMb2FkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBlbmRpbmdSZXF1ZXN0cy5sZW5ndGggPiAwO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLnJvdXRlJywgWydwZHMuY29tbW9uLnJvdXRlJywgJ3VpLnJvdXRlciddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2guc2VydmljZScsIFsncGRzLm5hdmlnYXRpb24ubW9kZWwnLCAncGRzLmNvbW1vbi5jb25maWcnXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLmNvbmZpZycsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2guY29udHJvbGxlcicsIFsncGRzLnNlYXJjaC5zZXJ2aWNlJywgJ3VpLmJvb3RzdHJhcCddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2gubW9kZWwnLCBbXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLmRpcmVjdGl2ZScsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2gnLCBbJ3Bkcy5zZWFyY2guY29udHJvbGxlcicsICdwZHMuc2VhcmNoLnJvdXRlJywgJ3Bkcy5zZWFyY2guc2VydmljZScsICdwZHMuc2VhcmNoLmNvbmZpZycsICdwZHMuc2VhcmNoLm1vZGVsJ10pO1xufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLnJvdXRlJywgWyd1aS5yb3V0ZXInXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5zZXJ2aWNlJywgWydwZHMubmF2aWdhdGlvbi5tb2RlbCcsICdwZHMuY29tbW9uLnNlcnZpY2UnXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5jb25maWcnLCBbXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5jb250cm9sbGVyJywgWydwZHMubmF2aWdhdGlvbi5zZXJ2aWNlJywgJ3Bkcy5jb21tb24uc2VydmljZSddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLm1vZGVsJywgW10pO1xuICBhbmd1bGFyLm1vZHVsZSgncGRzLm5hdmlnYXRpb24uZGlyZWN0aXZlJywgW10pO1xuICBhbmd1bGFyLm1vZHVsZSgncGRzLm5hdmlnYXRpb24nLCBbJ3Bkcy5uYXZpZ2F0aW9uLmNvbnRyb2xsZXInLCAncGRzLm5hdmlnYXRpb24ucm91dGUnLCAncGRzLm5hdmlnYXRpb24uc2VydmljZScsICdwZHMubmF2aWdhdGlvbi5jb25maWcnLCAncGRzLm5hdmlnYXRpb24ubW9kZWwnXSk7XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5mYWN0b3J5JylcbiAgICAgICAgLmZhY3RvcnkoJ3VybEJ1aWxkZXInLCBVcmxCdWlsZGVyKTtcblxuICAgIFVybEJ1aWxkZXIuJGluamVjdCA9IFsnJGluamVjdG9yJ107XG5cbiAgICBmdW5jdGlvbiBVcmxCdWlsZGVyKCRpbmplY3Rvcikge1xuICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnc2VvRnJpZW5kbHlVcmxCdWlsZGVyJyk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbnRyb2xsZXInKVxuICAgICAgICAuY29udHJvbGxlcignQnJlYWRjcnVtYkNvbnRyb2xsZXInLCBCcmVhZGNydW1iQ29udHJvbGxlcik7XG5cbiAgICBCcmVhZGNydW1iQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQnJlYWRjcnVtYlNlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIEJyZWFkY3J1bWJDb250cm9sbGVyKCRzY29wZSwgQnJlYWRjcnVtYlNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuYnJlYWRjcnVtYi51cGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgQnJlYWRjcnVtYlNlcnZpY2VcbiAgICAgICAgICAgICAgICAuYnVpbGQocGFyYW1zLmNhdGVnb3J5SWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2bS5icmVhZGNydW1icyA9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ubGFzdCh2bS5icmVhZGNydW1icykudHlwZSA9PSAncHJvZHVjdF9kZXRhaWxzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcjbmF2LWJyZWFkY3J1bWJzJykuYWRkQ2xhc3MoJ2RhcmstYnJlYWRjcnVtYicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuY29udHJvbGxlcicpXG4gICAgICAgIC5jb250cm9sbGVyKFwiQ2F0YWxvZ0NvbnRyb2xsZXJcIiwgQ2F0YWxvZ0NvbnRyb2xsZXIpO1xuXG4gICAgQ2F0YWxvZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAndXJsUGFyc2VyU2VydmljZScsICdfJywgJ01ldGFTZXJ2aWNlJ107XG5cbiAgICBmdW5jdGlvbiBDYXRhbG9nQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUsIHVybFBhcnNlclNlcnZpY2UsIF8sIE1ldGFTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZtLmNhdGFsb2dJZCA9IHVybFBhcnNlclNlcnZpY2UuZ2V0Q2F0YWxvZ0lkKCk7XG4gICAgICAgIHZtLmFueVByb2R1Y3RIYXNWYWx1ZSA9IGFueVByb2R1Y3RIYXNWYWx1ZTtcbiAgICAgICAgdm0udGFibGVEZWZpbml0aW9uQ29udGFpbnMgPSB0YWJsZURlZmluaXRpb25Db250YWlucztcblxuICAgICAgICBNZXRhU2VydmljZS51cGRhdGVNZXRhQnlDYXRlZ29yeSh2bS5jYXRhbG9nSWQpO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Bkcy5icmVhZGNydW1iLnVwZGF0ZScsIHtjYXRhbG9nSWQ6IHZtLmNhdGFsb2dJZH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3Bkcy5jYXRhbG9nLmxvYWRlZCcsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdENhdGFsb2cocGFyYW1zLmNhdGFsb2cpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuY2F0YWxvZy5sb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhbmd1bGFyXG4gICAgICAgICAgICAgICAgLmVsZW1lbnQoJyNuYXYtcHJpbWFyeS1jb2xsYXBzZScpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgICAgIC5lbGVtZW50KCcjb2NzLW5hdicpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdENhdGFsb2coY2F0YWxvZykge1xuICAgICAgICAgICAgdm0uY2F0YWxvZyA9IGNhdGFsb2c7XG4gICAgICAgICAgICBpZiAoXy5nZXQodm0uY2F0YWxvZywgJ3JlZGlyZWN0Q2F0ZWdvcnkuaWQnKSA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ2F0YWxvZ1NlcnZpY2UucmVkaXJlY3RUbyh2bS5jYXRhbG9nLnJlZGlyZWN0Q2F0ZWdvcnkuaWQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm0uY2F0YWxvZy5lbmVyZ3lFZmZpY2llbmN5ID0gdm0uY2F0YWxvZy5lbmVyZ3lFZmZpY2llbmN5IHx8IHt9O1xuICAgICAgICAgICAgdmFyIHRlY2huaWNhbERhdGFUYWJsZSA9IHZtLmNhdGFsb2cudGVjaG5pY2FsRGF0YVRhYmxlKCk7XG4gICAgICAgICAgICBpZiAodGVjaG5pY2FsRGF0YVRhYmxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlRGVmaW5pdGlvbiA9IHRlY2huaWNhbERhdGFUYWJsZS50YWJsZURlZmluaXRpb247XG4gICAgICAgICAgICAgICAgdGVjaG5pY2FsRGF0YVRhYmxlLnRhYmxlRGVmaW5pdGlvbiA9IF9cbiAgICAgICAgICAgICAgICAgICAgLmNoYWluKHRhYmxlRGVmaW5pdGlvbilcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihhdHRyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVjaG5pY2FsRGF0YVRhYmxlLnNob3dBdHRyaWJ1dGVzV2l0aE5vVmFsdWVzIHx8IGFueVByb2R1Y3RIYXNWYWx1ZSh0ZWNobmljYWxEYXRhVGFibGUucHJvZHVjdHMsIGF0dHIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGlzTm90SGVhZGVyQXR0cmlidXRlLmJpbmQodGhpcywgdGVjaG5pY2FsRGF0YVRhYmxlLnByb2R1Y3RzKSlcbiAgICAgICAgICAgICAgICAgICAgLnZhbHVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc05vdEhlYWRlckF0dHJpYnV0ZShwcm9kdWN0cywgYXR0cikge1xuICAgICAgICAgICAgcmV0dXJuICFpc0hlYWRlckF0dHJpYnV0ZShwcm9kdWN0cywgYXR0cik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0hlYWRlckF0dHJpYnV0ZShwcm9kdWN0cywgYXR0cikge1xuICAgICAgICAgICAgcmV0dXJuIF8uc29tZShwcm9kdWN0cywgZnVuY3Rpb24gKHByb2R1Y3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdC5oZWFkZXIua2V5ID09IGF0dHIua2V5O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbnlQcm9kdWN0SGFzVmFsdWUocHJvZHVjdHMsIGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIF8uc29tZShwcm9kdWN0cywgYXR0cmlidXRlLmtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0YWJsZURlZmluaXRpb25Db250YWlucyhkZWZpbml0aW9uLCBrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnNvbWUoZGVmaW5pdGlvbiwge2tleToga2V5fSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbnRyb2xsZXInKVxuICAgICAgICAuY29udHJvbGxlcihcIk5ld1Byb2R1Y3RDb250cm9sbGVyXCIsIE5ld1Byb2R1Y3RDb250cm9sbGVyKTtcblxuICAgIE5ld1Byb2R1Y3RDb250cm9sbGVyLiRpbmplY3QgPSBbJ0NhdGFsb2dTZXJ2aWNlJywgJ18nXTtcblxuICAgIGZ1bmN0aW9uIE5ld1Byb2R1Y3RDb250cm9sbGVyKGNhdGFsb2dTZXJ2aWNlLCBfKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucHJvZHVjdHNMb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uc2xpY2tTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIFwiYXJyb3dzXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJkb3RzXCI6IHRydWUsXG4gICAgICAgICAgICBcImluZmluaXRlXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzcGVlZFwiOiAxMDAwLFxuICAgICAgICAgICAgXCJjc3NFYXNlXCI6IFwiZWFzZS1pbi1vdXRcIixcbiAgICAgICAgICAgIFwic2xpZGVzVG9TaG93XCI6IDQsXG4gICAgICAgICAgICBcInNsaWRlc1RvU2Nyb2xsXCI6IDQsXG4gICAgICAgICAgICBcInJlc3BvbnNpdmVcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJicmVha3BvaW50XCI6IDk5MixcbiAgICAgICAgICAgICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNsaWRlc1RvU2hvd1wiOiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzbGlkZXNUb1Njcm9sbFwiOiAyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJicmVha3BvaW50XCI6IDc2OCxcbiAgICAgICAgICAgICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNsaWRlc1RvU2hvd1wiOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzbGlkZXNUb1Njcm9sbFwiOiAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgY2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgIC5nZXROZXdQcm9kdWN0RmFtaWxpZXMoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZtLnByb2R1Y3RGYW1pbGllcyA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICB2bS5wcm9kdWN0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuY29uZmlnJylcbiAgICAgICAgLmNvbmZpZyhbJyRodHRwUHJvdmlkZXInLCBIdHRwQ29uZmlnXSk7XG5cbiAgICBmdW5jdGlvbiBIdHRwQ29uZmlnKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbJyRxJywgJyRpbmplY3RvcicsIGZ1bmN0aW9uICgkcSwgJGluamVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAkaW5qZWN0b3IuZ2V0KCckc3RhdGUnKS5nbygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmNvbmZpZycpXG4gICAgICAgIC5jb25maWcoWyckc2NlRGVsZWdhdGVQcm92aWRlcicsIFNjZUNvbmZpZ10pO1xuXG4gICAgZnVuY3Rpb24gU2NlQ29uZmlnKCRzY2VEZWxlZ2F0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzY2VEZWxlZ2F0ZVByb3ZpZGVyLnJlc291cmNlVXJsV2hpdGVsaXN0KFtcbiAgICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICAgICdodHRwczovL3Bkcy1ib3NjaC10dC5raXR0ZWxiZXJnZXIubmV0LyoqJyxcbiAgICAgICAgICAgICdodHRwczovL3NzLWJvc2NoLXR0LmtpdHRlbGJlcmdlci5uZXQvKionLFxuICAgICAgICAgICAgJ2h0dHBzOi8vbXljbGlwbGlzdGVyLmNvbS8qKidcbiAgICAgICAgXSk7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cubW9kZWwnKVxuICAgICAgICAuZmFjdG9yeSgnQ2F0YWxvZ0hlbHBlcicsIENhdGFsb2dIZWxwZXIpO1xuXG4gICAgZnVuY3Rpb24gQ2F0YWxvZ0hlbHBlcigpIHtcbiAgICAgICAgdGhpcy50b1ZpZXcgPSBmdW5jdGlvbiAoY2F0YWxvZykge1xuICAgICAgICAgICAgY2F0YWxvZy5kZXNjcmlwdGlvbiA9IGNhdGFsb2cuZGVzY3JpcHRpb25Mb25nO1xuICAgICAgICAgICAgY2F0YWxvZy50aXRsZSA9IGNhdGFsb2cuZGVzY3JpcHRpb25TaG9ydDtcbiAgICAgICAgICAgIGNhdGFsb2cuaW1hZ2UgPSBjYXRhbG9nLmtleVZpc3VhbCB8fCBjYXRhbG9nLnByb2R1Y3RpbWFnZTtcbiAgICAgICAgICAgIGNhdGFsb2cuc2hvd0ltYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWNhdGFsb2cua2V5VmlzdWFsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhdGFsb2cuc2hvd1RpbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYXRhbG9nLmlzUm9vdENhdGFsb2coKSB8fCBjYXRhbG9nLmlzU3ViQ2F0YWxvZygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhdGFsb2cudGlsZXMgPSBfLm1hcChjYXRhbG9nLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpZDogY2hpbGQuaWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNoaWxkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBjaGlsZC5oZWFkbGluZSxcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGNoaWxkLmRlc2NyaXB0aW9uU2hvcnQsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBjaGlsZC5jYXRlZ29yeUltYWdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjYXRhbG9nLnNob3dMaXN0ID0gY2F0YWxvZy5pc0xlYWZDYXRhbG9nO1xuICAgICAgICAgICAgY2F0YWxvZy5saXN0ID0gXy5tYXAoY2F0YWxvZy5jaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGNoaWxkLmlkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjaGlsZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogY2hpbGQucHJvZHVjdG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBjaGlsZC5wcm9kdWN0Y2F0ZWdvcnlpbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgbmV3OiBjaGlsZC5uZXcsXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldHM6IF8uaGFzKGNoaWxkLCAnaGlnaGxpZ2h0Q2F0T3ZlcnZpZXcudmFsdWUuZWxlbWVudHMnKSAmJiBjaGlsZC5oaWdobGlnaHRDYXRPdmVydmlldy52YWx1ZS5lbGVtZW50c1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjYXRhbG9nLnNob3dUZWFzZXIgPSBjYXRhbG9nLmlzUHJvZHVjdEZhbWlseTtcbiAgICAgICAgICAgIGNhdGFsb2cubmV3ID0gY2F0YWxvZy5uZXVoZWl0T2NzO1xuICAgICAgICAgICAgY2F0YWxvZy5uZXdJbWFnZSA9ICcvbWVkaWEvbmV3LnBuZyc7XG4gICAgICAgICAgICBjYXRhbG9nLm5hbWUgPSBjYXRhbG9nLmhlYWRsaW5lIHx8IGNhdGFsb2cucHJvZHVjdG5hbWU7XG4gICAgICAgICAgICBjYXRhbG9nLmVuZXJneUVmZmljaWVuY3kgPSB7XG4gICAgICAgICAgICAgICAgaW1hZ2U6IGNhdGFsb2cubWFpbkVycExhYmVsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93VGVjaG5pY2FsSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uaGFzKGNhdGFsb2csICdoaWdobGlnaHRzLnZhbHVlLmVsZW1lbnRzJykgJiYgY2F0YWxvZy5oaWdobGlnaHRzLnZhbHVlLmVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXRhbG9nLnRlY2huaWNhbEluZm9ybWF0aW9uID0gXy5oYXMoY2F0YWxvZywgJ2hpZ2hsaWdodHMudmFsdWUuZWxlbWVudHMnKSAgJiYgY2F0YWxvZy5oaWdobGlnaHRzLnZhbHVlLmVsZW1lbnRzO1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93TW9yZURldGFpbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uc2l6ZShjYXRhbG9nLnN1YmhlYWRsaW5lcykgPiAwO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhdGFsb2cuc3ViaGVhZGxpbmVzID0gKGZ1bmN0aW9uIChjYXRhbG9nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAxO1xuICAgICAgICAgICAgICAgIHZhciBzdWJoZWFkbGluZSA9IGNhdGFsb2cuZGV0YWlsc1N1YmhlYWRsaW5lMTtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBjYXRhbG9nLmRldGFpbHNEZXNjcmlwdGlvbjE7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gY2F0YWxvZy5kZXRhaWxzSW1hZ2UxO1xuICAgICAgICAgICAgICAgIHZhciBzdWJoZWFkbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB3aGlsZShzdWJoZWFkbGluZSAhPSBudWxsIHx8IGRlc2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ViaGVhZGxpbmVzLnB1c2goe3RpdGxlOiBzdWJoZWFkbGluZSAmJiBzdWJoZWFkbGluZS52YWx1ZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uICYmIGRlc2NyaXB0aW9uLnZhbHVlLCBpbWFnZTogaW1hZ2UgJiYgaW1hZ2UudmFsdWV9KTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGNhdGFsb2dbJ2RldGFpbHNEZXNjcmlwdGlvbicgKyBpXTtcbiAgICAgICAgICAgICAgICAgICAgc3ViaGVhZGxpbmUgPSBjYXRhbG9nWydkZXRhaWxzU3ViaGVhZGxpbmUnICsgaV07XG4gICAgICAgICAgICAgICAgICAgIGltYWdlID0gY2F0YWxvZ1snZGV0YWlsc0ltYWdlJyArIGldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3ViaGVhZGxpbmVzO1xuICAgICAgICAgICAgfSkoY2F0YWxvZyk7XG4gICAgICAgICAgICBjYXRhbG9nLm1vcmVEZXRhaWxzID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBjYXRhbG9nLmhlYWRsaW5lT3ZlcnZpZXcsXG4gICAgICAgICAgICAgICAgZWxlbWVudHM6IGNhdGFsb2cuc3ViaGVhZGxpbmVzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjYXRhbG9nLnNob3dUZWNobmljYWxUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2F0YWxvZy5wcm9kdWN0VGFibGVEZWZpbml0aW9uICYmIGNhdGFsb2cuY2hpbGRyZW47IC8vRklYTUUgVGFrZSBsb2dpYyBmcm9tIGNvbnRyb2xsZXIsIE1ha2UgdGhpcyBjdXN0b21pemFibGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXRhbG9nLnNob3dGb290bm90ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2cuZm9vdG5vdGVzVGVjaERhdGE7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy5mb290bm90ZXMgPSBjYXRhbG9nLmZvb3Rub3Rlc1RlY2hEYXRhO1xuICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2c7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy50b1RlbXBsYXRlVmlldyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRTZWN0aW9uKHNlY3Rpb25zLCBuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHNlY3Rpb25zLCB7bmFtZTogbmFtZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5tb2RlbCcpXG4gICAgICAgIC5jb25maWcoQ2F0YWxvZ0NvbmZpZyk7XG5cbiAgICBDYXRhbG9nQ29uZmlnLiRpbmplY3QgPSBbJ2VudicsICdDYXRhbG9nUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2dDb25maWcoZW52LCBjYXRhbG9nTW9kZWxQcm92aWRlcikge1xuICAgICAgICBjYXRhbG9nTW9kZWxQcm92aWRlclxuICAgICAgICAgICAgLnByb2R1Y3REYXRhU2VydmljZUVuZFBvaW50KGVudi5lbmRQb2ludC5wcm9kdWN0RGF0YVNlcnZpY2UpXG4gICAgICAgICAgICAuY29udGVudFNlcnZpY2VFbmRQb2ludChlbnYuZW5kUG9pbnQuY29udGVudFNlcnZpY2UpO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLm1vZGVsJylcbiAgICAgICAgLnByb3ZpZGVyKCdDYXRhbG9nJywgZnVuY3Rpb24gQ2F0YWxvZ1Byb3ZpZGVyKCkge1xuICAgICAgICAgICAgdmFyIHBkc1VybCA9IG51bGw7XG4gICAgICAgICAgICB2YXIgY3NVcmwgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnByb2R1Y3REYXRhU2VydmljZUVuZFBvaW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcGRzVXJsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRTZXJ2aWNlRW5kUG9pbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjc1VybCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gWyckcmVzb3VyY2UnLCAnJGNhY2hlRmFjdG9yeScsICdsb2NhbGUnLCAnJGh0dHAnLCAnXycsICdDYXRhbG9nSGVscGVyJywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgJGNhY2hlRmFjdG9yeSwgbG9jYWxlLCAkaHR0cCwgXywgQ2F0YWxvZ0hlbHBlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ2F0YWxvZygkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnksIGxvY2FsZSwgcGRzVXJsLCBjc1VybCwgJGh0dHAsIF8sIENhdGFsb2dIZWxwZXIpO1xuICAgICAgICAgICAgfV07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gQ2F0YWxvZygkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnksIGxvY2FsZSwgcGRzVXJsLCBjc1VybCwgJGh0dHAsIF8sIGNhdGFsb2dIZWxwZXIpIHtcbiAgICAgICAgdmFyIGNhdGFsb2dDYWNoZSA9ICRjYWNoZUZhY3RvcnkoXCJjYXRhbG9nXCIpO1xuICAgICAgICB2YXIgY3VzdG9tVHJhbnNmb3JtYXRpb25zID0gW3JlZGlyZWN0Q2hpbGRyZW5dO1xuICAgICAgICB2YXIgdHJhbnNmb3JtYXRpb25zID0gJGh0dHAuZGVmYXVsdHMudHJhbnNmb3JtUmVzcG9uc2UuY29uY2F0KGN1c3RvbVRyYW5zZm9ybWF0aW9ucyk7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1SZXNwb25zZSA9IGZ1bmN0aW9uIChkYXRhLCBoZWFkZXJzLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBkYXRhO1xuICAgICAgICAgICAgXy5lYWNoKHRyYW5zZm9ybWF0aW9ucywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0KHJlc3VsdCwgaGVhZGVycywgc3RhdHVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIENhdGFsb2dSZXNvdXJjZSA9ICRyZXNvdXJjZShwZHNVcmwgKyAnOmxvY2FsZS86dHlwZS86cXVlcnlUeXBlLzppZCcsIG51bGwsIHtcbiAgICAgICAgICAgICAgICBnZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7bG9jYWxlOiBsb2NhbGUsIHF1ZXJ5VHlwZTogJ2lkJ30sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBjYXRhbG9nQ2FjaGUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBmdW5jdGlvbiAoZGF0YSwgaGVhZGVycywgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9DYXRhbG9nVmlldyh0cmFuc2Zvcm1SZXNwb25zZShkYXRhLCBoZWFkZXJzLCBzdGF0dXMpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBpc0FycmF5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtsb2NhbGU6IGxvY2FsZX0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBjYXRhbG9nQ2FjaGVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IGNzVXJsICsgJ3Jlc3QvZG9jdW1lbnQvZGlzcGxheScsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBmdW5jdGlvbiAoZGF0YSwgaGVhZGVycywgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9DYXRhbG9nVGVtcGxhdGVWaWV3KHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEsIGhlYWRlcnMsIHN0YXR1cykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlZGlyZWN0Q2hpbGRyZW4oZGF0YSwgaGVhZGVycywgc3RhdHVzKSB7XG4gICAgICAgICAgICBkYXRhLmNoaWxkcmVuID0gXy5tYXAoZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnJlZGlyZWN0Q2F0ZWdvcnkgPyBjaGlsZC5yZWRpcmVjdENhdGVnb3J5IDogY2hpbGQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9DYXRhbG9nVmlldyhjYXRhbG9nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2F0YWxvZ0hlbHBlci50b1ZpZXcoY2F0YWxvZyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b0NhdGFsb2dUZW1wbGF0ZVZpZXcoY2F0YWxvZykge1xuICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2dIZWxwZXIudG9UZW1wbGF0ZVZpZXcoY2F0YWxvZyk7XG4gICAgICAgIH1cblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UucHJvdG90eXBlLmlzTGVhZkNhdGFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUeXBlKCkgPT0gJ2xlYWZfY2F0ZWdvcnknO1xuICAgICAgICB9O1xuXG4gICAgICAgIENhdGFsb2dSZXNvdXJjZS5wcm90b3R5cGUuaXNQcm9kdWN0RmFtaWx5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VHlwZSgpID09ICdwcm9kdWN0X2ZhbWlseSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgQ2F0YWxvZ1Jlc291cmNlLnByb3RvdHlwZS5pc1N1YkNhdGFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUeXBlKCkgPT0gJ3N1Yl9jYXRlZ29yeSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgQ2F0YWxvZ1Jlc291cmNlLnByb3RvdHlwZS5pc1Jvb3RDYXRhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VHlwZSgpID09ICdyb290X2NhdGVnb3J5JztcbiAgICAgICAgfTtcblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnR5cGUgPyB0aGlzLnR5cGUudmFsdWUudG9Mb3dlckNhc2UoKSA6IFN0cmluZygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIENhdGFsb2dSZXNvdXJjZS5wcm90b3R5cGUudGVjaG5pY2FsRGF0YVRhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSBfLmZpbmQodGhpcy5zZWN0aW9ucywge25hbWU6ICdURUNITklDQUxfREFUQV9UQUJMRSd9KTtcbiAgICAgICAgICAgIHJldHVybiBzZWN0aW9uICYmIHNlY3Rpb24ucGFyYW1zO1xuICAgICAgICB9O1xuXG4gICAgICAgIENhdGFsb2dSZXNvdXJjZS5mYWxsYmFja1R5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1BST0RVQ1RfRkFNSUxZJztcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gQ2F0YWxvZ1Jlc291cmNlO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICB2YXIgVkFMVUVfVEVNUExBVEUgPSAnPHNwYW4+e3t2YWx1ZS52YWx1ZSB8fCBcXCctXFwnfX08L3NwYW4+JztcbiAgICB2YXIgSU1BR0VfTUVESUFfVEVNUExBVEUgPSAnPGltZyBuZy1zcmM9XCJ7e3ZhbHVlLnZhbHVlfX1cIiBhbHQ9XCJ7e2FsdC52YWx1ZX19XCIgdGl0bGU9XCJ7e3RpdGxlLnZhbHVlfX1cIi8+JztcbiAgICB2YXIgT1RIRVJfTUVESUFfVEVNUExBVEUgPSAnPHNwYW4+PGEgbmctaHJlZj1cInt7dmFsdWUudmFsdWUgfCBpbWFnZVVybH19XCIgdGl0bGU9XCJ7e3RpdGxlLnZhbHVlfX1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48c3BhbiB0cmFuc2xhdGU9XCJET1dOTE9BRC5OT1dcIj48L3NwYW4+Jm5ic3A7PGkgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWRvd25sb2FkLWFsdFwiPjwvaT48L2E+PC9zcGFuPic7XG4gICAgdmFyIElNQUdFX0VYVEVOU0lPTlMgPSBbJy5qcGcnLCAnLnBuZycsICcuanBlZycsICcuZ2lmJ107XG4gICAgdmFyIERPVCA9ICcuJztcblxuICAgIHZhciB0ZW1wbGF0ZVN0cmF0ZWd5ID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBpc0FwcGxpY2FibGU6IGZ1bmN0aW9uICh2YWwsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZSAmJiB0eXBlLnRvTG93ZXJDYXNlKCkgPT0gJ3N0cmluZycgJiYgSU1BR0VfRVhURU5TSU9OUy5pbmRleE9mKHZhbC5zbGljZSh2YWwubGFzdEluZGV4T2YoRE9UKSkpID49IDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6IElNQUdFX01FRElBX1RFTVBMQVRFXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlzQXBwbGljYWJsZTogZnVuY3Rpb24gKHZhbCwgdHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlICYmIHR5cGUudG9Mb3dlckNhc2UoKSA9PSAnYXNzZXQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBPVEhFUl9NRURJQV9URU1QTEFURVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpc0FwcGxpY2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZTogVkFMVUVfVEVNUExBVEVcbiAgICAgICAgfVxuICAgIF07XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2F0dHJpYnV0ZVZhbHVlJywgWyckY29tcGlsZScsICckc2NlJywgZnVuY3Rpb24gKCRjb21waWxlLCAkc2NlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnPWF0dHJpYnV0ZVZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgYWx0OiBcIj1hdHRyaWJ1dGVBbHRcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiPWF0dHJpYnV0ZVRpdGxlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHNjZSA9ICRzY2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcGxhdGVTdHJhdGVneS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLnZhbHVlICYmIHRlbXBsYXRlU3RyYXRlZ3lbaV0uaXNBcHBsaWNhYmxlKHNjb3BlLnZhbHVlLnZhbHVlLCBzY29wZS52YWx1ZS50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50Lmh0bWwoJGNvbXBpbGUodGVtcGxhdGVTdHJhdGVneVtpXS50ZW1wbGF0ZSkoc2NvcGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY2F0YWxvZ1RlbXBsYXRlJywgWydDYXRhbG9nU2VydmljZScsICckcm9vdFNjb3BlJywgJ18nICxmdW5jdGlvbiAoQ2F0YWxvZ1NlcnZpY2UsICRyb290U2NvcGUsIF8pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgY2F0YWxvZ0lkOiAnPSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiY2F0YWxvZy10ZW1wbGF0ZVwiIG5nLXRyYW5zY2x1ZGU+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnY2F0YWxvZ0lkJywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsICYmIENhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldFRlbXBsYXRlKHZhbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoY2F0YWxvZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kY2F0YWxvZyA9IGNhdGFsb2c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGRzLmNhdGFsb2cubG9hZGVkJywge2NhdGFsb2c6IGNhdGFsb2d9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyLCAkKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdlcXVhbGl6ZVRlYXNlckhlaWdodCcsIFsnJHRpbWVvdXQnLCBFcXVhbGl6ZVRlYXNlckhlaWdodF0pO1xuXG4gICAgZnVuY3Rpb24gRXF1YWxpemVUZWFzZXJIZWlnaHQoJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS4kbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhIZWlnaHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcmRCbG9jayA9ICQoXCIuY2FyZCAuY2FyZC1ibG9ja1wiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJChjYXJkQmxvY2spLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGVpZ2h0KCkgPiBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0ID0gJCh0aGlzKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJChjYXJkQmxvY2spLmhlaWdodChtYXhIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyLCBqUXVlcnkpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdvY3NCcmVhZGNydW1iJywgT2NzQnJlYWRjcnVtYik7XG5cbiAgICB2YXIgY3J1bWJUZW1wbGF0ZSA9IFwiPGxpIG5nLXJlcGVhdD1cXFwiY3J1bWIgaW4gJGJyZWFkY3J1bWJzXFxcIiBuZy1jbGFzcz1cXFwieydhY3RpdmUnOiAkbGFzdH1cXFwiPlwiXG4gICAgICAgICAgICArIFwiPGEgb2NzLW5hdmlnYXRlPVxcXCJjcnVtYi5pZFxcXCI+e3tjcnVtYi5uYW1lfX08L2E+XCJcbiAgICAgICAgKyBcIjwvbGk+XCI7XG5cbiAgICBmdW5jdGlvbiBPY3NCcmVhZGNydW1iKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG9jc05hdmlnYXRlOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckY29tcGlsZScsICdCcmVhZGNydW1iU2VydmljZScsICdfJywgQnJlYWRjcnVtYkNvbnRyb2xsZXJdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBCcmVhZGNydW1iQ29udHJvbGxlcigkc2NvcGUsICRjb21waWxlLCBCcmVhZGNydW1iU2VydmljZSwgXykge1xuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuYnJlYWRjcnVtYi51cGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgQnJlYWRjcnVtYlNlcnZpY2VcbiAgICAgICAgICAgICAgICAuYnVpbGQocGFyYW1zLmNhdGFsb2dJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kYnJlYWRjcnVtYnMgPSByZXMgfHwge307XG4gICAgICAgICAgICAgICAgICAgIHZhciBicmVhZGNydW1icyA9ICRjb21waWxlKGNydW1iVGVtcGxhdGUpKCRzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBicmVhZGNydW1ic0NvbnRhaW5lciA9IGFuZ3VsYXIuZWxlbWVudCgnI25hdi1icmVhZGNydW1icycpO1xuICAgICAgICAgICAgICAgICAgICBicmVhZGNydW1ic0NvbnRhaW5lci5maW5kKCcuZHJvcGRvd24tbWVudScpLmFwcGVuZChicmVhZGNydW1icyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIE1vdmUgdGhpcyBzdHVmZiwgYnV0IHdoZXJlLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ubGFzdCgkc2NvcGUuJGJyZWFkY3J1bWJzKS50eXBlID09ICdQUk9EVUNUX0ZBTUlMWScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFkY3J1bWJzQ29udGFpbmVyLmFkZENsYXNzKCdkYXJrLWJyZWFkY3J1bWInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFkY3J1bWJzQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmRyb3Bkb3duLXRvZ2dsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGV4dChfLmxhc3QoJHNjb3BlLiRicmVhZGNydW1icykubmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ29jc05hdmlnYXRlJywgT2NzTmF2aWdhdGVEaXJlY3RpdmUpO1xuXG4gICAgT2NzTmF2aWdhdGVEaXJlY3RpdmUuJGluamVjdCA9IFsnQ2F0YWxvZ1NlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIE9jc05hdmlnYXRlRGlyZWN0aXZlKENhdGFsb2dTZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb2NzTmF2aWdhdGU6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ29jc05hdmlnYXRlJywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgJiYgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlVXJpRnJvbUhpZXJhcmNoeSh2YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdocmVmJywgdXJpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmZpbHRlcihmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEkKGVsKS5hdHRyKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnc2Nyb2xsYWJsZVRhYmxlQ2FyZCcsIFNjcm9sbGFibGVUYWJsZUNhcmQpO1xuXG4gICAgZnVuY3Rpb24gU2Nyb2xsYWJsZVRhYmxlQ2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgICQoJy5mcy10YWJsZS1zY3JvbGxhYmxlIC5qcy1zbGljay1zbGlkZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXNUYWJsZSA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3cG9ydFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZVNsaWRlckVsZW1lbnRzID0gJHRoaXNUYWJsZS5maW5kKFwiLmNhcmRcIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZVNsaWRlckVsZW1lbnRzQW1vdW50ID0gJCh0YWJsZVNsaWRlckVsZW1lbnRzKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9kZXNrdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydFdpZHRoID4gOTkxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFibGVTbGlkZXJFbGVtZW50c0Ftb3VudCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1RhYmxlLmFkZENsYXNzKFwianMtZnVsbC13aWR0aC1zbGljay10cmFja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNUYWJsZS5yZW1vdmVDbGFzcyhcImpzLWZ1bGwtd2lkdGgtc2xpY2stdHJhY2tcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL3RhYmxldFxuICAgICAgICAgICAgICAgICAgICBpZiAoKHZpZXdwb3J0V2lkdGggPCA5OTIpICYmICh2aWV3cG9ydFdpZHRoID4gNzY3KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlU2xpZGVyRWxlbWVudHNBbW91bnQgPCAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNUYWJsZS5hZGRDbGFzcyhcImpzLWZ1bGwtd2lkdGgtc2xpY2stdHJhY2tcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzVGFibGUucmVtb3ZlQ2xhc3MoXCJqcy1mdWxsLXdpZHRoLXNsaWNrLXRyYWNrXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUuJGxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9zY3JvbGxhYmxlIHRhYmxlIHNsaWRlci13cmFwcGVyIGluc3RhbmNlXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZVNsaWRlciA9ICQoXCIuZnMtdGFibGUtc2Nyb2xsYWJsZSAuc2Nyb2xsYWJsZS10YWJsZS13cmFwcGVyXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc2Nyb2xsYWJsZSB0YWJsZSBzbGlkZXItd3JhcHBlciBpbnN0YW5jZSAoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlU2xpZGVyRWxlbWVudCA9ICQodGFibGVTbGlkZXIpLmZpbmQoXCIuY2FyZFwiKTtcblxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZVNsaWRlci5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIEFMTCBhdmFpbGFibGUgVGFibGUtRWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGFibGVTbGlkZXJFbGVtZW50KS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkdGhpc0VsZW1lbnQgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hZGQgdGFibGUtcm93LVtyb3ctY291bnRdLWNsYXNzIHRvIEFMTCBUYWJsZS1FbGVtZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzRWxlbWVudC5maW5kKFwidHJcIikuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkdGhpc1JvdyA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzUm93LmFkZENsYXNzKFwidGFibGUtcm93LVwiICsgKGkgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2Z1bmN0aW9uIHRvIGVxdWFsaXplIHRhYmxlIHJvd3NcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcXVhbEhlaWdodHNSb3cgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIGFsbCB0YWJsZSBzbGlkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0YWJsZVNsaWRlcikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzU2xpZGVyID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3NDb3VudCA9ICQodGhpcykuZmluZChcIi5jYXJkOmZpcnN0LW9mLXR5cGUgdHJcIikubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIGFtb3VudCBvZiB0YWJsZSByb3dzIGluIHRhYmxlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPD0gcm93c0NvdW50OyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzU2xpZGVyUm93cyA9ICQodGhpcykuZmluZChcInRyLnRhYmxlLXJvdy1cIiArIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heEhlaWdodCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzU2xpZGVyUm93cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhlaWdodCgpID4gbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heEhlaWdodCA9ICQodGhpcykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzU2xpZGVyUm93cy5oZWlnaHQobWF4SGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzZXRIZWlnaHRzUm93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNldCBoZWlnaHRzIGZvciB3aW5kb3cgY2hhbmdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5mcy10YWJsZS1zY3JvbGxhYmxlIC5zY3JvbGxhYmxlLXRhYmxlLXdyYXBwZXIgLmNhcmQgdHJcIikuaGVpZ2h0KDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRIZWlnaHRzUm93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcXVhbEhlaWdodHNSb3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCduYXZMYW5nJywgU3dpdGNoTGFuZ3VhZ2UpO1xuXG4gICAgU3dpdGNoTGFuZ3VhZ2UuJGluamVjdCA9IFsndXJsUGFyc2VyU2VydmljZScsICdDYXRhbG9nU2VydmljZScsICdsb2NhbGUnLCAnJHdpbmRvdyddO1xuXG4gICAgZnVuY3Rpb24gU3dpdGNoTGFuZ3VhZ2UodXJsUGFyc2VyU2VydmljZSwgY2F0YWxvZ1NlcnZpY2UsIGxvY2FsZSwgJHdpbmRvdykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQUMnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGlmICh1cmxQYXJzZXJTZXJ2aWNlLmlzT0NTKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBhbmd1bGFyLmVsZW1lbnQoZWwpLmNoaWxkcmVuKCdhJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhbmd1YWdlID0gbGluay5jaGlsZHJlbignc3BhbicpLnRleHQoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3TG9jYWxlID0gbG9jYWxlLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGUubGFuZ3VhZ2UsIGxhbmd1YWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXNvbHZlVXJpRnJvbUhpZXJhcmNoeShjYXRhbG9nU2VydmljZS5nZXRJZEZyb21Mb2NhdGlvbigpLCBuZXdMb2NhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsUGFyc2VyU2VydmljZS5zZXRMYW5ndWFnZSh1cmksIGxhbmd1YWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3N5bmNocm9uaXplSGVpZ2h0JywgU3luY2hyb25pemVIZWlnaHQpO1xuXG4gICAgU3luY2hyb25pemVIZWlnaHQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcblxuICAgIGZ1bmN0aW9uIFN5bmNocm9uaXplSGVpZ2h0KCR0aW1lb3V0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbGVtZW50KGRvY3VtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5jYXJkLmNhcmQtY29sdW1uIHRhYmxlIHRyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcShzY29wZS4kaW5kZXggKyAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNzcygnaGVpZ2h0JywgZWxlbWVudC5jc3MoJ2hlaWdodCcpKTtcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5yb3V0ZScpXG4gICAgICAgIC5jb25maWcoUm91dGVDb25maWcpO1xuXG4gICAgUm91dGVDb25maWcuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIFJvdXRlQ29uZmlnKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnBkc1JvdXRlKHtcbiAgICAgICAgICAgIG5hbWU6ICdjYXRhbG9nJyxcbiAgICAgICAgICAgIHVybDogJ3tjYXRVcmw6LiotW2NwXSR9JyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2F0YWxvZzMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ2F0YWxvZ0NvbnRyb2xsZXIgYXMgdm0nLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIHJlZGlyZWN0OiBbJ01ldGFTZXJ2aWNlJywgZnVuY3Rpb24gKG1ldGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXRhU2VydmljZS5yZWRpcmVjdE9uSW52YWxpZFVybCgpO1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoXCJwZHMuY2F0YWxvZy5zZXJ2aWNlXCIpXG4gICAgICAgIC5zZXJ2aWNlKFwiQnJlYWRjcnVtYlNlcnZpY2VcIiwgQnJlYWRjcnVtYlNlcnZpY2UpO1xuXG4gICAgQnJlYWRjcnVtYlNlcnZpY2UuJGluamVjdCA9IFsnQ2F0YWxvZ1NlcnZpY2UnLCAnXycsICckcSddO1xuXG4gICAgZnVuY3Rpb24gQnJlYWRjcnVtYlNlcnZpY2UoQ2F0YWxvZ1NlcnZpY2UsIF8sICRxKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBidWlsZDogYnVpbGRcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBidWlsZChjYXRlZ29yeUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAudHJhdmVsVXBOYXZpZ2F0aW9uSGllcmFyY2h5KGNhdGVnb3J5SWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZGVjb3JhdGVXaXRoVXJscylcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHJlZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX1xuICAgICAgICAgICAgICAgICAgICAgICAgLmNoYWluKHRyZWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBub2RlLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbm9kZS50eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGVXaXRoVXJscyh0cmVlKSB7XG4gICAgICAgICAgICByZXR1cm4gJHFcbiAgICAgICAgICAgICAgICAuYWxsKF8ubWFwKHRyZWUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlc29sdmVVcmlGcm9tSGllcmFyY2h5KG5vZGUuaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS51cmwgPSB1cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoXCJwZHMuY2F0YWxvZy5zZXJ2aWNlXCIpXG4gICAgICAgIC5zZXJ2aWNlKFwiQ2F0YWxvZ1NlcnZpY2VcIiwgQ2F0YWxvZ1NlcnZpY2UpO1xuXG4gICAgQ2F0YWxvZ1NlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdycsICdDYXRhbG9nJywgJ01lbnVTZXJ2aWNlJywgJ1Nlb0ZyaWVuZGx5VXJsQnVpbGRlcicsICdjYXRhbG9nU2VhcmNoTGlzdGVuZXInLCAnXycsICckcScsICdsb2NhbGUnXTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2dTZXJ2aWNlKCR3aW5kb3csIENhdGFsb2csIG1lbnVTZXJ2aWNlLCBTZW9GcmllbmRseVVybEJ1aWxkZXIsIGNhdGFsb2dTZWFyY2hMaXN0ZW5lciwgXywgJHEsIGxvY2FsZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcm9kdWN0UHJlZml4ID0gJ3AnO1xuICAgICAgICB2YXIgY2F0ZWdvcnlQcmVmaXggPSAnYyc7XG5cbiAgICAgICAgY2F0YWxvZ1NlYXJjaExpc3RlbmVyXG4gICAgICAgICAgICAubGlzdGVuKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkocGFyYW1zLnRhcmdldC5yZXNvdXJjZUlkKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJpKSB7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEJ5VGFnOiBnZXRCeVRhZyxcbiAgICAgICAgICAgIGdldE5ld1Byb2R1Y3RGYW1pbGllczogZ2V0TmV3UHJvZHVjdEZhbWlsaWVzLFxuICAgICAgICAgICAgZ2V0QnlJZDogZ2V0QnlJZCxcbiAgICAgICAgICAgIGdldFRlbXBsYXRlOiBnZXRUZW1wbGF0ZSxcbiAgICAgICAgICAgIGdldEJ5SWRBbmRUeXBlOiBnZXRCeUlkQW5kVHlwZSxcbiAgICAgICAgICAgIHJlZGlyZWN0VG86IG5hdmlnYXRlVG8sXG4gICAgICAgICAgICBuYXZpZ2F0ZVRvOiBuYXZpZ2F0ZVRvLFxuICAgICAgICAgICAgdHJhdmVsVXBIaWVyYXJjaHk6IHRyYXZlbFVwSGllcmFyY2h5LFxuICAgICAgICAgICAgdHJhdmVsVXBOYXZpZ2F0aW9uSGllcmFyY2h5OiB0cmF2ZWxVcE5hdmlnYXRpb25IaWVyYXJjaHksXG4gICAgICAgICAgICBnZXRJZEZyb21Mb2NhdGlvbjogZ2V0SWRGcm9tTG9jYXRpb24sXG4gICAgICAgICAgICByZXNvbHZlVXJpOiByZXNvbHZlVXJpLFxuICAgICAgICAgICAgcmVzb2x2ZVVyaUZyb21IaWVyYXJjaHk6IHJlc29sdmVVcmlGcm9tSGllcmFyY2h5LFxuICAgICAgICAgICAgZ2V0UHJvZHVjdEZhbWlseTogZ2V0UHJvZHVjdEZhbWlseVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ5VGFnKHR5cGUsIHRhZykge1xuICAgICAgICAgICAgcmV0dXJuIENhdGFsb2cucXVlcnkoe3R5cGU6IHR5cGUsIGlkOiB0YWcsIHF1ZXJ5VHlwZTogJ3RhZyd9KS4kcHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldE5ld1Byb2R1Y3RGYW1pbGllcygpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRCeVRhZyhDYXRhbG9nLmZhbGxiYWNrVHlwZSgpLCBcIm5ld1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ5SWQoY2F0ZWdvcnlJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFR5cGVGcm9tSGllcmFyY2h5KGNhdGVnb3J5SWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENhdGFsb2cuZ2V0KHtpZDogY2F0ZWdvcnlJZCwgdHlwZTogdHlwZX0pLiRwcm9taXNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVtcGxhdGUoY2F0YWxvZ0lkKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0VHlwZUZyb21IaWVyYXJjaHkoY2F0YWxvZ0lkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXRhbG9nID0gbmV3IENhdGFsb2coe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHtuYW1lOiB0eXBlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxlOiBsb2NhbGUudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0YWxvZ1JlcXVlc3Q6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGNhdGFsb2dJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbDogZ2V0T0NTQ2hhbm5lbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2cuJHRlbXBsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRPQ1NDaGFubmVsKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudCgnbWV0YVtuYW1lPVwib2NzLWNoYW5uZWxcIl0nKS5hdHRyKCdjb250ZW50JylcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ5SWRBbmRUeXBlKGlkLCB0eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gQ2F0YWxvZy5nZXQoe2lkOiBpZCwgdHlwZTogdHlwZX0pLiRwcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VHlwZUZyb21IaWVyYXJjaHkoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBtZW51U2VydmljZVxuICAgICAgICAgICAgICAgIC5maW5kSW5OYXZpZ2F0aW9uKGlkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjYXRhbG9nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXRhbG9nID8gY2F0YWxvZy50eXBlIDogQ2F0YWxvZy5mYWxsYmFja1R5cGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlbFVwSGllcmFyY2h5KGNhdGVnb3J5SWQsIHRyZWUpIHtcbiAgICAgICAgICAgIHRyZWUgPSB0cmVlIHx8IFtdO1xuICAgICAgICAgICAgcmV0dXJuIGdldEJ5SWQoY2F0ZWdvcnlJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0cmVlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnR5cGUudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWUudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEucGFyZW50SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmF2ZWxVcEhpZXJhcmNoeShkYXRhLnBhcmVudElkLnZhbHVlLCB0cmVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlbFVwTmF2aWdhdGlvbkhpZXJhcmNoeShjYXRlZ29yeUlkLCBsb2NhbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBtZW51U2VydmljZVxuICAgICAgICAgICAgICAgIC5maW5kSW5OYXZpZ2F0aW9uKGNhdGVnb3J5SWQsIGxvY2FsZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJlZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZShpdGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyZWUucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBtZW51U2VydmljZS5maW5kUGFyZW50SW5OYXZpZ2F0aW9uKGl0ZW0uaWQsIGxvY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbCh0cmVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG5hdmlnYXRlVG8oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlVXJpKGlkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVyaShjYXRlZ29yeUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhdmVsVXBIaWVyYXJjaHkoY2F0ZWdvcnlJZCkudGhlbihidWlsZFVyaSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBidWlsZFVyaSh0cmVlKSB7XG4gICAgICAgICAgICB2YXIgYnVpbGRlciA9IG5ldyBTZW9GcmllbmRseVVybEJ1aWxkZXIoKTtcbiAgICAgICAgICAgIF8uZm9yRWFjaFJpZ2h0KHRyZWUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyYWdtZW50cyA9IFtub2RlLm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0cmVlLmluZGV4T2Yobm9kZSkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudHMucHVzaChub2RlLmlkLCBjYXRlZ29yeVByZWZpeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYWRkUGF0aChmcmFnbWVudHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PSBDYXRhbG9nLmZhbGxiYWNrVHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuc2V0UGF0aChbbm9kZS5uYW1lLCBub2RlLmlkLCBwcm9kdWN0UHJlZml4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkoY2F0ZWdvcnlJZCwgbG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhdmVsVXBOYXZpZ2F0aW9uSGllcmFyY2h5KGNhdGVnb3J5SWQsIGxvY2FsZSkudGhlbihidWlsZFVyaSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRJZEZyb21Mb2NhdGlvbih1cmkpIHtcbiAgICAgICAgICAgIHVyaSA9IHVyaSB8fCBuZXcgVVJJKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHVyaS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDJdO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UHJvZHVjdEZhbWlseShwcm9kdWN0KSB7XG4gICAgICAgICAgICBpZiAoIXByb2R1Y3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IHByb2R1Y3QucGFyZW50SWQudmFsdWUuZWxlbWVudHMgfHwgW3Byb2R1Y3QucGFyZW50SWQudmFsdWVdO1xuICAgICAgICAgICAgcmV0dXJuICRxXG4gICAgICAgICAgICAgICAgLmFsbChfLm1hcChlbGVtZW50cywgZnVuY3Rpb24gKHBhcmVudElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZW51U2VydmljZS5maW5kSW5OYXZpZ2F0aW9uKHBhcmVudElkKSB8fCB7fTtcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZChub2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09IENhdGFsb2cuZmFsbGJhY2tUeXBlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuc2VydmljZScpXG4gICAgICAgIC5zZXJ2aWNlKCdNZXRhU2VydmljZScsIE1ldGFTZXJ2aWNlKTtcblxuICAgIE1ldGFTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHEnLCAnJGxvY2F0aW9uJywgJyR3aW5kb3cnLCAnQ2F0YWxvZ1NlcnZpY2UnLCAnaW1hZ2VVcmxGaWx0ZXInLCAnY29uZmlnJywgJ3VybFBhcnNlclNlcnZpY2UnXTtcblxuICAgIHZhciBUSVRMRV9ERUxJTUlURVIgPSAnIHwgJztcbiAgICB2YXIgTE9DQUxFX0RFTElNSVRFUiA9ICctJztcbiAgICB2YXIgTE9DQUxFX1BST1BFUl9ERUxJTUlURVIgPSAnXyc7XG4gICAgdmFyIFBBVEhfU0VQQVJBVE9SID0gJy8nO1xuXG4gICAgZnVuY3Rpb24gTWV0YVNlcnZpY2UoJHJvb3RTY29wZSwgJHEsICRsb2NhdGlvbiwgJHdpbmRvdywgQ2F0YWxvZ1NlcnZpY2UsIGltYWdlVXJsRmlsdGVyLCBjb25maWcsIHVybFBhcnNlclNlcnZpY2UpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXBkYXRlTWV0YUJ5Q2F0ZWdvcnk6IHVwZGF0ZU1ldGFCeUNhdGVnb3J5LFxuICAgICAgICAgICAgcmVkaXJlY3RPbkludmFsaWRVcmw6IHJlZGlyZWN0T25JbnZhbGlkVXJsXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTWV0YUJ5Q2F0ZWdvcnkoY2F0YWxvZ0lkKSB7XG4gICAgICAgICAgICB2YXIgZXhjbHVkZUhyZWZsYW5ncyA9IGZhbHNlO1xuICAgICAgICAgICAgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAuZ2V0VGVtcGxhdGUoY2F0YWxvZ0lkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjdXJyZW50Q2F0YWxvZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmF2ZWxVcE5hdmlnYXRpb25IaWVyYXJjaHkoY2F0YWxvZ0lkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHRyZWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmVlWzBdID0gY3VycmVudENhdGFsb2c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0cmVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnROb2RlID0gdHJlZVswXTtcbiAgICAgICAgICAgICAgICAgICAgdHJlZVswXS5uYW1lID0gdHJlZVswXS5uYW1lLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVyVGl0bGUgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmVlW2ldICYmIHRyZWVbaV0ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlclRpdGxlLnB1c2godHJlZVtpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJUaXRsZS5wdXNoKGNvbmZpZy5tZXRhVGFncy5zaXRlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0gKGN1cnJlbnROb2RlLmtleVZpc3VhbCB8fCBjdXJyZW50Tm9kZS5wcm9kdWN0aW1hZ2UgfHwge30pLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogaGVhZGVyVGl0bGUuam9pbihUSVRMRV9ERUxJTUlURVIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IChjdXJyZW50Tm9kZS5zZW9NZXRhVGV4dCB8fCBjdXJyZW50Tm9kZS5kZXNjcmlwdGlvbkxvbmcgfHwgY3VycmVudE5vZGUuZGVzY3JpcHRpb25TaG9ydCB8fCB7fSkudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2UgPyBpbWFnZVVybEZpbHRlcihpbWFnZSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXRlTmFtZTogY29uZmlnLm1ldGFUYWdzLnNpdGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2ViVHJlbmRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2dfczogdHJlZVswXSA/IHRyZWVbMF0ubmFtZSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgel9jZzM6IHRyZWVbMV0gPyB0cmVlWzFdLm5hbWUgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpfY2c0OiB0cmVlWzJdID8gdHJlZVsyXS5uYW1lIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbm9uaWNhbFVybDogJGxvY2F0aW9uLmFic1VybCgpXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoY3VycmVudE5vZGUuYmxvY2tDYW5vbmljYWxUYWcgfHwge30pLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2Fub25pY2FsUmVmID0gKGN1cnJlbnROb2RlLmNhbm9uaWNhbFJlZiB8fCB7fSkudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjYW5vbmljYWxSZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGNsdWRlSHJlZmxhbmdzID0gY2Fub25pY2FsUmVmICE9IGNhdGFsb2dJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkoY2Fub25pY2FsUmVmKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5jYW5vbmljYWxVcmwgPSB1cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLnJlc29sdmUoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcS5yZXNvbHZlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGRzLmhlYWRlci51cGRhdGUnLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhjbHVkZUhyZWZsYW5ncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdsaW5rW2hyZWZsYW5nXScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lbGVtZW50KCdsaW5rW2hyZWZsYW5nXScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlua09iamVjdCA9IGFuZ3VsYXIuZWxlbWVudChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxlID0gbGlua09iamVjdC5hdHRyKCdocmVmbGFuZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvY2FsZS5zcGxpdChMT0NBTEVfREVMSU1JVEVSKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkoY2F0YWxvZ0lkLCBsb2NhbGVbMF0gKyBMT0NBTEVfUFJPUEVSX0RFTElNSVRFUiArIGxvY2FsZVsxXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlua09iamVjdC5hdHRyKCdocmVmJywgdXJsLnJlcGxhY2UoL1xcL1thLXpdezJ9XFwvW2Etel17Mn1cXC8vLCBQQVRIX1NFUEFSQVRPUiArIGxvY2FsZVsxXS50b0xvd2VyQ2FzZSgpICsgUEFUSF9TRVBBUkFUT1IgKyBsb2NhbGVbMF0udG9Mb3dlckNhc2UoKSAgKyBQQVRIX1NFUEFSQVRPUikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhdXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0IHx8IGxpbmtPYmplY3QucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZWRpcmVjdE9uSW52YWxpZFVybCgpIHtcbiAgICAgICAgICAgIHJldHVybiBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgIC5yZXNvbHZlVXJpRnJvbUhpZXJhcmNoeSh1cmxQYXJzZXJTZXJ2aWNlLmdldENhdGFsb2dJZCgpKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuY29kZVVSSSh1cmwpICE9IFVSSSgpLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuc2VydmljZScpXG4gICAgICAgIC5zZXJ2aWNlKCdjYXRhbG9nU2VhcmNoTGlzdGVuZXInLCBDYXRhbG9nU2VhcmNoTGlzdGVuZXIpO1xuXG4gICAgQ2F0YWxvZ1NlYXJjaExpc3RlbmVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHEnLCAnZW52J107XG5cbiAgICBmdW5jdGlvbiBDYXRhbG9nU2VhcmNoTGlzdGVuZXIoJHJvb3QsICRxLCBlbnYpIHtcbiAgICAgICAgdGhpcy5saXN0ZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICRyb290LiRvbigncGRzLnNlYXJjaC5uYXZpZ2F0ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcy50YXJnZXQuY2hhbm5lbERpc2NyaW1pbmF0b3IgPT0gZW52LnNlYXJjaC5wZHNDaGFubmVsRGlzY3JpbWluYXRvciB8fCBwYXJhbXMudGFyZ2V0LnJlc291cmNlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmLnJlc29sdmUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyLCBVUkkpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnKVxuICAgICAgICAuZmFjdG9yeSgnU2VvRnJpZW5kbHlVcmxCdWlsZGVyJywgU2VvRnJpZW5kbHlVcmxCdWlsZGVyRmFjdG9yeSk7XG5cbiAgICBTZW9GcmllbmRseVVybEJ1aWxkZXJGYWN0b3J5LiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnXycsICdzaW1wbGlmeUNoYXJhY3RlcnNGaWx0ZXInLCAnY29uZmlnJ107XG5cbiAgICB2YXIgZnJhZ21lbnRTZXBhcmF0b3IgPSAnLSc7XG4gICAgdmFyIHBhdGhTZXBhcmF0b3IgPSAnLyc7XG5cbiAgICBmdW5jdGlvbiBTZW9GcmllbmRseVVybEJ1aWxkZXJGYWN0b3J5KCR3aW5kb3csIF8sIHNpbXBsaWZ5Q2hhcmFjdGVyc0ZpbHRlciwgY29uZmlnKSB7XG4gICAgICAgIGZ1bmN0aW9uIFNlb0ZyaWVuZGx5VXJsQnVpbGRlcihvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnBhdGggPSBidWlsZEJhc2VQYXRoKCk7XG4gICAgICAgICAgICB0aGlzLnNpbXBsaWZ5Q2hhcmFjdGVyc0ZpbHRlciA9IHNpbXBsaWZ5Q2hhcmFjdGVyc0ZpbHRlcjtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBTZW9GcmllbmRseVVybEJ1aWxkZXIucHJvdG90eXBlLmFkZFBhdGggPSBmdW5jdGlvbihmcmFnbWVudHMpIHtcbiAgICAgICAgICAgIGlmICghZnJhZ21lbnRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXJncyA9IF8uY29tcGFjdChbXS5jb25jYXQoZnJhZ21lbnRzKSk7XG4gICAgICAgICAgICB0aGlzLnBhdGggKz0gcGF0aFNlcGFyYXRvciArIHRoaXMuc2ltcGxpZnlDaGFyYWN0ZXJzRmlsdGVyKGFyZ3Muam9pbihmcmFnbWVudFNlcGFyYXRvcikpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgU2VvRnJpZW5kbHlVcmxCdWlsZGVyLnByb3RvdHlwZS5zZXRQYXRoID0gZnVuY3Rpb24gKGZyYWdtZW50cykge1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gYnVpbGRCYXNlUGF0aCgpO1xuICAgICAgICAgICAgdGhpcy5hZGRQYXRoKGZyYWdtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICBTZW9GcmllbmRseVVybEJ1aWxkZXIucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGF0aCArICh0aGlzLm9wdGlvbnMudHJhaWxpbmdTbGFzaCA/ICcvJyA6ICcnKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gU2VvRnJpZW5kbHlVcmxCdWlsZGVyO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkQmFzZVBhdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gVVJJKCkub3JpZ2luKCkgKyAkd2luZG93LmdldEJhc2VQYXRoKCkgKyBjb25maWcucGRzUGF0aFByZWZpeDtcbiAgICAgICAgfVxuICAgIH1cblxuXG59KShhbmd1bGFyLCBVUkkpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnKVxuICAgICAgICAuc2VydmljZSgndXJsUGFyc2VyU2VydmljZScsIFVybFBhcnNlcik7XG5cbiAgICBVcmxQYXJzZXIuJGluamVjdCA9IFsnY29uZmlnJ107XG5cbiAgICB2YXIgY291bnRyeU1hdGNoSW5kZXggPSAxO1xuICAgIHZhciBsYW5ndWFnZU1hdGNoSW5kZXggPSAyO1xuICAgIHZhciByb290U2VnbWVudE1hdGNoSW5kZXggPSAzO1xuICAgIHZhciBjYXRhbG9nSWRNYXRjaEluZGV4ID0gNDtcblxuICAgICAgICAgICAgICAgICAgICAgIC8qKiAgezF9ezJ9ICAgezN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezR9ICAgICoqL1xuICAgICAgICAgICAgICAgICAgICAgIC8qKiAvY2gvZGUvcmVzaWRlbnRpYWwuaHRtbC9xd2UvYXNkL3F3ZS9hc2QvcG9pdXV5LTEzNDIzMy1jICoqL1xuICAgIHZhciBwYXRoUGF0dGVybiA9IC9eXFwvKFthLXpdezJ9KVxcLyhbYS16XXsyfSlcXC8oPzpvY3NcXC8pPyhbXlxcL10qKSg/OlxcLmh0bWwpP1xcLyg/Oi4qLShbMC05XSopLVtwY11cXC8/JCk/L2k7XG4gICAgdmFyIGxhbmd1YWdlUGF0dGVybiA9IC8oXFwvW2Etel17Mn1cXC8pKFthLXpdezJ9KSguKikvaTtcblxuICAgIGZ1bmN0aW9uIFVybFBhcnNlcihjb25maWcpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgVXJsUGFyc2VyLnByb3RvdHlwZS5pc09DUyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmdldENhdGFsb2dJZCgpO1xuICAgIH07XG5cbiAgICBVcmxQYXJzZXIucHJvdG90eXBlLmdldFJvb3RTZWdtZW50ID0gZnVuY3Rpb24gZ2V0Um9vdFNlZ21lbnQoKSB7XG4gICAgICAgIHJldHVybiBtYXRjaEZvckluZGV4KHJvb3RTZWdtZW50TWF0Y2hJbmRleCkgfHwgdGhpcy5jb25maWcubWV0YVRhZ3Muc2l0ZU5hbWU7XG4gICAgfTtcblxuICAgIFVybFBhcnNlci5wcm90b3R5cGUuZ2V0Q2F0YWxvZ0lkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hGb3JJbmRleChjYXRhbG9nSWRNYXRjaEluZGV4KTtcbiAgICB9O1xuXG4gICAgVXJsUGFyc2VyLnByb3RvdHlwZS5nZXRMYW5ndWFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoRm9ySW5kZXgobGFuZ3VhZ2VNYXRjaEluZGV4KTtcbiAgICB9O1xuXG4gICAgVXJsUGFyc2VyLnByb3RvdHlwZS5zZXRMYW5ndWFnZSA9IGZ1bmN0aW9uICh1cmwsIGxhbmd1YWdlKSB7XG4gICAgICAgIHZhciB1cmkgPSBuZXcgVVJJKHVybCk7XG4gICAgICAgIHVyaS5wYXRoKHVyaS5wYXRoKCkucmVwbGFjZShsYW5ndWFnZVBhdHRlcm4sICckMScgKyBsYW5ndWFnZSArICckMycpKTtcbiAgICAgICAgcmV0dXJuIHVyaS50b1N0cmluZygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtYXRjaEZvckluZGV4KGluZGV4KSB7XG4gICAgICAgIHZhciBtYXRjaCA9IG5ldyBVUkkoKS5wYXRoKCkubWF0Y2gocGF0aFBhdHRlcm4pO1xuICAgICAgICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbaW5kZXhdO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLnNlYXJjaC5tb2RlbCcpXG4gICAgICAgIC5jb25maWcoU2VhcmNoUHJvdmlkZXIpO1xuXG4gICAgU2VhcmNoUHJvdmlkZXIuJGluamVjdCA9IFsnZW52JywgJ1NlYXJjaFByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBTZWFyY2hQcm92aWRlcihlbnYsIFNlYXJjaFByb3ZpZGVyKSB7XG4gICAgICAgIFNlYXJjaFByb3ZpZGVyLnNlYXJjaEVuZHBvaW50KGVudi5lbmRQb2ludC5zZWFyY2hTZXJ2aWNlKTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuc2VhcmNoLm1vZGVsJylcbiAgICAgICAgLnByb3ZpZGVyKCdTZWFyY2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5zZWFyY2hFbmRwb2ludCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHVybCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gWyckcmVzb3VyY2UnLCAnbG9jYWxlJywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgbG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTZWFyY2goJHJlc291cmNlLCBsb2NhbGUsIHVybCk7XG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBTZWFyY2goJHJlc291cmNlLCBsb2NhbGUsIHVybCkge1xuICAgICAgICB2YXIgbWV0aG9kcyA9IHtcbiAgICAgICAgICAgIGxvY2FsaXplOiB7bWV0aG9kOiAnR0VUJywgaXNBcnJheTogdHJ1ZSwgcGFyYW1zOiB7dHlwZTogJ2xvY2FsaXplJ319XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UodXJsICsgJy9yZXNvdXJjZS86dHlwZS86bG9jYWxlJywge2xvY2FsZTogbG9jYWxlfSwgbWV0aG9kcyk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5zZWFyY2guY29udHJvbGxlclwiKVxuICAgICAgICAuY29udHJvbGxlcihcIlF1aWNrc2VhcmNoQ29udHJvbGxlclwiLCBRdWlja3NlYXJjaENvbnRyb2xsZXIpO1xuXG4gICAgUXVpY2tzZWFyY2hDb250cm9sbGVyLiRpbmplY3QgPSBbJyRsb2NhdGlvbicsICckc3RhdGUnLCAnJHJvb3RTY29wZScsICdTZWFyY2hTZXJ2aWNlJywgJyR3aW5kb3cnXTtcblxuICAgIGZ1bmN0aW9uIFF1aWNrc2VhcmNoQ29udHJvbGxlcigkbG9jYXRpb24sICRzdGF0ZSwgJHJvb3RTY29wZSwgU2VhcmNoU2VydmljZSwgJHdpbmRvdykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5zdWdnZXN0ID0gc3VnZ2VzdDtcbiAgICAgICAgdm0uZ29UbyA9IGdvVG87XG4gICAgICAgIHZtLmRvU2VhcmNoID0gZG9TZWFyY2g7XG5cbiAgICAgICAgLy9GSVhNRSBhIGhhY2sgdG8gcHJvY2VlZCB0byBzdGF0ZSBgc2VhcmNoYCBhZnRlciBlbnRlcmluZyBzZWFyY2guaHRtbFxuICAgICAgICB2YXIgcGF0aCA9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgIGlmIChwYXRoICYmIHBhdGguaW5kZXhPZignc2VhcmNoLmh0bWwnKSA+IC0xICYmICEkc3RhdGUuaXMoJ3NlYXJjaCcpKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3NlYXJjaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3VnZ2VzdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBTZWFyY2hTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLnN1Z2dlc3Qodm0ucXVpY2tzZWFyY2gpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm0uYXV0b3N1Z2dlc3QgPSBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ29Ubyh0YXJnZXQpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGRzLnNlYXJjaC5uYXZpZ2F0ZScsIHt0YXJnZXQ6IHRhcmdldH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZG9TZWFyY2goJGl0ZW0pIHtcbiAgICAgICAgICAgIGlmICghJGl0ZW0gfHwgJGl0ZW0ud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5uYXZpZ2F0ZSgnc2VhcmNoLmh0bWw/dGVybXM9JyArIHZtLnF1aWNrc2VhcmNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoXCJwZHMuc2VhcmNoLmNvbnRyb2xsZXJcIilcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJTZWFyY2hDb250cm9sbGVyXCIsIFNlYXJjaENvbnRyb2xsZXIpO1xuXG4gICAgU2VhcmNoQ29udHJvbGxlci4kaW5qZWN0ID0gWyckYW5jaG9yU2Nyb2xsJywgJ1NlYXJjaFNlcnZpY2UnLCAnY21zU2VhcmNoTGlzdGVuZXInLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJHdpbmRvdycsICdfJywgJ3RyYW5zbGF0ZUZpbHRlciddO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcigkYW5jaG9yU2Nyb2xsLCBTZWFyY2hTZXJ2aWNlLCBjbXNTZWFyY2hMaXN0ZW5lciwgJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkd2luZG93LCBfLCB0cmFuc2xhdGVGaWx0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0uZmluYWxTZWFyY2hSZXN1bHRzID0gW107XG4gICAgICAgIHZtLnNlYXJjaFRlcm0gPSAkbG9jYXRpb24uc2VhcmNoKCkudGVybXM7XG4gICAgICAgIHZtLmNvbnRhY3RUZXh0ID0gdHJhbnNsYXRlRmlsdGVyKCdTRUFSQ0guTk8uUkVTVUxULkNIRUNLTElTVC4zJywge2NvbnRhY3RMaW5rOiBcIjxhIGhyZWY9J1wiICsgdHJhbnNsYXRlRmlsdGVyKCdTRUFSQ0guQ09OVEFDVC5VUkwnKSArIFwiJyBjbGFzcz0nbGluay1pbmxpbmUnIHRhcmdldD0nX3NlbGYnPlwiICsgdHJhbnNsYXRlRmlsdGVyKCdTRUFSQ0guQ09OVEFDVCcpICsgXCI8L2E+XCJ9KTtcbiAgICAgICAgdm0ub25TZWFyY2hJbnB1dCA9IG9uU2VhcmNoSW5wdXQ7XG4gICAgICAgIHZtLmdvVG9BbmNob3IgPSBnb1RvQW5jaG9yO1xuICAgICAgICB2bS5nb01vcmUgPSBnb01vcmU7XG5cbiAgICAgICAgY21zU2VhcmNoTGlzdGVuZXJcbiAgICAgICAgICAgIC5saXN0ZW4oKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGFyYW0udGFyZ2V0LnJlc291cmNlTG9jYXRpb247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgc2VhcmNoKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuICAgICAgICAgICAgaWYgKCF2bS5zZWFyY2hUZXJtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm0udG90YWxMZW5ndGggPSBmYWxzZTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goJ3Rlcm1zJywgdm0uc2VhcmNoVGVybSk7XG5cbiAgICAgICAgICAgIHJldHVybiBTZWFyY2hTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLnNlYXJjaCh2bS5zZWFyY2hUZXJtKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0udG90YWxMZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdm0uZmluYWxTZWFyY2hSZXN1bHRzID0gXy5ncm91cEJ5KGRhdGEsICdjaGFubmVsRGlzY3JpbWluYXRvcicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25TZWFyY2hJbnB1dChrZXlFdmVudCkge1xuICAgICAgICAgICAgaWYgKGtleUV2ZW50LndoaWNoID09PSAxMykge1xuICAgICAgICAgICAgICAgIHNlYXJjaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ29Ub0FuY2hvcihpZFRvR28pIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5oYXNoKGlkVG9Hbyk7XG4gICAgICAgICAgICAkYW5jaG9yU2Nyb2xsLnlPZmZzZXQgPSA4MDtcbiAgICAgICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdvTW9yZShwYXJhbSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwZHMuc2VhcmNoLm5hdmlnYXRlJywge3RhcmdldDogcGFyYW19KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuc2VhcmNoLnNlcnZpY2UnKVxuICAgICAgICAuc2VydmljZSgnY21zU2VhcmNoTGlzdGVuZXInLCBDbXNTZWFyY2hMaXN0ZW5lcik7XG5cbiAgICBDbXNTZWFyY2hMaXN0ZW5lci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRxJywgJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gQ21zU2VhcmNoTGlzdGVuZXIoJHJvb3QsICRxLCBjb25maWcpIHtcbiAgICAgICAgdGhpcy5saXN0ZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICRyb290LiRvbigncGRzLnNlYXJjaC5uYXZpZ2F0ZScsIGZ1bmN0aW9uIChldmVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEhcGFyYW1zLnRhcmdldC5yZXNvdXJjZUxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKFwicGRzLnNlYXJjaC5zZXJ2aWNlXCIpXG5cdFx0LnNlcnZpY2UoXCJTZWFyY2hTZXJ2aWNlXCIsIFNlYXJjaFNlcnZpY2UpO1xuXG5cdFNlYXJjaFNlcnZpY2UuJGluamVjdCA9IFsnJHEnLCAnU2VhcmNoJywgJ2xvY2FsZSddO1xuXG4gICAgdmFyIE1JTl9BVVRPU1VHR0VTVF9URVJNX0xFTkdUSCA9IDI7XG5cbiAgICBmdW5jdGlvbiBTZWFyY2hTZXJ2aWNlKCRxLCBTZWFyY2gsIGxvY2FsZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWFyY2g6IHNlYXJjaCxcblx0XHRcdHN1Z2dlc3Q6IHN1Z2dlc3Rcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc2VhcmNoKHNlYXJjaCkge1xuXHRcdFx0cmV0dXJuIFNlYXJjaC5xdWVyeSh7bG9jYWxlOiBsb2NhbGUsIHNlYXJjaFRlcm06IHNlYXJjaH0pLiRwcm9taXNlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN1Z2dlc3Qoc2VhcmNoVGVybSkge1xuICAgICAgICAgICAgaWYgKHNlYXJjaFRlcm0gJiYgc2VhcmNoVGVybS5sZW5ndGggPiBNSU5fQVVUT1NVR0dFU1RfVEVSTV9MRU5HVEgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU2VhcmNoLmxvY2FsaXplKHtsb2NhbGU6IGxvY2FsZSwgc2VhcmNoVGVybTogc2VhcmNoVGVybX0pLiRwcm9taXNlO1xuICAgICAgICAgICAgfVxuXHRcdFx0cmV0dXJuICRxLnJlc29sdmUoW10pO1xuXHRcdH1cblxuXHR9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5zZWFyY2gucm91dGUnKVxuICAgICAgICAuY29uZmlnKFJvdXRlQ29uZmlnKTtcblxuICAgIFJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gUm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5wZHNSb3V0ZSh7XG4gICAgICAgICAgICBuYW1lOiAnc2VhcmNoJyxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHRlcm1zOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzZWFyY2guaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnU2VhcmNoQ29udHJvbGxlciBhcyB2bSdcbiAgICAgICAgfSk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5uYXZpZ2F0aW9uLmNvbnRyb2xsZXJcIilcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJNZW51Q29udHJvbGxlclwiLCBNZW51Q29udHJvbGxlcik7XG5cbiAgICBNZW51Q29udHJvbGxlci4kaW5qZWN0ID0gWydNZW51U2VydmljZScsICdfJywgJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gTWVudUNvbnRyb2xsZXIobWVudVNlcnZpY2UsIF8sIGNvbmZpZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5pdGVtTGltaXQgPSBjb25maWcubmF2aWdhdGlvbk1heEVsZW1lbnRzO1xuICAgICAgICB2bS5tZW51ID0gdm0ubWVudSB8fCB7XG4gICAgICAgICAgICBuYW1lOiBhbmd1bGFyLmVsZW1lbnQoJyNvY3MtbmF2JykuY2hpbGRyZW4oJ2EnKS50ZXh0KClcbiAgICAgICAgfTtcblxuICAgICAgICBtZW51U2VydmljZVxuICAgICAgICAgICAgLmdldE1lbnUoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24obWVudSkge1xuICAgICAgICAgICAgICAgIHZtLm1lbnUgPSBtZW51O1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLm5hdmlnYXRpb24ubW9kZWwnKVxuICAgICAgICAuY29uZmlnKE5hdmlnYXRpb25Db25maWcpO1xuXG4gICAgTmF2aWdhdGlvbkNvbmZpZy4kaW5qZWN0ID0gWydlbnYnLCAnTmF2aWdhdGlvblByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBOYXZpZ2F0aW9uQ29uZmlnKGVudiwgTmF2aWdhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIE5hdmlnYXRpb25Qcm92aWRlci5uYXZpZ2F0aW9uRW5kcG9pbnQoZW52LmVuZFBvaW50LmNvbnRlbnRTZXJ2aWNlKTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5tb2RlbCcpXG4gICAgICAgIC5wcm92aWRlcignTmF2aWdhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRpb25FbmRwb2ludCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHVybCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gWyckcmVzb3VyY2UnLCAnJGNhY2hlRmFjdG9yeScsIGZ1bmN0aW9uICgkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE5hdmlnYXRpb24oJHJlc291cmNlLCAkY2FjaGVGYWN0b3J5LCB1cmwpO1xuICAgICAgICAgICAgfV1cbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBOYXZpZ2F0aW9uKCRyZXNvdXJjZSwgJGNhY2hlRmFjdG9yeSwgdXJsKSB7XG4gICAgICAgIHZhciBjYXRhbG9nQ2FjaGUgPSAkY2FjaGVGYWN0b3J5KFwibmF2aWdhdGlvblwiKTtcbiAgICAgICAgdmFyIG1ldGhvZHMgPSB7XG4gICAgICAgICAgICBnZXQ6IHttZXRob2Q6ICdHRVQnLCBjYWNoZTogY2F0YWxvZ0NhY2hlfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJHJlc291cmNlKHVybCArICdyZXN0L2RvY3VtZW50L2Rpc3BsYXknLCBudWxsLCBtZXRob2RzKTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKFwicGRzLm5hdmlnYXRpb24uc2VydmljZVwiKVxuXHRcdC5zZXJ2aWNlKFwiTWVudVNlcnZpY2VcIiwgTWVudVNlcnZpY2UpO1xuXG5cdE1lbnVTZXJ2aWNlLiRpbmplY3QgPSBbJ3VybFBhcnNlclNlcnZpY2UnLCAnXycsICdOYXZpZ2F0aW9uJywgJ2xvY2FsZScsICckcSddO1xuXG5cdGZ1bmN0aW9uIE1lbnVTZXJ2aWNlKHVybFBhcnNlclNlcnZpY2UsIF8sIE5hdmlnYXRpb24sIGxvY2FsZSwgJHEpIHtcbiAgICAgICAgdmFyIE5BVklHQVRJT05fVEVNUExBVEVfTkFNRSA9ICdDQVRBTE9HX0hJRVJBUkNIWSc7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5jdXJyZW50TG9jYWxlID0gbG9jYWxlLnRvU3RyaW5nKCk7XG4gICAgICAgIHNlbGYuZmxhdE5hdmlnYXRpb24gPSB7fTtcbiAgICAgICAgc2VsZi5nZXRNZW51ID0gZ2V0TWVudTtcbiAgICAgICAgc2VsZi5maW5kSW5OYXZpZ2F0aW9uID0gZmluZEluTmF2aWdhdGlvbjtcbiAgICAgICAgc2VsZi5maW5kUGFyZW50SW5OYXZpZ2F0aW9uID0gZmluZFBhcmVudEluTmF2aWdhdGlvbjtcblxuXHRcdGZ1bmN0aW9uIGdldE1lbnUobG9jYWxlKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVyTG9jYWxlID0gbG9jYWxlIHx8IHNlbGYuY3VycmVudExvY2FsZTtcbiAgICAgICAgICAgIHZhciBuYXYgPSBuZXcgTmF2aWdhdGlvbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogTkFWSUdBVElPTl9URU1QTEFURV9OQU1FLFxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZTogcHJvcGVyTG9jYWxlLFxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblx0XHRcdHJldHVybiBOYXZpZ2F0aW9uXG4gICAgICAgICAgICAgICAgLmdldCh7cXVlcnk6IG5hdn0pXG4gICAgICAgICAgICAgICAgLiRwcm9taXNlXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXJlcy5yb290KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5yb290LmNoaWxkcmVuWzBdO1xuXHRcdFx0XHR9KVxuXHRcdH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGdldE9DU0NoYW5uZWwoKSB7XG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KCdtZXRhW25hbWU9XCJvY3MtY2hhbm5lbFwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICB9XG5cblx0XHRmdW5jdGlvbiBnZXRGbGF0TWVudShsb2NhbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRNZW51KGxvY2FsZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobWVudSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2NhbGUgfHwgc2VsZi5jdXJyZW50TG9jYWxlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmZsYXROYXZpZ2F0aW9uW2xvY2FsZV0gPSBzZWxmLmZsYXROYXZpZ2F0aW9uW2xvY2FsZV0gfHwgZmxhdE1lbnUobWVudSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmZsYXROYXZpZ2F0aW9uW2xvY2FsZV07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZsYXRNZW51KG1lbnUsIGZsYXQpIHtcbiAgICAgICAgICAgIGZsYXQgPSBmbGF0IHx8IFtdO1xuICAgICAgICAgICAgZmxhdC5wdXNoKG1lbnUpO1xuICAgICAgICAgICAgXy5lYWNoKG1lbnUuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgZmxhdE1lbnUoaXRlbSwgZmxhdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmbGF0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZEluTmF2aWdhdGlvbihpZCwgbG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RmxhdE1lbnUobG9jYWxlKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGZsYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZChmbGF0LCB7aWQ6IFN0cmluZyhpZCl9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRQYXJlbnRJbk5hdmlnYXRpb24oY2hpbGRJZCwgbG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHNlbGYuZmxhdE5hdmlnYXRpb25bbG9jYWxlIHx8IHNlbGYuY3VycmVudExvY2FsZV0sIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFfLmZpbmQodmFsLmNoaWxkcmVuLCB7aWQ6IGNoaWxkSWR9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cdH1cblxufSkoYW5ndWxhcik7XG4iXX0=
