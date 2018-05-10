import * as _ from 'lodash'
import '../../../../js/domain/catalog/catalog.module'
import '../../../../js/domain/catalog/service/breadcrumb.service'

describe('service: BreadcrumbService', () => {
    let BreadcrumbService
    let catalogService
    let $q
    let $root

    beforeEach(angular.mock.module('pds.catalog.service'))

    beforeEach(angular.mock.module($provide => {
        catalogService = {
            getTemplate: jest.fn(),
            resolveUriFromHierarchy: jest.fn()
        }
        $provide.value('CatalogService', catalogService)
        $provide.value('_', _)
    }))

    beforeEach(angular.mock.inject(($injector) => {
        BreadcrumbService = $injector.get('breadcrumbService')
        $q = $injector.get('$q')
        $root = $injector.get('$rootScope')
    }));

    it('should return breadcrumbs', (done) => {
        spyOn(catalogService, 'getTemplate').and.returnValue($q.resolve({
            nodes: [
                {
                    "id": 669445,
                    "type": "ROOT_CATEGORY",
                    "name": "Commercial & Industrial"
                },
                {
                    "id": 669446,
                    "type": "CATEGORY",
                    "name": "Produkte"
                }
            ]
        }))

        spyOn(catalogService, 'resolveUriFromHierarchy').and.returnValue($q.resolve('url.url'))

        BreadcrumbService
            .build()
            .then((breadcrumbs) => {
                expect(breadcrumbs).toMatchSnapshot()
                done()
            })
            .catch(done)

        $root.$apply()
    })

})
