﻿using Newtonsoft.Json.Linq;
using Sdl.Web.Common.Models;
using Sdl.Web.Delivery.DiscoveryService;
using Sdl.Web.GraphQLClient;
using Sdl.Web.HttpClient.Auth;
using Sdl.Web.HttpClient.Request;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.PublicContentApi;
using Sdl.Web.PublicContentApi.ContentModel;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Sdl.Web.Modules.TridionDocsMashup.Client
{
    public class PublicContentApiClient
    {
        private IPublicContentApi _publicContentApi;

        public PublicContentApiClient()
        {
            //todo : should be removed , as PCA client itself will read it from the DiscoveryService
            string graphQLEndpoint = "http://localhost:8081/udp/content";

            //todo : should be removed , as  PCA client will be provided and initialized by DXA , like SiteConfiguration.PublicContentApi;
            IGraphQLClient graphQLClient = new GraphQLClient.GraphQLClient(graphQLEndpoint , new OAuth());

            _publicContentApi = new PublicContentApi.PublicContentApi(graphQLClient);
        }

        public List<DocsContent> GetDocsContentByKeywords(Dictionary<string, KeywordModel> keywords)
        {
            ItemConnection item = GetDocsItem(keywords);
            List<DocsContent> docsContent = ExtractDocsContent(item);
            return docsContent;
        }

        private ItemConnection GetDocsItem(Dictionary<string, KeywordModel> keywords)
        {
            var customMetaFilters = new List<InputItemFilter>();

            foreach (var keyword in keywords)
            {
                var keywordFilter = new InputItemFilter
                {
                    CustomMeta = new InputCustomMetaCriteria
                    {
                        Key = $"{keyword.Key}.version.element",
                        Value = keyword.Value.Id,
                        Scope = CriteriaScope.Publication
                    }
                };

                customMetaFilters.Add(keywordFilter);
            }

            var languageFilter = new InputItemFilter
            {
                CustomMeta = new InputCustomMetaCriteria
                {
                    Key = "DOC-LANGUAGE.lng.value",
                    Value = WebRequestContext.Localization.CultureInfo.Name,
                    Scope = CriteriaScope.ItemInPublication
                }
            };

            customMetaFilters.Add(languageFilter);

            InputItemFilter itemFilter = new InputItemFilter
            {
                NamespaceIds = new List<ContentNamespace> { ContentNamespace.Docs },
                ItemTypes = new List<PublicContentApi.ContentModel.ItemType> { PublicContentApi.ContentModel.ItemType.PAGE },
                And = customMetaFilters
            };

            ItemConnection item = _publicContentApi.ExecuteItemQuery(itemFilter, new Pagination { First = 5 }, null, null, true);

            return item;
        }

        private List<DocsContent> ExtractDocsContent(ItemConnection itemConnection)
        {
            if (itemConnection?.Edges == null)
            {
                return null;
            }

            var docContents = new List<DocsContent>();

            foreach (var item in itemConnection.Edges)
            {
                Page page = item.Node as Page;

                if (page != null)
                {
                    var docsContent = new DocsContent() { Link = page.Url, Title = page.Title };

                    if (page.ContainerItems != null)
                    {
                        foreach (ComponentPresentation componentPresentation in page.ContainerItems)
                        {
                            var component = componentPresentation?.RawContent?.Data["Component"] as JObject;
                            if (component != null)
                            {
                                var fields = component["Fields"] as JObject;
                                if (fields != null)
                                {
                                    var sb = new StringBuilder();

                                    foreach (var body in fields["topicBody"]["Values"])
                                    {
                                        sb.AppendLine(body.ToString());
                                    }

                                    docsContent.Content = sb.ToString();
                                }
                            }
                        }
                    }

                    docContents.Add(docsContent);
                }
            }

            return docContents;
        }
    }

    public class DocsContent
    {
        public string Title { get; set; }
        public string Link { get; set; }
        public string Content { get; set; }
    }

    //todo : should be removed , as DXA will provide a fully authenticated initialized PCA client 
    public class OAuth : IAuthentication
    {
        public NetworkCredential GetCredential(Uri uri, string authType)
        {
            return null;
        }

        public void ApplyManualAuthentication(IHttpClientRequest request)
        {
            request.Headers.Add(DiscoveryServiceProvider.DefaultTokenProvider.AuthRequestHeaderName, DiscoveryServiceProvider.DefaultTokenProvider.AuthRequestHeaderValue);
        }
    }

}
