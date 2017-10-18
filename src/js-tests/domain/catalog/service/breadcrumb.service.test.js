import * as _ from 'lodash'

describe('service: BreadcrumbService', () => {
    let BreadcrumbService
    let catalogService;

    beforeEach(angular.mock.module('pds.catalog.service'))

    beforeEach(angular.mock.module($provide => {
        catalogService = {
            getTemplate: jest.fn(),
            resolveUriFromHierarchy: jest.fn()
        }
        $provide.value('CatalogService', catalogService)
        $provide.value('_', _)
        $provide.value('$q', Promise)
    }))

    beforeEach(angular.mock.inject(($injector) => {
        BreadcrumbService = $injector.get('BreadcrumbService')
    }));

    it('should return breadcrumbs', async () => {
        spyOn(catalogService, 'getTemplate').and.returnValue(Promise.resolve({
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

        spyOn(catalogService, 'resolveUriFromHierarchy').and.returnValue(Promise.resolve('url.url'))

        let breadcrumbs = await BreadcrumbService.build()
        expect(breadcrumbs).toMatchSnapshot()
    })

})
