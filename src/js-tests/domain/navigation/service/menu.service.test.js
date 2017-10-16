import * as _ from 'lodash'
import ResourceWrapper from '../../../__mocks__/resource.mock'
import {getMenu} from "../../../__mocks__/api.service.mock";

describe('service: MenuService', () => {
    let MenuService

    beforeEach(angular.mock.module('pds.navigation.service'))
    beforeEach(() => {
        spyOn(angular, 'element').and.returnValue({
            attr: val => 'OCS_CHANNEL',
            data: () => {}
        });

        angular.mock.module($provide => {
            $provide.value('_', _)
            $provide.value('Navigation', new ResourceWrapper(getMenu()))
            $provide.value('locale', jest.fn())
        });
        angular.mock.inject($injector => MenuService = $injector.get('MenuService'))
    });

    it('should return menu', async () => {
        const menu = await MenuService.getMenu();
        expect(menu).toMatchSnapshot()
    })

    it('should find in navigation', async () => {
        const node = await MenuService.findInNavigation('669462');
        const node2 = await MenuService.findInNavigation('669464');
        expect({node, node2}).toMatchSnapshot('nodes')
        expect(MenuService.flatNavigation).toMatchSnapshot('flatMenu')
    })

    it('should find parent in navigation', async () => {
        await MenuService.findInNavigation()
        const node = await MenuService.findParentInNavigation('1106917');
        const node2 = await MenuService.findParentInNavigation('669445');
        expect({node, node2}).toMatchSnapshot()
    })
})
