# Sportlight – System Design Document

## 1. System Overview

Sportlight is designed as a modular, scalable, AI-integrated web platform that enables athletes to upload performance videos and receive AI-assisted evaluations while allowing scouts to discover and shortlist talent efficiently.

The system follows a layered architecture:

- Presentation Layer (Frontend)
- Application Layer (Backend APIs)
- AI/ML Processing Layer
- Data & Storage Layer
- Deployment & Infrastructure Layer

---

## 2. High-Level Architecture

### 2.1 Architectural Flow

Athlete → Frontend Interface → Backend API → AI Processing Service  
                                     ↓  
                               Database & Storage  
                                     ↓  
                               Scout Dashboard  

### 2.2 Component Overview

1. **Frontend (Client Layer)**
   - Athlete dashboard
   - Scout dashboard
   - Video upload interface
   - Performance insights display

2. **Backend (Application Layer)**
   - RESTful APIs
   - Authentication & authorization
   - Profile management
   - Video metadata handling
   - AI service integration

3. **AI/ML Service**
   - Video preprocessing
   - Computer vision models
   - Performance metric generation
   - Scoring and ranking logic

4. **Database & Storage**
   - Structured data storage (users, profiles, metrics)
   - Cloud storage for video files
   - AI output storage linked to athlete profiles

---

## 3. Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Responsive, mobile-first design

### Backend
- Node.js
- Express.js
- REST API architecture

### AI/ML Layer
- Python
- OpenCV
- Deep Learning models for action recognition and motion analysis

### Database & Storage
- MongoDB (NoSQL database)
- Cloud storage for media files

### Deployment
- Cloud-based deployment (Frontend + Backend services)
- Scalable infrastructure for handling media uploads

---

## 4. Detailed Design

## 4.1 User Authentication & Authorization

- JWT-based authentication
- Role-based access control:
  - Athlete
  - Scout
  - Admin
- Secure password hashing
- Protected API endpoints

---

## 4.2 Video Upload & Processing Pipeline

1. Athlete uploads performance video.
2. Video is stored in cloud storage.
3. Metadata is saved in the database.
4. Backend triggers AI processing service.
5. AI service:
   - Extracts frames
   - Performs motion detection
   - Identifies key performance indicators
6. Performance metrics are generated.
7. Results are stored and linked to athlete profile.
8. Dashboard displays structured insights.

---

## 4.3 AI Model Design

### Input
- Uploaded sports performance video

### Processing Steps
- Frame extraction
- Noise reduction and normalization
- Pose/motion detection
- Skill-specific metric calculation

### Output
- Performance score
- Skill-specific metrics (e.g., speed, accuracy, consistency)
- Ranking indicators

The AI acts as an assistive evaluation system to support scouts and coaches, not replace them.

---

## 4.4 Data Flow

1. User registers → Data stored in database.
2. Athlete uploads video → Stored in cloud storage.
3. AI service processes video → Outputs metrics.
4. Backend associates metrics with profile.
5. Scout accesses dashboard → Filters and views athletes.

---

## 5. Scalability Considerations

- Decoupled AI service for independent scaling.
- Cloud storage for efficient media handling.
- Modular backend architecture for adding new sports.
- Database indexing for efficient filtering and search.
- Designed to support large-scale onboarding across Bharat.

---

## 6. Security Considerations

- Encrypted communication (HTTPS)
- Role-based access control
- Secure file upload validation
- Protection against unauthorized data access
- Input validation and API rate limiting

---

## 7. Performance Optimization

- Asynchronous video processing
- Caching frequently accessed data
- Pagination for athlete listings
- Optimized database queries

---

## 8. Future Enhancements

- Multilingual interface (Indian regional languages)
- Mobile application version
- AI-driven personalized training suggestions
- Integration with government sports initiatives
- Real-time analytics dashboard for scouts

---

## 9. Conclusion

The system design of Sportlight ensures scalability, security, and AI-driven intelligence while remaining accessible to grassroots athletes across India. By combining modern web technologies with computer vision models, the platform creates a structured, transparent, and merit-based sports discovery ecosystem aligned with the goals of AI for Bharat.
