export interface SubjectData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  grade: number;
  icon: string;
  color: string;
  chapters: number;
}

export interface ChapterData {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  order: number;
  locked: boolean;
  tests?: number;
}

export interface QuestionData {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface TestData {
  id: string;
  name: string;
  description: string;
  chapterId: string;
  subjectId: string;
  duration: number;
  totalQuestions: number;
  locked: boolean;
  questions?: QuestionData[];
}

export interface Grade5Data {
  subjects: SubjectData[];
  chapters: { [subjectId: string]: ChapterData[] };
  tests: { [chapterId: string]: TestData[] };
} 