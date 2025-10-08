package io.reflectoring.adminmanager;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DbTestConfig {

    @Bean
    CommandLineRunner testDb(DataSource dataSource) {
        return args -> {
            try (Connection c = dataSource.getConnection()) {
                System.out.println("DB Connection OK. URL: " + c.getMetaData().getURL()
                        + " , User: " + c.getMetaData().getUserName());
            } catch (Exception e) {
                System.err.println("DB connection failed: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}

