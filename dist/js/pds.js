(function (angular) {
    angular.module('pds.environment', []);
    angular.module('product-data-service', ['pds.catalog', 'pds.navigation', 'pds.environment', 'pds.search', 'pds.common', 'ui.router', 'ngSanitize']);
})(angular);


(function () { 
 return angular.module("pds.environment")
.constant("env", {
  "endPoint": {
    "productDataService": "https://services.kittelberger.net/productdata/buderus/",
    "contentService": "http://localhost:8080/boschtt-cs-dev/",
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
    angular.module('pds.common', ['pds.common.controller', 'pds.common.route', 'pds.common.service', 'pds.common.config', 'pds.common.model', 'pds.common.directive']);
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

        //FIXME
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
    'use strict';

    angular
        .module('pds.common.directive')
        .directive('httpSrc', HttpSrc)

    var defaultImages = {
        'img-bg_BG': '/src/media/img_Default_BG_1.jpg',
        'img-es_ES': '/src/media/img_Default_ES_1.jpg',
        'img-hu_HU': '/src/media/img_Default_HU_1.jpg',
        'img-ro_RO': '/src/media/img_Default_RO_1.jpg'
    };
    var defaultLang = 'bg_BG'

    HttpSrc.$inject = ['_', '$http', 'locale'];

    function HttpSrc(_, $http, locale) {
        return {
            scope: {
                httpSrc: '='
            },
            link: link,
            restrict: 'A'
        };

        function link(scope, element, attrs) {

            if (!scope.httpSrc) {
                return defaultImage();
            }

            $http.get(scope.httpSrc)
                .then(function(response) {
                    attrs.$set('src', scope.httpSrc)
                })
                .catch(defaultImage)

            element.bind('error', defaultImage);

            function defaultImage() {
                var image = defaultImages['img-'+locale.toString()] || defaultImages['img-'+defaultLang]
                attrs.$set('src', image);
            }

        }

    }
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
                    // initNavCollapse(element);
                    //
                    // function initNavCollapse(submenus) {
                    //     var backLabel = window.cmsTranslations && window.cmsTranslations.MOBILE_NAVIGATION_BACK;
                    //
                    //     submenus
                    //         .append('<li class="dl-back"><a>' + backLabel + '</a></li>')
                    //         .end()
                    //         .on('click', '.js-open-submenu', function (e) {
                    //             if (Kit.bIsXs) {
                    //                 $(this).parent('li').addClass('is-open').parent('ul').addClass('nav-expanded').closest('li.is-open').addClass('trail');
                    //             }
                    //         })
                    //         .on('click', 'li.dl-back', function (e) {
                    //             if (Kit.bIsXs) {
                    //                 $(this).closest('li.is-open').removeClass('is-open').parent('ul.nav-expanded').removeClass('nav-expanded').parent('li.trail').removeClass('trail');
                    //             }
                    //         })
                    //         .on('hidden.bs.collapse', function (e) {
                    //             Kit.reset_navPrimary();
                    //         })
                    //         .on('click', 'li', function () {
                    //             var ocsNav = $('#ocs-nav').find('ul.nav');
                    //             ocsNav.addClass('hidden');
                    //             setTimeout(ocsNav.removeClass.bind(ocsNav, 'hidden'), 500);
                    //         });
                    // };
                }
            }
        })

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
  angular.module('pds.navigation.route', ['ui.router']);
  angular.module('pds.navigation.service', ['pds.navigation.model', 'pds.common.service']);
  angular.module('pds.navigation.config', []);
  angular.module('pds.navigation.controller', ['pds.navigation.service', 'pds.common.service']);
  angular.module('pds.navigation.model', []);
  angular.module('pds.navigation.directive', []);
  angular.module('pds.navigation', ['pds.navigation.controller', 'pds.navigation.route', 'pds.navigation.service', 'pds.navigation.config', 'pds.navigation.model']);
})(angular);

(function (angular) {
  angular.module('pds.search.route', ['pds.common.route', 'ui.router']);
  angular.module('pds.search.service', ['pds.navigation.model', 'pds.common.config']);
  angular.module('pds.search.config', []);
  angular.module('pds.search.directive', ['pds.search.service', 'ui.bootstrap']);
  angular.module('pds.search.model', []);
  angular.module('pds.search', ['pds.search.directive', 'pds.search.route', 'pds.search.service', 'pds.search.config', 'pds.search.model']);
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.config')
        .config(['$sceDelegateProvider', SceConfig]);

    function SceConfig($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://services.kittelberger.net/**',
            'https://dev02.sagiton.pl/**',
            'http://localhost:8080/**',
            'https://mycliplister.com/**'
        ]);
    }

})(angular);

(function (angular) {

    angular
        .module('pds.catalog.controller')
        .controller("CatalogController", CatalogController);

    CatalogController.$inject = ['$scope', '$rootScope', 'urlParserService', '_', 'MetaService', 'CatalogService'];

    function CatalogController($scope, $rootScope, urlParserService, _, MetaService, CatalogService) {
        var vm = this;
        var PRODUCT_COUNT_LAYOUT_BREAKPOINT = 4;
        vm.catalogId = urlParserService.getCatalogId();

        vm.anyProductHasValue = anyProductHasValue;
        vm.tableDefinitionContains = tableDefinitionContains;
        vm.responsiveChange = responsiveChange;
        vm.isArray = _.isArray;

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
            if (_.get(vm.catalog, 'redirectCategory.id')) {
                return CatalogService.redirectTo(vm.catalog.redirectCategory.id);
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
                vm.responsiveChange();
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

        function responsiveChange(e, table, columns) {
            var technicalDataTable = vm.catalog.technicalDataTable();
            technicalDataTable.partitions = _.chunk(technicalDataTable.products, _.every(columns) ? PRODUCT_COUNT_LAYOUT_BREAKPOINT : Number.POSITIVE_INFINITY);
        }
    }

})(angular);

(function (angular) {
    var VALUE_TEMPLATE = '<span>{{(value || {}).value == null ? \'-\' : value.value}}</span>';
    var IMAGE_MEDIA_TEMPLATE = '<img ng-src="{{value.value}}" alt="{{alt.value}}" title="{{title.value}}"/>';
    var OTHER_MEDIA_TEMPLATE = '<span><a ng-href="{{value.value | imageUrl}}" title="{{title.value}}" target="_blank"><span translate="DOWNLOAD.NOW"></span>&nbsp;<i class="glyphicon glyphicon-download-alt"></i></a></span>';
    var LIST_TEMPLATE = '<span ng-repeat="el in value.value">{{el + (!$last ? ", ": "")}}</span>';
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
            isApplicable: function (val, type) {
                return type && type.toLowerCase() == 'list';
            },
            template: LIST_TEMPLATE
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

(function (angular, $) {
    angular
        .module('pds.catalog.directive')
        .directive('catalogMetadata', CatalogMetadata);

    function CatalogMetadata() {
        return {
            restrict: 'EA',
            controller: CatalogMetadataController,
            scope: {
                data: '=data'
            }
        }
    }

    CatalogMetadataController.$inject = ['_', '$scope', 'CatalogService'];

    function CatalogMetadataController(_, $scope, CatalogService) {

        var redirectCategoryId = _.get($scope.data, 'redirect.id')
        if (redirectCategoryId) {
            return CatalogService.redirectTo(redirectCategoryId)
        }

        var canonicalReference = _.get($scope.data, 'canonicalReference')
        if (canonicalReference) {
            angular.element('head')
                .find('link[rel=canonical]')
                .attr({'href': canonicalReference})
                .attr({'ng-href': canonicalReference})
        }

    }

})(angular, $);

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
                            .getCatalogTemplate(val)
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

(function (angular, $) {
    angular
        .module('pds.catalog.directive')
        .directive('fullWidthTable', FullWidthTable);

    FullWidthTable.$inject = [];

    function FullWidthTable() {
        return {
            restrict: 'EA',
            link: link
        }
    }

    function link(scope, element, attrs) {

        var viewportWidth = $(window).width();
        var tableSliderElements = element.find(".slick-track .card");
        var tableSliderElementsAmount = $(tableSliderElements).length;

        //desktop
        if (viewportWidth > 991) {
            if (tableSliderElementsAmount < 3) {
                element.addClass("js-full-width-slick-track");
            } else {
                element.removeClass("js-full-width-slick-track");
            }
        }

        //tablet
        if ((viewportWidth < 992) && (viewportWidth > 767)) {
            if (tableSliderElementsAmount < 2) {
                element.addClass("js-full-width-slick-track");
            } else {
                element.removeClass("js-full-width-slick-track");
            }
        }

    }

})(angular, $);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('ocsBreadcrumb', OcsBreadcrumb);

    var crumbTemplate = "<li ng-repeat=\"crumb in $breadcrumbs\" ng-class=\"{'active ocs-breadcrumb-last': $last}\">"
            + "<a ocs-navigate=\"crumb.id\">{{crumb.name}}</a>"
        + "</li>";

    function OcsBreadcrumb() {
        return {
            restrict: 'EA',
            scope: {
                ocsNavigate: '='
            },
            controller: BreadcrumbController
        }
    }

    BreadcrumbController.$inject = ['$scope', '$compile', 'BreadcrumbService', '_']

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
        .directive('ocsDataTable', OcsDataTable);

    OcsDataTable.$inject = ['$timeout', '_'];


    function OcsDataTable($timeout, _) {
        return {
            restrict: 'EA',
            scope: {
                ocsDataTable: '=',
                odtResponsiveChange: '&'
            },
            link: function (scope, element, attrs) {
                scope.$watch('ocsDataTable', function (val) {
                    $timeout(function () {
                        element.DataTable();
                        element.off('responsive-resize.dt');
                        element.on('responsive-resize.dt', function (e, table, cols) {
                            scope.$apply(function () {
                                scope.odtResponsiveChange({$event: e, $table: table, $columns: cols});
                            })
                        });
                    });
                });
            }
        }
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
        .directive('ocsNavigationMenu', OcsNavigationMenu);

    OcsNavigationMenu.$inject = ['config']

    function OcsNavigationMenu(config) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: function() {
                return config.pdsTemplatePath + '/component/navigation_menu.html'
            },
            controller: NavigationMenuController,
            controllerAs: '$ctrl'
        }
    }

    NavigationMenuController.$inject = ['MenuService', '$element']

    function NavigationMenuController(MenuService, $element) {
        var self = this;

        self.menu = self.menu || {
            name: $element.children('a').text()
        };

        MenuService
            .getMenu()
            .then(function(menu) {
                self.menu = menu;
            });

    }
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .component('ocsNewProducts', {
            templateUrl: ['config', function(config) {
                return config.pdsTemplatePath + '/component/new_products.html'
            }],
            controller: NewProductsController
        });

    NewProductsController.$inject = ['CatalogService']

    function NewProductsController(CatalogService) {
        var self = this;

        self.slickSettings = {
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

        CatalogService
            .getNewProducts()
            .then(function (data) {
                self.products = data.products
                self.productsLoaded = true;
            });
    }
})(angular);

(function (angular) {
    angular
        .module('pds.catalog.directive')
        .directive('scrollableTableCard', function() {
            return {
                restrict: 'EA',
                controller: ScrollableTableCardController
            }
        });

    ScrollableTableCardController.$inject = ['$scope', '$element', '$attrs'];

    function ScrollableTableCardController(scope, element, attrs) {

        var $thisTable = $(this);
        var viewportWidth = $(window).width();
        var tableSliderElements = $thisTable.find(".card");
        var tableSliderElementsAmount = $(tableSliderElements).length;

        function setProperColumnQuantity() {
            element.each(function() {
                //desktop
                if (viewportWidth > 991) { //FIXME
                    if (tableSliderElementsAmount < 3) {
                        $thisTable.addClass("js-full-width-slick-track");
                    } else {
                        $thisTable.removeClass("js-full-width-slick-track");
                    }
                }

                //tablet
                if ((viewportWidth < 992) && (viewportWidth > 767)) { //FIXME
                    if (tableSliderElementsAmount < 2) {
                        $thisTable.addClass("js-full-width-slick-track");
                    } else {
                        $thisTable.removeClass("js-full-width-slick-track");
                    }
                }

            });
        }
        setProperColumnQuantity()
        $(window).on("resize orientationchange", setProperColumnQuantity)
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

    SynchronizeHeight.$inject = ['$timeout', '$window'];

    function SynchronizeHeight($timeout, $window) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                $timeout(function() {
                    var firstColumnRow = angular
                        .element(document)
                        .find('.card.card-column table tr')
                        .eq(scope.$index + 1)

                    scope.$watchCollection(function () {
                        return {
                            headerCellHeight: firstColumnRow[0].offsetHeight,
                            thisCellHeight: element[0].offsetHeight
                        }
                    }, synchronizeRowHeight, true)

                    function synchronizeRowHeight(newVals) {
                        var maxHeight = newVals.headerCellHeight > newVals.thisCellHeight ? newVals.headerCellHeight : newVals.thisCellHeight
                        element.height(maxHeight)
                        firstColumnRow.height(maxHeight)
                    }
                }, 500)

                angular.element($window).bind('resize', function () {
                    scope.$apply();
                });

            }
        }
    }

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
            catalog.name = catalog.name || catalog.headline || catalog.productname;
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
        var CatalogResource = $resource(pdsUrl + 'hierarchy/:channel/:locale/:type/:id', null, {
                get: {
                    method: 'GET',
                    params: {locale: locale},
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
            var section = _.find(this.sections, {name: 'TECHNICAL_DATA_TABLE'})
                       || _.find(this.sections, {name: 'TECHNICAL_DATA_TABLE_SLIDER'});
            return section && section.params;
        };

        CatalogResource.fallbackType = function () {
            return 'PRODUCT_FAMILY';
        };

        return CatalogResource;
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
            url: '{catUrl:.*-[cp][/]?}',
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
        var templatePromise

        return {
            build: build
        };

        function build(categoryId) {
            templatePromise = templatePromise || CatalogService.getTemplate(categoryId, 'BREADCRUMBS')
            
            return templatePromise
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
                        .value();
                });
        }

        function decorateWithUrls(response) {
            var tree = response.nodes
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
        var catalogTemplate;

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
            getNewProducts: getNewProducts,
            getCatalogTemplate: getCatalogTemplate,
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

        function getNewProducts() {
            var catalog = new Catalog({
                template: {name: 'NEW_PRODUCTS'},
                model: {
                    locale: locale.toString(),
                    channel: getOCSChannel()
                }
            });
            return catalog.$template();
        }

        function getById(categoryId) {
            return getTypeFromHierarchy(categoryId)
                .then(function (type) {
                    return Catalog.get({
                        id: categoryId,
                        type: type,
                        channel: getOCSChannel()
                    }).$promise;
                });
        }

        function getCatalogTemplate(catalogId) {
            catalogTemplate = catalogTemplate || getTemplate(catalogId)
            return catalogTemplate
        }

        function getTemplate(catalogId, type) {
            return getTypeFromHierarchy(catalogId)
                .then(function (typeFromHierarchy) {
                    var catalog = new Catalog({
                        template: {name: type || typeFromHierarchy},
                        model: {
                            locale: locale.toString(),
                            channel: getOCSChannel(),
                            catalogRequest: {
                                id: catalogId,
                                channel: getOCSChannel(),
                                type: typeFromHierarchy
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
                        id: data.id,
                        type: data.type,
                        name: data.name
                    });
                    if (data && data.parentId) {
                        return travelUpHierarchy(data.parentId, tree);
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
            return travelUpHierarchy(categoryId)
                .then(buildUri);
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
                .getCatalogTemplate(catalogId)
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
            this.options = options || {};
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
            return this.path + (config.urlSchema.trailingSlash ? '/' : '');
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
                    res.root.children[0].maxNavigationItems = res.root.maxNavigationItems;
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

(function (angular) {
    angular
        .module('pds.search.directive')
        .directive('activeSearch', function() {
            return {
                restrict: 'A',
                link: link
            }
        });

        function link(scope, element, attrs) {

            element
                .on('focus', function(e) {
                    document.body.classList.add('search-active');
                })
                .on('blur', function(e) {
                    document.body.classList.remove('search-active');
                });

            angular.element('#js-show-header-search')
                .on('click', 'a', function(e) {
                    element.trigger('focus');
                });
        }

})(angular);

(function (angular) {
    angular
        .module('pds.search.directive')
        .component('ocsQuickSearch', {
            templateUrl: ['config', function(config) {
                return config.pdsTemplatePath + '/component/quick_search.html'
            }],
            transclude: true,
            controller: ocsQuickSearchController
        });

    ocsQuickSearchController.$inject = ['_', '$location', '$state', '$rootScope', 'SearchService', '$window'];

    function ocsQuickSearchController(_, $location, $state, $rootScope, SearchService, $window) {
        var self = this;

        self.suggest = _.throttle(suggest, 200);
        self.goTo = goTo;
        self.doSearch = doSearch;

        //FIXME a hack to proceed to state `search` after entering search.html
        var path = $location.path();
        if (path && path.indexOf('search.html') > -1 && !$state.is('search')) {
            $state.go('search');
        }

        function suggest() {
            return SearchService
                .suggest(self.quicksearch)
                .then(function(data) {
                    return self.autosuggest = data;
                });
        }

        function goTo(target) {
            $rootScope.$broadcast('pds.search.navigate', {target: target});
        }

        function doSearch($item) {
            if (!$item || $item.which === 13) {
                $window.navigate('search.html?terms=' + self.quicksearch);
            }
        }
    }
})(angular);

(function (angular) {
    angular
        .module('pds.search.directive')
        .component('ocsSearch', {
            templateUrl: ['config', function(config) {
                return config.pdsTemplatePath + '/component/search.html'
            }],
            controller: ocsSearchController
        });

    ocsSearchController.$inject = ['$anchorScroll', 'SearchService', 'cmsSearchListener', '$rootScope', '$location', '$window', '_', 'translateFilter'];

    function ocsSearchController($anchorScroll, SearchService, cmsSearchListener, $rootScope, $location, $window, _, translateFilter) {
        var self = this;

        self.finalSearchResults = [];
        self.searchTerm = $location.search().terms;
        self.contactText = translateFilter('SEARCH.NO.RESULT.CHECKLIST.3', {contactLink: "<a href='" + translateFilter('SEARCH.CONTACT.URL') + "' class='link-inline' target='_self'>" + translateFilter('SEARCH.CONTACT') + "</a>"});
        self.onSearchInput = onSearchInput;
        self.goToAnchor = goToAnchor;
        self.goMore = goMore;

        cmsSearchListener
            .listen()
            .then(function (param) {
                $window.location.href = param.target.resourceLocation;
            });
        search();

        function search() {
            if (!self.searchTerm) {
                return;
            }
            self.totalLength = false;
            $location.search('terms', self.searchTerm);

            return SearchService
                .search(self.searchTerm)
                .then(function(data) {
                    self.totalLength = data.length;
                    self.finalSearchResults = _.groupBy(data, 'channelDiscriminator');
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
        return $resource(url + 'resource/:type/:locale', {locale: locale}, methods);
    }
})(angular);

(function(angular) {
    angular
        .module('pds.search.route')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider'];

    function RouteConfig($stateProvider) {
        $stateProvider.pdsRoute({
            name: 'search',
            params: {
                terms: null
            },
            url: 'search.html',
            templateUrl: 'search.html'
        });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImVudi5qcyIsImNvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwiY29tbW9uL2NvbmZpZy9hbmNob3IuY29uZmlnLmpzIiwiY29tbW9uL2NvbmZpZy9pMThuLmNvbmZpZy5qcyIsImNvbW1vbi9jb25maWcvbG9jYWxlLmRpc2NvdmVyeS5qcyIsImNvbW1vbi9jb25maWcvbG9kYXNoLmZhY3RvcnkuanMiLCJjb21tb24vY29uZmlnL29jcy5jaGFubmVsLnByb3ZpZGVyLmpzIiwiY29tbW9uL2NvbmZpZy91cmwucGF0dGVybi5sb2NhbGUuZGlzY292ZXJ5Lm1ldGhvZC5qcyIsImNvbW1vbi9jb25maWcvd2luZG93LmRlY29yYXRvci5qcyIsImNvbW1vbi9jb250cm9sbGVyL2NvbnRlbnQuY29udHJvbGxlci5qcyIsImNvbW1vbi9jb250cm9sbGVyL2hlYWRlci5jb250cm9sbGVyLmpzIiwiY29tbW9uL2NvbnRyb2xsZXIvanNvbmxkLmNvbnRyb2xsZXIuanMiLCJjb21tb24vZGlyZWN0aXZlL2NsaXBsaXN0ZXIuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2RpcmVjdGl2ZS9odHRwU3JjLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9kaXJlY3RpdmUvanNvbmxkLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9kaXJlY3RpdmUvc2ltcGxlLnN1Ym1lbnUuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2ZpbHRlci9pbWFnZS51cmwuZmlsdGVyLmpzIiwiY29tbW9uL2ZpbHRlci9zaW1wbGlmeS5jaGFyYWN0ZXJzLmZpbHRlci5qcyIsImNvbW1vbi9yb3V0ZS9yb3V0ZS5jb25maWcuanMiLCJjb21tb24vc2VydmljZS9zcGlubmVyLnNlcnZpY2UuanMiLCJkb21haW4vY2F0YWxvZy9jYXRhbG9nLm1vZHVsZS5qcyIsImRvbWFpbi9uYXZpZ2F0aW9uL25hdmlnYXRpb24ubW9kdWxlLmpzIiwiZG9tYWluL3NlYXJjaC9zZWFyY2gubW9kdWxlLmpzIiwiZG9tYWluL2NhdGFsb2cvY29uZmlnL3Nhbml0aXplLmNvbmZpZy5qcyIsImRvbWFpbi9jYXRhbG9nL2NvbnRyb2xsZXIvY2F0YWxvZy5jb250cm9sbGVyLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL2F0dHJpYnV0ZS52YWx1ZS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvY2F0YWxvZy5tZXRhZGF0YS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvY2F0YWxvZy50ZW1wbGF0ZS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvZXF1YWxpemUudGVhc2VyLmhlaWdodC5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvZnVsbC53aWR0aC50YWJsZS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvb2NzLmJyZWFkY3J1bWIuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL29jcy5kYXRhLnRhYmxlLmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL2RpcmVjdGl2ZS9vY3MubmF2aWdhdGUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL29jcy5uYXZpZ2F0aW9uLm1lbnUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL29jcy5uZXcucHJvZHVjdHMuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL3Njcm9sbGFibGUudGFibGUuZGlyZWN0aXZlLmpzIiwiZG9tYWluL2NhdGFsb2cvZGlyZWN0aXZlL3N3aXRjaC5sYW5ndWFnZS5kaXJlY3RpdmUuanMiLCJkb21haW4vY2F0YWxvZy9kaXJlY3RpdmUvc3luY2hyb25pemUuaGVpZ2h0LmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9jYXRhbG9nL2ZhY3RvcnkvdXJsLmJ1aWxkZXIuZmFjdG9yeS5qcyIsImRvbWFpbi9jYXRhbG9nL21vZGVsL2NhdGFsb2cuaGVscGVyLmpzIiwiZG9tYWluL2NhdGFsb2cvbW9kZWwvY2F0YWxvZy5tb2RlbC5jb25maWcuanMiLCJkb21haW4vY2F0YWxvZy9tb2RlbC9jYXRhbG9nLnJlc291cmNlLmpzIiwiZG9tYWluL2NhdGFsb2cvcm91dGUvY2F0YWxvZy5yb3V0ZS5jb25maWcuanMiLCJkb21haW4vY2F0YWxvZy9zZXJ2aWNlL2JyZWFkY3J1bWIuc2VydmljZS5qcyIsImRvbWFpbi9jYXRhbG9nL3NlcnZpY2UvY2F0YWxvZy5zZXJ2aWNlLmpzIiwiZG9tYWluL2NhdGFsb2cvc2VydmljZS9tZXRhLnNlcnZpY2UuanMiLCJkb21haW4vY2F0YWxvZy9zZXJ2aWNlL3NlYXJjaC5saXN0ZW5lci5qcyIsImRvbWFpbi9jYXRhbG9nL3NlcnZpY2Uvc2VvLmZyaWVuZGx5LnVybC5idWlsZGVyLmpzIiwiZG9tYWluL2NhdGFsb2cvc2VydmljZS91cmwucGFyc2VyLnNlcnZpY2UuanMiLCJkb21haW4vbmF2aWdhdGlvbi9tb2RlbC9uYXZpZ2F0aW9uLm1vZGVsLmNvbmZpZy5qcyIsImRvbWFpbi9uYXZpZ2F0aW9uL21vZGVsL25hdmlnYXRpb24ucmVzb3VyY2UuanMiLCJkb21haW4vbmF2aWdhdGlvbi9zZXJ2aWNlL21lbnUuc2VydmljZS5qcyIsImRvbWFpbi9zZWFyY2gvZGlyZWN0aXZlL2FjdGl2ZS5zZWFyY2guZGlyZWN0aXZlLmpzIiwiZG9tYWluL3NlYXJjaC9kaXJlY3RpdmUvb2NzLnF1aWNrc2VhcmNoLmRpcmVjdGl2ZS5qcyIsImRvbWFpbi9zZWFyY2gvZGlyZWN0aXZlL29jcy5zZWFyY2guZGlyZWN0aXZlLmpzIiwiZG9tYWluL3NlYXJjaC9tb2RlbC9zZWFyY2gubW9kZWwuY29uZmlnLmpzIiwiZG9tYWluL3NlYXJjaC9tb2RlbC9zZWFyY2gucmVzb3VyY2UuanMiLCJkb21haW4vc2VhcmNoL3JvdXRlL3NlYXJjaC5yb3V0ZS5jb25maWcuanMiLCJkb21haW4vc2VhcmNoL3NlcnZpY2UvY21zLnNlYXJjaC5saXN0ZW5lci5qcyIsImRvbWFpbi9zZWFyY2gvc2VydmljZS9zZWFyY2guc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5lbnZpcm9ubWVudCcsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncHJvZHVjdC1kYXRhLXNlcnZpY2UnLCBbJ3Bkcy5jYXRhbG9nJywgJ3Bkcy5uYXZpZ2F0aW9uJywgJ3Bkcy5lbnZpcm9ubWVudCcsICdwZHMuc2VhcmNoJywgJ3Bkcy5jb21tb24nLCAndWkucm91dGVyJywgJ25nU2FuaXRpemUnXSk7XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoKSB7IFxuIHJldHVybiBhbmd1bGFyLm1vZHVsZShcInBkcy5lbnZpcm9ubWVudFwiKVxuLmNvbnN0YW50KFwiY29uZmlnXCIsIHtcbiAgXCJtZXRhVGFnc1wiOiB7XG4gICAgXCJzaXRlTmFtZVwiOiBcIkJ1ZGVydXNcIlxuICB9LFxuICBcInVybFNjaGVtYVwiOiB7XG4gICAgXCJ0cmFpbGluZ1NsYXNoXCI6IGZhbHNlXG4gIH0sXG4gIFwicGRzUGF0aFByZWZpeFwiOiBcIi9vY3NcIixcbiAgXCJwZHNUZW1wbGF0ZVBhdGhcIjogXCIvc3JjL2h0bWxcIixcbiAgXCJmb3JjZUxhbmd1YWdlXCI6IG51bGwsXG4gIFwic2VhcmNoXCI6IHtcbiAgICBcImRlZmF1bHRJbWFnZVwiOiBcImRlZmF1bHQtc2VhcmNoXCJcbiAgfVxufSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkgeyBcbiByZXR1cm4gYW5ndWxhci5tb2R1bGUoXCJwZHMuZW52aXJvbm1lbnRcIilcbi5jb25zdGFudChcImVudlwiLCB7XG4gIFwiZW5kUG9pbnRcIjoge1xuICAgIFwicHJvZHVjdERhdGFTZXJ2aWNlXCI6IFwiaHR0cHM6Ly9zZXJ2aWNlcy5raXR0ZWxiZXJnZXIubmV0L3Byb2R1Y3RkYXRhL2J1ZGVydXMvXCIsXG4gICAgXCJjb250ZW50U2VydmljZVwiOiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9ib3NjaHR0LWNzLWRldi9cIixcbiAgICBcInNlYXJjaFNlcnZpY2VcIjogXCJodHRwczovL3NlcnZpY2VzLmtpdHRlbGJlcmdlci5uZXQvc2VhcmNoL3YxL1wiLFxuICAgIFwib2NzTWVkaWFFbmRwb2ludFwiOiBcImh0dHBzOi8vc2VydmljZXMua2l0dGVsYmVyZ2VyLm5ldC9wcm9kdWN0ZGF0YS9idWRlcnVzL1wiXG4gIH0sXG4gIFwic2VhcmNoXCI6IHtcbiAgICBcImNtc0NoYW5uZWxEaXNjcmltaW5hdG9yXCI6IFwiZGVDSENtc0Rpc2NyaW1pbmF0b3JcIixcbiAgICBcInBkc0NoYW5uZWxEaXNjcmltaW5hdG9yXCI6IFwiYnVkZXJ1c1Bkc0Rpc2NyaW1pbmF0b3JcIlxuICB9XG59KTtcblxufSkoKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLnJvdXRlJywgWyd1aS5yb3V0ZXInLCAnbmN5LWFuZ3VsYXItYnJlYWRjcnVtYicsICdwZHMuZW52aXJvbm1lbnQnXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24uc2VydmljZScsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnLCBbJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jb21tb24uY29udHJvbGxlcicsIFsnbmdBbmltYXRlJywgJ25nU2FuaXRpemUnLCAnZGF0YXRhYmxlcycsICdobC5zdGlja3knLCAnZGNiSW1nRmFsbGJhY2snLCAnc2xpY2tDYXJvdXNlbCddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5tb2RlbCcsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5mYWN0b3J5JywgW10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY29tbW9uLmRpcmVjdGl2ZScsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbi5maWx0ZXInLCBbJ3Bkcy5lbnZpcm9ubWVudCddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNvbW1vbicsIFsncGRzLmNvbW1vbi5jb250cm9sbGVyJywgJ3Bkcy5jb21tb24ucm91dGUnLCAncGRzLmNvbW1vbi5zZXJ2aWNlJywgJ3Bkcy5jb21tb24uY29uZmlnJywgJ3Bkcy5jb21tb24ubW9kZWwnLCAncGRzLmNvbW1vbi5kaXJlY3RpdmUnXSk7XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhciwgJCkge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnKVxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKCdhJylcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEkKGVsKS5hdHRyKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfc2VsZicpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbn0pKGFuZ3VsYXIsICQpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyLCB3aW5kb3cpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJylcbiAgICAgICAgLmNvbmZpZyhbJyR0cmFuc2xhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkdHJhbnNsYXRlUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuY21zVHJhbnNsYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgICAgIC50cmFuc2xhdGlvbnMoJ3RoaXMnLCB3aW5kb3cuY21zVHJhbnNsYXRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdzYW5pdGl6ZScpXG4gICAgICAgICAgICAgICAgICAgIC5wcmVmZXJyZWRMYW5ndWFnZSgndGhpcycpXG4gICAgICAgICAgICAgICAgICAgIC51c2UoJ3RoaXMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuXG59KShhbmd1bGFyLCB3aW5kb3cpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmNvbmZpZycpXG4gICAgICAgIC5wcm92aWRlcignbG9jYWxlJywgTG9jYWxlUHJvdmlkZXIpO1xuXG5cbiAgICBmdW5jdGlvbiBMb2NhbGVQcm92aWRlcigpIHtcbiAgICAgICAgdmFyIGRpc2NvdmVyeU1ldGhvZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmFkZERpc2NvdmVyeU1ldGhvZCA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgICAgIGRpc2NvdmVyeU1ldGhvZHMucHVzaChtZXRob2QpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4kZ2V0ID0gWydfJywgZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTG9jYWxlKF8sIGRpc2NvdmVyeU1ldGhvZHMpO1xuICAgICAgICB9XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoXywgZGlzY292ZXJ5TWV0aG9kcykge1xuICAgICAgICB2YXIgbWV0aG9kID0gXy5maW5kKGRpc2NvdmVyeU1ldGhvZHMsIF8uYXR0ZW1wdCk7XG4gICAgICAgIHZhciByZXN1bHQgPSAgbWV0aG9kID8gbWV0aG9kKCkgOiBbXTtcbiAgICAgICAgdmFyIGNvdW50cnkgPSByZXN1bHRbMV07XG4gICAgICAgIHZhciBsYW5ndWFnZSA9IHJlc3VsdFsyXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvdW50cnk6IGNvdW50cnksXG4gICAgICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2UudG9Mb3dlckNhc2UoKSArIFwiX1wiICsgdGhpcy5jb3VudHJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJylcbiAgICAgICAgLmZhY3RvcnkoJ18nLCBbJyR3aW5kb3cnLCBmdW5jdGlvbiAoJHdpbmRvdykge1xuICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cuXztcbiAgICAgICAgfV0pO1xuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnKVxuICAgICAgICAuZmFjdG9yeSgnb2NzQ2hhbm5lbCcsIE9jc0NoYW5uZWwpO1xuXG4gICAgZnVuY3Rpb24gT2NzQ2hhbm5lbCgpIHtcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudCgnbWV0YVtuYW1lPVwib2NzLWNoYW5uZWxcIl0nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29uZmlnJylcbiAgICAgICAgLmNvbmZpZyhbJ2xvY2FsZVByb3ZpZGVyJywgZnVuY3Rpb24gKGxvY2FsZVByb3ZpZGVyKSB7XG4gICAgICAgICAgICB2YXIgbG9jYWxlVXJsUGF0dGVybiA9IC9eXFwvKFthLXpBLVpdezJ9KVxcLyhbYS16QS1aXXsyfSkvO1xuICAgICAgICAgICAgbG9jYWxlUHJvdmlkZXIuYWRkRGlzY292ZXJ5TWV0aG9kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlVXJsUGF0dGVybi5leGVjKG5ldyBVUkkoKS5wYXRoKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dKTtcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb25maWcnKVxuICAgICAgICAuZGVjb3JhdG9yKCckd2luZG93JywgWyckZGVsZWdhdGUnLCBXaW5kb3dEZWNvcmF0b3JdKTtcblxuICAgIGZ1bmN0aW9uIFdpbmRvd0RlY29yYXRvcigkZGVsZWdhdGUpIHtcbiAgICAgICAgJGRlbGVnYXRlLm5hdmlnYXRlID0gZnVuY3Rpb24gKHVyaSkge1xuICAgICAgICAgICAgaWYgKHVyaS5pbmRleE9mKCcvJykgIT0gMCkge1xuICAgICAgICAgICAgICAgIHVyaSA9ICcvJy5jb25jYXQodXJpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRkZWxlZ2F0ZS5sb2NhdGlvbi5ocmVmID0gZ2V0QmFzZVBhdGgoKSArIHVyaTtcbiAgICAgICAgfTtcbiAgICAgICAgJGRlbGVnYXRlLmdldEJhc2VQYXRoID0gZnVuY3Rpb24gZ2V0QmFzZVBhdGgoKSB7XG4gICAgICAgICAgICB2YXIgYmFzZVBhdGggPSBhbmd1bGFyLmVsZW1lbnQoJ2Jhc2UnKS5hdHRyKCdocmVmLW92ZXJyaWRlJyk7XG5cbiAgICAgICAgICAgIGlmICghYmFzZVBhdGgpXG4gICAgICAgICAgICAgICAgYmFzZVBhdGggPSBhbmd1bGFyLmVsZW1lbnQoJ2Jhc2UnKS5hdHRyKCdocmVmJyk7XG5cbiAgICAgICAgICAgIGlmIChiYXNlUGF0aC5sYXN0SW5kZXhPZignLycpID09IChiYXNlUGF0aC5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIGJhc2VQYXRoID0gYmFzZVBhdGguc2xpY2UoMCwgYmFzZVBhdGgubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmFzZVBhdGg7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAkZGVsZWdhdGU7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uY29udHJvbGxlcicpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb250ZW50Q29udHJvbGxlcicsIENvbnRlbnRDb250cm9sbGVyKTtcblxuICAgIENvbnRlbnRDb250cm9sbGVyLiRpbmplY3QgPSBbJ1NwaW5uZXJTZXJ2aWNlJ107XG5cbiAgICBmdW5jdGlvbiBDb250ZW50Q29udHJvbGxlcihzcGlubmVyU2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmlzU3Bpbm5pbmcgPSBzcGlubmVyU2VydmljZS5pc0xvYWRpbmc7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb250cm9sbGVyJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2hlYWRlckNvbnRyb2xsZXInLCBIZWFkZXJDb250cm9sbGVyKTtcblxuICAgIEhlYWRlckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdsb2NhbGUnLCAnY29uZmlnJywgJ2pzb25GaWx0ZXInLCAnXycsICdCcmVhZGNydW1iU2VydmljZSddO1xuICAgIHZhciBjb250ZW50R3JvdXBzID0gWydXVC5jZ19uJywgJ1dULmNnX3MnLCAnV1Quel9jZzMnLCAnV1Quel9jZzQnLCAnV1Quel9jZzUnLCAnV1Quel9jZzYnLCAnV1Quel9jZzcnLCAnV1Quel9jZzgnLCAnV1Quel9jZzknLCAnV1Quel9jZzEwJ107XG5cbiAgICBmdW5jdGlvbiBIZWFkZXJDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBsb2NhbGUsIGNvbmZpZywganNvbkZpbHRlciwgXywgQnJlYWRjcnVtYlNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHJvb3RDb250ZW50R3JvdXAgPSB7bmFtZTogY29uZmlnLm1ldGFUYWdzLnNpdGVOYW1lfTtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0udXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuICAgICAgICB2bS5sb2NhbGUgPSBsb2NhbGUudG9TdHJpbmcoKTtcbiAgICAgICAgdm0uYnJhbmQgPSBjb25maWcubWV0YVRhZ3MuYnJhbmQ7XG4gICAgICAgIHZtLmNvdW50cnkgPSBsb2NhbGUuY291bnRyeTtcbiAgICAgICAgdm0ubGFuZ3VhZ2UgPSBsb2NhbGUubGFuZ3VhZ2U7XG5cbiAgICAgICAgJHNjb3BlLiRvbigncGRzLmhlYWRlci51cGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgdm0udGl0bGUgPSBwYXJhbXMudGl0bGU7XG4gICAgICAgICAgICB2bS5kZXNjcmlwdGlvbiA9IHBhcmFtcy5kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIHZtLmltYWdlID0gcGFyYW1zLmltYWdlO1xuICAgICAgICAgICAgdm0ud2ViVHJlbmRzID0gcGFyYW1zLndlYlRyZW5kcztcbiAgICAgICAgICAgIHZtLnNpdGVOYW1lID0gcGFyYW1zLnNpdGVOYW1lO1xuICAgICAgICAgICAgdm0uY2Fub25pY2FsVXJsID0gcGFyYW1zLmNhbm9uaWNhbFVybDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbigncGRzLmhlYWRlci51cGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgYnVpbGRKc29uTEQoe1xuICAgICAgICAgICAgICAgIFwiQGNvbnRleHRcIjogXCJodHRwOi8vc2NoZW1hLm9yZy9cIixcbiAgICAgICAgICAgICAgICBcIkB0eXBlXCI6IFwiUHJvZHVjdFwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiIDogcGFyYW1zLnRpdGxlLFxuICAgICAgICAgICAgICAgIFwiaW1hZ2VcIjogcGFyYW1zLmltYWdlLFxuICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogcGFyYW1zLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIFwiYnJhbmRcIjogY29uZmlnLm1ldGFUYWdzLnNpdGVOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9GSVhNRVxuICAgICAgICAkc2NvcGUuJG9uKCdwZHMuYnJlYWRjcnVtYi51cGRhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgQnJlYWRjcnVtYlNlcnZpY2VcbiAgICAgICAgICAgICAgICAuYnVpbGQocGFyYW1zLmNhdGFsb2dJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYnJlYWRjcnVtYnMpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRKc29uTEQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJAY29udGV4dFwiOiBcImh0dHA6Ly9zY2hlbWEub3JnL1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJAdHlwZVwiOiBcIkJyZWFkY3J1bWJMaXN0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIml0ZW1MaXN0RWxlbWVudFwiOiBfLm1hcChicmVhZGNydW1icywgZnVuY3Rpb24gKGNydW1iLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdAdHlwZSc6ICdMaXN0SXRlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0BpZCc6IGNydW1iLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNydW1iLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJlYWRjcnVtYnM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihidWlsZENvbnRlbnRHcm91cHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBidWlsZEpzb25MRChtb2RlbCkge1xuICAgICAgICAgICAgYW5ndWxhclxuICAgICAgICAgICAgICAgIC5lbGVtZW50KCc8c2NyaXB0PicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3R5cGUnLCAnYXBwbGljYXRpb24vbGQranNvbicpXG4gICAgICAgICAgICAgICAgLnRleHQoanNvbkZpbHRlcihtb2RlbCkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdoZWFkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBidWlsZENvbnRlbnRHcm91cHModHJlZSkge1xuICAgICAgICAgICAgdHJlZS51bnNoaWZ0KHJvb3RDb250ZW50R3JvdXApO1xuICAgICAgICAgICAgXy5mb3JFYWNoKHRyZWUsIGZ1bmN0aW9uIChlbGVtZW50LCBpZHgpIHtcbiAgICAgICAgICAgICAgICBhZGRNZXRhKGNvbnRlbnRHcm91cHNbaWR4XSwgZWxlbWVudC5uYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBhZGRNZXRhKG5hbWUsIGNvbnRlbnQpIHtcbiAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAuZWxlbWVudCgnbWV0YVtuYW1lPVwiJyArIG5hbWUgKyAnXCInKVxuICAgICAgICAgICAgICAgIC5yZW1vdmUoKTtcbiAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAuZWxlbWVudCgnPG1ldGE+JylcbiAgICAgICAgICAgICAgICAuYXR0cignbmFtZScsIG5hbWUpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NvbnRlbnQnLCBjb250ZW50KVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbygnaGVhZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5jb250cm9sbGVyJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2pzb25MZENvbnRyb2xsZXInLCBKc29uTGRDb250cm9sbGVyKTtcblxuICAgIEpzb25MZENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdCcmVhZGNydW1iU2VydmljZScsICdDYXRhbG9nU2VydmljZScsICdqc29uRmlsdGVyJ107XG5cbiAgICBmdW5jdGlvbiBKc29uTGRDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBCcmVhZGNydW1iU2VydmljZSwgQ2F0YWxvZ1NlcnZpY2UsIGpzb25GaWx0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgdm0udXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuXG5cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NsaXBsaXN0ZXInLCBDbGlwbGlzdGVyRGlyZWN0aXZlKTtcblxuICAgIENsaXBsaXN0ZXJEaXJlY3RpdmUuJGluamVjdCA9IFsnJGZpbHRlcicsICckc2NlJ107XG5cbiAgICBmdW5jdGlvbiBDbGlwbGlzdGVyRGlyZWN0aXZlKCRmaWx0ZXIsICRzY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgaWQ9XCJ2aWRlb1wiIHN0eWxlPVwiaGVpZ2h0OjQwMHB4O1wiPjwvZGl2PicsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHZpZGVvSWQ6ICc9dmlkZW9JZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBuZXcgQ2xpcGxpc3RlckNvbnRyb2wuVmlld2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50SWQ6IFwidmlkZW9cIixcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tZXI6IDE1Nzg5MyxcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBbc2NvcGUudmlkZW9JZF0sXG4gICAgICAgICAgICAgICAgICAgIGtleVR5cGU6IDEwMDAwLFxuICAgICAgICAgICAgICAgICAgICBmc2s6IDE4LFxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIElubmVyQ29udHJvbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllcjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVEZWZhdWx0Q29udHJvbHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiY29udHJvbHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGFja2xpc3Q6IFtcInNoYXJlXCIsXCJxdWFsaXR5XCIsXCJwbGF5YmFjay1zcGVlZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImV4dGVybmFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCJodHRwczovL215Y2xpcGxpc3Rlci5jb20vc3RhdGljL3ZpZXdlci9hc3NldHMvc2tpbnMvZGVmYXVsdC9jb250cm9scy5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2xpY2thYmxlVmlkZW86IHtsYXllcjogMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICBQbGF5QnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwicGxheUJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyOiA3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBcImh0dHBzOi8vbXljbGlwbGlzdGVyLmNvbS9zdGF0aWMvdmlld2VyL2Fzc2V0cy9za2lucy9kZWZhdWx0L3BsYXlCdXR0b24ucG5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFByZXZpZXdJbWFnZToge2xheWVyOiA2fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfTtcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnaHR0cFNyYycsIEh0dHBTcmMpXG5cbiAgICB2YXIgZGVmYXVsdEltYWdlcyA9IHtcbiAgICAgICAgJ2ltZy1iZ19CRyc6ICcvc3JjL21lZGlhL2ltZ19EZWZhdWx0X0JHXzEuanBnJyxcbiAgICAgICAgJ2ltZy1lc19FUyc6ICcvc3JjL21lZGlhL2ltZ19EZWZhdWx0X0VTXzEuanBnJyxcbiAgICAgICAgJ2ltZy1odV9IVSc6ICcvc3JjL21lZGlhL2ltZ19EZWZhdWx0X0hVXzEuanBnJyxcbiAgICAgICAgJ2ltZy1yb19STyc6ICcvc3JjL21lZGlhL2ltZ19EZWZhdWx0X1JPXzEuanBnJ1xuICAgIH07XG4gICAgdmFyIGRlZmF1bHRMYW5nID0gJ2JnX0JHJ1xuXG4gICAgSHR0cFNyYy4kaW5qZWN0ID0gWydfJywgJyRodHRwJywgJ2xvY2FsZSddO1xuXG4gICAgZnVuY3Rpb24gSHR0cFNyYyhfLCAkaHR0cCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGh0dHBTcmM6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgICAgaWYgKCFzY29wZS5odHRwU3JjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRJbWFnZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkaHR0cC5nZXQoc2NvcGUuaHR0cFNyYylcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCdzcmMnLCBzY29wZS5odHRwU3JjKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGRlZmF1bHRJbWFnZSlcblxuICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdlcnJvcicsIGRlZmF1bHRJbWFnZSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlZmF1bHRJbWFnZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBkZWZhdWx0SW1hZ2VzWydpbWctJytsb2NhbGUudG9TdHJpbmcoKV0gfHwgZGVmYXVsdEltYWdlc1snaW1nLScrZGVmYXVsdExhbmddXG4gICAgICAgICAgICAgICAgYXR0cnMuJHNldCgnc3JjJywgaW1hZ2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2pzb25sZCcsIEpzb25MZERpcmVjdGl2ZSk7XG5cbiAgICBKc29uTGREaXJlY3RpdmUuJGluamVjdCA9IFsnJGZpbHRlcicsICckc2NlJ107XG5cbiAgICBmdW5jdGlvbiBKc29uTGREaXJlY3RpdmUoJGZpbHRlciwgJHNjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNjcmlwdCB0eXBlPVwiYXBwbGljYXRpb24vbGQranNvblwiIG5nLWJpbmQtaHRtbD1cIm9uR2V0SnNvbigpXCI+PC9zY3JpcHQ+JyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAganNvbjogJz1qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHNjb3BlLm9uR2V0SnNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbCgkZmlsdGVyKCdqc29uJykoc2NvcGUuanNvbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9O1xuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNvbW1vbi5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdzaW1wbGVTdWJtZW51JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGluaXROYXZDb2xsYXBzZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gaW5pdE5hdkNvbGxhcHNlKHN1Ym1lbnVzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgYmFja0xhYmVsID0gd2luZG93LmNtc1RyYW5zbGF0aW9ucyAmJiB3aW5kb3cuY21zVHJhbnNsYXRpb25zLk1PQklMRV9OQVZJR0FUSU9OX0JBQ0s7XG4gICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBzdWJtZW51c1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC5hcHBlbmQoJzxsaSBjbGFzcz1cImRsLWJhY2tcIj48YT4nICsgYmFja0xhYmVsICsgJzwvYT48L2xpPicpXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgLm9uKCdjbGljaycsICcuanMtb3Blbi1zdWJtZW51JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYgKEtpdC5iSXNYcykge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJ2xpJykuYWRkQ2xhc3MoJ2lzLW9wZW4nKS5wYXJlbnQoJ3VsJykuYWRkQ2xhc3MoJ25hdi1leHBhbmRlZCcpLmNsb3Nlc3QoJ2xpLmlzLW9wZW4nKS5hZGRDbGFzcygndHJhaWwnKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgLm9uKCdjbGljaycsICdsaS5kbC1iYWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYgKEtpdC5iSXNYcykge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaS5pcy1vcGVuJykucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKS5wYXJlbnQoJ3VsLm5hdi1leHBhbmRlZCcpLnJlbW92ZUNsYXNzKCduYXYtZXhwYW5kZWQnKS5wYXJlbnQoJ2xpLnRyYWlsJykucmVtb3ZlQ2xhc3MoJ3RyYWlsJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC5vbignaGlkZGVuLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgS2l0LnJlc2V0X25hdlByaW1hcnkoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC5vbignY2xpY2snLCAnbGknLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHZhciBvY3NOYXYgPSAkKCcjb2NzLW5hdicpLmZpbmQoJ3VsLm5hdicpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBvY3NOYXYuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzZXRUaW1lb3V0KG9jc05hdi5yZW1vdmVDbGFzcy5iaW5kKG9jc05hdiwgJ2hpZGRlbicpLCA1MDApO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uZmlsdGVyJylcbiAgICAgICAgLmZpbHRlcignaW1hZ2VVcmwnLCBJbWFnZVVybEZpbHRlcik7XG5cbiAgICBJbWFnZVVybEZpbHRlci4kaW5qZWN0ID0gWydlbnYnLCAnbG9jYWxlJywgJ29jc0NoYW5uZWwnXTtcblxuICAgIHZhciBkZWZhdWx0SW1hZ2VzID0ge1xuICAgICAgICAnaW1nLXNtJzogJy9zcmMvbWVkaWEvZGVmYXVsdC00NjB4NDYwLmpwZycsXG4gICAgICAgICdpbWctbWQnOiAnL3NyYy9tZWRpYS9kZWZhdWx0LTY0MHgzNzIuanBnJyxcbiAgICAgICAgJ2ltZy1sZyc6ICcvc3JjL21lZGlhL2RlZmF1bHQtNjgweDQ0MC5qcGcnLFxuICAgICAgICAnaW1nLXhsZyc6ICcvc3JjL21lZGlhL2RlZmF1bHQtMTYwMHg1NjAuanBnJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBJbWFnZVVybEZpbHRlcihlbnYsIGxvY2FsZSwgb2NzQ2hhbm5lbCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lZGlhT2JqZWN0LCBzaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gbWVkaWFPYmplY3QgPyBlbnYuZW5kUG9pbnQub2NzTWVkaWFFbmRwb2ludCArIG9jc0NoYW5uZWwgKyBcIi9cIiArIGxvY2FsZS50b1N0cmluZygpICsgXCIvXCIgKyBtZWRpYU9iamVjdCA6IGRlZmF1bHRJbWFnZXNbc2l6ZSB8fCAnaW1nLXNtJ107XG4gICAgICAgIH1cbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIHZhciBDSEFSQUNURVJfTUFQID0ge1xuICAgICAgICAnXFx1MDAyRSc6ICAgJycsICAvLy5cbiAgICAgICAgJ1xcdTAwMjAnOiAgICctJywgLy9TUEFDRVxuICAgICAgICAnXFx1MDAyQyc6ICAgJy0nLCAvLyxcbiAgICAgICAgJ1xcdTAwMjYnOiAgICctJywgLy8mXG4gICAgICAgICdcXHUwMDVDJzogICAnLScsIC8vXFxcbiAgICAgICAgJ1xcdTIwMUUnOiAgICctJywgLy/igJ5cbiAgICAgICAgJ1xcdTAwMjInOiAgICctJywgLy8nXG4gICAgICAgICdcXHUwMDI3JzogICAnLScsIC8vJ1xuICAgICAgICAnXFx1MDBCNCc6ICAgJy0nLCAvL8K0XG4gICAgICAgICdcXHUwMDYwJzogICAnLScsIC8vYFxuICAgICAgICAnXFx1MDBCQic6ICAgJy0nLCAvL8K7XG4gICAgICAgICdcXHUwMEFCJzogICAnLScsIC8vwqtcbiAgICAgICAgJ1xcdTAwMkYnOiAgICctJywgLy8vXG4gICAgICAgICdcXHUwMDNBJzogICAnLScsIC8vOlxuICAgICAgICAnXFx1MDAyMSc6ICAgJy0nLCAvLyFcbiAgICAgICAgJ1xcdTAwMkEnOiAgICctJywgLy8qXG4gICAgICAgICdcXHUwMDI4JzogICAnLScsIC8vKFxuICAgICAgICAnXFx1MDAyOSc6ICAgJy0nLCAvLylcbiAgICAgICAgJ1xcdTIxMjInOiAgICctJywgLy/ihKJcbiAgICAgICAgJ1xcdTAwQUUnOiAgICctJywgLy/CrlxuICAgICAgICAnXFx1MDBFMSc6ICAgJ2EnLCAvL8OhXG4gICAgICAgICdcXHUwMEYzJzogICAnbycsIC8vw7NcbiAgICAgICAgJ1xcdTAwRUQnOiAgICdpJywgLy/DrVxuICAgICAgICAnXFx1MDBFOSc6ICAgJ2UnLCAvL8OpXG4gICAgICAgICdcXHUwMEU0JzogICAnYWUnLC8vw6RcbiAgICAgICAgJ1xcdTAwRjYnOiAgICdvZScsLy/DtlxuICAgICAgICAnXFx1MDE1MSc6ICAgJ28nLCAvL8WRXG4gICAgICAgICdcXHUwMEZDJzogICAndScsIC8vw7xcbiAgICAgICAgJ1xcdTAwRkEnOiAgICd1JywgLy/DulxuICAgICAgICAnXFx1MDE3MSc6ICAgJ3UnLCAvL8WxXG4gICAgICAgICdcXHUwMERGJzogICAnc3MnLC8vw59cbiAgICAgICAgJ1xcdTAwRUUnOiAgICdpJywgLy/DrlxuICAgICAgICAnXFx1MDBFMic6ICAgJ2EnLCAvL8OiXG4gICAgICAgICdcXHUwMTAzJzogICAnYScsIC8vxINcbiAgICAgICAgJ1xcdTAyMUInOiAgICd0JywgLy/Im1xuICAgICAgICAnXFx1MDE2Myc6ICAgJ3QnLCAvL8WjXG4gICAgICAgICdcXHUwMTVGJzogICAndCcsIC8vxZ9cbiAgICAgICAgJ1xcdTAyMTknOiAgICdzJywgLy/ImVxuICAgICAgICAnXFx1MDE1OSc6ICAgJ3InLCAvL8WZXG4gICAgICAgICdcXHUwMTZmJzogICAndScsIC8vxa9cbiAgICAgICAgJ1xcdTAwRkQnOiAgICd5JywgLy/DvVxuICAgICAgICAnXFx1MDEwRCc6ICAgJ2MnLCAvL8SNXG4gICAgICAgICdcXHUwMTFCJzogICAnZScsIC8vxJtcbiAgICAgICAgJ1xcdTAxN0UnOiAgICd6JywgLy/FvlxuICAgICAgICAnXFx1MDE2MSc6ICAgJ3MnLCAvL8WhXG4gICAgICAgICdcXHUwMTY1JzogICAndCcsIC8vxaVcbiAgICAgICAgJ1xcdTAxNDgnOiAgICduJywgLy/FiFxuICAgICAgICAnXFx1MjAxOSc6ICAgJy0nLCAvL+KAmVxuICAgICAgICAnXFx1MDBlMCc6ICAgJ2EnICAvL8OgXG4gICAgfTtcbiAgICB2YXIgY2hhcmFjdGVyUmVnZXggPSBfXG4gICAgICAgIC5tYXAoQ0hBUkFDVEVSX01BUCwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gJ1xcXFwnICsga2V5O1xuICAgICAgICB9KVxuICAgICAgICAuam9pbignfCcpO1xuICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKGNoYXJhY3RlclJlZ2V4LCAnZycpO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY29tbW9uLmZpbHRlcicpXG4gICAgICAgIC5maWx0ZXIoJ3NpbXBsaWZ5Q2hhcmFjdGVycycsIFsnXycsIGZ1bmN0aW9uIChfKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgJiYgdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UocmVnRXhwLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ0hBUkFDVEVSX01BUFttYXRjaF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pXG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24ucm91dGUnKVxuICAgICAgICAuY29uZmlnKFJvdXRlQ29uZmlnKTtcblxuICAgIFJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gUm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCBjb25maWcpIHtcbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgICAkc3RhdGVQcm92aWRlci5wZHNSb3V0ZSA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgcm91dGUudXJsID0gdXJsUGF0aChyb3V0ZS51cmwpO1xuICAgICAgICAgICAgcm91dGUudGVtcGxhdGVVcmwgPSBodG1sUGF0aChyb3V0ZS50ZW1wbGF0ZVVybCk7XG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShyb3V0ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gdXJsUGF0aChwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnBkc1BhdGhQcmVmaXggKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaHRtbFBhdGgocGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5wZHNUZW1wbGF0ZVBhdGggKyAnLycgKyBwYXRoO1xuICAgICAgICB9XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jb21tb24uc2VydmljZScpXG4gICAgICAgIC5zZXJ2aWNlKCdTcGlubmVyU2VydmljZScsIFNwaW5uZXJTZXJ2aWNlKTtcblxuICAgIFNwaW5uZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBTcGlubmVyU2VydmljZSgkaHR0cCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucGVuZGluZ1JlcXVlc3RzLmxlbmd0aCA+IDA7XG4gICAgICAgIH1cblxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cucm91dGUnLCBbJ3Bkcy5jb21tb24ucm91dGUnLCAndWkucm91dGVyJywgJ25jeS1hbmd1bGFyLWJyZWFkY3J1bWInXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnLCBbJ3Bkcy5jb21tb24uZmlsdGVyJ10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY2F0YWxvZy5jb25maWcnLCBbJ3Bkcy5lbnZpcm9ubWVudCcsICduZ1Jlc291cmNlJywgJ3Bkcy5jb21tb24uY29uZmlnJ10pO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdwZHMuY2F0YWxvZy5jb250cm9sbGVyJywgWyduZ1Nhbml0aXplJywgJ2RhdGF0YWJsZXMnLCAnaGwuc3RpY2t5JywgJ2RjYkltZ0ZhbGxiYWNrJywgJ3NsaWNrQ2Fyb3VzZWwnLCAncGRzLmNhdGFsb2cuc2VydmljZScsICdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnLCAncGRzLm5hdmlnYXRpb24uc2VydmljZSddKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cubW9kZWwnLCBbXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmZhY3RvcnknLCBbJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScsIFtdKTtcbiAgICBhbmd1bGFyLm1vZHVsZSgncGRzLmNhdGFsb2cnLCBbJ3Bkcy5jYXRhbG9nLmNvbnRyb2xsZXInLCAncGRzLmNhdGFsb2cucm91dGUnLCAncGRzLmNhdGFsb2cuc2VydmljZScsICdwZHMuY2F0YWxvZy5jb25maWcnLCAncGRzLmNhdGFsb2cubW9kZWwnXSk7XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICBhbmd1bGFyLm1vZHVsZSgncGRzLm5hdmlnYXRpb24ucm91dGUnLCBbJ3VpLnJvdXRlciddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLnNlcnZpY2UnLCBbJ3Bkcy5uYXZpZ2F0aW9uLm1vZGVsJywgJ3Bkcy5jb21tb24uc2VydmljZSddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLmNvbmZpZycsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLmNvbnRyb2xsZXInLCBbJ3Bkcy5uYXZpZ2F0aW9uLnNlcnZpY2UnLCAncGRzLmNvbW1vbi5zZXJ2aWNlJ10pO1xuICBhbmd1bGFyLm1vZHVsZSgncGRzLm5hdmlnYXRpb24ubW9kZWwnLCBbXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5kaXJlY3RpdmUnLCBbXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMubmF2aWdhdGlvbicsIFsncGRzLm5hdmlnYXRpb24uY29udHJvbGxlcicsICdwZHMubmF2aWdhdGlvbi5yb3V0ZScsICdwZHMubmF2aWdhdGlvbi5zZXJ2aWNlJywgJ3Bkcy5uYXZpZ2F0aW9uLmNvbmZpZycsICdwZHMubmF2aWdhdGlvbi5tb2RlbCddKTtcbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLnJvdXRlJywgWydwZHMuY29tbW9uLnJvdXRlJywgJ3VpLnJvdXRlciddKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2guc2VydmljZScsIFsncGRzLm5hdmlnYXRpb24ubW9kZWwnLCAncGRzLmNvbW1vbi5jb25maWcnXSk7XG4gIGFuZ3VsYXIubW9kdWxlKCdwZHMuc2VhcmNoLmNvbmZpZycsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2guZGlyZWN0aXZlJywgWydwZHMuc2VhcmNoLnNlcnZpY2UnLCAndWkuYm9vdHN0cmFwJ10pO1xuICBhbmd1bGFyLm1vZHVsZSgncGRzLnNlYXJjaC5tb2RlbCcsIFtdKTtcbiAgYW5ndWxhci5tb2R1bGUoJ3Bkcy5zZWFyY2gnLCBbJ3Bkcy5zZWFyY2guZGlyZWN0aXZlJywgJ3Bkcy5zZWFyY2gucm91dGUnLCAncGRzLnNlYXJjaC5zZXJ2aWNlJywgJ3Bkcy5zZWFyY2guY29uZmlnJywgJ3Bkcy5zZWFyY2gubW9kZWwnXSk7XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuY29uZmlnJylcbiAgICAgICAgLmNvbmZpZyhbJyRzY2VEZWxlZ2F0ZVByb3ZpZGVyJywgU2NlQ29uZmlnXSk7XG5cbiAgICBmdW5jdGlvbiBTY2VDb25maWcoJHNjZURlbGVnYXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHNjZURlbGVnYXRlUHJvdmlkZXIucmVzb3VyY2VVcmxXaGl0ZWxpc3QoW1xuICAgICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgICAgJ2h0dHBzOi8vc2VydmljZXMua2l0dGVsYmVyZ2VyLm5ldC8qKicsXG4gICAgICAgICAgICAnaHR0cHM6Ly9kZXYwMi5zYWdpdG9uLnBsLyoqJyxcbiAgICAgICAgICAgICdodHRwOi8vbG9jYWxob3N0OjgwODAvKionLFxuICAgICAgICAgICAgJ2h0dHBzOi8vbXljbGlwbGlzdGVyLmNvbS8qKidcbiAgICAgICAgXSk7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5jb250cm9sbGVyJylcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJDYXRhbG9nQ29udHJvbGxlclwiLCBDYXRhbG9nQ29udHJvbGxlcik7XG5cbiAgICBDYXRhbG9nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICd1cmxQYXJzZXJTZXJ2aWNlJywgJ18nLCAnTWV0YVNlcnZpY2UnLCAnQ2F0YWxvZ1NlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2dDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgdXJsUGFyc2VyU2VydmljZSwgXywgTWV0YVNlcnZpY2UsIENhdGFsb2dTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgIHZhciBQUk9EVUNUX0NPVU5UX0xBWU9VVF9CUkVBS1BPSU5UID0gNDtcbiAgICAgICAgdm0uY2F0YWxvZ0lkID0gdXJsUGFyc2VyU2VydmljZS5nZXRDYXRhbG9nSWQoKTtcblxuICAgICAgICB2bS5hbnlQcm9kdWN0SGFzVmFsdWUgPSBhbnlQcm9kdWN0SGFzVmFsdWU7XG4gICAgICAgIHZtLnRhYmxlRGVmaW5pdGlvbkNvbnRhaW5zID0gdGFibGVEZWZpbml0aW9uQ29udGFpbnM7XG4gICAgICAgIHZtLnJlc3BvbnNpdmVDaGFuZ2UgPSByZXNwb25zaXZlQ2hhbmdlO1xuICAgICAgICB2bS5pc0FycmF5ID0gXy5pc0FycmF5O1xuXG4gICAgICAgIE1ldGFTZXJ2aWNlLnVwZGF0ZU1ldGFCeUNhdGVnb3J5KHZtLmNhdGFsb2dJZCk7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGRzLmJyZWFkY3J1bWIudXBkYXRlJywge2NhdGFsb2dJZDogdm0uY2F0YWxvZ0lkfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbigncGRzLmNhdGFsb2cubG9hZGVkJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0Q2F0YWxvZyhwYXJhbXMuY2F0YWxvZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS4kb24oJ3Bkcy5jYXRhbG9nLmxvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAgICAgICAuZWxlbWVudCgnI25hdi1wcmltYXJ5LWNvbGxhcHNlJylcbiAgICAgICAgICAgICAgICAuZmluZCgnbGknKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICBhbmd1bGFyXG4gICAgICAgICAgICAgICAgLmVsZW1lbnQoJyNvY3MtbmF2JylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0Q2F0YWxvZyhjYXRhbG9nKSB7XG4gICAgICAgICAgICB2bS5jYXRhbG9nID0gY2F0YWxvZztcbiAgICAgICAgICAgIGlmIChfLmdldCh2bS5jYXRhbG9nLCAncmVkaXJlY3RDYXRlZ29yeS5pZCcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENhdGFsb2dTZXJ2aWNlLnJlZGlyZWN0VG8odm0uY2F0YWxvZy5yZWRpcmVjdENhdGVnb3J5LmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZtLmNhdGFsb2cuZW5lcmd5RWZmaWNpZW5jeSA9IHZtLmNhdGFsb2cuZW5lcmd5RWZmaWNpZW5jeSB8fCB7fTtcbiAgICAgICAgICAgIHZhciB0ZWNobmljYWxEYXRhVGFibGUgPSB2bS5jYXRhbG9nLnRlY2huaWNhbERhdGFUYWJsZSgpO1xuICAgICAgICAgICAgaWYgKHRlY2huaWNhbERhdGFUYWJsZSkge1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZURlZmluaXRpb24gPSB0ZWNobmljYWxEYXRhVGFibGUudGFibGVEZWZpbml0aW9uO1xuICAgICAgICAgICAgICAgIHRlY2huaWNhbERhdGFUYWJsZS50YWJsZURlZmluaXRpb24gPSBfXG4gICAgICAgICAgICAgICAgICAgIC5jaGFpbih0YWJsZURlZmluaXRpb24pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oYXR0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlY2huaWNhbERhdGFUYWJsZS5zaG93QXR0cmlidXRlc1dpdGhOb1ZhbHVlcyB8fCBhbnlQcm9kdWN0SGFzVmFsdWUodGVjaG5pY2FsRGF0YVRhYmxlLnByb2R1Y3RzLCBhdHRyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihpc05vdEhlYWRlckF0dHJpYnV0ZS5iaW5kKHRoaXMsIHRlY2huaWNhbERhdGFUYWJsZS5wcm9kdWN0cykpXG4gICAgICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xuICAgICAgICAgICAgICAgIHZtLnJlc3BvbnNpdmVDaGFuZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTm90SGVhZGVyQXR0cmlidXRlKHByb2R1Y3RzLCBhdHRyKSB7XG4gICAgICAgICAgICByZXR1cm4gIWlzSGVhZGVyQXR0cmlidXRlKHByb2R1Y3RzLCBhdHRyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzSGVhZGVyQXR0cmlidXRlKHByb2R1Y3RzLCBhdHRyKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5zb21lKHByb2R1Y3RzLCBmdW5jdGlvbiAocHJvZHVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWN0LmhlYWRlci5rZXkgPT0gYXR0ci5rZXk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFueVByb2R1Y3RIYXNWYWx1ZShwcm9kdWN0cywgYXR0cmlidXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5zb21lKHByb2R1Y3RzLCBhdHRyaWJ1dGUua2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRhYmxlRGVmaW5pdGlvbkNvbnRhaW5zKGRlZmluaXRpb24sIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIF8uc29tZShkZWZpbml0aW9uLCB7a2V5OiBrZXl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNpdmVDaGFuZ2UoZSwgdGFibGUsIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIHZhciB0ZWNobmljYWxEYXRhVGFibGUgPSB2bS5jYXRhbG9nLnRlY2huaWNhbERhdGFUYWJsZSgpO1xuICAgICAgICAgICAgdGVjaG5pY2FsRGF0YVRhYmxlLnBhcnRpdGlvbnMgPSBfLmNodW5rKHRlY2huaWNhbERhdGFUYWJsZS5wcm9kdWN0cywgXy5ldmVyeShjb2x1bW5zKSA/IFBST0RVQ1RfQ09VTlRfTEFZT1VUX0JSRUFLUE9JTlQgOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpO1xuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIHZhciBWQUxVRV9URU1QTEFURSA9ICc8c3Bhbj57eyh2YWx1ZSB8fCB7fSkudmFsdWUgPT0gbnVsbCA/IFxcJy1cXCcgOiB2YWx1ZS52YWx1ZX19PC9zcGFuPic7XG4gICAgdmFyIElNQUdFX01FRElBX1RFTVBMQVRFID0gJzxpbWcgbmctc3JjPVwie3t2YWx1ZS52YWx1ZX19XCIgYWx0PVwie3thbHQudmFsdWV9fVwiIHRpdGxlPVwie3t0aXRsZS52YWx1ZX19XCIvPic7XG4gICAgdmFyIE9USEVSX01FRElBX1RFTVBMQVRFID0gJzxzcGFuPjxhIG5nLWhyZWY9XCJ7e3ZhbHVlLnZhbHVlIHwgaW1hZ2VVcmx9fVwiIHRpdGxlPVwie3t0aXRsZS52YWx1ZX19XCIgdGFyZ2V0PVwiX2JsYW5rXCI+PHNwYW4gdHJhbnNsYXRlPVwiRE9XTkxPQUQuTk9XXCI+PC9zcGFuPiZuYnNwOzxpIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1kb3dubG9hZC1hbHRcIj48L2k+PC9hPjwvc3Bhbj4nO1xuICAgIHZhciBMSVNUX1RFTVBMQVRFID0gJzxzcGFuIG5nLXJlcGVhdD1cImVsIGluIHZhbHVlLnZhbHVlXCI+e3tlbCArICghJGxhc3QgPyBcIiwgXCI6IFwiXCIpfX08L3NwYW4+JztcbiAgICB2YXIgSU1BR0VfRVhURU5TSU9OUyA9IFsnLmpwZycsICcucG5nJywgJy5qcGVnJywgJy5naWYnXTtcbiAgICB2YXIgRE9UID0gJy4nO1xuXG4gICAgdmFyIHRlbXBsYXRlU3RyYXRlZ3kgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlzQXBwbGljYWJsZTogZnVuY3Rpb24gKHZhbCwgdHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlICYmIHR5cGUudG9Mb3dlckNhc2UoKSA9PSAnc3RyaW5nJyAmJiBJTUFHRV9FWFRFTlNJT05TLmluZGV4T2YodmFsLnNsaWNlKHZhbC5sYXN0SW5kZXhPZihET1QpKSkgPj0gMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZTogSU1BR0VfTUVESUFfVEVNUExBVEVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaXNBcHBsaWNhYmxlOiBmdW5jdGlvbiAodmFsLCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGUgJiYgdHlwZS50b0xvd2VyQ2FzZSgpID09ICdhc3NldCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6IE9USEVSX01FRElBX1RFTVBMQVRFXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlzQXBwbGljYWJsZTogZnVuY3Rpb24gKHZhbCwgdHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlICYmIHR5cGUudG9Mb3dlckNhc2UoKSA9PSAnbGlzdCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6IExJU1RfVEVNUExBVEVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaXNBcHBsaWNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6IFZBTFVFX1RFTVBMQVRFXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdhdHRyaWJ1dGVWYWx1ZScsIFsnJGNvbXBpbGUnLCAnJHNjZScsIGZ1bmN0aW9uICgkY29tcGlsZSwgJHNjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJz1hdHRyaWJ1dGVWYWx1ZScsXG4gICAgICAgICAgICAgICAgICAgIGFsdDogXCI9YXR0cmlidXRlQWx0XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIj1hdHRyaWJ1dGVUaXRsZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRzY2UgPSAkc2NlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBsYXRlU3RyYXRlZ3kubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS52YWx1ZSAmJiB0ZW1wbGF0ZVN0cmF0ZWd5W2ldLmlzQXBwbGljYWJsZShzY29wZS52YWx1ZS52YWx1ZSwgc2NvcGUudmFsdWUudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5odG1sKCRjb21waWxlKHRlbXBsYXRlU3RyYXRlZ3lbaV0udGVtcGxhdGUpKHNjb3BlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIsICQpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NhdGFsb2dNZXRhZGF0YScsIENhdGFsb2dNZXRhZGF0YSk7XG5cbiAgICBmdW5jdGlvbiBDYXRhbG9nTWV0YWRhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IENhdGFsb2dNZXRhZGF0YUNvbnRyb2xsZXIsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGRhdGE6ICc9ZGF0YSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIENhdGFsb2dNZXRhZGF0YUNvbnRyb2xsZXIuJGluamVjdCA9IFsnXycsICckc2NvcGUnLCAnQ2F0YWxvZ1NlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2dNZXRhZGF0YUNvbnRyb2xsZXIoXywgJHNjb3BlLCBDYXRhbG9nU2VydmljZSkge1xuXG4gICAgICAgIHZhciByZWRpcmVjdENhdGVnb3J5SWQgPSBfLmdldCgkc2NvcGUuZGF0YSwgJ3JlZGlyZWN0LmlkJylcbiAgICAgICAgaWYgKHJlZGlyZWN0Q2F0ZWdvcnlJZCkge1xuICAgICAgICAgICAgcmV0dXJuIENhdGFsb2dTZXJ2aWNlLnJlZGlyZWN0VG8ocmVkaXJlY3RDYXRlZ29yeUlkKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhbm9uaWNhbFJlZmVyZW5jZSA9IF8uZ2V0KCRzY29wZS5kYXRhLCAnY2Fub25pY2FsUmVmZXJlbmNlJylcbiAgICAgICAgaWYgKGNhbm9uaWNhbFJlZmVyZW5jZSkge1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdoZWFkJylcbiAgICAgICAgICAgICAgICAuZmluZCgnbGlua1tyZWw9Y2Fub25pY2FsXScpXG4gICAgICAgICAgICAgICAgLmF0dHIoeydocmVmJzogY2Fub25pY2FsUmVmZXJlbmNlfSlcbiAgICAgICAgICAgICAgICAuYXR0cih7J25nLWhyZWYnOiBjYW5vbmljYWxSZWZlcmVuY2V9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKGFuZ3VsYXIsICQpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdjYXRhbG9nVGVtcGxhdGUnLCBbJ0NhdGFsb2dTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnXycgLGZ1bmN0aW9uIChDYXRhbG9nU2VydmljZSwgJHJvb3RTY29wZSwgXykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBjYXRhbG9nSWQ6ICc9J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJjYXRhbG9nLXRlbXBsYXRlXCIgbmctdHJhbnNjbHVkZT48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdjYXRhbG9nSWQnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgJiYgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0Q2F0YWxvZ1RlbXBsYXRlKHZhbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoY2F0YWxvZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kY2F0YWxvZyA9IGNhdGFsb2c7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGRzLmNhdGFsb2cubG9hZGVkJywge2NhdGFsb2c6IGNhdGFsb2d9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XSk7XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyLCAkKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdlcXVhbGl6ZVRlYXNlckhlaWdodCcsIFsnJHRpbWVvdXQnLCBFcXVhbGl6ZVRlYXNlckhlaWdodF0pO1xuXG4gICAgZnVuY3Rpb24gRXF1YWxpemVUZWFzZXJIZWlnaHQoJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS4kbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXhIZWlnaHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcmRCbG9jayA9ICQoXCIuY2FyZCAuY2FyZC1ibG9ja1wiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJChjYXJkQmxvY2spLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGVpZ2h0KCkgPiBtYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4SGVpZ2h0ID0gJCh0aGlzKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJChjYXJkQmxvY2spLmhlaWdodChtYXhIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyLCBqUXVlcnkpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyLCAkKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdmdWxsV2lkdGhUYWJsZScsIEZ1bGxXaWR0aFRhYmxlKTtcblxuICAgIEZ1bGxXaWR0aFRhYmxlLiRpbmplY3QgPSBbXTtcblxuICAgIGZ1bmN0aW9uIEZ1bGxXaWR0aFRhYmxlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBsaW5rOiBsaW5rXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgIHZhciB2aWV3cG9ydFdpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG4gICAgICAgIHZhciB0YWJsZVNsaWRlckVsZW1lbnRzID0gZWxlbWVudC5maW5kKFwiLnNsaWNrLXRyYWNrIC5jYXJkXCIpO1xuICAgICAgICB2YXIgdGFibGVTbGlkZXJFbGVtZW50c0Ftb3VudCA9ICQodGFibGVTbGlkZXJFbGVtZW50cykubGVuZ3RoO1xuXG4gICAgICAgIC8vZGVza3RvcFxuICAgICAgICBpZiAodmlld3BvcnRXaWR0aCA+IDk5MSkge1xuICAgICAgICAgICAgaWYgKHRhYmxlU2xpZGVyRWxlbWVudHNBbW91bnQgPCAzKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhcImpzLWZ1bGwtd2lkdGgtc2xpY2stdHJhY2tcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJqcy1mdWxsLXdpZHRoLXNsaWNrLXRyYWNrXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy90YWJsZXRcbiAgICAgICAgaWYgKCh2aWV3cG9ydFdpZHRoIDwgOTkyKSAmJiAodmlld3BvcnRXaWR0aCA+IDc2NykpIHtcbiAgICAgICAgICAgIGlmICh0YWJsZVNsaWRlckVsZW1lbnRzQW1vdW50IDwgMikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoXCJqcy1mdWxsLXdpZHRoLXNsaWNrLXRyYWNrXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKFwianMtZnVsbC13aWR0aC1zbGljay10cmFja1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG59KShhbmd1bGFyLCAkKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnb2NzQnJlYWRjcnVtYicsIE9jc0JyZWFkY3J1bWIpO1xuXG4gICAgdmFyIGNydW1iVGVtcGxhdGUgPSBcIjxsaSBuZy1yZXBlYXQ9XFxcImNydW1iIGluICRicmVhZGNydW1ic1xcXCIgbmctY2xhc3M9XFxcInsnYWN0aXZlIG9jcy1icmVhZGNydW1iLWxhc3QnOiAkbGFzdH1cXFwiPlwiXG4gICAgICAgICAgICArIFwiPGEgb2NzLW5hdmlnYXRlPVxcXCJjcnVtYi5pZFxcXCI+e3tjcnVtYi5uYW1lfX08L2E+XCJcbiAgICAgICAgKyBcIjwvbGk+XCI7XG5cbiAgICBmdW5jdGlvbiBPY3NCcmVhZGNydW1iKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG9jc05hdmlnYXRlOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiBCcmVhZGNydW1iQ29udHJvbGxlclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQnJlYWRjcnVtYkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRjb21waWxlJywgJ0JyZWFkY3J1bWJTZXJ2aWNlJywgJ18nXVxuXG4gICAgZnVuY3Rpb24gQnJlYWRjcnVtYkNvbnRyb2xsZXIoJHNjb3BlLCAkY29tcGlsZSwgQnJlYWRjcnVtYlNlcnZpY2UsIF8pIHtcbiAgICAgICAgJHNjb3BlLiRvbigncGRzLmJyZWFkY3J1bWIudXBkYXRlJywgZnVuY3Rpb24gKGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgICAgICAgIEJyZWFkY3J1bWJTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmJ1aWxkKHBhcmFtcy5jYXRhbG9nSWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGJyZWFkY3J1bWJzID0gcmVzIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnJlYWRjcnVtYnMgPSAkY29tcGlsZShjcnVtYlRlbXBsYXRlKSgkc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnJlYWRjcnVtYnNDb250YWluZXIgPSBhbmd1bGFyLmVsZW1lbnQoJyNuYXYtYnJlYWRjcnVtYnMnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWRjcnVtYnNDb250YWluZXIuZmluZCgnLmRyb3Bkb3duLW1lbnUnKS5hcHBlbmQoYnJlYWRjcnVtYnMpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETyBNb3ZlIHRoaXMgc3R1ZmYsIGJ1dCB3aGVyZS4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmxhc3QoJHNjb3BlLiRicmVhZGNydW1icykudHlwZSA9PSAnUFJPRFVDVF9GQU1JTFknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhZGNydW1ic0NvbnRhaW5lci5hZGRDbGFzcygnZGFyay1icmVhZGNydW1iJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhZGNydW1ic0NvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5kcm9wZG93bi10b2dnbGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoXy5sYXN0KCRzY29wZS4kYnJlYWRjcnVtYnMpLm5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdvY3NEYXRhVGFibGUnLCBPY3NEYXRhVGFibGUpO1xuXG4gICAgT2NzRGF0YVRhYmxlLiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJ18nXTtcblxuXG4gICAgZnVuY3Rpb24gT2NzRGF0YVRhYmxlKCR0aW1lb3V0LCBfKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb2NzRGF0YVRhYmxlOiAnPScsXG4gICAgICAgICAgICAgICAgb2R0UmVzcG9uc2l2ZUNoYW5nZTogJyYnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnb2NzRGF0YVRhYmxlJywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkRhdGFUYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vZmYoJ3Jlc3BvbnNpdmUtcmVzaXplLmR0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdyZXNwb25zaXZlLXJlc2l6ZS5kdCcsIGZ1bmN0aW9uIChlLCB0YWJsZSwgY29scykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm9kdFJlc3BvbnNpdmVDaGFuZ2UoeyRldmVudDogZSwgJHRhYmxlOiB0YWJsZSwgJGNvbHVtbnM6IGNvbHN9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnb2NzTmF2aWdhdGUnLCBPY3NOYXZpZ2F0ZURpcmVjdGl2ZSk7XG5cbiAgICBPY3NOYXZpZ2F0ZURpcmVjdGl2ZS4kaW5qZWN0ID0gWydDYXRhbG9nU2VydmljZSddO1xuXG4gICAgZnVuY3Rpb24gT2NzTmF2aWdhdGVEaXJlY3RpdmUoQ2F0YWxvZ1NlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBvY3NOYXZpZ2F0ZTogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnb2NzTmF2aWdhdGUnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCAmJiBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlc29sdmVVcmlGcm9tSGllcmFyY2h5KHZhbClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2hyZWYnLCB1cmkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZmlsdGVyKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISQoZWwpLmF0dHIoJ3RhcmdldCcpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19zZWxmJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdvY3NOYXZpZ2F0aW9uTWVudScsIE9jc05hdmlnYXRpb25NZW51KTtcblxuICAgIE9jc05hdmlnYXRpb25NZW51LiRpbmplY3QgPSBbJ2NvbmZpZyddXG5cbiAgICBmdW5jdGlvbiBPY3NOYXZpZ2F0aW9uTWVudShjb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnLnBkc1RlbXBsYXRlUGF0aCArICcvY29tcG9uZW50L25hdmlnYXRpb25fbWVudS5odG1sJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IE5hdmlnYXRpb25NZW51Q29udHJvbGxlcixcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJyRjdHJsJ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTmF2aWdhdGlvbk1lbnVDb250cm9sbGVyLiRpbmplY3QgPSBbJ01lbnVTZXJ2aWNlJywgJyRlbGVtZW50J11cblxuICAgIGZ1bmN0aW9uIE5hdmlnYXRpb25NZW51Q29udHJvbGxlcihNZW51U2VydmljZSwgJGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYubWVudSA9IHNlbGYubWVudSB8fCB7XG4gICAgICAgICAgICBuYW1lOiAkZWxlbWVudC5jaGlsZHJlbignYScpLnRleHQoKVxuICAgICAgICB9O1xuXG4gICAgICAgIE1lbnVTZXJ2aWNlXG4gICAgICAgICAgICAuZ2V0TWVudSgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihtZW51KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5tZW51ID0gbWVudTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLmRpcmVjdGl2ZScpXG4gICAgICAgIC5jb21wb25lbnQoJ29jc05ld1Byb2R1Y3RzJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFsnY29uZmlnJywgZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5wZHNUZW1wbGF0ZVBhdGggKyAnL2NvbXBvbmVudC9uZXdfcHJvZHVjdHMuaHRtbCdcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgY29udHJvbGxlcjogTmV3UHJvZHVjdHNDb250cm9sbGVyXG4gICAgICAgIH0pO1xuXG4gICAgTmV3UHJvZHVjdHNDb250cm9sbGVyLiRpbmplY3QgPSBbJ0NhdGFsb2dTZXJ2aWNlJ11cblxuICAgIGZ1bmN0aW9uIE5ld1Byb2R1Y3RzQ29udHJvbGxlcihDYXRhbG9nU2VydmljZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi5zbGlja1NldHRpbmdzID0ge1xuICAgICAgICAgICAgXCJhcnJvd3NcIjogZmFsc2UsXG4gICAgICAgICAgICBcImRvdHNcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiaW5maW5pdGVcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNwZWVkXCI6IDEwMDAsXG4gICAgICAgICAgICBcImNzc0Vhc2VcIjogXCJlYXNlLWluLW91dFwiLFxuICAgICAgICAgICAgXCJzbGlkZXNUb1Nob3dcIjogNCxcbiAgICAgICAgICAgIFwic2xpZGVzVG9TY3JvbGxcIjogNCxcbiAgICAgICAgICAgIFwicmVzcG9uc2l2ZVwiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImJyZWFrcG9pbnRcIjogOTkyLFxuICAgICAgICAgICAgICAgICAgICBcInNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2xpZGVzVG9TaG93XCI6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNsaWRlc1RvU2Nyb2xsXCI6IDJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImJyZWFrcG9pbnRcIjogNzY4LFxuICAgICAgICAgICAgICAgICAgICBcInNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2xpZGVzVG9TaG93XCI6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNsaWRlc1RvU2Nyb2xsXCI6IDFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBDYXRhbG9nU2VydmljZVxuICAgICAgICAgICAgLmdldE5ld1Byb2R1Y3RzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wcm9kdWN0cyA9IGRhdGEucHJvZHVjdHNcbiAgICAgICAgICAgICAgICBzZWxmLnByb2R1Y3RzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdzY3JvbGxhYmxlVGFibGVDYXJkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFNjcm9sbGFibGVUYWJsZUNhcmRDb250cm9sbGVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgU2Nyb2xsYWJsZVRhYmxlQ2FyZENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycyddO1xuXG4gICAgZnVuY3Rpb24gU2Nyb2xsYWJsZVRhYmxlQ2FyZENvbnRyb2xsZXIoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgdmFyICR0aGlzVGFibGUgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgdmlld3BvcnRXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuICAgICAgICB2YXIgdGFibGVTbGlkZXJFbGVtZW50cyA9ICR0aGlzVGFibGUuZmluZChcIi5jYXJkXCIpO1xuICAgICAgICB2YXIgdGFibGVTbGlkZXJFbGVtZW50c0Ftb3VudCA9ICQodGFibGVTbGlkZXJFbGVtZW50cykubGVuZ3RoO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNldFByb3BlckNvbHVtblF1YW50aXR5KCkge1xuICAgICAgICAgICAgZWxlbWVudC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vZGVza3RvcFxuICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydFdpZHRoID4gOTkxKSB7IC8vRklYTUVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhYmxlU2xpZGVyRWxlbWVudHNBbW91bnQgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1RhYmxlLmFkZENsYXNzKFwianMtZnVsbC13aWR0aC1zbGljay10cmFja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzVGFibGUucmVtb3ZlQ2xhc3MoXCJqcy1mdWxsLXdpZHRoLXNsaWNrLXRyYWNrXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy90YWJsZXRcbiAgICAgICAgICAgICAgICBpZiAoKHZpZXdwb3J0V2lkdGggPCA5OTIpICYmICh2aWV3cG9ydFdpZHRoID4gNzY3KSkgeyAvL0ZJWE1FXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWJsZVNsaWRlckVsZW1lbnRzQW1vdW50IDwgMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNUYWJsZS5hZGRDbGFzcyhcImpzLWZ1bGwtd2lkdGgtc2xpY2stdHJhY2tcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1RhYmxlLnJlbW92ZUNsYXNzKFwianMtZnVsbC13aWR0aC1zbGljay10cmFja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0UHJvcGVyQ29sdW1uUXVhbnRpdHkoKVxuICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemUgb3JpZW50YXRpb25jaGFuZ2VcIiwgc2V0UHJvcGVyQ29sdW1uUXVhbnRpdHkpXG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZGlyZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnbmF2TGFuZycsIFN3aXRjaExhbmd1YWdlKTtcblxuICAgIFN3aXRjaExhbmd1YWdlLiRpbmplY3QgPSBbJ3VybFBhcnNlclNlcnZpY2UnLCAnQ2F0YWxvZ1NlcnZpY2UnLCAnbG9jYWxlJywgJyR3aW5kb3cnXTtcblxuICAgIGZ1bmN0aW9uIFN3aXRjaExhbmd1YWdlKHVybFBhcnNlclNlcnZpY2UsIGNhdGFsb2dTZXJ2aWNlLCBsb2NhbGUsICR3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUFDJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJsUGFyc2VyU2VydmljZS5pc09DUygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbignbGknKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gYW5ndWxhci5lbGVtZW50KGVsKS5jaGlsZHJlbignYScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluay5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYW5ndWFnZSA9IGxpbmsuY2hpbGRyZW4oJ3NwYW4nKS50ZXh0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0xvY2FsZSA9IGxvY2FsZS50b1N0cmluZygpLnJlcGxhY2UobG9jYWxlLmxhbmd1YWdlLCBsYW5ndWFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkoY2F0YWxvZ1NlcnZpY2UuZ2V0SWRGcm9tTG9jYXRpb24oKSwgbmV3TG9jYWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVyaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybFBhcnNlclNlcnZpY2Uuc2V0TGFuZ3VhZ2UodXJpLCBsYW5ndWFnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5kaXJlY3RpdmUnKVxuICAgICAgICAuZGlyZWN0aXZlKCdzeW5jaHJvbml6ZUhlaWdodCcsIFN5bmNocm9uaXplSGVpZ2h0KTtcblxuICAgIFN5bmNocm9uaXplSGVpZ2h0LiRpbmplY3QgPSBbJyR0aW1lb3V0JywgJyR3aW5kb3cnXTtcblxuICAgIGZ1bmN0aW9uIFN5bmNocm9uaXplSGVpZ2h0KCR0aW1lb3V0LCAkd2luZG93KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpcnN0Q29sdW1uUm93ID0gYW5ndWxhclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVsZW1lbnQoZG9jdW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmNhcmQuY2FyZC1jb2x1bW4gdGFibGUgdHInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVxKHNjb3BlLiRpbmRleCArIDEpXG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlckNlbGxIZWlnaHQ6IGZpcnN0Q29sdW1uUm93WzBdLm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQ2VsbEhlaWdodDogZWxlbWVudFswXS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgc3luY2hyb25pemVSb3dIZWlnaHQsIHRydWUpXG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc3luY2hyb25pemVSb3dIZWlnaHQobmV3VmFscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heEhlaWdodCA9IG5ld1ZhbHMuaGVhZGVyQ2VsbEhlaWdodCA+IG5ld1ZhbHMudGhpc0NlbGxIZWlnaHQgPyBuZXdWYWxzLmhlYWRlckNlbGxIZWlnaHQgOiBuZXdWYWxzLnRoaXNDZWxsSGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmhlaWdodChtYXhIZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdENvbHVtblJvdy5oZWlnaHQobWF4SGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgNTAwKVxuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuZmFjdG9yeScpXG4gICAgICAgIC5mYWN0b3J5KCd1cmxCdWlsZGVyJywgVXJsQnVpbGRlcik7XG5cbiAgICBVcmxCdWlsZGVyLiRpbmplY3QgPSBbJyRpbmplY3RvciddO1xuXG4gICAgZnVuY3Rpb24gVXJsQnVpbGRlcigkaW5qZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ3Nlb0ZyaWVuZGx5VXJsQnVpbGRlcicpO1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5tb2RlbCcpXG4gICAgICAgIC5mYWN0b3J5KCdDYXRhbG9nSGVscGVyJywgQ2F0YWxvZ0hlbHBlcik7XG5cbiAgICBmdW5jdGlvbiBDYXRhbG9nSGVscGVyKCkge1xuICAgICAgICB0aGlzLnRvVmlldyA9IGZ1bmN0aW9uIChjYXRhbG9nKSB7XG4gICAgICAgICAgICBjYXRhbG9nLmRlc2NyaXB0aW9uID0gY2F0YWxvZy5kZXNjcmlwdGlvbkxvbmc7XG4gICAgICAgICAgICBjYXRhbG9nLnRpdGxlID0gY2F0YWxvZy5kZXNjcmlwdGlvblNob3J0O1xuICAgICAgICAgICAgY2F0YWxvZy5pbWFnZSA9IGNhdGFsb2cua2V5VmlzdWFsIHx8IGNhdGFsb2cucHJvZHVjdGltYWdlO1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93SW1hZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhY2F0YWxvZy5rZXlWaXN1YWw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93VGlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2cuaXNSb290Q2F0YWxvZygpIHx8IGNhdGFsb2cuaXNTdWJDYXRhbG9nKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy50aWxlcyA9IF8ubWFwKGNhdGFsb2cuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBjaGlsZC5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY2hpbGQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGNoaWxkLmhlYWRsaW5lLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogY2hpbGQuZGVzY3JpcHRpb25TaG9ydCxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGNoaWxkLmNhdGVnb3J5SW1hZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNhdGFsb2cuc2hvd0xpc3QgPSBjYXRhbG9nLmlzTGVhZkNhdGFsb2c7XG4gICAgICAgICAgICBjYXRhbG9nLmxpc3QgPSBfLm1hcChjYXRhbG9nLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpZDogY2hpbGQuaWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNoaWxkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBjaGlsZC5wcm9kdWN0bmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGNoaWxkLnByb2R1Y3RjYXRlZ29yeWltYWdlLFxuICAgICAgICAgICAgICAgICAgICBuZXc6IGNoaWxkLm5ldyxcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0czogXy5oYXMoY2hpbGQsICdoaWdobGlnaHRDYXRPdmVydmlldy52YWx1ZS5lbGVtZW50cycpICYmIGNoaWxkLmhpZ2hsaWdodENhdE92ZXJ2aWV3LnZhbHVlLmVsZW1lbnRzXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNhdGFsb2cuc2hvd1RlYXNlciA9IGNhdGFsb2cuaXNQcm9kdWN0RmFtaWx5O1xuICAgICAgICAgICAgY2F0YWxvZy5uZXcgPSBjYXRhbG9nLm5ldWhlaXRPY3M7XG4gICAgICAgICAgICBjYXRhbG9nLm5ld0ltYWdlID0gJy9tZWRpYS9uZXcucG5nJztcbiAgICAgICAgICAgIGNhdGFsb2cubmFtZSA9IGNhdGFsb2cubmFtZSB8fCBjYXRhbG9nLmhlYWRsaW5lIHx8IGNhdGFsb2cucHJvZHVjdG5hbWU7XG4gICAgICAgICAgICBjYXRhbG9nLmVuZXJneUVmZmljaWVuY3kgPSB7XG4gICAgICAgICAgICAgICAgaW1hZ2U6IGNhdGFsb2cubWFpbkVycExhYmVsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93VGVjaG5pY2FsSW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uaGFzKGNhdGFsb2csICdoaWdobGlnaHRzLnZhbHVlLmVsZW1lbnRzJykgJiYgY2F0YWxvZy5oaWdobGlnaHRzLnZhbHVlLmVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXRhbG9nLnRlY2huaWNhbEluZm9ybWF0aW9uID0gXy5oYXMoY2F0YWxvZywgJ2hpZ2hsaWdodHMudmFsdWUuZWxlbWVudHMnKSAgJiYgY2F0YWxvZy5oaWdobGlnaHRzLnZhbHVlLmVsZW1lbnRzO1xuICAgICAgICAgICAgY2F0YWxvZy5zaG93TW9yZURldGFpbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uc2l6ZShjYXRhbG9nLnN1YmhlYWRsaW5lcykgPiAwO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhdGFsb2cuc3ViaGVhZGxpbmVzID0gKGZ1bmN0aW9uIChjYXRhbG9nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAxO1xuICAgICAgICAgICAgICAgIHZhciBzdWJoZWFkbGluZSA9IGNhdGFsb2cuZGV0YWlsc1N1YmhlYWRsaW5lMTtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBjYXRhbG9nLmRldGFpbHNEZXNjcmlwdGlvbjE7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gY2F0YWxvZy5kZXRhaWxzSW1hZ2UxO1xuICAgICAgICAgICAgICAgIHZhciBzdWJoZWFkbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB3aGlsZShzdWJoZWFkbGluZSAhPSBudWxsIHx8IGRlc2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ViaGVhZGxpbmVzLnB1c2goe3RpdGxlOiBzdWJoZWFkbGluZSAmJiBzdWJoZWFkbGluZS52YWx1ZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uICYmIGRlc2NyaXB0aW9uLnZhbHVlLCBpbWFnZTogaW1hZ2UgJiYgaW1hZ2UudmFsdWV9KTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGNhdGFsb2dbJ2RldGFpbHNEZXNjcmlwdGlvbicgKyBpXTtcbiAgICAgICAgICAgICAgICAgICAgc3ViaGVhZGxpbmUgPSBjYXRhbG9nWydkZXRhaWxzU3ViaGVhZGxpbmUnICsgaV07XG4gICAgICAgICAgICAgICAgICAgIGltYWdlID0gY2F0YWxvZ1snZGV0YWlsc0ltYWdlJyArIGldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3ViaGVhZGxpbmVzO1xuICAgICAgICAgICAgfSkoY2F0YWxvZyk7XG4gICAgICAgICAgICBjYXRhbG9nLm1vcmVEZXRhaWxzID0ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBjYXRhbG9nLmhlYWRsaW5lT3ZlcnZpZXcsXG4gICAgICAgICAgICAgICAgZWxlbWVudHM6IGNhdGFsb2cuc3ViaGVhZGxpbmVzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjYXRhbG9nLnNob3dUZWNobmljYWxUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2F0YWxvZy5wcm9kdWN0VGFibGVEZWZpbml0aW9uICYmIGNhdGFsb2cuY2hpbGRyZW47IC8vRklYTUUgVGFrZSBsb2dpYyBmcm9tIGNvbnRyb2xsZXIsIE1ha2UgdGhpcyBjdXN0b21pemFibGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXRhbG9nLnNob3dGb290bm90ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2cuZm9vdG5vdGVzVGVjaERhdGE7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2F0YWxvZy5mb290bm90ZXMgPSBjYXRhbG9nLmZvb3Rub3Rlc1RlY2hEYXRhO1xuICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2c7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy50b1RlbXBsYXRlVmlldyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRTZWN0aW9uKHNlY3Rpb25zLCBuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHNlY3Rpb25zLCB7bmFtZTogbmFtZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5tb2RlbCcpXG4gICAgICAgIC5jb25maWcoQ2F0YWxvZ0NvbmZpZyk7XG5cbiAgICBDYXRhbG9nQ29uZmlnLiRpbmplY3QgPSBbJ2VudicsICdDYXRhbG9nUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIENhdGFsb2dDb25maWcoZW52LCBjYXRhbG9nTW9kZWxQcm92aWRlcikge1xuICAgICAgICBjYXRhbG9nTW9kZWxQcm92aWRlclxuICAgICAgICAgICAgLnByb2R1Y3REYXRhU2VydmljZUVuZFBvaW50KGVudi5lbmRQb2ludC5wcm9kdWN0RGF0YVNlcnZpY2UpXG4gICAgICAgICAgICAuY29udGVudFNlcnZpY2VFbmRQb2ludChlbnYuZW5kUG9pbnQuY29udGVudFNlcnZpY2UpO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLm1vZGVsJylcbiAgICAgICAgLnByb3ZpZGVyKCdDYXRhbG9nJywgZnVuY3Rpb24gQ2F0YWxvZ1Byb3ZpZGVyKCkge1xuICAgICAgICAgICAgdmFyIHBkc1VybCA9IG51bGw7XG4gICAgICAgICAgICB2YXIgY3NVcmwgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnByb2R1Y3REYXRhU2VydmljZUVuZFBvaW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcGRzVXJsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRTZXJ2aWNlRW5kUG9pbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjc1VybCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gWyckcmVzb3VyY2UnLCAnJGNhY2hlRmFjdG9yeScsICdsb2NhbGUnLCAnJGh0dHAnLCAnXycsICdDYXRhbG9nSGVscGVyJywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgJGNhY2hlRmFjdG9yeSwgbG9jYWxlLCAkaHR0cCwgXywgQ2F0YWxvZ0hlbHBlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ2F0YWxvZygkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnksIGxvY2FsZSwgcGRzVXJsLCBjc1VybCwgJGh0dHAsIF8sIENhdGFsb2dIZWxwZXIpO1xuICAgICAgICAgICAgfV07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gQ2F0YWxvZygkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnksIGxvY2FsZSwgcGRzVXJsLCBjc1VybCwgJGh0dHAsIF8sIGNhdGFsb2dIZWxwZXIpIHtcbiAgICAgICAgdmFyIGNhdGFsb2dDYWNoZSA9ICRjYWNoZUZhY3RvcnkoXCJjYXRhbG9nXCIpO1xuICAgICAgICB2YXIgY3VzdG9tVHJhbnNmb3JtYXRpb25zID0gW3JlZGlyZWN0Q2hpbGRyZW5dO1xuICAgICAgICB2YXIgdHJhbnNmb3JtYXRpb25zID0gJGh0dHAuZGVmYXVsdHMudHJhbnNmb3JtUmVzcG9uc2UuY29uY2F0KGN1c3RvbVRyYW5zZm9ybWF0aW9ucyk7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1SZXNwb25zZSA9IGZ1bmN0aW9uIChkYXRhLCBoZWFkZXJzLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBkYXRhO1xuICAgICAgICAgICAgXy5lYWNoKHRyYW5zZm9ybWF0aW9ucywgZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0KHJlc3VsdCwgaGVhZGVycywgc3RhdHVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIENhdGFsb2dSZXNvdXJjZSA9ICRyZXNvdXJjZShwZHNVcmwgKyAnaGllcmFyY2h5LzpjaGFubmVsLzpsb2NhbGUvOnR5cGUvOmlkJywgbnVsbCwge1xuICAgICAgICAgICAgICAgIGdldDoge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtsb2NhbGU6IGxvY2FsZX0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBjYXRhbG9nQ2FjaGUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBmdW5jdGlvbiAoZGF0YSwgaGVhZGVycywgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9DYXRhbG9nVmlldyh0cmFuc2Zvcm1SZXNwb25zZShkYXRhLCBoZWFkZXJzLCBzdGF0dXMpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBpc0FycmF5OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtsb2NhbGU6IGxvY2FsZX0sXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBjYXRhbG9nQ2FjaGVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IGNzVXJsICsgJ3Jlc3QvZG9jdW1lbnQvZGlzcGxheScsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlc3BvbnNlOiBmdW5jdGlvbiAoZGF0YSwgaGVhZGVycywgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9DYXRhbG9nVGVtcGxhdGVWaWV3KHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEsIGhlYWRlcnMsIHN0YXR1cykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlZGlyZWN0Q2hpbGRyZW4oZGF0YSwgaGVhZGVycywgc3RhdHVzKSB7XG4gICAgICAgICAgICBkYXRhLmNoaWxkcmVuID0gXy5tYXAoZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnJlZGlyZWN0Q2F0ZWdvcnkgPyBjaGlsZC5yZWRpcmVjdENhdGVnb3J5IDogY2hpbGQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9DYXRhbG9nVmlldyhjYXRhbG9nKSB7XG4gICAgICAgICAgICByZXR1cm4gY2F0YWxvZ0hlbHBlci50b1ZpZXcoY2F0YWxvZyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b0NhdGFsb2dUZW1wbGF0ZVZpZXcoY2F0YWxvZykge1xuICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2dIZWxwZXIudG9UZW1wbGF0ZVZpZXcoY2F0YWxvZyk7XG4gICAgICAgIH1cblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UucHJvdG90eXBlLmlzTGVhZkNhdGFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUeXBlKCkgPT0gJ2xlYWZfY2F0ZWdvcnknO1xuICAgICAgICB9O1xuXG4gICAgICAgIENhdGFsb2dSZXNvdXJjZS5wcm90b3R5cGUuaXNQcm9kdWN0RmFtaWx5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VHlwZSgpID09ICdwcm9kdWN0X2ZhbWlseSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgQ2F0YWxvZ1Jlc291cmNlLnByb3RvdHlwZS5pc1N1YkNhdGFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUeXBlKCkgPT0gJ3N1Yl9jYXRlZ29yeSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgQ2F0YWxvZ1Jlc291cmNlLnByb3RvdHlwZS5pc1Jvb3RDYXRhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VHlwZSgpID09ICdyb290X2NhdGVnb3J5JztcbiAgICAgICAgfTtcblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnR5cGUgPyB0aGlzLnR5cGUudmFsdWUudG9Mb3dlckNhc2UoKSA6IFN0cmluZygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIENhdGFsb2dSZXNvdXJjZS5wcm90b3R5cGUudGVjaG5pY2FsRGF0YVRhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSBfLmZpbmQodGhpcy5zZWN0aW9ucywge25hbWU6ICdURUNITklDQUxfREFUQV9UQUJMRSd9KVxuICAgICAgICAgICAgICAgICAgICAgICB8fCBfLmZpbmQodGhpcy5zZWN0aW9ucywge25hbWU6ICdURUNITklDQUxfREFUQV9UQUJMRV9TTElERVInfSk7XG4gICAgICAgICAgICByZXR1cm4gc2VjdGlvbiAmJiBzZWN0aW9uLnBhcmFtcztcbiAgICAgICAgfTtcblxuICAgICAgICBDYXRhbG9nUmVzb3VyY2UuZmFsbGJhY2tUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdQUk9EVUNUX0ZBTUlMWSc7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIENhdGFsb2dSZXNvdXJjZTtcbiAgICB9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnJvdXRlJylcbiAgICAgICAgLmNvbmZpZyhSb3V0ZUNvbmZpZyk7XG5cbiAgICBSb3V0ZUNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlciddO1xuXG4gICAgZnVuY3Rpb24gUm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXIucGRzUm91dGUoe1xuICAgICAgICAgICAgbmFtZTogJ2NhdGFsb2cnLFxuICAgICAgICAgICAgdXJsOiAne2NhdFVybDouKi1bY3BdWy9dP30nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjYXRhbG9nMy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXRhbG9nQ29udHJvbGxlciBhcyB2bScsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3Q6IFsnTWV0YVNlcnZpY2UnLCBmdW5jdGlvbiAobWV0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFTZXJ2aWNlLnJlZGlyZWN0T25JbnZhbGlkVXJsKCk7XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5jYXRhbG9nLnNlcnZpY2VcIilcbiAgICAgICAgLnNlcnZpY2UoXCJCcmVhZGNydW1iU2VydmljZVwiLCBCcmVhZGNydW1iU2VydmljZSk7XG5cbiAgICBCcmVhZGNydW1iU2VydmljZS4kaW5qZWN0ID0gWydDYXRhbG9nU2VydmljZScsICdfJywgJyRxJ107XG5cbiAgICBmdW5jdGlvbiBCcmVhZGNydW1iU2VydmljZShDYXRhbG9nU2VydmljZSwgXywgJHEpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlUHJvbWlzZVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBidWlsZDogYnVpbGRcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBidWlsZChjYXRlZ29yeUlkKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVByb21pc2UgPSB0ZW1wbGF0ZVByb21pc2UgfHwgQ2F0YWxvZ1NlcnZpY2UuZ2V0VGVtcGxhdGUoY2F0ZWdvcnlJZCwgJ0JSRUFEQ1JVTUJTJylcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlUHJvbWlzZVxuICAgICAgICAgICAgICAgIC50aGVuKGRlY29yYXRlV2l0aFVybHMpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHRyZWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9cbiAgICAgICAgICAgICAgICAgICAgICAgIC5jaGFpbih0cmVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogbm9kZS51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IG5vZGUudHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudmFsdWUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlV2l0aFVybHMocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciB0cmVlID0gcmVzcG9uc2Uubm9kZXNcbiAgICAgICAgICAgIHJldHVybiAkcVxuICAgICAgICAgICAgICAgIC5hbGwoXy5tYXAodHJlZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkobm9kZS5pZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnVybCA9IHVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZShcInBkcy5jYXRhbG9nLnNlcnZpY2VcIilcbiAgICAgICAgLnNlcnZpY2UoXCJDYXRhbG9nU2VydmljZVwiLCBDYXRhbG9nU2VydmljZSk7XG5cbiAgICBDYXRhbG9nU2VydmljZS4kaW5qZWN0ID0gWyckd2luZG93JywgJ0NhdGFsb2cnLCAnTWVudVNlcnZpY2UnLCAnU2VvRnJpZW5kbHlVcmxCdWlsZGVyJywgJ2NhdGFsb2dTZWFyY2hMaXN0ZW5lcicsICdfJywgJyRxJywgJ2xvY2FsZSddO1xuXG4gICAgZnVuY3Rpb24gQ2F0YWxvZ1NlcnZpY2UoJHdpbmRvdywgQ2F0YWxvZywgbWVudVNlcnZpY2UsIFNlb0ZyaWVuZGx5VXJsQnVpbGRlciwgY2F0YWxvZ1NlYXJjaExpc3RlbmVyLCBfLCAkcSwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHByb2R1Y3RQcmVmaXggPSAncCc7XG4gICAgICAgIHZhciBjYXRlZ29yeVByZWZpeCA9ICdjJztcbiAgICAgICAgdmFyIGNhdGFsb2dUZW1wbGF0ZTtcblxuICAgICAgICBjYXRhbG9nU2VhcmNoTGlzdGVuZXJcbiAgICAgICAgICAgIC5saXN0ZW4oKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlVXJpRnJvbUhpZXJhcmNoeShwYXJhbXMudGFyZ2V0LnJlc291cmNlSWQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0QnlUYWc6IGdldEJ5VGFnLFxuICAgICAgICAgICAgZ2V0TmV3UHJvZHVjdHM6IGdldE5ld1Byb2R1Y3RzLFxuICAgICAgICAgICAgZ2V0Q2F0YWxvZ1RlbXBsYXRlOiBnZXRDYXRhbG9nVGVtcGxhdGUsXG4gICAgICAgICAgICBnZXRCeUlkOiBnZXRCeUlkLFxuICAgICAgICAgICAgZ2V0VGVtcGxhdGU6IGdldFRlbXBsYXRlLFxuICAgICAgICAgICAgZ2V0QnlJZEFuZFR5cGU6IGdldEJ5SWRBbmRUeXBlLFxuICAgICAgICAgICAgcmVkaXJlY3RUbzogbmF2aWdhdGVUbyxcbiAgICAgICAgICAgIG5hdmlnYXRlVG86IG5hdmlnYXRlVG8sXG4gICAgICAgICAgICB0cmF2ZWxVcEhpZXJhcmNoeTogdHJhdmVsVXBIaWVyYXJjaHksXG4gICAgICAgICAgICB0cmF2ZWxVcE5hdmlnYXRpb25IaWVyYXJjaHk6IHRyYXZlbFVwTmF2aWdhdGlvbkhpZXJhcmNoeSxcbiAgICAgICAgICAgIGdldElkRnJvbUxvY2F0aW9uOiBnZXRJZEZyb21Mb2NhdGlvbixcbiAgICAgICAgICAgIHJlc29sdmVVcmk6IHJlc29sdmVVcmksXG4gICAgICAgICAgICByZXNvbHZlVXJpRnJvbUhpZXJhcmNoeTogcmVzb2x2ZVVyaUZyb21IaWVyYXJjaHksXG4gICAgICAgICAgICBnZXRQcm9kdWN0RmFtaWx5OiBnZXRQcm9kdWN0RmFtaWx5XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QnlUYWcodHlwZSwgdGFnKSB7XG4gICAgICAgICAgICByZXR1cm4gQ2F0YWxvZy5xdWVyeSh7dHlwZTogdHlwZSwgaWQ6IHRhZywgcXVlcnlUeXBlOiAndGFnJ30pLiRwcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmV3UHJvZHVjdHMoKSB7XG4gICAgICAgICAgICB2YXIgY2F0YWxvZyA9IG5ldyBDYXRhbG9nKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZToge25hbWU6ICdORVdfUFJPRFVDVFMnfSxcbiAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGU6IGxvY2FsZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nLiR0ZW1wbGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QnlJZChjYXRlZ29yeUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0VHlwZUZyb21IaWVyYXJjaHkoY2F0ZWdvcnlJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ2F0YWxvZy5nZXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGNhdGVnb3J5SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbDogZ2V0T0NTQ2hhbm5lbCgpXG4gICAgICAgICAgICAgICAgICAgIH0pLiRwcm9taXNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q2F0YWxvZ1RlbXBsYXRlKGNhdGFsb2dJZCkge1xuICAgICAgICAgICAgY2F0YWxvZ1RlbXBsYXRlID0gY2F0YWxvZ1RlbXBsYXRlIHx8IGdldFRlbXBsYXRlKGNhdGFsb2dJZClcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nVGVtcGxhdGVcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlKGNhdGFsb2dJZCwgdHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFR5cGVGcm9tSGllcmFyY2h5KGNhdGFsb2dJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHlwZUZyb21IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhdGFsb2cgPSBuZXcgQ2F0YWxvZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZToge25hbWU6IHR5cGUgfHwgdHlwZUZyb21IaWVyYXJjaHl9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGU6IGxvY2FsZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWw6IGdldE9DU0NoYW5uZWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRhbG9nUmVxdWVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogY2F0YWxvZ0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsOiBnZXRPQ1NDaGFubmVsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVGcm9tSGllcmFyY2h5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2cuJHRlbXBsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRPQ1NDaGFubmVsKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudCgnbWV0YVtuYW1lPVwib2NzLWNoYW5uZWxcIl0nKS5hdHRyKCdjb250ZW50JylcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ5SWRBbmRUeXBlKGlkLCB0eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gQ2F0YWxvZy5nZXQoe2lkOiBpZCwgdHlwZTogdHlwZX0pLiRwcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VHlwZUZyb21IaWVyYXJjaHkoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBtZW51U2VydmljZVxuICAgICAgICAgICAgICAgIC5maW5kSW5OYXZpZ2F0aW9uKGlkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChjYXRhbG9nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXRhbG9nID8gY2F0YWxvZy50eXBlIDogQ2F0YWxvZy5mYWxsYmFja1R5cGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlbFVwSGllcmFyY2h5KGNhdGVnb3J5SWQsIHRyZWUpIHtcbiAgICAgICAgICAgIHRyZWUgPSB0cmVlIHx8IFtdO1xuICAgICAgICAgICAgcmV0dXJuIGdldEJ5SWQoY2F0ZWdvcnlJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0cmVlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEucGFyZW50SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmF2ZWxVcEhpZXJhcmNoeShkYXRhLnBhcmVudElkLCB0cmVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlbFVwTmF2aWdhdGlvbkhpZXJhcmNoeShjYXRlZ29yeUlkLCBsb2NhbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBtZW51U2VydmljZVxuICAgICAgICAgICAgICAgIC5maW5kSW5OYXZpZ2F0aW9uKGNhdGVnb3J5SWQsIGxvY2FsZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJlZSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZShpdGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyZWUucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBtZW51U2VydmljZS5maW5kUGFyZW50SW5OYXZpZ2F0aW9uKGl0ZW0uaWQsIGxvY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbCh0cmVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG5hdmlnYXRlVG8oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlVXJpKGlkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVyaShjYXRlZ29yeUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhdmVsVXBIaWVyYXJjaHkoY2F0ZWdvcnlJZClcbiAgICAgICAgICAgICAgICAudGhlbihidWlsZFVyaSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBidWlsZFVyaSh0cmVlKSB7XG4gICAgICAgICAgICB2YXIgYnVpbGRlciA9IG5ldyBTZW9GcmllbmRseVVybEJ1aWxkZXIoKTtcbiAgICAgICAgICAgIF8uZm9yRWFjaFJpZ2h0KHRyZWUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyYWdtZW50cyA9IFtub2RlLm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0cmVlLmluZGV4T2Yobm9kZSkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudHMucHVzaChub2RlLmlkLCBjYXRlZ29yeVByZWZpeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJ1aWxkZXIuYWRkUGF0aChmcmFnbWVudHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PSBDYXRhbG9nLmZhbGxiYWNrVHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuc2V0UGF0aChbbm9kZS5uYW1lLCBub2RlLmlkLCBwcm9kdWN0UHJlZml4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkoY2F0ZWdvcnlJZCwgbG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhdmVsVXBOYXZpZ2F0aW9uSGllcmFyY2h5KGNhdGVnb3J5SWQsIGxvY2FsZSkudGhlbihidWlsZFVyaSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRJZEZyb21Mb2NhdGlvbih1cmkpIHtcbiAgICAgICAgICAgIHVyaSA9IHVyaSB8fCBuZXcgVVJJKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHVyaS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDJdO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UHJvZHVjdEZhbWlseShwcm9kdWN0KSB7XG4gICAgICAgICAgICBpZiAoIXByb2R1Y3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IHByb2R1Y3QucGFyZW50SWQudmFsdWUuZWxlbWVudHMgfHwgW3Byb2R1Y3QucGFyZW50SWQudmFsdWVdO1xuICAgICAgICAgICAgcmV0dXJuICRxXG4gICAgICAgICAgICAgICAgLmFsbChfLm1hcChlbGVtZW50cywgZnVuY3Rpb24gKHBhcmVudElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZW51U2VydmljZS5maW5kSW5OYXZpZ2F0aW9uKHBhcmVudElkKSB8fCB7fTtcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uZmluZChub2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09IENhdGFsb2cuZmFsbGJhY2tUeXBlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuc2VydmljZScpXG4gICAgICAgIC5zZXJ2aWNlKCdNZXRhU2VydmljZScsIE1ldGFTZXJ2aWNlKTtcblxuICAgIE1ldGFTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHEnLCAnJGxvY2F0aW9uJywgJyR3aW5kb3cnLCAnQ2F0YWxvZ1NlcnZpY2UnLCAnaW1hZ2VVcmxGaWx0ZXInLCAnY29uZmlnJywgJ3VybFBhcnNlclNlcnZpY2UnXTtcblxuICAgIHZhciBUSVRMRV9ERUxJTUlURVIgPSAnIHwgJztcbiAgICB2YXIgTE9DQUxFX0RFTElNSVRFUiA9ICctJztcbiAgICB2YXIgTE9DQUxFX1BST1BFUl9ERUxJTUlURVIgPSAnXyc7XG4gICAgdmFyIFBBVEhfU0VQQVJBVE9SID0gJy8nO1xuXG4gICAgZnVuY3Rpb24gTWV0YVNlcnZpY2UoJHJvb3RTY29wZSwgJHEsICRsb2NhdGlvbiwgJHdpbmRvdywgQ2F0YWxvZ1NlcnZpY2UsIGltYWdlVXJsRmlsdGVyLCBjb25maWcsIHVybFBhcnNlclNlcnZpY2UpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXBkYXRlTWV0YUJ5Q2F0ZWdvcnk6IHVwZGF0ZU1ldGFCeUNhdGVnb3J5LFxuICAgICAgICAgICAgcmVkaXJlY3RPbkludmFsaWRVcmw6IHJlZGlyZWN0T25JbnZhbGlkVXJsXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTWV0YUJ5Q2F0ZWdvcnkoY2F0YWxvZ0lkKSB7XG4gICAgICAgICAgICB2YXIgZXhjbHVkZUhyZWZsYW5ncyA9IGZhbHNlO1xuICAgICAgICAgICAgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAuZ2V0Q2F0YWxvZ1RlbXBsYXRlKGNhdGFsb2dJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoY3VycmVudENhdGFsb2cpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENhdGFsb2dTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJhdmVsVXBOYXZpZ2F0aW9uSGllcmFyY2h5KGNhdGFsb2dJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0cmVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJlZVswXSA9IGN1cnJlbnRDYXRhbG9nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodHJlZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcSA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHRyZWVbMF07XG4gICAgICAgICAgICAgICAgICAgIHRyZWVbMF0ubmFtZSA9IHRyZWVbMF0ubmFtZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlclRpdGxlID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHJlZVtpXSAmJiB0cmVlW2ldLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJUaXRsZS5wdXNoKHRyZWVbaV0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyVGl0bGUucHVzaChjb25maWcubWV0YVRhZ3Muc2l0ZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IChjdXJyZW50Tm9kZS5rZXlWaXN1YWwgfHwgY3VycmVudE5vZGUucHJvZHVjdGltYWdlIHx8IHt9KS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGhlYWRlclRpdGxlLmpvaW4oVElUTEVfREVMSU1JVEVSKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAoY3VycmVudE5vZGUuc2VvTWV0YVRleHQgfHwgY3VycmVudE5vZGUuZGVzY3JpcHRpb25Mb25nIHx8IGN1cnJlbnROb2RlLmRlc2NyaXB0aW9uU2hvcnQgfHwge30pLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGltYWdlID8gaW1hZ2VVcmxGaWx0ZXIoaW1hZ2UpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l0ZU5hbWU6IGNvbmZpZy5tZXRhVGFncy5zaXRlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYlRyZW5kczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNnX3M6IHRyZWVbMF0gPyB0cmVlWzBdLm5hbWUgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpfY2czOiB0cmVlWzFdID8gdHJlZVsxXS5uYW1lIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6X2NnNDogdHJlZVsyXSA/IHRyZWVbMl0ubmFtZSA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5vbmljYWxVcmw6ICRsb2NhdGlvbi5hYnNVcmwoKVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghKGN1cnJlbnROb2RlLmJsb2NrQ2Fub25pY2FsVGFnIHx8IHt9KS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhbm9uaWNhbFJlZiA9IChjdXJyZW50Tm9kZS5jYW5vbmljYWxSZWYgfHwge30pLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2Fub25pY2FsUmVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUhyZWZsYW5ncyA9IGNhbm9uaWNhbFJlZiAhPSBjYXRhbG9nSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlc29sdmVVcmlGcm9tSGllcmFyY2h5KGNhbm9uaWNhbFJlZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuY2Fub25pY2FsVXJsID0gdXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcS5yZXNvbHZlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEucmVzb2x2ZShldmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Bkcy5oZWFkZXIudXBkYXRlJywgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4Y2x1ZGVIcmVmbGFuZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnbGlua1tocmVmbGFuZ10nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZWxlbWVudCgnbGlua1tocmVmbGFuZ10nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKGluZGV4LCBsaW5rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmtPYmplY3QgPSBhbmd1bGFyLmVsZW1lbnQobGluayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsZSA9IGxpbmtPYmplY3QuYXR0cignaHJlZmxhbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2NhbGUuc3BsaXQoTE9DQUxFX0RFTElNSVRFUik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlc29sdmVVcmlGcm9tSGllcmFyY2h5KGNhdGFsb2dJZCwgbG9jYWxlWzBdICsgTE9DQUxFX1BST1BFUl9ERUxJTUlURVIgKyBsb2NhbGVbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtPYmplY3QuYXR0cignaHJlZicsIHVybC5yZXBsYWNlKC9cXC9bYS16XXsyfVxcL1thLXpdezJ9XFwvLywgUEFUSF9TRVBBUkFUT1IgKyBsb2NhbGVbMV0udG9Mb3dlckNhc2UoKSArIFBBVEhfU0VQQVJBVE9SICsgbG9jYWxlWzBdLnRvTG93ZXJDYXNlKCkgICsgUEFUSF9TRVBBUkFUT1IpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBsaW5rT2JqZWN0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVkaXJlY3RPbkludmFsaWRVcmwoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ2F0YWxvZ1NlcnZpY2VcbiAgICAgICAgICAgICAgICAucmVzb2x2ZVVyaUZyb21IaWVyYXJjaHkodXJsUGFyc2VyU2VydmljZS5nZXRDYXRhbG9nSWQoKSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmNvZGVVUkkodXJsKSAhPSBVUkkoKS50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5jYXRhbG9nLnNlcnZpY2UnKVxuICAgICAgICAuc2VydmljZSgnY2F0YWxvZ1NlYXJjaExpc3RlbmVyJywgQ2F0YWxvZ1NlYXJjaExpc3RlbmVyKTtcblxuICAgIENhdGFsb2dTZWFyY2hMaXN0ZW5lci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRxJywgJ2VudiddO1xuXG4gICAgZnVuY3Rpb24gQ2F0YWxvZ1NlYXJjaExpc3RlbmVyKCRyb290LCAkcSwgZW52KSB7XG4gICAgICAgIHRoaXMubGlzdGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAkcm9vdC4kb24oJ3Bkcy5zZWFyY2gubmF2aWdhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMudGFyZ2V0LmNoYW5uZWxEaXNjcmltaW5hdG9yID09IGVudi5zZWFyY2gucGRzQ2hhbm5lbERpc2NyaW1pbmF0b3IgfHwgcGFyYW1zLnRhcmdldC5yZXNvdXJjZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhciwgVVJJKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuY2F0YWxvZy5zZXJ2aWNlJylcbiAgICAgICAgLmZhY3RvcnkoJ1Nlb0ZyaWVuZGx5VXJsQnVpbGRlcicsIFNlb0ZyaWVuZGx5VXJsQnVpbGRlckZhY3RvcnkpO1xuXG4gICAgU2VvRnJpZW5kbHlVcmxCdWlsZGVyRmFjdG9yeS4kaW5qZWN0ID0gWyckd2luZG93JywgJ18nLCAnc2ltcGxpZnlDaGFyYWN0ZXJzRmlsdGVyJywgJ2NvbmZpZyddO1xuXG4gICAgdmFyIGZyYWdtZW50U2VwYXJhdG9yID0gJy0nO1xuICAgIHZhciBwYXRoU2VwYXJhdG9yID0gJy8nO1xuXG4gICAgZnVuY3Rpb24gU2VvRnJpZW5kbHlVcmxCdWlsZGVyRmFjdG9yeSgkd2luZG93LCBfLCBzaW1wbGlmeUNoYXJhY3RlcnNGaWx0ZXIsIGNvbmZpZykge1xuICAgICAgICBmdW5jdGlvbiBTZW9GcmllbmRseVVybEJ1aWxkZXIob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gYnVpbGRCYXNlUGF0aCgpO1xuICAgICAgICAgICAgdGhpcy5zaW1wbGlmeUNoYXJhY3RlcnNGaWx0ZXIgPSBzaW1wbGlmeUNoYXJhY3RlcnNGaWx0ZXI7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgU2VvRnJpZW5kbHlVcmxCdWlsZGVyLnByb3RvdHlwZS5hZGRQYXRoID0gZnVuY3Rpb24oZnJhZ21lbnRzKSB7XG4gICAgICAgICAgICBpZiAoIWZyYWdtZW50cykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBfLmNvbXBhY3QoW10uY29uY2F0KGZyYWdtZW50cykpO1xuICAgICAgICAgICAgdGhpcy5wYXRoICs9IHBhdGhTZXBhcmF0b3IgKyB0aGlzLnNpbXBsaWZ5Q2hhcmFjdGVyc0ZpbHRlcihhcmdzLmpvaW4oZnJhZ21lbnRTZXBhcmF0b3IpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIFNlb0ZyaWVuZGx5VXJsQnVpbGRlci5wcm90b3R5cGUuc2V0UGF0aCA9IGZ1bmN0aW9uIChmcmFnbWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IGJ1aWxkQmFzZVBhdGgoKTtcbiAgICAgICAgICAgIHRoaXMuYWRkUGF0aChmcmFnbWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgU2VvRnJpZW5kbHlVcmxCdWlsZGVyLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhdGggKyAoY29uZmlnLnVybFNjaGVtYS50cmFpbGluZ1NsYXNoID8gJy8nIDogJycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBTZW9GcmllbmRseVVybEJ1aWxkZXI7XG5cbiAgICAgICAgZnVuY3Rpb24gYnVpbGRCYXNlUGF0aCgpIHtcbiAgICAgICAgICAgIHJldHVybiBVUkkoKS5vcmlnaW4oKSArICR3aW5kb3cuZ2V0QmFzZVBhdGgoKSArIGNvbmZpZy5wZHNQYXRoUHJlZml4O1xuICAgICAgICB9XG4gICAgfVxuXG5cbn0pKGFuZ3VsYXIsIFVSSSk7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLmNhdGFsb2cuc2VydmljZScpXG4gICAgICAgIC5zZXJ2aWNlKCd1cmxQYXJzZXJTZXJ2aWNlJywgVXJsUGFyc2VyKTtcblxuICAgIFVybFBhcnNlci4kaW5qZWN0ID0gWydjb25maWcnXTtcblxuICAgIHZhciBjb3VudHJ5TWF0Y2hJbmRleCA9IDE7XG4gICAgdmFyIGxhbmd1YWdlTWF0Y2hJbmRleCA9IDI7XG4gICAgdmFyIHJvb3RTZWdtZW50TWF0Y2hJbmRleCA9IDM7XG4gICAgdmFyIGNhdGFsb2dJZE1hdGNoSW5kZXggPSA0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgLyoqICB7MX17Mn0gICB7M30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7NH0gICAgKiovXG4gICAgICAgICAgICAgICAgICAgICAgLyoqIC9jaC9kZS9yZXNpZGVudGlhbC5odG1sL3F3ZS9hc2QvcXdlL2FzZC9wb2l1dXktMTM0MjMzLWMgKiovXG4gICAgdmFyIHBhdGhQYXR0ZXJuID0gL15cXC8oW2Etel17Mn0pXFwvKFthLXpdezJ9KVxcLyg/Om9jc1xcLyk/KFteXFwvXSopKD86XFwuaHRtbCk/XFwvKD86LiotKFswLTldKiktW3BjXVxcLz8kKT8vaTtcbiAgICB2YXIgbGFuZ3VhZ2VQYXR0ZXJuID0gLyhcXC9bYS16XXsyfVxcLykoW2Etel17Mn0pKC4qKS9pO1xuXG4gICAgZnVuY3Rpb24gVXJsUGFyc2VyKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBVcmxQYXJzZXIucHJvdG90eXBlLmlzT0NTID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZ2V0Q2F0YWxvZ0lkKCk7XG4gICAgfTtcblxuICAgIFVybFBhcnNlci5wcm90b3R5cGUuZ2V0Um9vdFNlZ21lbnQgPSBmdW5jdGlvbiBnZXRSb290U2VnbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoRm9ySW5kZXgocm9vdFNlZ21lbnRNYXRjaEluZGV4KSB8fCB0aGlzLmNvbmZpZy5tZXRhVGFncy5zaXRlTmFtZTtcbiAgICB9O1xuXG4gICAgVXJsUGFyc2VyLnByb3RvdHlwZS5nZXRDYXRhbG9nSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtYXRjaEZvckluZGV4KGNhdGFsb2dJZE1hdGNoSW5kZXgpO1xuICAgIH07XG5cbiAgICBVcmxQYXJzZXIucHJvdG90eXBlLmdldExhbmd1YWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hGb3JJbmRleChsYW5ndWFnZU1hdGNoSW5kZXgpO1xuICAgIH07XG5cbiAgICBVcmxQYXJzZXIucHJvdG90eXBlLnNldExhbmd1YWdlID0gZnVuY3Rpb24gKHVybCwgbGFuZ3VhZ2UpIHtcbiAgICAgICAgdmFyIHVyaSA9IG5ldyBVUkkodXJsKTtcbiAgICAgICAgdXJpLnBhdGgodXJpLnBhdGgoKS5yZXBsYWNlKGxhbmd1YWdlUGF0dGVybiwgJyQxJyArIGxhbmd1YWdlICsgJyQzJykpO1xuICAgICAgICByZXR1cm4gdXJpLnRvU3RyaW5nKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG1hdGNoRm9ySW5kZXgoaW5kZXgpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gbmV3IFVSSSgpLnBhdGgoKS5tYXRjaChwYXRoUGF0dGVybik7XG4gICAgICAgIHJldHVybiBtYXRjaCAmJiBtYXRjaFtpbmRleF07XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbihhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMubmF2aWdhdGlvbi5tb2RlbCcpXG4gICAgICAgIC5jb25maWcoTmF2aWdhdGlvbkNvbmZpZyk7XG5cbiAgICBOYXZpZ2F0aW9uQ29uZmlnLiRpbmplY3QgPSBbJ2VudicsICdOYXZpZ2F0aW9uUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIE5hdmlnYXRpb25Db25maWcoZW52LCBOYXZpZ2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgTmF2aWdhdGlvblByb3ZpZGVyLm5hdmlnYXRpb25FbmRwb2ludChlbnYuZW5kUG9pbnQuY29udGVudFNlcnZpY2UpO1xuICAgIH1cblxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5uYXZpZ2F0aW9uLm1vZGVsJylcbiAgICAgICAgLnByb3ZpZGVyKCdOYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVybCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbkVuZHBvaW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLiRnZXQgPSBbJyRyZXNvdXJjZScsICckY2FjaGVGYWN0b3J5JywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgJGNhY2hlRmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTmF2aWdhdGlvbigkcmVzb3VyY2UsICRjYWNoZUZhY3RvcnksIHVybCk7XG4gICAgICAgICAgICB9XVxuICAgICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIE5hdmlnYXRpb24oJHJlc291cmNlLCAkY2FjaGVGYWN0b3J5LCB1cmwpIHtcbiAgICAgICAgdmFyIGNhdGFsb2dDYWNoZSA9ICRjYWNoZUZhY3RvcnkoXCJuYXZpZ2F0aW9uXCIpO1xuICAgICAgICB2YXIgbWV0aG9kcyA9IHtcbiAgICAgICAgICAgIGdldDoge21ldGhvZDogJ0dFVCcsIGNhY2hlOiBjYXRhbG9nQ2FjaGV9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UodXJsICsgJ3Jlc3QvZG9jdW1lbnQvZGlzcGxheScsIG51bGwsIG1ldGhvZHMpO1xuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoXCJwZHMubmF2aWdhdGlvbi5zZXJ2aWNlXCIpXG5cdFx0LnNlcnZpY2UoXCJNZW51U2VydmljZVwiLCBNZW51U2VydmljZSk7XG5cblx0TWVudVNlcnZpY2UuJGluamVjdCA9IFsndXJsUGFyc2VyU2VydmljZScsICdfJywgJ05hdmlnYXRpb24nLCAnbG9jYWxlJywgJyRxJ107XG5cblx0ZnVuY3Rpb24gTWVudVNlcnZpY2UodXJsUGFyc2VyU2VydmljZSwgXywgTmF2aWdhdGlvbiwgbG9jYWxlLCAkcSkge1xuICAgICAgICB2YXIgTkFWSUdBVElPTl9URU1QTEFURV9OQU1FID0gJ0NBVEFMT0dfSElFUkFSQ0hZJztcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmN1cnJlbnRMb2NhbGUgPSBsb2NhbGUudG9TdHJpbmcoKTtcbiAgICAgICAgc2VsZi5mbGF0TmF2aWdhdGlvbiA9IHt9O1xuICAgICAgICBzZWxmLmdldE1lbnUgPSBnZXRNZW51O1xuICAgICAgICBzZWxmLmZpbmRJbk5hdmlnYXRpb24gPSBmaW5kSW5OYXZpZ2F0aW9uO1xuICAgICAgICBzZWxmLmZpbmRQYXJlbnRJbk5hdmlnYXRpb24gPSBmaW5kUGFyZW50SW5OYXZpZ2F0aW9uO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0TWVudShsb2NhbGUpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJMb2NhbGUgPSBsb2NhbGUgfHwgc2VsZi5jdXJyZW50TG9jYWxlO1xuICAgICAgICAgICAgdmFyIG5hdiA9IG5ldyBOYXZpZ2F0aW9uKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBOQVZJR0FUSU9OX1RFTVBMQVRFX05BTUUsXG4gICAgICAgICAgICAgICAgICAgIGNoYW5uZWw6IGdldE9DU0NoYW5uZWwoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxlOiBwcm9wZXJMb2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIGNoYW5uZWw6IGdldE9DU0NoYW5uZWwoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXHRcdFx0cmV0dXJuIE5hdmlnYXRpb25cbiAgICAgICAgICAgICAgICAuZ2V0KHtxdWVyeTogbmF2fSlcbiAgICAgICAgICAgICAgICAuJHByb21pc2Vcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBpZighcmVzLnJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXMucm9vdC5jaGlsZHJlblswXS5tYXhOYXZpZ2F0aW9uSXRlbXMgPSByZXMucm9vdC5tYXhOYXZpZ2F0aW9uSXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMucm9vdC5jaGlsZHJlblswXTtcblx0XHRcdFx0fSlcblx0XHR9XG5cblxuICAgICAgICBmdW5jdGlvbiBnZXRPQ1NDaGFubmVsKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudCgnbWV0YVtuYW1lPVwib2NzLWNoYW5uZWxcIl0nKS5hdHRyKCdjb250ZW50JylcbiAgICAgICAgfVxuXG5cdFx0ZnVuY3Rpb24gZ2V0RmxhdE1lbnUobG9jYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0TWVudShsb2NhbGUpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKG1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxlID0gbG9jYWxlIHx8IHNlbGYuY3VycmVudExvY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5mbGF0TmF2aWdhdGlvbltsb2NhbGVdID0gc2VsZi5mbGF0TmF2aWdhdGlvbltsb2NhbGVdIHx8IGZsYXRNZW51KG1lbnUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5mbGF0TmF2aWdhdGlvbltsb2NhbGVdO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmbGF0TWVudShtZW51LCBmbGF0KSB7XG4gICAgICAgICAgICBmbGF0ID0gZmxhdCB8fCBbXTtcbiAgICAgICAgICAgIGZsYXQucHVzaChtZW51KTtcbiAgICAgICAgICAgIF8uZWFjaChtZW51LmNoaWxkcmVuLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGZsYXRNZW51KGl0ZW0sIGZsYXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmxhdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRJbk5hdmlnYXRpb24oaWQsIGxvY2FsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEZsYXRNZW51KGxvY2FsZSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihmbGF0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfLmZpbmQoZmxhdCwge2lkOiBTdHJpbmcoaWQpfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kUGFyZW50SW5OYXZpZ2F0aW9uKGNoaWxkSWQsIGxvY2FsZSkge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmluZChzZWxmLmZsYXROYXZpZ2F0aW9uW2xvY2FsZSB8fCBzZWxmLmN1cnJlbnRMb2NhbGVdLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhXy5maW5kKHZhbC5jaGlsZHJlbiwge2lkOiBjaGlsZElkfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXHR9XG5cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdwZHMuc2VhcmNoLmRpcmVjdGl2ZScpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2FjdGl2ZVNlYXJjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgICAgIGxpbms6IGxpbmtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAgIC5vbignZm9jdXMnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc2VhcmNoLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3NlYXJjaC1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcjanMtc2hvdy1oZWFkZXItc2VhcmNoJylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJ2EnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLnNlYXJjaC5kaXJlY3RpdmUnKVxuICAgICAgICAuY29tcG9uZW50KCdvY3NRdWlja1NlYXJjaCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBbJ2NvbmZpZycsIGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWcucGRzVGVtcGxhdGVQYXRoICsgJy9jb21wb25lbnQvcXVpY2tfc2VhcmNoLmh0bWwnXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBvY3NRdWlja1NlYXJjaENvbnRyb2xsZXJcbiAgICAgICAgfSk7XG5cbiAgICBvY3NRdWlja1NlYXJjaENvbnRyb2xsZXIuJGluamVjdCA9IFsnXycsICckbG9jYXRpb24nLCAnJHN0YXRlJywgJyRyb290U2NvcGUnLCAnU2VhcmNoU2VydmljZScsICckd2luZG93J107XG5cbiAgICBmdW5jdGlvbiBvY3NRdWlja1NlYXJjaENvbnRyb2xsZXIoXywgJGxvY2F0aW9uLCAkc3RhdGUsICRyb290U2NvcGUsIFNlYXJjaFNlcnZpY2UsICR3aW5kb3cpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuc3VnZ2VzdCA9IF8udGhyb3R0bGUoc3VnZ2VzdCwgMjAwKTtcbiAgICAgICAgc2VsZi5nb1RvID0gZ29UbztcbiAgICAgICAgc2VsZi5kb1NlYXJjaCA9IGRvU2VhcmNoO1xuXG4gICAgICAgIC8vRklYTUUgYSBoYWNrIHRvIHByb2NlZWQgdG8gc3RhdGUgYHNlYXJjaGAgYWZ0ZXIgZW50ZXJpbmcgc2VhcmNoLmh0bWxcbiAgICAgICAgdmFyIHBhdGggPSAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICBpZiAocGF0aCAmJiBwYXRoLmluZGV4T2YoJ3NlYXJjaC5odG1sJykgPiAtMSAmJiAhJHN0YXRlLmlzKCdzZWFyY2gnKSkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdzZWFyY2gnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN1Z2dlc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gU2VhcmNoU2VydmljZVxuICAgICAgICAgICAgICAgIC5zdWdnZXN0KHNlbGYucXVpY2tzZWFyY2gpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5hdXRvc3VnZ2VzdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnb1RvKHRhcmdldCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwZHMuc2VhcmNoLm5hdmlnYXRlJywge3RhcmdldDogdGFyZ2V0fSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkb1NlYXJjaCgkaXRlbSkge1xuICAgICAgICAgICAgaWYgKCEkaXRlbSB8fCAkaXRlbS53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICAkd2luZG93Lm5hdmlnYXRlKCdzZWFyY2guaHRtbD90ZXJtcz0nICsgc2VsZi5xdWlja3NlYXJjaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLnNlYXJjaC5kaXJlY3RpdmUnKVxuICAgICAgICAuY29tcG9uZW50KCdvY3NTZWFyY2gnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogWydjb25maWcnLCBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnLnBkc1RlbXBsYXRlUGF0aCArICcvY29tcG9uZW50L3NlYXJjaC5odG1sJ1xuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiBvY3NTZWFyY2hDb250cm9sbGVyXG4gICAgICAgIH0pO1xuXG4gICAgb2NzU2VhcmNoQ29udHJvbGxlci4kaW5qZWN0ID0gWyckYW5jaG9yU2Nyb2xsJywgJ1NlYXJjaFNlcnZpY2UnLCAnY21zU2VhcmNoTGlzdGVuZXInLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJHdpbmRvdycsICdfJywgJ3RyYW5zbGF0ZUZpbHRlciddO1xuXG4gICAgZnVuY3Rpb24gb2NzU2VhcmNoQ29udHJvbGxlcigkYW5jaG9yU2Nyb2xsLCBTZWFyY2hTZXJ2aWNlLCBjbXNTZWFyY2hMaXN0ZW5lciwgJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkd2luZG93LCBfLCB0cmFuc2xhdGVGaWx0ZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuZmluYWxTZWFyY2hSZXN1bHRzID0gW107XG4gICAgICAgIHNlbGYuc2VhcmNoVGVybSA9ICRsb2NhdGlvbi5zZWFyY2goKS50ZXJtcztcbiAgICAgICAgc2VsZi5jb250YWN0VGV4dCA9IHRyYW5zbGF0ZUZpbHRlcignU0VBUkNILk5PLlJFU1VMVC5DSEVDS0xJU1QuMycsIHtjb250YWN0TGluazogXCI8YSBocmVmPSdcIiArIHRyYW5zbGF0ZUZpbHRlcignU0VBUkNILkNPTlRBQ1QuVVJMJykgKyBcIicgY2xhc3M9J2xpbmstaW5saW5lJyB0YXJnZXQ9J19zZWxmJz5cIiArIHRyYW5zbGF0ZUZpbHRlcignU0VBUkNILkNPTlRBQ1QnKSArIFwiPC9hPlwifSk7XG4gICAgICAgIHNlbGYub25TZWFyY2hJbnB1dCA9IG9uU2VhcmNoSW5wdXQ7XG4gICAgICAgIHNlbGYuZ29Ub0FuY2hvciA9IGdvVG9BbmNob3I7XG4gICAgICAgIHNlbGYuZ29Nb3JlID0gZ29Nb3JlO1xuXG4gICAgICAgIGNtc1NlYXJjaExpc3RlbmVyXG4gICAgICAgICAgICAubGlzdGVuKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhcmFtLnRhcmdldC5yZXNvdXJjZUxvY2F0aW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHNlYXJjaCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5zZWFyY2hUZXJtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi50b3RhbExlbmd0aCA9IGZhbHNlO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCgndGVybXMnLCBzZWxmLnNlYXJjaFRlcm0pO1xuXG4gICAgICAgICAgICByZXR1cm4gU2VhcmNoU2VydmljZVxuICAgICAgICAgICAgICAgIC5zZWFyY2goc2VsZi5zZWFyY2hUZXJtKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50b3RhbExlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpbmFsU2VhcmNoUmVzdWx0cyA9IF8uZ3JvdXBCeShkYXRhLCAnY2hhbm5lbERpc2NyaW1pbmF0b3InKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uU2VhcmNoSW5wdXQoa2V5RXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChrZXlFdmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBzZWFyY2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdvVG9BbmNob3IoaWRUb0dvKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24uaGFzaChpZFRvR28pO1xuICAgICAgICAgICAgJGFuY2hvclNjcm9sbC55T2Zmc2V0ID0gODA7XG4gICAgICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnb01vcmUocGFyYW0pIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGRzLnNlYXJjaC5uYXZpZ2F0ZScsIHt0YXJnZXQ6IHBhcmFtfSk7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKGFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ3Bkcy5zZWFyY2gubW9kZWwnKVxuICAgICAgICAuY29uZmlnKFNlYXJjaFByb3ZpZGVyKTtcblxuICAgIFNlYXJjaFByb3ZpZGVyLiRpbmplY3QgPSBbJ2VudicsICdTZWFyY2hQcm92aWRlciddO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoUHJvdmlkZXIoZW52LCBTZWFyY2hQcm92aWRlcikge1xuICAgICAgICBTZWFyY2hQcm92aWRlci5zZWFyY2hFbmRwb2ludChlbnYuZW5kUG9pbnQuc2VhcmNoU2VydmljZSk7XG4gICAgfVxuXG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLnNlYXJjaC5tb2RlbCcpXG4gICAgICAgIC5wcm92aWRlcignU2VhcmNoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVybCA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuc2VhcmNoRW5kcG9pbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB1cmwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJGdldCA9IFsnJHJlc291cmNlJywgJ2xvY2FsZScsIGZ1bmN0aW9uICgkcmVzb3VyY2UsIGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2VhcmNoKCRyZXNvdXJjZSwgbG9jYWxlLCB1cmwpO1xuICAgICAgICAgICAgfV07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoKCRyZXNvdXJjZSwgbG9jYWxlLCB1cmwpIHtcbiAgICAgICAgdmFyIG1ldGhvZHMgPSB7XG4gICAgICAgICAgICBsb2NhbGl6ZToge21ldGhvZDogJ0dFVCcsIGlzQXJyYXk6IHRydWUsIHBhcmFtczoge3R5cGU6ICdsb2NhbGl6ZSd9fVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJHJlc291cmNlKHVybCArICdyZXNvdXJjZS86dHlwZS86bG9jYWxlJywge2xvY2FsZTogbG9jYWxlfSwgbWV0aG9kcyk7XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLnNlYXJjaC5yb3V0ZScpXG4gICAgICAgIC5jb25maWcoUm91dGVDb25maWcpO1xuXG4gICAgUm91dGVDb25maWcuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIFJvdXRlQ29uZmlnKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnBkc1JvdXRlKHtcbiAgICAgICAgICAgIG5hbWU6ICdzZWFyY2gnLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdGVybXM6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmw6ICdzZWFyY2guaHRtbCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NlYXJjaC5odG1sJ1xuICAgICAgICB9KTtcbiAgICB9XG59KShhbmd1bGFyKTtcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgncGRzLnNlYXJjaC5zZXJ2aWNlJylcbiAgICAgICAgLnNlcnZpY2UoJ2Ntc1NlYXJjaExpc3RlbmVyJywgQ21zU2VhcmNoTGlzdGVuZXIpO1xuXG4gICAgQ21zU2VhcmNoTGlzdGVuZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckcScsICdjb25maWcnXTtcblxuICAgIGZ1bmN0aW9uIENtc1NlYXJjaExpc3RlbmVyKCRyb290LCAkcSwgY29uZmlnKSB7XG4gICAgICAgIHRoaXMubGlzdGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAkcm9vdC4kb24oJ3Bkcy5zZWFyY2gubmF2aWdhdGUnLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmICghIXBhcmFtcy50YXJnZXQucmVzb3VyY2VMb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG4gICAgfVxufSkoYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oYW5ndWxhcikge1xuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZShcInBkcy5zZWFyY2guc2VydmljZVwiKVxuXHRcdC5zZXJ2aWNlKFwiU2VhcmNoU2VydmljZVwiLCBTZWFyY2hTZXJ2aWNlKTtcblxuXHRTZWFyY2hTZXJ2aWNlLiRpbmplY3QgPSBbJyRxJywgJ1NlYXJjaCcsICdsb2NhbGUnXTtcblxuICAgIHZhciBNSU5fQVVUT1NVR0dFU1RfVEVSTV9MRU5HVEggPSAyO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoU2VydmljZSgkcSwgU2VhcmNoLCBsb2NhbGUpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VhcmNoOiBzZWFyY2gsXG5cdFx0XHRzdWdnZXN0OiBzdWdnZXN0XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHNlYXJjaChzZWFyY2gpIHtcblx0XHRcdHJldHVybiBTZWFyY2gucXVlcnkoe2xvY2FsZTogbG9jYWxlLCBzZWFyY2hUZXJtOiBzZWFyY2h9KS4kcHJvbWlzZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWdnZXN0KHNlYXJjaFRlcm0pIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hUZXJtICYmIHNlYXJjaFRlcm0ubGVuZ3RoID4gTUlOX0FVVE9TVUdHRVNUX1RFUk1fTEVOR1RIKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNlYXJjaC5sb2NhbGl6ZSh7bG9jYWxlOiBsb2NhbGUsIHNlYXJjaFRlcm06IHNlYXJjaFRlcm19KS4kcHJvbWlzZTtcbiAgICAgICAgICAgIH1cblx0XHRcdHJldHVybiAkcS5yZXNvbHZlKFtdKTtcblx0XHR9XG5cblx0fVxuXG59KShhbmd1bGFyKTtcbiJdfQ==
