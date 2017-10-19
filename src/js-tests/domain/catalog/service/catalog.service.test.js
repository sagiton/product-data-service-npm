import * as _ from 'lodash'
import sinon from 'sinon'

describe('service: CatalogService', () => {
    let CatalogService, MenuService, CatalogUrlSchema, catalogSearchListener, Catalog, locale, CatalogConstructorSpy, $window
    Catalog = sinon.stub(new class Catalog {
        $template(){}
        get(){}
    }())

    beforeEach(angular.mock.module('pds.catalog.service'))

    beforeEach(angular.mock.module($provide => {
        spyOn(angular, 'element').and.returnValue({
            attr: val => 'OCS_CHANNEL',
            data: () => {}
        });
        $provide.value('MenuService', MenuService = {
            findInNavigation: () => {},
            findParentInNavigation: sinon.stub()
        })
        $provide.value('CatalogUrlSchema', CatalogUrlSchema = sinon.stub({
            build: ()=>{}
        }))
        $provide.value('catalogSearchListener', catalogSearchListener = {
            listen: () => Promise.resolve({target: {resourceId: 'resourceId'}})
        })
        $provide.value('Catalog', CatalogConstructorSpy = sinon.spy(class {
            constructor() { return Catalog}
            static get(){ return {$promise: ''} }
        }))
        $provide.value('locale', locale = {})
        $provide.value('$q', Promise)
        $provide.value('_', _)
        $provide.value('$window', $window = sinon.stub({
            location: {url: ''}
        }))
    }))

    beforeEach(angular.mock.inject(($injector) => {
        CatalogService = $injector.get('CatalogService')
    }));

    it('should call Catalog with params', async () => {
        await CatalogService.getNewProducts()
        expect(CatalogConstructorSpy.calledWith({
            template: {name: 'NEW_PRODUCTS'},
            model: {
                locale: '[object Object]',
                channel: 'OCS_CHANNEL'
            }
        })).toBeTruthy()
        expect(Catalog.$template.called).toBeTruthy()
    })


    it('should getById Catalog', async () => {
        spyOn(MenuService, 'findInNavigation').and.returnValue(Promise.resolve({type: 'catalogType'}))
        await CatalogService.getCatalogTemplate('catalogId')
        expect(CatalogConstructorSpy.calledWith({
            template: {name: 'catalogType'},
            model: {
                locale: '[object Object]',
                channel: 'OCS_CHANNEL',
                catalogRequest: {
                    id: 'catalogId',
                    channel: 'OCS_CHANNEL',
                    type: 'catalogType'
                }
            }
        })).toBeTruthy()
        expect(Catalog.$template.called).toBeTruthy()
    })

    it('should navigateTo', async () => {
        spyOn(MenuService, 'findInNavigation').and.returnValue(Promise.resolve({type: 'catalogType'}))
        CatalogConstructorSpy.get = function(){}
        sinon.stub(CatalogConstructorSpy, 'get').returns({$promise: Promise.resolve({
            id: 'id',
            type: 'type',
            name: 'name'
        })})
        spyOn(CatalogUrlSchema, 'build').and.returnValue(Promise.resolve('http://url.url'))
        await CatalogService.redirectTo('catalogId')
        expect(CatalogUrlSchema.build.calledWith([{
            "id": "id",
            "type": "type",
            "name": "name"
        }]))
        expect($window.location.href).toEqual('http://url.url')
    })


    it('should travelUpNavigationHierarchy', async () => {
        spyOn(MenuService, 'findInNavigation').and.returnValue(Promise.resolve({
            id: 'catalogId1',
            type: 'catalogType1'
        }))
        MenuService.findParentInNavigation
            .onCall(0).returns(Promise.resolve({
                id: 'catalogId2',
                type: 'catalogType2'
            }))
            .onCall(1).returns(null)

        const tree = await CatalogService.travelUpNavigationHierarchy('catalogId')
        expect(tree).toMatchSnapshot()
    })

    it('should getIdFromLocation', () => {
        const id = CatalogService.getIdFromLocation('https://www.buderus.com/ro/ro/ocs/logamax-plus-gb172i-667905-p/')
        expect(id).toEqual('667905')
    })

    it('should resolveUriFromHierarchy', async () => {
        spyOn(MenuService, 'findInNavigation').and.returnValue(Promise.resolve({
            id: 'catalogId1',
            type: 'catalogType1'
        }))
        MenuService.findParentInNavigation
            .onCall(0).returns(Promise.resolve({
                id: 'catalogId2',
                type: 'catalogType2'
            }))
            .onCall(1).returns(null)
        await CatalogService.resolveUriFromHierarchy('categoryId')
        expect(CatalogUrlSchema.build.calledWith([
            {
                "id": "catalogId1",
                "type": "catalogType1"
            },
            {
                "id": "catalogId2",
                "type": "catalogType2"
            }
        ])).toBeTruthy()
    })

})
