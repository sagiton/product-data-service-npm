import 'angular-mocks'
import '../../../../js/domain/navigation/service/menu.service'
import '../../../../js/domain/catalog/service/url.parser.service'
import * as _ from 'lodash'
import ResourceWrapper from '../../../__mocks__/resource.mock'

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
            $provide.value('Navigation', new ResourceWrapper({root: {children: [{a:'h'}]}}))
            $provide.value('locale', jest.fn())
        });
        angular.mock.inject($injector => MenuService = $injector.get('MenuService'))
    });

    it('should initialise service', () => {
        expect(MenuService).toBeDefined()
    })

    it('should return  menu', async () => {
        const menu = await MenuService.getMenu();
        expect(menu).toMatchSnapshot()
    })
})
