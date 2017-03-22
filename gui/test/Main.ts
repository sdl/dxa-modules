import "ts-helpers";
import "sdl-controls-react-wrappers/dist/stylesheets/main";
import "./configuration/Tests.less";
import "babel-polyfill";

// Import all tests
import "test/tests/components/container/AppComponent";
import "test/tests/components/container/ErrorContentComponent";
import "test/tests/components/container/HomeComponent";
import "test/tests/components/container/ProductFamiliesListComponent";
import "test/tests/components/container/PublicationContentComponent";
import "test/tests/components/container/PublicationsListComponent";
import "test/tests/components/container/TilesListComponent";
import "test/tests/components/container/TilesListComponent";
import "test/tests/components/controls/DropdownComponent";
import "test/tests/components/presentation/BreadcrumbsComponent";
import "test/tests/components/presentation/ContentNavigationComponent";
import "test/tests/components/presentation/ErrorComponent";
import "test/tests/components/presentation/NavigationMenuComponent";
import "test/tests/components/presentation/PageComponent";
import "test/tests/components/presentation/SearchBarComponent";
import "test/tests/components/presentation/TileComponent";
import "test/tests/components/presentation/TocComponent";
import "test/tests/models/PublicationsModel";
import "test/tests/Server";
import "test/tests/services/client/PageService";
import "test/tests/services/client/PublicationService";
import "test/tests/services/client/TaxonomyService";
import "test/tests/services/server/PublicationService";
import "test/tests/utils/Html";
import "test/tests/utils/Path";
import "test/tests/utils/Slug";
import "test/tests/utils/StringUtil";
import "test/tests/utils/TcmId";
import "test/tests/utils/UrlUtil";
