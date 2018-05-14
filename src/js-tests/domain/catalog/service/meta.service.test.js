import '../../../../js/domain/catalog/catalog.module'
import '../../../../js/domain/catalog/service/meta.service'
import * as sinon from "sinon";
import _ from "lodash"

describe("service: MetaService", function () {
    let service
    let $root
    let catalogStub
    let $q
    let breadcrumbStub
    let imageFilterStub
    let catalogPathStub
    let $window
    let resolveUriStub
    let catalogIdStub

    beforeEach(angular.mock.module('pds.catalog.service'))
    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.value('CatalogService', {
                getCatalogTemplate: catalogStub = sinon.stub(),
                resolveUriFromHierarchy: resolveUriStub = sinon.stub()
            })
            $provide.value('breadcrumbService', {
                getData: breadcrumbStub = sinon.stub()
            })
            $provide.value('_', _)
            $provide.value('$window', $window = {cmsTranslations: {PAGE_TITLE: "##Test##"}, location: {}})
            $provide.value('imageUrlFilter', imageFilterStub = sinon.stub())
            $provide.value('config', {metaTags: {siteName: "Site_Name"}})
            $provide.value('$location', {absUrl: () => "http://location.url"})
            $provide.value('urlParserService', {
                getCatalogPath: catalogPathStub = sinon.stub(),
                getCatalogId: catalogIdStub = sinon.stub()
            })
        })
    })
    beforeEach(angular.mock.inject($injector => {
        service = $injector.get('metaService')
        $root = $injector.get('$rootScope')
        $q = $injector.get("$q")
    }))
    afterEach(() => {
        catalogStub.resetHistory()
        breadcrumbStub.resetHistory()
        imageFilterStub.resetHistory()
        catalogPathStub.resetHistory()
        resolveUriStub.resetHistory()
        catalogIdStub.resetHistory()
    })

    it("should redirect on invalid url", (done) => {
        catalogIdStub.returns("catalogID")
        catalogPathStub.returns("/path/tó/cątalog-123##")
        resolveUriStub.withArgs("catalogID").returns($q.resolve("http://valid.url/path/tó/cątąlog-123##"))

        service
            .redirectOnInvalidUrl()
            .then(() => {
                expect($window.location.href).toEqual("http://valid.url/path/tó/cątąlog-123##")
                done()
            })
            .catch(done)
        $root.$apply()
    })

    it('should not redirect on invalid url', (done) => {
        catalogIdStub.returns("id")
        catalogPathStub.returns("/path1/path2/%C4%85%C4%99%C3%A6%C2%A9-123&")
        resolveUriStub.withArgs("id").returns($q.resolve("http://valid.url/prefix/path1/path2/ąęæ©-123&"))

        service
            .redirectOnInvalidUrl()
            .then(() => {
                expect($window.location.href).toBeUndefined()
                done()
            })
            .catch(done)
        $root.$apply()
    })

    it("should update meta by catalog ID", (done) => {
        testMetadataUpdate({
            nodes: [{name: "NodeA"}, {name: "Node#B"}, {name: "_Node_"}],
            stubCallback: (stubs) => {
                imageFilterStub.withArgs("image1").returns("image.url")
                stubs.catalog.getParameter.withArgs("PRODUCT_HEADER", "productImgUrl").returns("image1")
                stubs.catalog.getParameter.withArgs('SEO_TEXT', 'seoText').returns("description##")
            },
            result: {
                title: "_Node_ | Node#B | NodeA | ##Test##",
                image: "image.url",
                description: "description##",
                webTrends: {
                    z_cg4: "NodeA",
                    z_cg3: "Node#B",
                    cg_s: "_Node_"
                }
            },
            done: done
        })
    })

    it("should update meta by catalog ID (2)", (done) => {
        testMetadataUpdate({
            done: done,
            nodes: [{name: "123"}, {name: "[]"}],
            stubCallback: (stubs) => {
                imageFilterStub.withArgs("$IMG$").returns("diamanti")
                stubs.catalog.getParameter.withArgs("KEYVISUAL", "backgroundImgUrl").returns("$IMG$")
                stubs.catalog.getParameter.withArgs("PRODUCT_HEADER", "subtitle").returns("headerfordesc")
            },
            result: {
                title: "[] | 123 | ##Test##",
                image: "diamanti",
                description: "headerfordesc",
                webTrends: {
                    z_cg4: undefined,
                    z_cg3: "123",
                    cg_s: "[]"
                }
            }
        })
    })

    function testMetadataUpdate(input) {
        sinon.spy($root, '$broadcast')
        var breadcrumbs = {nodes: input.nodes};
        var catalog = sinon.stub({
            getParameter: function () {}
        });
        catalogStub.withArgs("catalogA").returns($q.resolve(catalog))
        breadcrumbStub.withArgs("catalogA").returns($q.resolve(breadcrumbs))
        input.stubCallback({catalog: catalog})

        service
            .updateMetaByCategory("catalogA")
            .then(() => {
                var result = angular.extend(input.result, {
                    siteName: "Site_Name",
                    canonicalUrl: "http://location.url"
                })
                expect($root.$broadcast.firstCall.args[0]).toEqual('pds.header.update')
                expect($root.$broadcast.firstCall.args[1]).toEqual(result)
                input.done()
            })
            .catch(input.done)
        $root.$apply()
    }
})
