export const topics = [
  "Social media does more harm than good.",
  "Artificial intelligence should be regulated.",
  "College education should be free.",
  "Climate change is the greatest global threat.",
  "Remote work is better than office work.",
];

export function getRandomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}