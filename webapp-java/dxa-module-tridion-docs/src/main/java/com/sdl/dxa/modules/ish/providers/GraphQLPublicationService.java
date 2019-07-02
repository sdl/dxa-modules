package com.sdl.dxa.modules.ish.providers;

import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.dxa.tridion.pcaclient.GraphQLUtils;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.Pagination;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CustomMeta;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaConnection;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaEdge;
import com.sdl.web.pca.client.contentmodel.generated.Publication;
import com.sdl.web.pca.client.contentmodel.generated.PublicationConnection;
import com.sdl.web.pca.client.contentmodel.generated.PublicationEdge;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.controller.exception.NotFoundException;
import org.dd4t.providers.PublicationProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Profile("!cil.providers.active")
public class GraphQLPublicationService implements PublicationService {
    private static final Logger LOG = LoggerFactory.getLogger(PublicationProvider.class);

    private static final String PublicationTitleMeta = "publicationtitle.generated.value";
    private static final String PublicationProductfamilynameMeta = "FISHPRODUCTFAMILYNAME.logical.value";
    private static final String PublicationProductreleasenameMeta = "FISHPRODUCTRELEASENAME.version.value";
    private static final String PublicationVersionrefMeta = "ishversionref.object.id";
    private static final String PublicationLangMeta = "FISHPUBLNGCOMBINATION.lng.value";
    private static final String PublicationOnlineStatusMeta = "FISHDITADLVRREMOTESTATUS.lng.element";
    private static final String PublicationOnlineValue = "VDITADLVRREMOTESTATUSONLINE";
    private static final String PublicationCratedonMeta = "CREATED-ON.version.value";
    private static final String PublicationVersionMeta = "VERSION.version.value";
    private static final String PublicationLogicalId = "ishref.object.value";

    private static final String CustomMetaFilter = "requiredMeta:" + PublicationTitleMeta + ","
            + PublicationProductfamilynameMeta+ "," + PublicationProductreleasenameMeta + ","
            + PublicationVersionrefMeta + "," + PublicationLangMeta + "," + PublicationOnlineStatusMeta + ","
            + PublicationCratedonMeta + "," + PublicationVersionMeta + "," + PublicationLogicalId;

    @Autowired
    private ApiClientProvider apiClientProvider;

    @Override
    @Cacheable
    public List<com.sdl.dxa.modules.ish.model.Publication> getPublicationList(Localization localization) {
        ApiClient client = apiClientProvider.getClient();
        ContentNamespace contentNamespace = GraphQLUtils.convertUriToGraphQLContentNamespace(localization.getCmUriScheme());
        PublicationConnection publications = client.getPublications(contentNamespace, new Pagination(), null,
                CustomMetaFilter, null);
        for (PublicationEdge edge : publications.getEdges()) {
            if (isPublicationOnline(edge.getNode())) {
                return publications.getEdges().stream()
                        .filter(publicationEdge -> isPublicationOnline(publicationEdge.getNode()))
                        .map(publicationEdge -> buildPublicationFrom(publicationEdge.getNode()))
                        .collect(Collectors.toList());
            }
        }
        return null;
    }

    public boolean isPublicationOnline(Publication publication) {
        CustomMetaConnection customMeta = publication.getCustomMetas();
        if (customMeta == null) return false;
        for (CustomMetaEdge customMetaEdge : customMeta.getEdges()) {
            CustomMeta node = customMetaEdge.getNode();
            if (PublicationOnlineStatusMeta.equals(node.getKey())) {
                return PublicationOnlineValue.equals(node.getValue());
            }
        }
        return false;
    }

    @Cacheable
    public void checkPublicationOnline(int publicationId, Localization localization) {
        ApiClient client = apiClientProvider.getClient();
        boolean isOffline = false;
        try {
            ContentNamespace contentNamespace = GraphQLUtils.convertUriToGraphQLContentNamespace(localization.getCmUriScheme());
            Publication publication = client.getPublication(contentNamespace, publicationId,
                    "requiredMeta:" + PublicationOnlineStatusMeta, null);
            isOffline = publication == null
                    || publication.getCustomMetas() == null
                    || !publication.getCustomMetas().getEdges().stream()
                        .anyMatch(customMetaEdge -> PublicationOnlineValue.equals(customMetaEdge.getNode().getValue()));
        } catch (Exception e) {
            LOG.error("Couldn't find publication metadata for id: " + publicationId, e);
        }
        if (isOffline) {
            throw new NotFoundException("Unable to find publication " + publicationId);
        }
    }


    private com.sdl.dxa.modules.ish.model.Publication buildPublicationFrom(Publication publication) {
        com.sdl.dxa.modules.ish.model.Publication result = new com.sdl.dxa.modules.ish.model.Publication();
        result.setId(String.valueOf(publication.getItemId()));
        result.setTitle(publication.getTitle());

        CustomMetaConnection customMeta = publication.getCustomMetas();
        if (customMeta == null) return result;

        for (CustomMetaEdge customMetaEdge : customMeta.getEdges()) {
            String value = customMetaEdge.getNode().getValue();
            switch (customMetaEdge.getNode().getKey()) {
                case PublicationTitleMeta:
                    result.setTitle(value);
                    break;
                case PublicationLangMeta:
                    result.setLanguage(value);
                    break;
                case PublicationProductfamilynameMeta:
                    if (result.getProductFamily() == null) {
                        result.setProductFamily(new ArrayList<>());
                    }
                    result.getProductFamily().add(value);
                    break;
                case PublicationProductreleasenameMeta:
                    if (result.getProductReleaseVersion() == null) {
                        result.setProductReleaseVersion(new ArrayList<>());
                    }
                    result.getProductReleaseVersion().add(value);
                    break;
                case PublicationCratedonMeta:
                    //result.setCreatedOn(DateTime.parse(value, dateTimeFormat));
                    result.setCreatedOn(value);
                    break;
                case PublicationVersionMeta:
                    result.setVersion(value);
                    break;
                case PublicationVersionrefMeta:
                    result.setVersionRef(value);
                    break;
                case PublicationLogicalId:
                    result.setLogicalId(value);
                    break;
            }
        }

        return result;
    }
}
