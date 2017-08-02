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
                            .getById(val)
                            .then(function (catalog) {
                                scope.$catalog = catalog;
                                populateTemplateAttributes(scope.$catalog);
                                $rootScope.$broadcast('pds.catalog.loaded', {catalog: catalog});
                            });
                    });

                    function populateTemplateAttributes(catalog) {
                        catalog.description = catalog.descriptionLong;
                        catalog.title = catalog.descriptionShort;
                        catalog.image = catalog.keyVisual || catalog.productimage;
                        catalog.showImage = function () {
                            return !!catalog.image;
                        };
                        catalog.showTiles = _.negate(catalog.isLeafCatalog);
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
                                bullets: _.has(child, 'highlightCatOverview.value.elements') && child.highlightCatOverview.value.elements,

                            }
                        });
                        catalog.showTeaser = catalog.isProductFamily;
                        catalog.new = catalog.neuheitOcs;
                        catalog.newImage = '/media/new.png';
                        catalog.name = catalog.productname;
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
                        catalog.moreDetails = {
                            title: catalog.headlineOverview,
                            elements: _.map(catalog.subheadlines, function (headline) {
                                return {
                                    title: headline.title,
                                    text: headline.description,
                                    image: headline.image
                                }
                            })
                        };
                        catalog.showTechnicalTable = function () {
                            return catalog.productTableDefinition && catalog.children; //FIXME Take logic from controller, Make this customizable
                        };
                        catalog.showFootnotes = function () {
                            return catalog.footnotesTechData;
                        };
                        catalog.footnotes = catalog.footnotesTechData;
                    }
                }
            }
        }]);

})(angular);
