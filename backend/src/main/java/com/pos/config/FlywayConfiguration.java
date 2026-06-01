package com.pos.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import javax.sql.DataSource;

@Configuration
public class FlywayConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .load();
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public ApplicationRunner flywayMigrator(Flyway flyway) {
        return args -> flyway.migrate();
    }
}
