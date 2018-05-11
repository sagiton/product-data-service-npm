import '../../../../js/domain/catalog/catalog.module'
import '../../../../js/domain/catalog/service/catalog.url.schema'
import * as sinon from "sinon";
import Catalog from "../../../__mocks__/catalog.mock"
import * as _ from 'lodash'



describe("service: CatalogUrlSchema", () => {
    let metaStub
    let service
    let builder
    let UrlBuilder = sinon.stub(new class UrlBuilder {
        constructor() {}
        addPath() {}
        setPath() {}
        build() {}
    }())

    beforeEach(angular.mock.module('pds.catalog.service'))
    beforeEach(() => {
        var metaTag = {
            getSiteChannel: () => ""
        }

        angular.mock.module($provide => {
            $provide.value('SeoFriendlyUrlBuilder', builder = sinon.spy(class {
                constructor() { return UrlBuilder }
            }))
            $provide.value('metaTag', metaStub = sinon.stub(metaTag))
            $provide.value('_', _)
        })
    })
    beforeEach(angular.mock.inject($injector => service = $injector.get('catalogUrlSchema')))

    afterEach(() => {
        UrlBuilder.addPath.resetHistory()
        UrlBuilder.build.resetHistory()
    })

    it("should build default url", () => {
        metaStub.getSiteChannel.returns("unknown")

        service.build([new Catalog("sub2", "SubCatalog", "sub", false), new Catalog("sub1", "SubCatalog", "sub", false), new Catalog("abc", "Root Catalog", "root", false)])

        expect(builder.calledOnce).toBeTruthy()
        expect(UrlBuilder.addPath.calledThrice).toBeTruthy()
        expect(UrlBuilder.addPath.firstCall.args[0]).toEqual(["unknown", "Root Catalog"])
        expect(UrlBuilder.addPath.secondCall.args[0]).toEqual(["SubCatalog"])
        expect(UrlBuilder.addPath.thirdCall.args[0]).toEqual(["SubCatalog", "sub2", "c"])
        expect(UrlBuilder.build.calledOnce).toBeTruthy()
    })

    it("should build with industrial schema", () => {
        metaStub.getSiteChannel.returns("gewerbe-industrie")

        service.build([new Catalog("123", "Catalog@", "sub", false), new Catalog("234", "Catalog#", "sub", false), new Catalog("345", "Catalog_", "sub", false), new Catalog("567", "Catalog+", "sub", false)])

        expect(builder.calledOnce).toBeTruthy()
        expect(builder.firstCall.args[0]).toEqual({ocsBasePath: "gewerbe-industrie/ocs"})
        expect(UrlBuilder.addPath.callCount).toEqual(4)
        expect(UrlBuilder.addPath.firstCall.args[0]).toEqual(["Catalog+"])
        expect(UrlBuilder.addPath.secondCall.args[0]).toEqual(["Catalog_"])
        expect(UrlBuilder.addPath.thirdCall.args[0]).toEqual(["Catalog#"])
        expect(UrlBuilder.addPath.getCall(3).args[0]).toEqual(["Catalog@", "123", "c"])
        expect(UrlBuilder.build.calledOnce).toBeTruthy()
    })

    it("should build product family", () => {

        service.build([new Catalog("123", "Family Yo", "fam", "true"), new Catalog("234", "Catalog#", "sub", false), new Catalog("345", "Catalog_", "sub", false)])

        expect(builder.calledOnce).toBeTruthy()
        expect(UrlBuilder.setPath.calledOnce).toBeTruthy()
        expect(UrlBuilder.setPath.firstCall.args[0]).toEqual(["Family Yo", "123", "p"])
        expect(UrlBuilder.build.calledOnce).toBeTruthy()
    })
})
