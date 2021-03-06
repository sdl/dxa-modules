<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.core.model.entity.ContentList" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<div class="${entity.htmlClasses}" ${markup.entity(entity)}>
    <c:if test="${not empty entity.headline}">
        <h3 ${markup.property(entity, "headline")}>${entity.headline}</h3>
    </c:if>
    <ul class='popup-image-gallery list-gallery'>
        <c:forEach var="item" items="${entity.itemListElements}" varStatus="status">
            <li ${markup.property(entity, "itemListElements", status.index)}>
                <a href="${item.media.url}" title="${item.headline}">
                    <dxa:media media="${item.media}" widthFactor="172" aspect="1.0"/>
                </a>
            </li>
        </c:forEach>
    </ul>
</div>
