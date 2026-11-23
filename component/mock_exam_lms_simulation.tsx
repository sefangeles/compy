"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

type ExamState = "attempt" | "confirm" | "review";
type QuestionType = "short" | "code" | "mcq" | "tf";

interface SubQuestion {
  qId: string;
  type: QuestionType;
  points: number;
  text: string;
  answer: string;
  options?: string[];
}

interface ExamItem {
  id: number;
  part: string;
  points: number;
  context: string | null;
  subQuestions: SubQuestion[];
}

interface ScoreData {
  total: number;
  max: number;
  items: Record<number, number>;
}

// =====================================================
// GRADING FUNCTION
// =====================================================

function checkSubQuestion(
  sq: SubQuestion,
  userAns: string | undefined | null,
): boolean {
  if (userAns == null || userAns.trim() === "") return false;

  const cleanUser = userAns.trim().toLowerCase();
  const cleanCorrect = sq.answer.trim().toLowerCase();

  if (sq.type === "mcq" || sq.type === "tf") {
    return cleanUser === cleanCorrect;
  }

  return cleanUser.replace(/\s/g, "") === cleanCorrect.replace(/\s/g, "");
}

// =====================================================
// EXAM DATA
// =====================================================

const EXAM_DATA: ExamItem[] = [
  // PART 1: IDENTIFICATION (1-8)
  {
    id: 1,
    part: "Part 1: Identification",
    points: 3,
    context: `1  #include <stdio.h>

3  float Value1, Value2;

5  void Display(void);
6  void Enter(void);
7  float Calculate(float, float);

9  int main() {
10    float Result;

12    Display();
13    Enter();
14    Result = Calculate(Value1, Value2);
15    printf("\\n\\tThe addition result is: %f",Result);
16 }`,
    subQuestions: [
      {
        qId: "1.1",
        type: "short",
        points: 1,
        text: "How many user-defined functions are there in the program above (excluding main)?",
        answer: "3",
      },
      {
        qId: "1.2",
        type: "short",
        points: 1,
        text: "What line numbers correspond to the function prototypes? (Separate with commas.)",
        answer: "5,6,7",
      },
      {
        qId: "1.3",
        type: "short",
        points: 1,
        text: "What is the return type of function Calculate?",
        answer: "float",
      },
    ],
  },
  {
    id: 2,
    part: "Part 1: Identification",
    points: 2,
    context: null,
    subQuestions: [
      {
        qId: "2.1",
        type: "short",
        points: 1,
        text: "What header file contains the declarations of printf() and scanf()?",
        answer: "stdio.h",
      },
      {
        qId: "2.2",
        type: "short",
        points: 1,
        text: "What keyword is used inside a function to pass a value back to the calling function?",
        answer: "return",
      },
    ],
  },
  {
    id: 3,
    part: "Part 1: Identification",
    points: 2,
    context: null,
    subQuestions: [
      {
        qId: "3.1",
        type: "short",
        points: 1,
        text: "A procedure defined in terms of simpler versions of itself is called:",
        answer: "recursion",
      },
      {
        qId: "3.2",
        type: "short",
        points: 1,
        text: "What condition allows a recursive function to terminate?",
        answer: "base case",
      },
    ],
  },
  {
    id: 4,
    part: "Part 1: Identification",
    points: 2,
    context: null,
    subQuestions: [
      {
        qId: "4.1",
        type: "short",
        points: 1,
        text: "What phase applies the recursive step until reaching the base step?",
        answer: "expansion",
      },
      {
        qId: "4.2",
        type: "short",
        points: 1,
        text: "What phase constructs the solution backwards, starting with the base step?",
        answer: "substitution",
      },
    ],
  },
  {
    id: 5,
    part: "Part 1: Identification",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "5.1",
        type: "short",
        points: 1,
        text: "If a function does not take any parameters, what keyword is placed inside its declaration parentheses?",
        answer: "void",
      },
    ],
  },
  {
    id: 6,
    part: "Part 1: Identification",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "6.1",
        type: "short",
        points: 1,
        text: "What type of loop evaluates its condition at the bottom, ensuring it executes at least once?",
        answer: "do...while",
      },
    ],
  },
  {
    id: 7,
    part: "Part 1: Identification",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "7.1",
        type: "short",
        points: 1,
        text: "What loop control statement immediately terminates a loop entirely?",
        answer: "break",
      },
    ],
  },
  {
    id: 8,
    part: "Part 1: Identification",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "8.1",
        type: "short",
        points: 1,
        text: "What loop control statement skips the rest of the current iteration?",
        answer: "continue",
      },
    ],
  },

  // PART 2: TRUE OR FALSE (9-15)
  {
    id: 9,
    part: "Part 2: True or False",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "9.1",
        type: "tf",
        points: 1,
        text: "A function can return multiple values simultaneously using the standard return statement.",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  {
    id: 10,
    part: "Part 2: True or False",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "10.1",
        type: "tf",
        points: 1,
        text: "The while loop is considered a pre-test loop.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: 11,
    part: "Part 2: True or False",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "11.1",
        type: "tf",
        points: 1,
        text: "In C, changes made to formal parameters passed by value directly affect the actual parameters in the calling function.",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  {
    id: 12,
    part: "Part 2: True or False",
    points: 2,
    context: null,
    subQuestions: [
      {
        qId: "12.1",
        type: "tf",
        points: 1,
        text: "A recursive function must contain at least one non-recursive branch.",
        options: ["True", "False"],
        answer: "True",
      },
      {
        qId: "12.2",
        type: "tf",
        points: 1,
        text: "The Fibonacci sequence relies on unary recursion.",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  {
    id: 13,
    part: "Part 2: True or False",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "13.1",
        type: "tf",
        points: 1,
        text: "The do...while statement must be terminated with a semicolon.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: 14,
    part: "Part 2: True or False",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "14.1",
        type: "tf",
        points: 1,
        text: "A global variable is visible from its definition until the end of the program.",
        options: ["True", "False"],
        answer: "True",
      },
    ],
  },
  {
    id: 15,
    part: "Part 2: True or False",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "15.1",
        type: "tf",
        points: 1,
        text: "The comma expression evaluates from right to left.",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },

  // PART 3: FILL THE C CODE (16-22)
  {
    id: 16,
    part: "Part 3: Fill the C Code",
    points: 1,
    context: `Supply the missing code for this recursive function so it counts how many digits are greater than 5:

int countGT5(int n){
    if(n == 0)
        return 0;
    else
        return [ BLANK ];
}`,
    subQuestions: [
      {
        qId: "16.1",
        type: "code",
        points: 1,
        text: "What belongs in [ BLANK ]?",
        answer: "countGT5(n/10) + ((n%10)>5)",
      },
    ],
  },
  {
    id: 17,
    part: "Part 3: Fill the C Code",
    points: 2,
    context: `int mystery(int n)
{
    if(n < 5)
        return n;
    else
        return 2 + mystery(n / 2);
}`,
    subQuestions: [
      {
        qId: "17.1",
        type: "short",
        points: 1,
        text: "What is the first recursive call if mystery(20) is executed?",
        answer: "mystery(10)",
      },
      {
        qId: "17.2",
        type: "short",
        points: 1,
        text: "What is the final value returned by mystery(20)?",
        answer: "8",
      },
    ],
  },
  {
    id: 18,
    part: "Part 3: Fill the C Code",
    points: 3,
    context: `Rewrite the while loop into a for statement:

x=14; sum=0;
while (x>=3) {
    printf("%d ", x);
    sum += x;
    x-=5;
}`,
    subQuestions: [
      {
        qId: "18.1",
        type: "code",
        points: 1,
        text: "Initialization expression:",
        answer: "x=14, sum=0",
      },
      {
        qId: "18.2",
        type: "code",
        points: 1,
        text: "Condition expression:",
        answer: "x>=3",
      },
      {
        qId: "18.3",
        type: "code",
        points: 1,
        text: "Update expression:",
        answer: "x-=5",
      },
    ],
  },
  {
    id: 19,
    part: "Part 3: Fill the C Code",
    points: 2,
    context: `void count(int n) {
    if (n <= 0) return;
    printf("%d ", n);
    count(n - 1);
    count(n - 2);
}
int main() { count(3); return 0; }`,
    subQuestions: [
      {
        qId: "19.1",
        type: "short",
        points: 1,
        text: "How many recursive calls are made before the function terminates completely (excluding the initial call)?",
        answer: "8",
      },
      {
        qId: "19.2",
        type: "short",
        points: 1,
        text: "What is the output of the program?",
        answer: "3 2 1 1",
      },
    ],
  },
  {
    id: 20,
    part: "Part 3: Fill the C Code",
    points: 2,
    context: `int f(int a, int b) {
    if(a == b) return f(a-1, b-1) + 2*a - 1;
    else if(a > b) return f(a-b, b) + f(b, b);
    else if(a < b) return f(a, a) + f(b-a, a);
}`,
    subQuestions: [
      {
        qId: "20.1",
        type: "short",
        points: 1,
        text: "Assuming valid base cases exist, what value is returned by f(3,2)?",
        answer: "8",
      },
      {
        qId: "20.2",
        type: "short",
        points: 1,
        text: "How many recursive function calls are made by f(3,2)?",
        answer: "3",
      },
    ],
  },
  {
    id: 21,
    part: "Part 3: Fill the C Code",
    points: 1,
    context: `double pow(double x, int n) {
    if (n == 0) return 1;
    else return [ BLANK ];
}`,
    subQuestions: [
      {
        qId: "21.1",
        type: "code",
        points: 1,
        text: "Fill in the [ BLANK ] for the recursive step:",
        answer: "x * pow(x, n-1)",
      },
    ],
  },
  {
    id: 22,
    part: "Part 3: Fill the C Code",
    points: 1,
    context: `int factorial(int n) {
    if (n <= 1) return 1;
    else return [ BLANK ];
}`,
    subQuestions: [
      {
        qId: "22.1",
        type: "code",
        points: 1,
        text: "Fill in the [ BLANK ] for the recursive step:",
        answer: "n * factorial(n-1)",
      },
    ],
  },

  // PART 4: MULTIPLE CHOICE (23-30)
  {
    id: 23,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "23.1",
        type: "mcq",
        points: 1,
        text: "Which standard library header file contains the abs() function?",
        options: ["math.h", "stdio.h", "stdlib.h", "string.h"],
        answer: "stdlib.h",
      },
    ],
  },
  {
    id: 24,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "24.1",
        type: "mcq",
        points: 1,
        text: "What is the output of ceil(-1.9)?",
        options: ["-2.0", "-1.0", "1.0", "2.0"],
        answer: "-1.0",
      },
    ],
  },
  {
    id: 25,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "25.1",
        type: "mcq",
        points: 1,
        text: "Which jump statement is primarily associated with returning a value from a function?",
        options: ["break", "continue", "goto", "return"],
        answer: "return",
      },
    ],
  },
  {
    id: 26,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "26.1",
        type: "mcq",
        points: 1,
        text: "The scope of a local variable is:",
        options: [
          "The entire program",
          "The block following its declaration",
          "Only within loops",
          "Across all functions",
        ],
        answer: "The block following its declaration",
      },
    ],
  },
  {
    id: 27,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "27.1",
        type: "mcq",
        points: 1,
        text: "A function that calls itself one time at most is an example of:",
        options: [
          "Unary Recursion",
          "N-ary Recursion",
          "Infinite Recursion",
          "Iterative Recursion",
        ],
        answer: "Unary Recursion",
      },
    ],
  },
  {
    id: 28,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "28.1",
        type: "mcq",
        points: 1,
        text: "In a pre-test loop, what happens if the initial condition evaluates to false?",
        options: [
          "The loop runs infinitely",
          "The loop body executes exactly once",
          "The loop body is never executed",
          "A syntax error occurs",
        ],
        answer: "The loop body is never executed",
      },
    ],
  },
  {
    id: 29,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "29.1",
        type: "mcq",
        points: 1,
        text: "Which of the following is NOT a component of a well-formed recursive definition?",
        options: [
          "Base case",
          "Recursive step",
          "Convergence",
          "Goto statement",
        ],
        answer: "Goto statement",
      },
    ],
  },
  {
    id: 30,
    part: "Part 4: Multiple Choice",
    points: 1,
    context: null,
    subQuestions: [
      {
        qId: "30.1",
        type: "mcq",
        points: 1,
        text: "What is a block in C?",
        options: [
          "A mathematical operation",
          "Zero or more statements enclosed in braces {}",
          "A type of variable",
          "A library file",
        ],
        answer: "Zero or more statements enclosed in braces {}",
      },
    ],
  },
];

// =====================================================
// MAIN APP
// =====================================================

export default function App() {
  const [examState, setExamState] = useState<ExamState>("attempt");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [timerVisible, setTimerVisible] = useState<boolean>(true);

  const [scoreData, setScoreData] = useState<ScoreData>({
    total: 0,
    max: 0,
    items: {},
  });

  const finishAttemptRef = useRef<() => void>(() => {});

  // =====================================================
  // FINISH / GRADING
  // =====================================================

  const finishAttempt = () => {
    let totalScore = 0;
    let maxScore = 0;
    const itemScores: Record<number, number> = {};

    EXAM_DATA.forEach((item) => {
      let itemScore = 0;

      item.subQuestions.forEach((sq) => {
        maxScore += sq.points;

        if (checkSubQuestion(sq, answers[sq.qId])) {
          itemScore += sq.points;
          totalScore += sq.points;
        }
      });

      itemScores[item.id] = itemScore;
    });

    setScoreData({
      total: totalScore,
      max: maxScore,
      items: itemScores,
    });

    setExamState("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keep the latest grading function available to the timer.
  useEffect(() => {
    finishAttemptRef.current = finishAttempt;
  }, [answers]);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (examState !== "attempt") return;

    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        setTimeLeft(0);
        finishAttemptRef.current();
      } else {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [examState, timeLeft]);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (qId: string, val: string): void => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const toggleFlag = (itemId: number): void => {
    setFlags((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const isItemAnswered = (item: ExamItem): boolean => {
    return item.subQuestions.every((sq) => {
      const ans = answers[sq.qId];
      return ans !== undefined && ans.trim() !== "";
    });
  };

  const currentItem: ExamItem = EXAM_DATA[currentIndex];

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="min-h-screen bg-[#1c1e22] text-gray-300 font-sans pb-20 selection:bg-blue-500/30">
      {/* HEADER */}
      <header className="bg-[#2b2d31] border-b border-gray-800 sticky top-0 z-50 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-gray-400">
              <svg viewBox="0 0 24 24" fill="#d97706" className="w-6 h-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-white text-lg font-semibold tracking-wide">
              BULMS
            </h1>
          </div>

          <div className="text-sm hidden md:block font-medium">
            CS102: Computer Programming I Mock Exam
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 mt-6 relative flex flex-col md:flex-row gap-6 items-start">
        {/* ================================================= */}
        {/* ATTEMPT VIEW */}
        {/* ================================================= */}

        {examState === "attempt" && (
          <>
            <div className="flex-1 w-full relative">
              {/* TIMER */}
              <div className="flex justify-end mb-4 w-full">
                <div
                  className={`bg-[#ebf2e3] text-gray-800 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-3 z-40 transition-all duration-300 ${
                    !timerVisible ? "opacity-70" : ""
                  }`}
                >
                  {timerVisible && (
                    <div className="flex items-center gap-1.5 font-bold text-sm min-w-[60px]">
                      <Clock size={16} />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  )}

                  <button
                    onClick={() => setTimerVisible(!timerVisible)}
                    className="bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded border border-gray-300 shadow-sm"
                  >
                    {timerVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {/* QUESTION CARD */}
              <div className="bg-[#2b2d31] rounded-lg p-5 sm:p-7 shadow-sm border border-gray-700">
                <div className="text-blue-400 font-bold mb-4 uppercase tracking-wider text-sm border-b border-gray-700 pb-2">
                  {currentItem.part}
                </div>

                <div className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h2 className="text-xl text-white font-medium mb-2">
                      Question{" "}
                      <span className="font-bold">{currentItem.id}</span>
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#3a3b40] text-gray-300 px-3 py-1 rounded text-xs font-medium border border-gray-600">
                        {isItemAnswered(currentItem)
                          ? "Answer saved"
                          : "Not yet answered"}
                      </span>

                      <span className="bg-[#3a3b40] text-gray-300 px-3 py-1 rounded text-xs font-medium border border-gray-600">
                        Marked out of {currentItem.points.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentItem.id)}
                    className={`text-sm flex items-center gap-1.5 transition-colors p-2 rounded ${
                      flags[currentItem.id]
                        ? "text-red-400 bg-red-900/20"
                        : "text-blue-400 hover:bg-[#3a3b40]"
                    }`}
                  >
                    <Flag
                      size={16}
                      fill={flags[currentItem.id] ? "currentColor" : "none"}
                    />
                    <span>
                      {flags[currentItem.id] ? "Remove flag" : "Flag question"}
                    </span>
                  </button>
                </div>

                {/* CODE / CONTEXT */}
                {currentItem.context && (
                  <div className="bg-[#1e1f22] p-4 rounded-md border border-gray-700 font-mono text-sm leading-relaxed whitespace-pre-wrap text-green-300 mb-6 overflow-x-auto shadow-inner">
                    {currentItem.context}
                  </div>
                )}

                {/* SUB-QUESTIONS */}
                <div className="space-y-8">
                  {currentItem.subQuestions.map((sq) => (
                    <div
                      key={sq.qId}
                      className="text-[15px] leading-relaxed text-gray-200"
                    >
                      <p className="mb-3 font-medium">{sq.text}</p>

                      {(sq.type === "short" || sq.type === "code") && (
                        <input
                          type="text"
                          value={answers[sq.qId] || ""}
                          onChange={(e) =>
                            handleAnswerChange(sq.qId, e.target.value)
                          }
                          className="bg-[#1e1f22] border border-gray-500 text-white px-3 py-2 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full max-w-sm transition-all shadow-inner font-mono text-sm"
                          placeholder="Your answer..."
                        />
                      )}

                      {(sq.type === "mcq" || sq.type === "tf") && (
                        <div className="space-y-2">
                          {(sq.options ?? []).map((opt, idx) => (
                            <label
                              key={idx}
                              className="flex items-start gap-3 cursor-pointer p-2 hover:bg-[#3a3b40] rounded transition-colors group border border-transparent hover:border-gray-600"
                            >
                              <input
                                type="radio"
                                name={`sq-${sq.qId}`}
                                value={opt}
                                checked={answers[sq.qId] === opt}
                                onChange={() => handleAnswerChange(sq.qId, opt)}
                                className="mt-1 w-4 h-4 text-blue-500 bg-gray-700 border-gray-500 focus:ring-blue-600 focus:ring-offset-gray-800"
                              />
                              <span className="group-hover:text-white transition-colors">
                                {opt}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="mt-10 flex justify-between gap-3 pt-4 border-t border-gray-700">
                  {currentIndex > 0 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev - 1)}
                      className="bg-[#3a3b40] hover:bg-gray-600 text-gray-200 px-4 py-2 rounded font-medium transition-colors border border-gray-600 text-sm flex items-center gap-1"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentIndex < EXAM_DATA.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="bg-[#0070a8] hover:bg-[#005a87] text-white px-4 py-2 rounded font-medium transition-colors text-sm shadow-sm flex items-center gap-1"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setExamState("confirm")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm shadow-sm flex items-center gap-2"
                    >
                      Finish attempt
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* NAVIGATION SIDEBAR */}
            <div className="w-full md:w-72 shrink-0">
              <div className="bg-[#2b2d31] rounded-lg p-5 shadow-sm border border-gray-700 md:sticky md:top-20">
                <h3 className="text-white text-base font-medium mb-4">
                  Quiz navigation
                </h3>

                <div className="grid grid-cols-5 gap-2 mb-6">
                  {EXAM_DATA.map((item, idx) => {
                    const active = currentIndex === idx;
                    const answered = isItemAnswered(item);
                    const flagged = flags[item.id];

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative h-10 border rounded-sm cursor-pointer flex flex-col justify-start items-center pt-1.5 text-xs font-semibold transition-all select-none ${
                          active
                            ? "border-2 border-white text-white"
                            : "border-gray-500 text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        <span className="relative z-10 drop-shadow-md">
                          {item.id}
                        </span>

                        {answered && (
                          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-500/80 z-0 border-t border-gray-600 rounded-b-sm" />
                        )}

                        {flagged && (
                          <div className="absolute -top-1.5 -right-1 text-red-500 text-[10px] drop-shadow z-20">
                            🚩
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setExamState("confirm")}
                  className="w-full text-center text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium transition-colors py-2"
                >
                  Finish attempt ...
                </button>
              </div>
            </div>
          </>
        )}

        {/* ================================================= */}
        {/* CONFIRMATION VIEW */}
        {/* ================================================= */}

        {examState === "confirm" && (
          <div className="w-full max-w-3xl mx-auto bg-[#2b2d31] rounded-lg p-6 shadow-sm border border-gray-700 mt-10">
            <h2 className="text-2xl text-white font-medium mb-4">
              Summary of attempt
            </h2>

            <div className="border border-gray-700 rounded mb-6 max-h-96 overflow-y-auto bg-[#1e1f22]">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-[#3a3b40] text-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold border-b border-gray-600">
                      Question
                    </th>
                    <th className="px-4 py-3 font-semibold border-b border-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {EXAM_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-[#2b2d31]">
                      <td className="px-4 py-2 font-medium">Item {item.id}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-between">
                          {isItemAnswered(item) ? (
                            <span className="text-gray-300">Answer saved</span>
                          ) : (
                            <span className="text-red-400">
                              Not yet answered
                            </span>
                          )}

                          {flags[item.id] && (
                            <Flag size={14} className="text-red-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#3a3b40] border border-gray-600 rounded p-4 text-center mb-6 text-sm">
              <p>
                Time left: <strong>{formatTime(timeLeft)}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setExamState("attempt")}
                className="bg-gray-600 hover:bg-gray-500 text-white px-5 py-2.5 rounded font-medium transition-colors text-sm shadow-sm"
              >
                Return to attempt
              </button>

              <button
                onClick={finishAttempt}
                className="bg-[#0070a8] hover:bg-[#005a87] text-white px-5 py-2.5 rounded font-medium transition-colors text-sm shadow-sm"
              >
                Submit all and finish
              </button>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* REVIEW / RESULTS */}
        {/* ================================================= */}

        {examState === "review" && (
          <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* REVIEW HEADER */}
            <div className="bg-[#2b2d31] rounded-lg p-6 shadow-sm border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-[60px] z-40">
              <div>
                <h2 className="text-2xl text-white font-medium mb-1">
                  Review Attempt
                </h2>
                <p className="text-sm text-gray-400">
                  CS102: Computer Programming I
                </p>
              </div>

              <div className="bg-[#1e1f22] border border-gray-600 p-4 rounded text-center min-w-[200px] shadow-inner">
                <div className="text-sm text-gray-400 mb-1 font-medium tracking-wide">
                  Final Grade
                </div>

                <div className="text-3xl font-bold text-white mb-1">
                  {scoreData.total.toFixed(2)}
                  <span className="text-lg font-normal text-gray-400">
                    {" "}
                    / {scoreData.max.toFixed(2)}
                  </span>
                </div>

                <div className="text-sm font-bold text-blue-400 bg-blue-900/20 py-1 rounded">
                  {scoreData.max > 0
                    ? ((scoreData.total / scoreData.max) * 100).toFixed(2)
                    : "0.00"}
                  %
                </div>
              </div>
            </div>

            {/* QUESTION REVIEW */}
            <div className="space-y-8">
              {EXAM_DATA.map((item) => {
                const itemScore = scoreData.items[item.id] ?? 0;
                const isFullyCorrect = itemScore === item.points;
                const isPartiallyCorrect =
                  itemScore > 0 && itemScore < item.points;

                let statusColor = "text-red-500";
                let statusBg = "bg-[#3b1212]/40 border-red-800/50";
                let statusText = "Incorrect";

                if (isFullyCorrect) {
                  statusColor = "text-green-500";
                  statusBg = "bg-[#0f2e20]/40 border-green-800/50";
                  statusText = "Correct";
                } else if (isPartiallyCorrect) {
                  statusColor = "text-yellow-500";
                  statusBg = "bg-[#4a3306]/40 border-yellow-800/50";
                  statusText = "Partially Correct";
                }

                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-4"
                  >
                    {/* STATUS SIDEBAR */}
                    <div className="w-full md:w-48 shrink-0 bg-[#2b2d31] border border-gray-700 rounded p-4 text-sm h-fit">
                      <div className="text-blue-400 font-bold mb-2">
                        Question {item.id}
                      </div>

                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-2 border-b border-gray-700 pb-2">
                        {item.part}
                      </div>

                      <div className={`font-bold mb-2 ${statusColor}`}>
                        {statusText}
                      </div>

                      <div className="text-gray-400 font-medium">
                        Mark {itemScore.toFixed(2)} out of{" "}
                        {item.points.toFixed(2)}
                      </div>

                      {flags[item.id] && (
                        <div className="mt-3 flex items-center gap-1.5 text-red-400 text-xs font-bold bg-red-900/20 p-1.5 rounded">
                          <Flag size={12} /> Flagged
                        </div>
                      )}
                    </div>

                    {/* ANSWER REVIEW CARD */}
                    <div className={`flex-1 rounded p-5 border ${statusBg}`}>
                      {item.context && (
                        <div className="bg-black/40 p-4 rounded border border-gray-700 font-mono text-sm leading-relaxed whitespace-pre-wrap text-green-300 mb-6 overflow-x-auto shadow-inner">
                          {item.context}
                        </div>
                      )}

                      <div className="space-y-6">
                        {item.subQuestions.map((sq) => {
                          const userAns = answers[sq.qId] ?? "";
                          const isCorrect = checkSubQuestion(sq, userAns);

                          return (
                            <div
                              key={sq.qId}
                              className="bg-[#1e1f22]/80 border border-gray-700 rounded p-4 shadow-sm"
                            >
                              <p className="text-gray-200 mb-3 font-medium">
                                {sq.text}
                              </p>

                              <div className="flex flex-col gap-3">
                                {/* USER ANSWER */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-gray-400 text-sm">
                                    Your answer:
                                  </span>

                                  <span className="font-mono text-sm bg-black/30 px-2 py-1 rounded border border-gray-600 text-white break-all">
                                    {userAns || (
                                      <span className="italic text-gray-500">
                                        Not answered
                                      </span>
                                    )}
                                  </span>

                                  {isCorrect ? (
                                    <CheckCircle2
                                      size={18}
                                      className="text-green-500 shrink-0"
                                    />
                                  ) : (
                                    <XCircle
                                      size={18}
                                      className="text-red-500 shrink-0"
                                    />
                                  )}
                                </div>

                                {/* CORRECT ANSWER */}
                                {!isCorrect && (
                                  <div className="bg-yellow-900/20 border border-yellow-700/50 p-2.5 rounded text-sm flex items-start gap-2 text-yellow-200/90 mt-1">
                                    <AlertTriangle
                                      size={16}
                                      className="mt-0.5 shrink-0"
                                    />
                                    <div>
                                      Correct answer:
                                      <strong className="font-mono text-white bg-black/40 px-1.5 py-0.5 rounded border border-yellow-700/50 ml-1 break-all">
                                        {sq.answer}
                                      </strong>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RESTART */}
            <div className="flex justify-center pt-8 border-t border-gray-700 pb-12">
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded font-medium transition-colors text-sm shadow-sm"
              >
                Back to course (Restart Simulator)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
