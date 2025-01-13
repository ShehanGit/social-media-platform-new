# Social Media Platform
A comprehensive full-stack social media application built with Spring Boot, React (Vite), and MySQL. This project implements core social media features including authentication, post management, user relationships, and media handling.


## Features

### Authentication & Security

JWT-based authentication with Spring Security
User registration and login functionality
Token-based session management
Protected routes and API endpoints


### Post Management

Create, read, update, and delete posts
Support for text and media content
Image upload functionality
Post listing with multiple sort options:

Sort by creation time
Sort by number of likes



### Social Interactions

Like/unlike posts
Comment on posts
Follow/unfollow users
View followers and following lists
User relationship management:

Mute users
Block users
Close friends feature



### Profile Management

View and edit user profiles
Upload profile pictures
Update personal information
View user statistics
Manage account settings

## Tech Stack
### Frontend Technologies

React 18.3.1 with Vite 6.0.5
TypeScript support 
TailwindCSS 3.4.17 for styling
React Query 3.39.3 for state management
React Router DOM 7.1.1 for routing
Axios for API requests
React Hook Form 7.54.2 for form management
HeadlessUI/React 2.2.0 for accessible components
HeroIcons for icons
React Hot Toast for notifications
Date-fns for date formatting

### Backend Technologies

Spring Boot 3
Spring Security with JWT
Spring Data JPA
MySQL 8 Database
Project Lombok
Maven for dependency management



## Setup Instructions
### Prerequisites

Node.js (v18 or later)
Java JDK 17 or later
MySQL 8.0
Maven
Docker (optional)

### Database Setup
sqlCopyCREATE DATABASE social_media_platform;

### Backend Configuration (application.yml)
yamlCopyspring:
  application:
    name: social-media-platform

  datasource:
    url: jdbc:mysql://localhost:3306/social_media_platform?useSSL=false
    username: your_username
    password: your_password

  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
    show-sql: true
    
##Running the Application

### Backend:
```bash
Copycd social-media-backend
mvn spring-boot:run
```

### Frontend:

```bash
cd social-media-frontend
npm install
npm run dev
```

### License
This project is licensed under the MIT License.
