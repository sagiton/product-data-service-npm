import '../../bower_components/angular/angular'
import '../../bower_components/angular-translate/angular-translate'
import 'angular-mocks'

import '../js/app'

import '../js/domain/search/search.module'
import '../js/domain/search/directive/ocs.quicksearch.directive'
import '../js/domain/search/directive/ocs.search.directive'
import '../js/domain/search/directive/search.result.link'
// import '../js/domain/search/model/search.model.config'
// import '../js/domain/search/model/search.resource'
import '../js/domain/search/service/cms.search.listener'
import '../js/domain/search/service/search.handlers'
import '../js/domain/search/service/search.service'

import '../js/domain/catalog/catalog.module'
import '../js/domain/catalog/service/search.listener'
import '../js/domain/catalog/service/seo.friendly.url.builder'
import '../js/domain/catalog/service/url.parser.service'
import '../js/domain/catalog/controller/catalog.controller'
import '../js/domain/catalog/directive/attribute.value.directive'
import '../js/domain/catalog/directive/catalog.metadata.directive'
import '../js/domain/catalog/directive/catalog.template.directive'
import '../js/domain/catalog/directive/equalize.teaser.height.directive'
import '../js/domain/catalog/directive/ocs.breadcrumb.directive'
import '../js/domain/catalog/directive/ocs.data.table.directive'
import '../js/domain/catalog/directive/ocs.navigate.directive'
import '../js/domain/catalog/directive/ocs.navigation.menu.directive'
import '../js/domain/catalog/directive/ocs.new.products.directive'
import '../js/domain/catalog/directive/scrollable.table.directive'
import '../js/domain/catalog/directive/section.technical.data.table.directive'
import '../js/domain/catalog/directive/switch.language.directive'
import '../js/domain/catalog/directive/synchronize.height.directive'
import '../js/domain/catalog/factory/url.builder.factory'
// import '../js/domain/catalog/model/catalog.model.config'
// import '../js/domain/catalog/model/catalog.resource'
import '../js/domain/catalog/route/catalog.route.config'

import '../js/domain/navigation/navigation.module'
// import '../js/domain/navigation/model/navigation.model.config'
// import '../js/domain/navigation/model/navigation.resource'

import '../js/common/common.module'
import '../js/common/config/i18n.config'
import '../js/common/config/lodash.factory'
import '../js/common/config/anchor.config'
import '../js/common/config/locale.discovery'
import '../js/common/config/locale.discovery.methods'
import '../js/common/config/meta.tag.provider'
import '../js/common/config/ocs.webtrends.tracking.listener'
import '../js/common/config/sticky.header.runner'
import '../js/common/config/window.decorator'
import '../js/common/service/spinner.service'
import '../js/common/directive/cliplister.directive'
import '../js/common/directive/httpSrc.directive'
import '../js/common/directive/simple.submenu.directive'
import '../js/common/filter/simplify.characters.filter'
import '../js/common/controller/content.controller'
import '../js/common/controller/header.controller'

