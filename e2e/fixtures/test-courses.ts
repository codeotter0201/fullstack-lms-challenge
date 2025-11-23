export interface TestCourse {
  id: number;
  name: string;
  slug: string;
  isFree: boolean;
  price: number;
  description?: string;
  lessons?: TestLesson[];
}

export interface TestLesson {
  id: number;
  courseId: number;
  title: string;
  videoUrl: string;
  duration: number; // in seconds
  xpReward: number;
  order: number;
}

export const testCourses: TestCourse[] = [
  {
    id: 1,
    name: 'Software Design Patterns',
    slug: 'software-design-pattern',
    isFree: false,
    price: 2990,
    description: 'Learn essential design patterns for better software architecture',
  },
  {
    id: 2,
    name: 'Introduction to Programming',
    slug: 'intro-to-programming',
    isFree: true,
    price: 0,
    description: 'Free introduction course for beginners',
  },
  {
    id: 3,
    name: 'Advanced Spring Boot',
    slug: 'advanced-spring-boot',
    isFree: false,
    price: 3990,
    description: 'Master Spring Boot framework and build production-ready applications',
  },
];

export const testLessons: TestLesson[] = [
  {
    id: 1,
    courseId: 1,
    title: 'Introduction to Design Patterns',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 600, // 10 minutes
    xpReward: 200,
    order: 1,
  },
  {
    id: 2,
    courseId: 1,
    title: 'Factory Pattern Deep Dive',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 900, // 15 minutes
    xpReward: 200,
    order: 2,
  },
  {
    id: 3,
    courseId: 2,
    title: 'Getting Started with Programming',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 480, // 8 minutes
    xpReward: 200,
    order: 1,
  },
];

export function getCourseById(id: number): TestCourse | undefined {
  return testCourses.find((course) => course.id === id);
}

export function getLessonById(id: number): TestLesson | undefined {
  return testLessons.find((lesson) => lesson.id === id);
}

export function getLessonsByCourseId(courseId: number): TestLesson[] {
  return testLessons.filter((lesson) => lesson.courseId === courseId);
}

export function getPaidCourse(index: number = 0): TestCourse {
  const paidCourses = testCourses.filter((course) => !course.isFree);
  if (index >= paidCourses.length) {
    throw new Error(`Paid course at index ${index} not found. Only ${paidCourses.length} paid courses available.`);
  }
  return paidCourses[index];
}

export function getFreeCourse(index: number = 0): TestCourse {
  const freeCourses = testCourses.filter((course) => course.isFree);
  if (index >= freeCourses.length) {
    throw new Error(`Free course at index ${index} not found. Only ${freeCourses.length} free courses available.`);
  }
  return freeCourses[index];
}
