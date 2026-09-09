# -*- coding: utf-8 -*-
import os

BASE_DIR = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\backend"
SRC_JAVA = os.path.join(BASE_DIR, "src", "main", "java", "com", "sih26102", "sentinel")
SRC_RES = os.path.join(BASE_DIR, "src", "main", "resources")

# 1. pom.xml
pom_xml = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.3</version>
        <relativePath/>
    </parent>
    <groupId>com.sih26102</groupId>
    <artifactId>mplads-sentinel</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>mplads-sentinel</name>
    <description>MPLADS Sentinel - Intelligent Project Monitoring &amp; Risk Prioritization Platform</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
"""

with open(os.path.join(BASE_DIR, "pom.xml"), "w", encoding="utf-8") as f:
    f.write(pom_xml)

# 2. application.yml
app_yml = """server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: mplads-sentinel
  datasource:
    url: jdbc:h2:mem:mplads_db;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE
    driverClassName: org.h2.Driver
    username: sa
    password: 
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: none
    show-sql: false
    defer-datasource-initialization: true
  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
      data-locations: classpath:data.sql
  h2:
    console:
      enabled: true
      path: /h2-console
      settings:
        web-allow-others: true

sentinel:
  jwt:
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    expiration-ms: 86400000
  ml-service:
    url: http://localhost:8082
"""

with open(os.path.join(SRC_RES, "application.yml"), "w", encoding="utf-8") as f:
    f.write(app_yml)

# 3. SentinelApplication.java
main_app = """package com.sih26102.sentinel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SentinelApplication {
    public static void main(String[] args) {
        SpringApplication.run(SentinelApplication.class, args);
    }
}
"""

with open(os.path.join(SRC_JAVA, "SentinelApplication.java"), "w", encoding="utf-8") as f:
    f.write(main_app)

print("POM, application.yml, and Main Application written.")
