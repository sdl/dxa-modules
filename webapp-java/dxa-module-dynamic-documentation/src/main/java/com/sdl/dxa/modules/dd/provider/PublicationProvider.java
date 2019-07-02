package com.sdl.dxa.modules.dd.provider;

import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.Pagination;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CustomMeta;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaConnection;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaEdge;
import com.sdl.web.pca.client.contentmodel.generated.Publication;
import com.sdl.web.pca.client.contentmodel.generated.PublicationConnection;
import com.sdl.web.pca.client.contentmodel.generated.PublicationEdge;
import com.sdl.webapp.common.exceptions.DxaItemNotFoundException;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/// <summary>
/// Publication Provider
/// </summary>
@Component
public class PublicationProvider {
    private static final Logger LOG = LoggerFactory.getLogger(PublicationProvider.class);

    protected static final DateTimeFormatter dateTimeFormat = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ssZ");
//    protected static final DateTimeFormatter dateTimeFormat = ISODateTimeFormat.basicDateTimeNoMillis();

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

    private static final String CustomMetaFilter = "requiredMeta:" + PublicationTitleMeta + "," + PublicationProductfamilynameMeta+ "," + PublicationProductreleasenameMeta + "," + PublicationVersionrefMeta + "," + PublicationLangMeta + "," + PublicationOnlineStatusMeta + "," + PublicationCratedonMeta + "," + PublicationVersionMeta + "," + PublicationLogicalId;

    @Autowired
    private ApiClientProvider apiClientProvider;

    public List<com.sdl.dxa.modules.dd.models.Publication> publicationList() {
//        get {
//            try {
//                return SiteConfiguration.CacheProvider.GetOrAdd($"publications", CacheRegion.Publications, () = >
//                        {
        //client = ApiClientFactory.Instance.CreateClient();
        ApiClient client = apiClientProvider.getClient();
        PublicationConnection publications = client.getPublications(ContentNamespace.Docs, new Pagination(), null,
                CustomMetaFilter, null);
//        null, null);
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

    public void checkPublicationOnline(int publicationId) throws DxaItemNotFoundException {
        ApiClient client = apiClientProvider.getClient();
        boolean isOffline = false;
        try {
            Publication publication = client.getPublication(ContentNamespace.Docs, publicationId, "requiredMeta:" + PublicationOnlineStatusMeta, null);
            isOffline = publication == null || publication.getCustomMetas() == null || !publication.getCustomMetas().getEdges().stream().anyMatch(customMetaEdge -> PublicationOnlineValue.equals(customMetaEdge.getNode().getValue()));
//                    .filter(publicationEdge -> isPublicationOnline(publicationEdge.getNode()))
//                    .map(publicationEdge -> buildPublicationFrom(publicationEdge.getNode()))
//            isOffline = publication.getCustomMetas() == null || publication.getCustomMetas().getEdges().size() == 0 ||
//                    !
        } catch (Exception e) {
            LOG.error("Couldn't find publication metadata for id: " + publicationId, e);
        }
        if (isOffline) {
            throw new DxaItemNotFoundException("Unable to find publication " + publicationId);
        }
    }


    private com.sdl.dxa.modules.dd.models.Publication buildPublicationFrom(Publication publication) {
        com.sdl.dxa.modules.dd.models.Publication result = new com.sdl.dxa.modules.dd.models.Publication();
        result.setId(String.valueOf(publication.getItemId()));
        result.setTitle(publication.getTitle());

        CustomMetaConnection customMeta = publication.getCustomMetas();
        if (customMeta == null) return result;

//        result.setProductFamily(null);
//        result.setProductReleaseVersion(null);

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
//                if (result.ProductFamily == null) result.ProductFamily = new List<String>();
                    result.getProductFamily().add(value);
                    break;
                case PublicationProductreleasenameMeta:
//                if (result.getProductReleaseVersion == null) result.ProductReleaseVersion = new List<String>();
                    result.getProductReleaseVersion().add(value);
                    break;
                case PublicationCratedonMeta:
                    result.setCreatedOn(DateTime.parse(value, dateTimeFormat));
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
