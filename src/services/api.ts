// Mock API service to simulate the backend logic described in the diagram

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  classId: string;
  optedTestSeriesIds: string[];
}

export interface TestSeries {
  id: string;
  name: string;
  type: 'boards' | 'jee_main' | 'jee_advanced';
  classId: string;
  description: string;
  price: number;
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  question_text: string;
  max_marks: number;
}

export interface Test {
  id: string;
  testSeriesId: string;
  name: string;
  duration_minutes: number;
  subjects: string[];
  status: 'available' | 'in_progress' | 'evaluating' | 'completed';
  questions: Question[];
}

export interface Submission {
  question_id: string;
  image_s3_url: string;
  is_evaluated_by_ai: boolean;
  ai_evaluation: any;
  marks_awarded: number;
  status: string;
}

const MOCK_TEST_SERIES: TestSeries[] = [
  { id: 'ts-1', name: 'Class 11 Boards Test Series', type: 'boards', classId: '11', description: 'Subject-wise tests for Class 11 Boards', price: 499 },
  { id: 'ts-2', name: 'Class 11 JEE Main Test Series', type: 'jee_main', classId: '11', description: 'Full syllabus and part tests for JEE Main', price: 999 },
  { id: 'ts-3', name: 'Class 11 JEE Advanced Test Series', type: 'jee_advanced', classId: '11', description: 'Tough, multi-concept problems for JEE Advanced', price: 1499 },
  { id: 'ts-4', name: 'Class 12 Boards Test Series', type: 'boards', classId: '12', description: 'Subject-wise tests for Class 12 Boards', price: 499 },
  { id: 'ts-5', name: 'Class 12 JEE Main Test Series', type: 'jee_main', classId: '12', description: 'Full syllabus and part tests for JEE Main', price: 999 },
];

const MOCK_QUESTIONS: Question[] = [
  { id: 'q1', subject: 'Mathematics', topic: 'Quadratic Equations', question_text: 'Solve for x: 2x^2 + 4x - 8 = 0', max_marks: 5 },
  { id: 'q2', subject: 'Mathematics', topic: 'Calculus', question_text: 'Find the derivative of f(x) = 3x^3 - 2x + 1', max_marks: 5 },
  { id: 'q3', subject: 'Physics', topic: 'Kinematics', question_text: 'A car accelerates uniformly from rest to a speed of 20 m/s in 10 seconds. Find the distance covered.', max_marks: 5 },
  { id: 'q4', subject: 'Physics', topic: 'Laws of Motion', question_text: 'Calculate the force required to accelerate a 5kg mass at 2 m/s^2.', max_marks: 5 },
  { id: 'q5', subject: 'Chemistry', topic: 'Atomic Structure', question_text: 'Calculate the energy of a photon with wavelength 400 nm.', max_marks: 5 },
];

const MOCK_TESTS: Test[] = [
  { id: 't-1', testSeriesId: 'ts-2', name: 'JEE Main Part Test 1', duration_minutes: 180, subjects: ['Physics', 'Chemistry', 'Mathematics'], status: 'available', questions: MOCK_QUESTIONS },
  { id: 't-2', testSeriesId: 'ts-2', name: 'JEE Main Part Test 2', duration_minutes: 180, subjects: ['Physics', 'Chemistry', 'Mathematics'], status: 'available', questions: MOCK_QUESTIONS },
  { id: 't-3', testSeriesId: 'ts-1', name: 'Physics Board Pattern Test', duration_minutes: 180, subjects: ['Physics'], status: 'available', questions: [MOCK_QUESTIONS[2], MOCK_QUESTIONS[3]] },
];

export const api = {
  // Phase 1: Onboarding & Authentication
  login: async (email: string, phone: string, classId: string, optedTestSeriesIds: string[]): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: 'user-123', name: 'Student', email, phone, classId, optedTestSeriesIds });
      }, 800);
    });
  },

  getTestSeries: async (classId: string): Promise<TestSeries[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_TEST_SERIES.filter(ts => ts.classId === classId));
      }, 500);
    });
  },

  purchaseTestSeries: async (userId: string, testSeriesId: string): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  },

  getTestsForSeries: async (testSeriesId: string): Promise<Test[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return mock tests, or generate some if none match exactly to keep the MVP working
        const tests = MOCK_TESTS.filter(t => t.testSeriesId === testSeriesId);
        if (tests.length > 0) {
          resolve(tests);
        } else {
          // Generate dummy tests for the series
          resolve([
            { id: `t-gen-1-${testSeriesId}`, testSeriesId, name: 'Practice Test 1', duration_minutes: 60, subjects: ['Physics', 'Chemistry', 'Mathematics'], status: 'available', questions: MOCK_QUESTIONS },
            { id: `t-gen-2-${testSeriesId}`, testSeriesId, name: 'Practice Test 2', duration_minutes: 60, subjects: ['Physics', 'Chemistry', 'Mathematics'], status: 'available', questions: MOCK_QUESTIONS }
          ]);
        }
      }, 500);
    });
  },

  getTestDetails: async (testId: string): Promise<Test> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const test = MOCK_TESTS.find(t => t.id === testId);
        if (test) resolve(test);
        else resolve({ id: testId, testSeriesId: 'ts-x', name: 'Practice Test', duration_minutes: 60, subjects: ['Physics', 'Chemistry', 'Mathematics'], status: 'available', questions: MOCK_QUESTIONS });
      }, 500);
    });
  },

  // Phase 3 & 4: Submission & Instant Scoring
  submitTest: async (testId: string, submissions: Partial<Submission>[]): Promise<{ score: number, total: number, results: any[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock AI scoring logic based on uploaded images
        const results = submissions.map((sub, index) => {
          // Simulate AI evaluation of the image
          const hasImage = !!sub.image_s3_url;
          const isCorrect = hasImage && index % 2 === 0; // Randomly assign correct if image exists
          const marks = isCorrect ? 5 : (hasImage ? 2 : 0); // Partial marks if image exists but incorrect
          return {
            ...sub,
            marks_awarded: marks,
            status: 'completed',
            isCorrect,
            ai_evaluation: hasImage ? {
               feedback: isCorrect ? "Perfectly solved!" : "You made a calculation error in step 3.",
               extracted_text: "Simulated extracted text from image..."
            } : { feedback: "No answer uploaded.", extracted_text: "" }
          };
        });
        const score = results.reduce((acc, curr) => acc + curr.marks_awarded, 0);
        resolve({ score, total: submissions.length * 5, results });
      }, 1500); // Slightly longer to simulate AI processing of all images
    });
  },

  // Phase 5: Self-Review (Fetch Official Solution)
  getOfficialSolution: async (questionId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          steps: [
            "Step 1: Divide the entire equation by 2 to simplify: x^2 + 2x - 4 = 0",
            "Step 2: Use the quadratic formula: x = [-b ± √(b^2 - 4ac)] / 2a",
            "Step 3: Plug in a=1, b=2, c=-4: x = [-2 ± √(4 - 4(1)(-4))] / 2",
            "Step 4: Simplify the discriminant: x = [-2 ± √(4 + 16)] / 2 = [-2 ± √20] / 2",
            "Step 5: Simplify the radical: x = [-2 ± 2√5] / 2",
            "Step 6: Final answer: x = -1 ± √5"
          ]
        });
      }, 600);
    });
  },

  // Instant Doubt Feature
  instantDoubt: async (imageUrl: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate Cache Miss -> Gemini Processing
        resolve({
          question_text: "Solve for x: 2x^2 + 4x - 8 = 0",
          official_solution: {
            steps: [
              "Step 1: Divide the entire equation by 2 to simplify: x^2 + 2x - 4 = 0",
              "Step 2: Use the quadratic formula: x = [-b ± √(b^2 - 4ac)] / 2a",
              "Step 3: Plug in a=1, b=2, c=-4: x = [-2 ± √(4 - 4(1)(-4))] / 2",
              "Step 4: Simplify the discriminant: x = [-2 ± √(4 + 16)] / 2 = [-2 ± √20] / 2",
              "Step 5: Simplify the radical: x = [-2 ± 2√5] / 2",
              "Step 6: Final answer: x = -1 ± √5"
            ]
          }
        });
      }, 2500);
    });
  }
};

