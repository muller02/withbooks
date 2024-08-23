# Withbooks

![image](https://github.com/user-attachments/assets/219dca7e-b7fe-4992-87f5-0243f77a1c1d)


# [1] About the Project
- http://withbooks.kr/
- 책을 좋아하는 모든 독자들에게 책 정보 및 구매루트를 제공하고, 책에 대한 생각과 감상을 공유할 수 있는 커뮤니티 사이트입니다.
- 좋아하는 책을 저장하고 관심 있는 장르를 통한 온라인 동아리 활동을 제공합니다.

## Features
- 다양한 **책 정보**를 확인할 수 있고 간단한 **커뮤니티**를 즐길 수 있습니다.

## Technologies
***언어, 프레임워크, 주요 라이브러리**를 **버전**과 함께 나열하세요.*

- Maven 4.0.0
- MySQL 8.0
- Spring Boot 3.2.4



# [2] Getting Started

## Installation


1. Repository 클론 <br/>
   Maven 환경 변수 설정 필요 : [Maven](https://maven.apache.org/download.cgi)
```
git clone https://github.com/muller02/withbooks.git
cd withbooks
mvn spring-boot:run
```

## Configuration
- `src/main/resources/application-dev.yml`에 datasource, aladdin-key 입력
```
spring: 
  datasource:
    driver-class-name: org.mariadb.jdbc.Driver
    url: < MySQL URL >
    username: < user >
    password: < password >

aladdin-key:
  value: < aladdin ttb-key >
```
