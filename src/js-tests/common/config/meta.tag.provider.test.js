import '../../../js/common/config/meta.tag.provider'

describe("config: MetaTag", () => {
    let metaTag

    beforeEach(angular.mock.module('pds.common.config'))
    beforeEach(angular.mock.inject($injector => {
        document.body.innerHTML = "" +
            "<head>" +
            "<meta name='ocs-locale' content='ch_DE'/>" +
            "<meta name='ocs-channel' content='#channel@'/>" +
            "<meta name='ocs-snippets' content='https://snippet.url'/>" +
            "<meta name='channel' content='++chan nel++'/>" +
            "</head>"
        metaTag = $injector.get('metaTag')
    }))

    it("should get ocs locale", () => {
        expect(metaTag.getOcsLocale()).toEqual("ch_DE")
    })

    it("should get ocs channel", () => {
        expect(metaTag.getOcsChannel()).toEqual("#channel@")
    })

    it("should get ocs snippet url", () => {
        expect(metaTag.getOcsSnippetDefinition()).toEqual("https://snippet.url")
    })

    it("should get site channel", () => {
        expect(metaTag.getSiteChannel()).toEqual("++chan nel++")
    })

    it("should add meta tag", () => {
        metaTag.addMeta("meta-name", "123()Meta")
        expect(angular.element("meta[name='meta-name']").attr('content')).toEqual("123()Meta")
    })

    it("should add json ld meta", () => {
        var model = {attribute: 'value', list: [1, 0, 3], obj: {hello: 'there'}};
        metaTag.addJsonLD(model)
        var jsonld = angular.element("script[type='application/ld+json']").html();
        expect(jsonld).toBeTruthy()
        expect(JSON.parse(jsonld)).toEqual(model)
    })
})
