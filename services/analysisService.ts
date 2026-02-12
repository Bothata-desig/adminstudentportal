
import { Student, AnalysisResult } from "../types";

export const getLocalStudentAnalysis = (student: Student): AnalysisResult => {
  const avgScore = student.subjects.length > 0 
    ? student.subjects.reduce((acc, s) => acc + (s.score * s.weight), 0) / student.subjects.reduce((acc, s) => acc + s.weight, 0)
    : 0;

  let summary = "";
  let limitBreakerAdvice = "";
  let probability = "N/A";
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const roadmap: string[] = [];

  if (avgScore < 50) {
    summary = "Current scores are below target. Immediate support is required to turn this around.";
    limitBreakerAdvice = "Don't be discouraged! This is just a starting point for a major comeback. We believe you have the potential to master these subjects if we reset your study plan today. Let's turn this failure into your greatest fuel for success. Start small, but start now.";
    probability = "15% (Needs Action)";
    strengths.push("Willingness to learn", "Active attendance record");
    weaknesses.push("Missing core concepts", "Inconsistent study routine");
    roadmap.push("Daily 1-hour focused review", "Work with a tutor on fundamentals", "Celebrate small weekly wins");
  } else if (avgScore >= 50 && avgScore < 65) {
    summary = "Performance is average, but there is significant room for growth.";
    limitBreakerAdvice = "You're doing okay, but 'okay' isn't where you belong. You have a hidden gear that you haven't used yet. By pushing just 20% harder each day, you'll see your scores jump into the next tier. Let's move from just getting by to actually leading the way!";
    probability = "45% (Improving)";
    strengths.push("Basic concept understanding", "Good participation in class");
    weaknesses.push("Study habits need structure", "Focus fades during long tasks");
    roadmap.push("Use the Spaced Repetition tool", "Cut out one major distraction", "Set a target for 70% next month");
  } else if (avgScore >= 65 && avgScore < 80) {
    summary = "Solid performance. You are on the right track and doing well!";
    limitBreakerAdvice = "You've earned a green light! You’re performing well, but now is the time to go even harder. Don't settle for 'good' when 'great' is right there in front of you. Challenge yourself with harder problems and more advanced reading. You’re ready for the next level.";
    probability = "75% (Strong)";
    strengths.push("Strong core fundamentals", "Consistent effort", "Great time management");
    weaknesses.push("Sometimes avoids complex topics", "Needs to engage more in research");
    roadmap.push("Start advanced subject reading", "Lead a study group session", "Maintain 80-min deep work blocks");
  } else if (avgScore >= 80 && avgScore < 92) {
    summary = "Excellent standing! You are among the top performers in your grade.";
    limitBreakerAdvice = "Outstanding work. You've mastered the curriculum—now it's time to master yourself. Start connecting your subjects together. How does Math apply to Music? How does History affect Science? You are becoming a true scholar. Keep that fire burning!";
    probability = "92% (Excellent)";
    strengths.push("High focus and dedication", "Creative problem solving", "Excellent self-discipline");
    weaknesses.push("Risk of overworking", "Could diversify study methods");
    roadmap.push("Participate in academic competitions", "Start a cross-subject project", "Consistent high-level performance");
  } else {
    summary = "Exceptional performance. You are setting a brilliant example for everyone.";
    limitBreakerAdvice = "You have moved beyond the limits of the standard curriculum. Your biggest challenge now is your own curiosity. Keep asking the big questions. You aren't just a student anymore; you are a leader and a visionary in the making. Continue to dominate your studies!";
    probability = "99% (Exceptional)";
    strengths.push("Perfect subject mastery", "Strategic thinking skills", "Incredible work ethic");
    weaknesses.push("Standard material is too easy");
    roadmap.push("Seek university-level challenges", "Mentor junior students", "Publish an independent research piece");
  }

  return {
    summary,
    strengths,
    weaknesses,
    roadmap,
    limitBreakerAdvice,
    statisticalProbability: probability
  };
};
