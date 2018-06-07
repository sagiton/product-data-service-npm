import '../../../js/common/common.module'
import '../../../js/common/filter/image.url.filter'
import _ from 'lodash'
import sinon from 'sinon'

describe("filter: ImageUrlFilter", () => {
    let filter
    let localeStub
    let channelStub

    beforeEach(angular.mock.module('pds.common.filter'))

    beforeEach(angular.mock.module($provide => {
        $provide.value('env', {
            endPoint: {
                ocsMediaEndpoint: 'http://asset-url.com/'
            }
        })
        $provide.value('locale', {
            toString: localeStub = sinon.stub()
        })
        $provide.value('metaTag', {
            getOcsChannel: channelStub = sinon.stub()
        })
        $provide.value('_', _)
    }))

    beforeEach(angular.mock.inject(($injector) => {
        filter = $injector.get('imageUrlFilter')
    }));

    afterEach(() => {
        localeStub.resetHistory()
        channelStub.resetHistory()
    })

    it('should get asset url', () => {
        localeStub.returns("de_DE")
        channelStub.returns("ocs channel")

        var url = filter('Asset_URL123 %#.jpg', 'img-sm', 'variantABC')

        expect(url).toEqual("http://asset-url.com/ocs%20channel/de_DE/Asset_URL123%20%25%23_variantABC.jpg")
    })

    it('should get default asset url', () => {
        var url = filter(null, 'img-sm', null)

        expect(url).toEqual('/media/images/default-460x460.jpg')
    })

    it('should get asset without variant url', () => {
        localeStub.returns('pl')
        channelStub.returns('channel')

        var url = filter('AssetName.png', 'img-md', null)
        expect('http://asset-url.com/channel/pl/AssetName.png')
    })
})
