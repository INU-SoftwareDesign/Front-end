# 학생 특기사항 (Special Notes) API 명세서

## 개요
이 문서는 학생 특기사항 관리를 위한 API 명세서입니다. 특기사항은 학생의 특기, 흥미, 진로희망, 기타 특기사항을 관리하는 기능입니다.

## 기본 URL
```
http://52.73.19.160:5000
```

## 인증
모든 API 요청은 인증이 필요합니다. 인증 방식은 기존 시스템과 동일합니다.

## API 엔드포인트

### 1. 학생 특기사항 조회

#### 요청
```
GET /specialnotes/{studentId}
```

#### 매개변수
| 이름 | 타입 | 설명 |
|------|------|------|
| studentId | number | 학생 ID |

#### 응답
```json
{
  "success": true,
  "data": [
    {
      "id": 201,
      "studentId": 20250022,
      "grade": 1,
      "classNumber": 3,
      "teacherId": 5,
      "teacherName": "김선생",
      "specialTalent": "컴퓨터게임",
      "careerAspiration": {
        "student": "프로게이머",
        "parent": "소프트웨어 개발자"
      },
      "note": "컴퓨터 관련 활동에 흥미가 많으며 논리적 사고력이 뛰어납니다. 게임을 통해 전략적 사고와 문제 해결 능력을 키우고 있으며, 프로그래밍 동아리 활동에도 적극적으로 참여하고 있습니다.",
      "createdAt": "2025-04-25T16:30:00",
      "updatedAt": "2025-04-25T16:30:00"
    },
    {
      "id": 202,
      "studentId": 20250022,
      "grade": 2,
      "classNumber": 1,
      "teacherId": 8,
      "teacherName": "박선생",
      "specialTalent": "음악감상",
      "careerAspiration": {
        "student": "유치원교사",
        "parent": "초등교사"
      },
      "note": "적극적이고 세심한 성격으로 아이들에 대한 애정을 지니고 있음. 관련 봉사활동도 열심히 참여하고 있음.",
      "createdAt": "2025-05-31T10:30:00",
      "updatedAt": "2025-05-31T10:30:00"
    }
  ]
}
```

### 2. 특기사항 생성

#### 요청
```
POST /specialnotes
```

#### 요청 본문
```json
{
  "studentId": 20250022,
  "grade": 2,
  "classNumber": 1,
  "teacherId": 8,
  "teacherName": "박선생",
  "specialTalent": "음악감상",
  "careerAspiration": {
    "student": "유치원교사",
    "parent": "초등교사"
  },
  "note": "적극적이고 세심한 성격으로 아이들에 대한 애정을 지니고 있음. 관련 봉사활동도 열심히 참여하고 있음."
}
```

#### 응답
```json
{
  "success": true,
  "data": {
    "id": 202,
    "studentId": 20250022,
    "grade": 2,
    "classNumber": 1,
    "teacherId": 8,
    "teacherName": "박선생",
    "specialTalent": "음악감상",
    "careerAspiration": {
      "student": "유치원교사",
      "parent": "초등교사"
    },
    "note": "적극적이고 세심한 성격으로 아이들에 대한 애정을 지니고 있음. 관련 봉사활동도 열심히 참여하고 있음.",
    "createdAt": "2025-05-31T10:30:00",
    "updatedAt": "2025-05-31T10:30:00"
  }
}
```

### 3. 특기사항 수정

#### 요청
```
PATCH /specialnotes/{noteId}
```

#### 매개변수
| 이름 | 타입 | 설명 |
|------|------|------|
| noteId | number | 특기사항 ID |

#### 요청 본문
```json
{
  "specialTalent": "음악감상, 독서",
  "careerAspiration": {
    "student": "유치원교사",
    "parent": "초등교사"
  },
  "note": "적극적이고 세심한 성격으로 아이들에 대한 애정을 지니고 있음. 관련 봉사활동도 열심히 참여하고 있음. 책 읽기를 좋아하며 특히 아동 도서에 관심이 많음."
}
```

#### 응답
```json
{
  "success": true,
  "data": {
    "id": 202,
    "studentId": 20250022,
    "grade": 2,
    "classNumber": 1,
    "teacherId": 8,
    "teacherName": "박선생",
    "specialTalent": "음악감상, 독서",
    "careerAspiration": {
      "student": "유치원교사",
      "parent": "초등교사"
    },
    "note": "적극적이고 세심한 성격으로 아이들에 대한 애정을 지니고 있음. 관련 봉사활동도 열심히 참여하고 있음. 책 읽기를 좋아하며 특히 아동 도서에 관심이 많음.",
    "createdAt": "2025-05-31T10:30:00",
    "updatedAt": "2025-05-31T11:15:00"
  }
}
```

### 4. 특기사항 삭제

#### 요청
```
DELETE /specialnotes/{noteId}
```

#### 매개변수
| 이름 | 타입 | 설명 |
|------|------|------|
| noteId | number | 특기사항 ID |

#### 응답
```json
{
  "success": true,
  "message": "특기사항이 성공적으로 삭제되었습니다."
}
```

## 오류 응답

### 인증 오류
```json
{
  "success": false,
  "error": {
    "code": "AUTH_ERROR",
    "message": "인증에 실패했습니다."
  }
}
```

### 권한 오류
```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "이 작업을 수행할 권한이 없습니다."
  }
}
```

### 리소스 없음
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "요청한 리소스를 찾을 수 없습니다."
  }
}
```

### 서버 오류
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "서버 오류가 발생했습니다."
  }
}
```

## 데이터 모델

### SpecialNote
| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 특기사항 ID |
| studentId | number | 학생 ID |
| grade | number | 학년 |
| classNumber | number | 반 번호 |
| teacherId | number | 교사 ID |
| teacherName | string | 교사 이름 |
| specialTalent | string | 특기 또는 흥미 |
| careerAspiration | object | 진로희망 정보 |
| careerAspiration.student | string | 학생 진로희망 |
| careerAspiration.parent | string | 학부모 진로희망 |
| note | string | 특기사항 내용 |
| createdAt | string | 생성 일시 (ISO 8601 형식) |
| updatedAt | string | 수정 일시 (ISO 8601 형식) |

## 권한 요구사항

1. 특기사항 조회
   - 학생: 자신의 특기사항만 조회 가능
   - 학부모: 자녀의 특기사항만 조회 가능
   - 교사: 담당 학급 학생의 특기사항 조회 가능
   - 관리자: 모든 학생의 특기사항 조회 가능

2. 특기사항 생성/수정/삭제
   - 교사: 담당 학급 학생의 특기사항만 생성/수정/삭제 가능
   - 관리자: 모든 학생의 특기사항 생성/수정/삭제 가능
   - 학생/학부모: 특기사항 생성/수정/삭제 불가
