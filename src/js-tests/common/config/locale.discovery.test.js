import '../../../js/common/config/locale.discovery.methods'
import '../../../js/common/config/locale.discovery'
import _ from 'lodash'
import sinon from 'sinon'

describe("config: LocaleProvider", () => {
    let localeStub
    let _localeProvider

    beforeEach(angular.mock.module($provide => {
        localeStub = sinon.stub()
        $provide.factory('_', () => _)
        $provide.factory('metaTag', () => {
            return {
                getOcsLocale: localeStub
            }
        })
    }))
    beforeEach(angular.mock.module('pds.common.config', function (localeProvider) {
        _localeProvider = localeProvider
    }))
    afterEach(function () {
        localeStub.resetHistory()
    })

    it("should detect locale by metatag", angular.mock.inject(($injector) => {
        localeStub.returns('en_US')
        const locale = $injector.invoke(_localeProvider.$get)
        expect(locale).toBeDefined()
        expect(locale.toString()).toEqual('en_US')
        expect(locale.country).toEqual('US')
        expect(locale.language).toEqual('en')
    }))

    it("should detect locale by url", angular.mock.inject(($injector) => {
        Object.defineProperty(window.location, 'href', {
            writable: true,
            value: 'http://test-site.com:8080/pl/pl/current/url ()/with?param=1#hashed'
        })

        const locale = $injector.invoke(_localeProvider.$get)
        expect(locale).toBeDefined()
        expect(locale.toString()).toEqual('pl_PL')
        expect(locale.language).toEqual('pl')
        expect(locale.country).toEqual('pl')
    }))

    it("should detect locale by meta tag first", angular.mock.inject($injector => {
        Object.defineProperty(window.location, 'href', {
            writable: true,
            value: 'http://test-site.com:8080/pl/pl/current/url ()/with?param=1#hashed'
        })
        localeStub.returns("en_CA")

        const locale = $injector.invoke(_localeProvider.$get)
        expect(locale).toBeDefined()
        expect(locale.toString()).toEqual("en_CA")
    }))

    it("should not detect locale", angular.mock.inject($injector => {
        Object.defineProperty(window.location, 'href', {
            writable: true,
            value: 'http://test-site.com:8080/some/irrelevant/path'
        })
        localeStub.returns("invalid locale")

        expect(() => $injector.invoke(_localeProvider.$get)).toThrow(new Error("OCS Locale cannot be discovered - country: undefined, language: undefined"))
    }))
})
