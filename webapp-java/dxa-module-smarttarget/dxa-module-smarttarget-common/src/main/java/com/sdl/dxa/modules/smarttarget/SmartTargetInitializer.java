package com.sdl.dxa.modules.smarttarget;

import com.sdl.dxa.modules.smarttarget.markup.TrackingMarkupDecorator;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetPromotion;
import com.sdl.dxa.modules.smarttarget.model.entity.SmartTargetRegion;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
import com.sdl.webapp.common.markup.MarkupDecoratorRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Configuration
@ComponentScan("com.sdl.dxa.modules.smarttarget")
public class SmartTargetInitializer {

    @Autowired
    private MarkupDecoratorRegistry markupDecoratorRegistry;

    @PostConstruct
    public void init() {
        markupDecoratorRegistry.registerDecorator("Entity", trackingMarkupDecorator());
    }

    @Bean
    public TrackingMarkupDecorator trackingMarkupDecorator() {
        return new TrackingMarkupDecorator();
    }

    @RegisteredViews({
            @RegisteredView(viewName = "SmartTargetRegion", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "2-Column", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "3-Column", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "4-Column", clazz = SmartTargetRegion.class),
            @RegisteredView(viewName = "Promotion", clazz = SmartTargetPromotion.class)
    })
    @ModuleInfo(name = "Smart Target module", areaName = "SmartTarget", description = "Common implementation for 2013SP1 and Web8 ST modules")
    @Component
    public static class SmartTargetViewsInitializer extends AbstractInitializer {
        @Override
        protected String getAreaName() {
            return "SmartTarget";
        }
    }

}