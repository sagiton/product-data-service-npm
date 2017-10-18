import * as _ from 'lodash'
import sinon from 'sinon'
import ResourceMock from "../../../__mocks__/resource.mock";

describe('service: CatalogService', () => {
    let CatalogService, MenuService, CatalogUrlSchema, catalogSearchListener, Catalog, locale
    Catalog = ResourceMock({})

    beforeEach(angular.mock.module('pds.catalog.service'))

    beforeEach(angular.mock.module($provide => {
        spyOn(angular, 'element').and.returnValue({
            attr: val => 'OCS_CHANNEL',
            data: () => {}
        });
        $provide.value('MenuService', MenuService = {})
        $provide.value('CatalogUrlSchema', CatalogUrlSchema = {})
        $provide.value('catalogSearchListener', catalogSearchListener = {
            listen: () => Promise.resolve({target: {resourceId: 'resourceId'}})
        })
        $provide.value('Catalog', sinon.stub(Catalog))
        $provide.value('locale', locale = {})
        $provide.value('$q', Promise)
        $provide.value('_', _)
    }))

    beforeEach(angular.mock.inject(($injector) => {
        CatalogService = $injector.get('CatalogService')
    }));

    it('should calll Catalog with params', async () => {
        await CatalogService.getNewProducts()
        console.log(Catalog)

        // expect(Catalog.getCal)
        // spyOn(catalogService, 'getTemplate').and.returnValue(Promise.resolve({
        //     nodes: [
        //         {
        //             "id": 669445,
        //             "type": "ROOT_CATEGORY",
        //             "name": "Commercial & Industrial"
        //         },
        //         {
        //             "id": 669446,
        //             "type": "CATEGORY",
        //             "name": "Produkte"
        //         }
        //     ]
        // }))
    })

})
