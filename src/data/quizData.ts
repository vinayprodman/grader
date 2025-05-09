import { Quiz } from '../contexts/QuizContext';

export const quizData: Quiz[] = [
  {
    id: 'decimals-1',
    title: 'Decimals - Basic Operations',
    description: 'Test your understanding of basic decimal operations including addition, subtraction, multiplication, and division.',
    subject: 'Mathematics',
    grade: 5,
    questions: [
      {
        question: 'What is 0.5 + 0.3?',
        options: {
          A: '0.8',
          B: '0.7',
          C: '0.9',
          D: '0.6'
        },
        answer_key: 0 // A is correct
      },
      {
        question: 'What is 2.7 - 1.4?',
        options: {
          A: '1.1',
          B: '1.2',
          C: '1.3',
          D: '1.4'
        },
        answer_key: 2 // C is correct
      },
      {
        question: 'What is 0.6 × 0.5?',
        options: {
          A: '0.3',
          B: '0.25',
          C: '0.35',
          D: '0.4'
        },
        answer_key: 0 // A is correct
      },
      {
        question: 'What is 1.2 ÷ 0.4?',
        options: {
          A: '2.8',
          B: '3.0',
          C: '3.2',
          D: '3.4'
        },
        answer_key: 1 // B is correct
      },
      {
        question: 'Round 3.14159 to 2 decimal places.',
        options: {
          A: '3.14',
          B: '3.15',
          C: '3.16',
          D: '3.13'
        },
        answer_key: 0 // A is correct
      }
    ]
  },
  {
    id: 'fractions-1',
    title: 'Fractions - Basic Concepts',
    description: 'Test your understanding of basic fraction concepts including equivalent fractions, simplifying, and comparing.',
    subject: 'Mathematics',
    grade: 4,
    questions: [
      {
        question: 'Which fraction is equivalent to 1/2?',
        options: {
          A: '2/4',
          B: '3/6',
          C: '4/8',
          D: 'All of the above'
        },
        answer_key: 3 // D is correct
      },
      {
        question: 'What is the simplified form of 6/9?',
        options: {
          A: '1/3',
          B: '2/3',
          C: '3/4',
          D: '4/5'
        },
        answer_key: 1 // B is correct
      },
      {
        question: 'Which fraction is greater: 3/4 or 2/3?',
        options: {
          A: '3/4',
          B: '2/3',
          C: 'They are equal',
          D: 'Cannot be determined'
        },
        answer_key: 0 // A is correct
      },
      {
        question: 'What is 1/4 + 1/4?',
        options: {
          A: '1/8',
          B: '1/2',
          C: '2/4',
          D: 'Both B and C'
        },
        answer_key: 3 // D is correct
      },
      {
        question: 'Which fraction represents 0.75?',
        options: {
          A: '1/4',
          B: '1/2',
          C: '3/4',
          D: '4/5'
        },
        answer_key: 2 // C is correct
      }
    ]
  }
];