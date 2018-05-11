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

    beforeEach(angular.mock.module('pds.catalog.service'))
    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.value('CatalogService', {
                getCatalogTemplate: catalogStub = sinon.stub()
            })
            $provide.value('breadcrumbService', {
                getData: breadcrumbStub = sinon.stub()
            })
            $provide.value('_', _)
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
    })

    it("should update meta by catalog ID", (done) => {
        sinon.spy($root, '$broadcast')
        var breadcrumbs = {nodes: [{name: "NodeA"}, {name: "Node#B"}, {name: "_Node_"}]};
        var catalog = sinon.stub({
            getParameter: function () {}
        });
        catalogStub.withArgs("catalogA").returns($q.resolve(catalog))
        breadcrumbStub.withArgs("catalogA").returns($q.resolve(breadcrumbs))
        catalog.getParameter.withArgs("PRODUCT_HEADER", "productImgUrl").returns("image1")
        catalog.getParameter.withArgs('SEO_TEXT', 'seoText').returns("description##")

        service
            .updateMetaByCategory("catalogA")
            .then(function () {
                expect($root.$broadcast.firstCall.args[0]).toEqual('pds.header.update')
                expect($root.$broadcast.firstCall.args[1]).toEqual({

                })
            })
            .catch(done)
        $root.$apply()
    })
})
