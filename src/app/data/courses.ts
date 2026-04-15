export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  quiz: Question[];
  points: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: Lesson[];
  totalPoints: number;
  icon: string;
}

export const courses: Course[] = [
  {
    id: "web-dev",
    title: "Web Development Fundamentals",
    description: "Master the basics of HTML, CSS, and JavaScript",
    category: "Programming",
    difficulty: "Beginner",
    icon: "Code",
    totalPoints: 300,
    lessons: [
      {
        id: "html-basics",
        title: "HTML Basics",
        description: "Learn the foundation of web pages",
        content: `
# HTML Basics

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the structure and content of websites.

## Key Concepts:
- **Elements**: Building blocks of HTML (e.g., <div>, <p>, <h1>)
- **Tags**: Markers that define elements (opening and closing tags)
- **Attributes**: Additional information about elements (e.g., class, id)

## Common HTML Elements:
- Headings: h1 through h6
- Paragraphs: p
- Links: a
- Images: img
- Lists: ul, ol, li

HTML forms the skeleton of every website you visit!
        `,
        points: 100,
        quiz: [
          {
            id: "q1",
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "High Tech Modern Language",
              "Home Tool Markup Language",
              "Hyperlinks and Text Markup Language"
            ],
            correctAnswer: 0,
            points: 25
          },
          {
            id: "q2",
            question: "Which tag is used for the largest heading?",
            options: ["<h6>", "<heading>", "<h1>", "<head>"],
            correctAnswer: 2,
            points: 25
          },
          {
            id: "q3",
            question: "Which attribute is used to provide a unique identifier?",
            options: ["class", "id", "name", "unique"],
            correctAnswer: 1,
            points: 25
          },
          {
            id: "q4",
            question: "What is the correct HTML for creating a hyperlink?",
            options: [
              "<a url='url'>text</a>",
              "<a href='url'>text</a>",
              "<link>url</link>",
              "<hyperlink>url</hyperlink>"
            ],
            correctAnswer: 1,
            points: 25
          }
        ]
      },
      {
        id: "css-styling",
        title: "CSS Styling",
        description: "Style your web pages beautifully",
        content: `
# CSS Styling

CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and positioning.

## Key Concepts:
- **Selectors**: Target HTML elements to style
- **Properties**: What aspect to style (color, font-size, margin)
- **Values**: How to style it (red, 16px, 10px)

## CSS Syntax:
\`\`\`css
selector {
  property: value;
}
\`\`\`

## Common Properties:
- color: Text color
- background-color: Background color
- font-size: Size of text
- margin: Space outside element
- padding: Space inside element

CSS transforms plain HTML into beautiful, engaging designs!
        `,
        points: 100,
        quiz: [
          {
            id: "q1",
            question: "What does CSS stand for?",
            options: [
              "Creative Style Sheets",
              "Cascading Style Sheets",
              "Computer Style Sheets",
              "Colorful Style Sheets"
            ],
            correctAnswer: 1,
            points: 25
          },
          {
            id: "q2",
            question: "Which property is used to change text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            correctAnswer: 2,
            points: 25
          },
          {
            id: "q3",
            question: "How do you select an element with id 'header'?",
            options: ["#header", ".header", "header", "*header"],
            correctAnswer: 0,
            points: 25
          },
          {
            id: "q4",
            question: "Which property controls spacing outside an element?",
            options: ["padding", "spacing", "margin", "border"],
            correctAnswer: 2,
            points: 25
          }
        ]
      },
      {
        id: "js-intro",
        title: "JavaScript Introduction",
        description: "Add interactivity to your websites",
        content: `
# JavaScript Introduction

JavaScript is a programming language that adds interactivity and dynamic behavior to web pages.

## Key Concepts:
- **Variables**: Store data (let, const, var)
- **Functions**: Reusable blocks of code
- **Events**: Respond to user actions (clicks, typing)
- **DOM Manipulation**: Change HTML and CSS dynamically

## Basic JavaScript:
\`\`\`javascript
// Variables
let name = "Student";
const age = 25;

// Functions
function greet() {
  console.log("Hello, " + name);
}

// Events
button.addEventListener('click', greet);
\`\`\`

JavaScript brings websites to life with animations, form validation, and interactive experiences!
        `,
        points: 100,
        quiz: [
          {
            id: "q1",
            question: "Which keyword declares a variable that cannot be reassigned?",
            options: ["var", "let", "const", "static"],
            correctAnswer: 2,
            points: 25
          },
          {
            id: "q2",
            question: "What is the correct syntax for a function?",
            options: [
              "function = myFunction()",
              "function myFunction()",
              "def myFunction()",
              "function:myFunction()"
            ],
            correctAnswer: 1,
            points: 25
          },
          {
            id: "q3",
            question: "How do you write 'Hello World' in the console?",
            options: [
              "print('Hello World')",
              "console.log('Hello World')",
              "echo('Hello World')",
              "log('Hello World')"
            ],
            correctAnswer: 1,
            points: 25
          },
          {
            id: "q4",
            question: "Which method adds an event listener?",
            options: [
              "attachEvent()",
              "addEventListener()",
              "addListener()",
              "onEvent()"
            ],
            correctAnswer: 1,
            points: 25
          }
        ]
      }
    ]
  },
  {
    id: "data-science",
    title: "Data Science Basics",
    description: "Introduction to data analysis and visualization",
    category: "Data",
    difficulty: "Intermediate",
    icon: "BarChart",
    totalPoints: 200,
    lessons: [
      {
        id: "intro-data",
        title: "Introduction to Data",
        description: "Understanding data types and structures",
        content: `
# Introduction to Data

Data is information collected and organized for analysis. Understanding data is crucial for making informed decisions.

## Types of Data:
- **Quantitative**: Numerical data (age, salary, temperature)
- **Qualitative**: Categorical data (colors, names, categories)

## Data Structures:
- **Arrays**: Ordered lists of values
- **Tables**: Rows and columns (like spreadsheets)
- **Dictionaries**: Key-value pairs

## Why Data Matters:
Data helps us understand patterns, make predictions, and solve real-world problems!
        `,
        points: 100,
        quiz: [
          {
            id: "q1",
            question: "Which is an example of quantitative data?",
            options: ["Color", "Temperature", "Name", "Category"],
            correctAnswer: 1,
            points: 50
          },
          {
            id: "q2",
            question: "What is a table structure also called?",
            options: ["Array", "List", "DataFrame", "String"],
            correctAnswer: 2,
            points: 50
          }
        ]
      },
      {
        id: "visualization",
        title: "Data Visualization",
        description: "Creating charts and graphs",
        content: `
# Data Visualization

Data visualization transforms numbers into visual stories through charts, graphs, and infographics.

## Common Visualizations:
- **Bar Charts**: Compare categories
- **Line Graphs**: Show trends over time
- **Pie Charts**: Show proportions
- **Scatter Plots**: Show relationships

## Why Visualize?
- Makes complex data easier to understand
- Reveals patterns and insights
- Communicates findings effectively

A picture is worth a thousand data points!
        `,
        points: 100,
        quiz: [
          {
            id: "q1",
            question: "Which chart is best for showing trends over time?",
            options: ["Pie chart", "Line graph", "Bar chart", "Scatter plot"],
            correctAnswer: 1,
            points: 50
          },
          {
            id: "q2",
            question: "What shows relationships between two variables?",
            options: ["Pie chart", "Bar chart", "Scatter plot", "Line graph"],
            correctAnswer: 2,
            points: 50
          }
        ]
      }
    ]
  },
  {
    id: "design",
    title: "UI/UX Design Principles",
    description: "Create beautiful and user-friendly interfaces",
    category: "Design",
    difficulty: "Beginner",
    icon: "Palette",
    totalPoints: 200,
    lessons: [
      {
        id: "design-basics",
        title: "Design Fundamentals",
        description: "Core principles of good design",
        content: `
# Design Fundamentals

Good design is both beautiful and functional. It guides users intuitively while creating delightful experiences.

## Key Principles:
- **Contrast**: Make important elements stand out
- **Alignment**: Create visual order
- **Hierarchy**: Guide attention to what matters
- **Consistency**: Maintain patterns throughout

## Color Theory:
- Primary colors: Red, Blue, Yellow
- Complementary colors create contrast
- Color evokes emotion and meaning

## Typography:
- Choose readable fonts
- Establish hierarchy with size and weight
- Limit to 2-3 font families

Design is not just what it looks like—it's how it works!
        `,
        points: 100,
        quiz: [
          {
            id: "q1",
            question: "What principle makes important elements stand out?",
            options: ["Alignment", "Contrast", "Proximity", "Balance"],
            correctAnswer: 1,
            points: 50
          },
          {
            id: "q2",
            question: "How many font families should you typically use?",
            options: ["1", "2-3", "5-6", "As many as possible"],
            correctAnswer: 1,
            points: 50
          }
        ]
      },
      {
        id: "ux-principles",
        title: "UX Principles",
        description: "Design for user experience",
        content: `
# UX Principles

UX (User Experience) design focuses on creating products that provide meaningful experiences to users.

## Core UX Principles:
- **User-Centered**: Design for your users' needs
- **Accessibility**: Make it usable for everyone
- **Feedback**: Provide clear responses to actions
- **Simplicity**: Don't make users think

## UX Process:
1. Research users and their needs
2. Create user flows and wireframes
3. Design and prototype
4. Test with real users
5. Iterate based on feedback

## Key Questions:
- Who are your users?
- What are they trying to accomplish?
- How can you make it easier?

Great UX is invisible—users don't notice it, they just enjoy using your product!
        `,
        points: 100,
        quiz: [
          {
            id: "q1",
            question: "What does UX stand for?",
            options: [
              "User Extension",
              "User Experience",
              "Universal Export",
              "Unique Experience"
            ],
            correctAnswer: 1,
            points: 50
          },
          {
            id: "q2",
            question: "Which is NOT a core UX principle?",
            options: [
              "User-Centered",
              "Accessibility",
              "Complexity",
              "Feedback"
            ],
            correctAnswer: 2,
            points: 50
          }
        ]
      }
    ]
  }
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: "points" | "lessons" | "streak" | "perfect";
}

export const achievements: Achievement[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "Star",
    requirement: 1,
    type: "lessons"
  },
  {
    id: "knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Complete 5 lessons",
    icon: "BookOpen",
    requirement: 5,
    type: "lessons"
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Complete 10 lessons",
    icon: "GraduationCap",
    requirement: 10,
    type: "lessons"
  },
  {
    id: "century-club",
    title: "Century Club",
    description: "Earn 100 points",
    icon: "Trophy",
    requirement: 100,
    type: "points"
  },
  {
    id: "point-master",
    title: "Point Master",
    description: "Earn 500 points",
    icon: "Award",
    requirement: 500,
    type: "points"
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Get 100% on a quiz",
    icon: "Target",
    requirement: 1,
    type: "perfect"
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "7-day learning streak",
    icon: "Flame",
    requirement: 7,
    type: "streak"
  }
];
