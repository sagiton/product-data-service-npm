import * as _ from 'lodash'
import ResourceWrapper from '../../../__mocks__/resource.mock'
import {getMenu} from "../../../__mocks__/api.service.mock";
import * as sinon from "sinon";
import '../../../../js/domain/navigation/navigation.module'
import '../../../../js/domain/navigation/service/menu.service'

describe('service: MenuService', () => {
    let MenuService, metaTag, Navigation

    beforeEach(angular.mock.module('pds.navigation.service'))
    beforeEach(() => {
        angular.mock.module($provide => {
            $provide.value('_', _)
            $provide.value('Navigation', Navigation = new ResourceWrapper(getMenu()))
            $provide.value('locale', {
                toString: () => {
                    return 'pl_PL'
                }
            })
            $provide.value('metaTag', metaTag = {
                getSiteChannel: () => { return "site-channel" },
                getOcsChannel: () => { return "channelABC" },
                getOcsLocale: () => { return "de_CH" },
                getOcsSnippetDefinition: () => { return "https://definition.url" }
            })
        });
        angular.mock.inject($injector => MenuService = $injector.get('MenuService'))
        sinon.spy(Navigation, 'get')
    });

    it('should return menu', async () => {
        const menu = await MenuService.getMenu();
        expect(menu).toMatchSnapshot()
        var arg = Navigation.get.getCall(0).args[0];
        var nav = arg.query
        expect(nav.args).toEqual({
            template: {
                name: 'CATALOG_HIERARCHY',
                channel: 'channelABC'
            },
            model: {
                locale: 'pl_PL',
                channel: 'channelABC'
            }
        })
    })

    it('should find in navigation', async () => {
        const node = await MenuService.findInNavigation({id: '669462'});
        const node2 = await MenuService.findInNavigation({id: '669464'});
        expect({node, node2}).toMatchSnapshot('nodes')
        expect(MenuService.flatNavigation).toMatchSnapshot('flatMenu')
    })

    it('should find parent in navigation', async () => {
        await MenuService.findInNavigation({})
        const node = await MenuService.findParentInNavigation('1106917');
        const node2 = await MenuService.findParentInNavigation('669445');
        expect({node, node2}).toMatchSnapshot()
    })
})
