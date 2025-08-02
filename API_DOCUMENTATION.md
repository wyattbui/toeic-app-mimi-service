# TOEIC Web Service - API Documentation

## Base URL: `http://localhost:3333`

---

## 🔐 Authentication APIs

### 1. Sign Up
**POST** `/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name" // optional
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 User Management APIs

### 3. Get Current User Profile
**GET** `/users/me`
- **Auth Required:** ✅ Bearer Token

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2025-08-03T02:15:48.000Z",
  "updatedAt": "2025-08-03T02:15:48.000Z"
}
```

### 4. Update User Profile
**PATCH** `/users`
- **Auth Required:** ✅ Bearer Token

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com" // optional
}
```

**Response:**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "name": "New Name",
  "updatedAt": "2025-08-03T02:20:00.000Z"
}
```

---

## 📝 Question Management APIs

### 5. Get All Parts
**GET** `/questions/parts`

**Response:**
```json
[
  {
    "id": 1,
    "partNumber": 1,
    "name": "Photographs",
    "description": "Directions: For each question in this part, you will hear four statements about a picture..."
  },
  {
    "id": 2,
    "partNumber": 2,
    "name": "Question-Response",
    "description": "Directions: You will hear a question or statement..."
  }
]
```

### 6. Get Questions by Part
**GET** `/questions/part/:partId?limit=10`

**Parameters:**
- `partId`: Part ID (1-7)
- `limit`: Number of questions (optional)

**Response:**
```json
[
  {
    "id": 1,
    "partId": 1,
    "questionText": "Look at the picture and choose the best description.",
    "questionType": "single",
    "difficulty": "easy",
    "explanation": "The man is sitting at a desk.",
    "audioUrl": "http://localhost:3333/static/audio/question1.mp3",
    "imageUrl": "http://localhost:3333/static/images/question1.jpg",
    "passageText": null,
    "passageTitle": null,
    "part": {
      "id": 1,
      "partNumber": 1,
      "name": "Photographs"
    },
    "options": [
      {
        "id": 1,
        "optionLetter": "A",
        "optionText": "A man is sitting at a desk.",
        "isCorrect": true
      },
      {
        "id": 2,
        "optionLetter": "B",
        "optionText": "A man is standing by the window.",
        "isCorrect": false
      }
    ]
  }
]
```

### 7. Get Random Questions
**GET** `/questions/random?count=20&difficulty=easy`

**Parameters:**
- `count`: Number of questions (default: 20)
- `difficulty`: easy, medium, hard (optional)

**Response:** Same format as Get Questions by Part

### 8. Get Question by ID
**GET** `/questions/:id`

**Response:** Single question object (same format as above)

### 9. Create Question
**POST** `/questions`
- **Auth Required:** ✅ Bearer Token

**Request Body:**
```json
{
  "partId": 1,
  "questionText": "Look at the picture and choose the best description.",
  "questionType": "single",
  "difficulty": "easy",
  "explanation": "The man is sitting at a desk.",
  "audioUrl": "http://localhost:3333/static/audio/question1.mp3",
  "imageUrl": "http://localhost:3333/static/images/question1.jpg",
  "passageText": null,
  "passageTitle": null,
  "options": [
    {
      "optionLetter": "A",
      "optionText": "A man is sitting at a desk.",
      "isCorrect": true
    },
    {
      "optionLetter": "B",
      "optionText": "A man is standing by the window.",
      "isCorrect": false
    }
  ]
}
```

**Response:** Created question object

### 10. Update Question
**PATCH** `/questions/:id`
- **Auth Required:** ✅ Bearer Token

**Request Body:** Same as Create Question (partial update allowed)

**Response:** Updated question object

### 11. Delete Question
**DELETE** `/questions/:id`
- **Auth Required:** ✅ Bearer Token

**Response:**
```json
{
  "message": "Question deleted successfully"
}
```

### 12. Upload Files (Image/Audio)
**POST** `/questions/upload`
- **Auth Required:** ✅ Bearer Token
- **Content-Type:** `multipart/form-data`

**Request Body:**
```
files: [File, File] // Max 2 files
```

**Response:**
```json
{
  "files": [
    {
      "fieldname": "files",
      "filename": "1733123456789-image.jpg",
      "url": "http://localhost:3333/static/images/1733123456789-image.jpg",
      "type": "image"
    },
    {
      "fieldname": "files", 
      "filename": "1733123456790-audio.mp3",
      "url": "http://localhost:3333/static/audio/1733123456790-audio.mp3",
      "type": "audio"
    }
  ]
}
```

### 13. Submit Test (Legacy)
**POST** `/questions/submit-test`
- **Auth Required:** ✅ Bearer Token

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "selectedOption": "A",
      "timeSpent": 30
    }
  ]
}
```

**Response:** Test result with score

### 14. Get User Test Results (Legacy)
**GET** `/questions/user/results`
- **Auth Required:** ✅ Bearer Token

**Response:** Array of user's test results

---

## 📋 Test Set Management APIs

### 15. Generate Test Set
**POST** `/questions/test-sets/generate`
- **Auth Required:** ✅ Bearer Token

**Request Body:**
```json
{
  "partId": 1,
  "title": "Listening Practice Test 1",
  "description": "Practice test for Part 1",
  "questionCount": 10,
  "timeLimit": 300,
  "difficulty": "easy"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "partId": 1,
  "title": "Listening Practice Test 1",
  "description": "Practice test for Part 1",
  "questionCount": 10,
  "timeLimit": 300,
  "difficulty": "easy",
  "status": "generated",
  "totalScore": null,
  "correctAnswers": null,
  "createdAt": "2025-08-03T02:15:00.000Z",
  "startedAt": null,
  "completedAt": null,
  "part": {
    "id": 1,
    "partNumber": 1,
    "name": "Photographs"
  },
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  },
  "questions": [
    {
      "id": 1,
      "testSetId": 1,
      "questionId": 1,
      "orderIndex": 1,
      "question": {
        "id": 1,
        "questionText": "...",
        "options": [...],
        "part": {...}
      }
    }
  ],
  "answers": []
}
```

### 16. Get My Test Sets
**GET** `/questions/test-sets/my`
- **Auth Required:** ✅ Bearer Token

**Response:**
```json
[
  {
    "id": 1,
    "title": "Listening Practice Test 1",
    "status": "generated",
    "totalScore": null,
    "questionCount": 10,
    "createdAt": "2025-08-03T02:15:00.000Z",
    "part": {
      "id": 1,
      "name": "Photographs"
    },
    "_count": {
      "questions": 10,
      "answers": 0
    }
  }
]
```

### 17. Get Abandoned Test Sets
**GET** `/questions/test-sets/abandoned`
- **Auth Required:** ✅ Bearer Token

**Response:** Array of test sets with status "in_progress" but not completed

### 18. Get Test Set by ID
**GET** `/questions/test-sets/:id`
- **Auth Required:** ✅ Bearer Token

**Response:** Complete test set object with questions

### 19. Start Test Set
**POST** `/questions/test-sets/:id/start`
- **Auth Required:** ✅ Bearer Token

**Response:** Updated test set with status "in_progress" and startedAt timestamp

### 20. Submit Test Set
**POST** `/questions/test-sets/submit`
- **Auth Required:** ✅ Bearer Token

**Request Body:**
```json
{
  "testSetId": 1,
  "answers": [
    {
      "questionId": 1,
      "selectedOption": "A",
      "timeSpent": 30
    },
    {
      "questionId": 2,
      "selectedOption": "B",
      "timeSpent": 25
    }
  ]
}
```

**Response:**
```json
{
  "testSet": {
    "id": 1,
    "status": "completed",
    "totalScore": 85.5,
    "correctAnswers": 8,
    "completedAt": "2025-08-03T02:20:00.000Z"
  },
  "results": {
    "totalQuestions": 10,
    "correctAnswers": 8,
    "wrongAnswers": 2,
    "score": 85.5,
    "timeSpent": 280,
    "details": [
      {
        "questionId": 1,
        "isCorrect": true,
        "selectedOption": "A",
        "correctOption": "A",
        "timeSpent": 30
      }
    ]
  }
}
```

### 21. Delete Test Set
**DELETE** `/questions/test-sets/:id`
- **Auth Required:** ✅ Bearer Token

**Response:**
```json
{
  "message": "Test set deleted successfully"
}
```

---

## 📊 Test History & Analytics APIs (User)

### 22. Get My Test History
**GET** `/questions/test-sets/history/my`
- **Auth Required:** ✅ Bearer Token

**Response:**
```json
[
  {
    "id": 1,
    "title": "Listening Practice Test 1",
    "status": "completed",
    "totalScore": 85.5,
    "correctAnswers": 8,
    "questionCount": 10,
    "completedAt": "2025-08-03T02:20:00.000Z",
    "part": {
      "id": 1,
      "name": "Photographs"
    },
    "answers": [
      {
        "questionId": 1,
        "selectedOption": "A",
        "isCorrect": true,
        "timeSpent": 30,
        "question": {
          "id": 1,
          "questionText": "..."
        }
      }
    ]
  }
]
```

### 23. Get My Statistics
**GET** `/questions/test-sets/statistics/my`
- **Auth Required:** ✅ Bearer Token

**Response:**
```json
{
  "completedTests": 5,
  "averageScore": 82.4,
  "bestScore": 95.0,
  "partStatistics": [
    {
      "partId": 1,
      "_count": {
        "id": 3
      },
      "_avg": {
        "totalScore": 85.5
      },
      "_max": {
        "totalScore": 95.0
      },
      "part": {
        "name": "Photographs",
        "partNumber": 1
      }
    }
  ]
}
```

### 24. Review My Test Set
**GET** `/questions/test-sets/:id/review`
- **Auth Required:** ✅ Bearer Token

**Response:**
```json
{
  "id": 1,
  "title": "Listening Practice Test 1",
  "status": "completed",
  "totalScore": 85.5,
  "correctAnswers": 8,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  },
  "part": {
    "id": 1,
    "name": "Photographs"
  },
  "questions": [
    {
      "id": 1,
      "orderIndex": 1,
      "question": {
        "id": 1,
        "questionText": "...",
        "options": [...]
      },
      "userAnswer": {
        "selectedOption": "A",
        "isCorrect": true,
        "timeSpent": 30
      },
      "correctAnswer": "A"
    }
  ]
}
```

---

## 🔧 Admin APIs

### 25. Get All Users Test History
**GET** `/questions/admin/test-sets/all-history`
- **Auth Required:** ✅ Bearer Token (Admin)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Listening Practice Test 1",
    "status": "completed",
    "totalScore": 85.5,
    "completedAt": "2025-08-03T02:20:00.000Z",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name"
    },
    "part": {
      "id": 1,
      "name": "Photographs"
    },
    "_count": {
      "questions": 10,
      "answers": 10
    }
  }
]
```

### 26. Get Specific User Test History
**GET** `/questions/admin/users/:userId/test-history`
- **Auth Required:** ✅ Bearer Token (Admin)

**Response:**
```json
{
  "user": {
    "id": 2,
    "email": "user2@example.com",
    "name": "User 2"
  },
  "testHistory": [
    {
      "id": 1,
      "title": "...",
      "status": "completed",
      // ... complete test set data
    }
  ],
  "statistics": {
    "completedTests": 3,
    "averageScore": 78.5,
    "bestScore": 90.0,
    "partStatistics": [...]
  }
}
```

### 27. Get Specific User Statistics
**GET** `/questions/admin/users/:userId/statistics`
- **Auth Required:** ✅ Bearer Token (Admin)

**Response:** Same format as Get My Statistics

### 28. Admin Review Test Set
**GET** `/questions/admin/test-sets/:id/review`
- **Auth Required:** ✅ Bearer Token (Admin)

**Response:** Same format as Review My Test Set (no user restriction)

---

## 📁 Static File Serving

### File URLs:
- **Images:** `http://localhost:3333/static/images/{filename}`
- **Audio:** `http://localhost:3333/static/audio/{filename}`

---

## 🔒 Authentication Headers

For protected endpoints, include:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## 🎯 Common Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## 📈 Test Set Status Flow

1. **generated** → Test set created, ready to start
2. **in_progress** → User started the test
3. **completed** → User submitted answers
4. **abandoned** → Test started but not completed (timeout/user left)

---

## 🎓 Part Numbers & Names

1. **Part 1**: Photographs
2. **Part 2**: Question-Response  
3. **Part 3**: Conversations
4. **Part 4**: Talks
5. **Part 5**: Incomplete Sentences
6. **Part 6**: Text Completion
7. **Part 7**: Reading Comprehension

---

## 💡 Frontend Implementation Tips

1. **Store JWT token** in localStorage/sessionStorage after login
2. **Handle token expiration** - redirect to login on 401 errors
3. **File upload** - use FormData for multipart uploads
4. **Real-time updates** - Poll test set status during active tests
5. **Error handling** - Display user-friendly messages for API errors
6. **Loading states** - Show spinners during API calls
7. **Pagination** - Implement for large test history lists (if needed)
