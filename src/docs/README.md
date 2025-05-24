# Quiz Application Configuration Guide

This documentation provides an overview of the key configuration files and their usage in the quiz application.

## Configuration Files

### 1. Authentication (`auth-config.ts`)
- Contains Firebase configuration and initialization
- Defines user profile and data structures
- Handles authentication persistence settings

Usage:
```typescript
import { auth, db, UserProfile } from './auth-config';
```

### 2. Quiz Configuration (`quiz-config.ts`)
- Defines quiz data structures and interfaces
- Contains quiz state management logic
- Includes quiz storage configuration

Usage:
```typescript
import { Quiz, Question, QUIZ_CONFIG } from './quiz-config';
```

### 3. Performance Tracking (`performance-config.ts`)
- Handles performance metrics calculation
- Manages badge system configuration
- Includes progress tracking logic

Usage:
```typescript
import { calculateProgress, BADGE_CONFIG } from './performance-config';
```

## Key Features

### Authentication
- Firebase-based authentication
- User profile management
- Session persistence
- Real-time user data updates

### Quiz System
- Dynamic quiz loading
- Progress tracking
- Time management
- Score calculation
- Quiz state persistence

### Performance Tracking
- Overall progress calculation
- Weekly progress tracking
- Badge system
- Strength/weakness analysis
- Time spent tracking

## Data Structure

### Quiz Data Organization
```
/data/grades/{grade}/{subject}/chapters.json
/data/grades/{grade}/{subject}/chapter1/quizes/quiz1.json
```

### Local Storage
- Quiz state: `quiz_{quizId}_{userId}`
- Auth state: `auth_user`

## Implementation Notes

1. **Quiz State Management**
   - Use `QUIZ_STATE_KEY` for storing quiz progress
   - Implement auto-save functionality
   - Handle quiz resumption

2. **Performance Tracking**
   - Update metrics after each quiz completion
   - Calculate weekly progress
   - Award badges based on performance

3. **Authentication**
   - Handle user session persistence
   - Manage user profile updates
   - Track user activity

## Best Practices

1. Always use the provided interfaces for type safety
2. Follow the established data structure for quizzes
3. Implement proper error handling
4. Use the configuration constants for consistency
5. Maintain proper state management
6. Follow the badge system guidelines

## Migration Notes

When migrating from the old UI:
1. Preserve all existing quiz data
2. Maintain user progress and scores
3. Keep the same authentication flow
4. Ensure backward compatibility
5. Update UI components while keeping core logic 