import * as _ from 'lodash'
import sinon from 'sinon'
import '../../../../js/domain/catalog/catalog.module'
import '../../../../js/domain/catalog/service/catalog.service'

describe('service: CatalogService', () => {
    let CatalogService, MenuService, CatalogUrlSchema, catalogSearchListener, Catalog, locale, CatalogConstructorSpy, $window, metaTag, $root, $q
    Catalog = sinon.stub(new class Catalog {
        $template(){}
        get(){}
    }())

    beforeEach(angular.mock.module('pds.catalog.service'))

    beforeEach(angular.mock.module($provide => {
        $provide.value('MenuService', MenuService = {
            findInNavigation: () => {},
            findParentInNavigation: sinon.stub()
        })
        $provide.value('catalogUrlSchema', CatalogUrlSchema = sinon.stub({
            build: ()=>{}
        }))
        $provide.value('catalogSearchListener', catalogSearchListener = {
            listen: () => Promise.resolve({target: {resourceId: 'resourceId'}})
        })
        $provide.value('Catalog', CatalogConstructorSpy = sinon.spy(class {
            constructor() { return Catalog}
            static get(){ return {$promise: ''} }
        }))
        $provide.value('metaTag', metaTag = {
            getSiteChannel: () => { return "site-channel" },
            getOcsChannel: () => { return "channelABC" },
            getOcsLocale: () => { return "de_CH" },
            getOcsSnippetDefinition: () => { return "https://definition.url" }
        })
        $provide.value('locale', locale = {
            toString: () => { return "de_CH" }
        })
        $provide.value('_', _)
        $provide.value('$window', $window = {
            location: {url: ''}
        })
    }))

    beforeEach(angular.mock.inject(($injector) => {
        CatalogService = $injector.get('CatalogService')
        $root = $injector.get('$rootScope')
        $q = $injector.get('$q')
    }));

    it('should call Catalog with params', () => {
        CatalogService.getNewProducts()
        $root.$apply()
        expect(CatalogConstructorSpy.calledWith({
            template: {name: 'NEW_PRODUCTS'},
            model: {
                locale: 'de_CH',
                channel: 'channelABC'
            }
        })).toBeTruthy()
        expect(Catalog.$template.called).toBeTruthy()
    })


    it('should getById Catalog', (done) => {
        spyOn(MenuService, 'findInNavigation').and.returnValue($q.resolve({type: 'catalogType'}))
        CatalogService
            .getCatalogTemplate('catalogId')
            .then(() => {
                expect(CatalogConstructorSpy.calledWith({
                    template: {name: 'catalogType'},
                    model: {
                        locale: 'de_CH',
                        channel: 'channelABC',
                        catalogRequest: {
                            id: 'catalogId',
                            channel: 'channelABC',
                            type: 'catalogType',
                            cmsDefinitionUrl: 'https://definition.url'
                        }
                    }
                })).toBeTruthy()
                expect(Catalog.$template.called).toBeTruthy()
                done()
            })
            .catch(done)
        $root.$apply()
    })

    it('should navigateTo', (done) => {
        spyOn(MenuService, 'findInNavigation').and.returnValue($q.resolve({type: 'catalogType'}))
        CatalogConstructorSpy.get = function(){}
        sinon.stub(CatalogConstructorSpy, 'get').returns({$promise: $q.resolve({
            id: 'id',
            type: 'type',
            name: 'name'
        })})
        spyOn(CatalogUrlSchema, 'build').and.returnValue($q.resolve('http://url.url'))

        CatalogService
            .redirectTo('catalogId')
            .then(() => {
                expect(CatalogUrlSchema.build.calledWith([{
                    "id": "id",
                    "type": "type",
                    "name": "name"
                }]))
                expect($window.location.href).toEqual('http://url.url')
                done()
            })
            .catch(done)
        $root.$apply()
    })


    it('should travelUpNavigationHierarchy', (done) => {
        spyOn(MenuService, 'findInNavigation').and.returnValue($q.resolve({
            id: 'catalogId1',
            type: 'catalogType1'
        }))
        MenuService.findParentInNavigation
            .withArgs("catalogId1", "de_CH")
            .onCall(0).returns($q.resolve({
                id: 'catalogId2',
                type: 'catalogType2'
            }))

        MenuService.findParentInNavigation
            .withArgs("catalogId2", "de_CH")
            .onCall(1).returns(null)

        CatalogService
            .travelUpNavigationHierarchy({locale: "de_CH"})
            .then((tree) => {
                expect(tree.length).toEqual(2)
                CatalogConstructorSpy.getCall(0).calledWith({id: "catalogId1", type: "catalogType1"})
                CatalogConstructorSpy.getCall(1).calledWith({id: "catalogId2", type: "catalogType2"})
                done()
            })
            .catch(done)
        $root.$apply()
    })

    it('should getIdFromLocation', () => {
        const id = CatalogService.getIdFromLocation('https://www.buderus.com/ro/ro/ocs/logamax-plus-gb172i-667905-p/')
        expect(id).toEqual('667905')
    })

    it('should resolveUriFromHierarchy', (done) => {
        spyOn(MenuService, 'findInNavigation').and.returnValue($q.resolve({
            id: 'catalogId1',
            type: 'catalogType1'
        }))

        MenuService.findParentInNavigation
            .onCall(0).returns($q.resolve({
                id: 'catalogId2',
                type: 'catalogType2'
            }))
            .onCall(1).returns(null)
        CatalogService
            .resolveUriFromHierarchy('categoryId', "de_CH", "channelQWERTY")
            .then(() => {
                expect(MenuService.findInNavigation).toHaveBeenCalledWith({id: "categoryId", locale: "de_CH", channel: "channelQWERTY"})
                expect(CatalogUrlSchema.build.called).toBeTruthy()
                done()
            })
            .catch(done)
        $root.$apply()
    })

})
