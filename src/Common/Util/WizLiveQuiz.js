export function getScore(quizAnswer) {
  let score = {
    apiTotal: 0,
    api: 0,
    conceptTotal: 0,
    concept: 0,
  };
  for (let i = 0; i < quizAnswer.quizes.length; i++) {
    const quiz = quizAnswer.quizes[i];
    score.apiTotal += quiz.score.api;
    score.conceptTotal += quiz.score.concept;
    if (quiz.choiceNum === quiz.answerNum) {
      score.api += quiz.score.api;
      score.concept += quiz.score.concept;
    }
  }
  return score;
}

export function getFeedbackScore(feedbackString) {
  if (!feedbackString) return;
  const feedback = JSON.parse(feedbackString);
  let score = {
    total: 0,
    api: 0,
    concept: 0,
  };

  if (feedback.feedbacks) {
    // 구 피드백
    const feedbacks = feedback.feedbacks;
    let totalScore = 0;
    feedbacks.forEach((value) => {
      totalScore += value.level;
    });
    totalScore = Math.round((totalScore / feedbacks.length) * 10) / 10;
    score.total = totalScore;
    score.api = totalScore;
    score.concept = totalScore;
  } else {
    // 신 피드백
    let apiScore = 0;
    let conceptScore = 0;
    let totalScore = 0;

    const api = feedback.api;
    const apiLength = api.length;
    const concept = feedback.concept;
    const conceptLength = concept.length;
    const feedbacks = api.concat(concept);
    const feedbacksLength = feedbacks.length;

    if (apiLength > 0) {
      api.forEach((value) => {
        const level = parseInt(value.level);
        apiScore += level || 0;
      });
      apiScore = apiScore / apiLength;
    }
    if (conceptLength > 0) {
      concept.forEach((value) => {
        const level = parseInt(value.level);
        conceptScore += level || 0;
      });
      conceptScore = conceptScore / conceptLength;
    }
    if (feedbacksLength > 0) {
      feedbacks.forEach((value) => {
        const level = parseInt(value.level);
        totalScore += level || 0;
      });
      totalScore = totalScore / feedbacksLength;
    }

    score.api = Math.round(apiScore * 10) / 10;
    score.concept = Math.round(conceptScore * 10) / 10;
    score.total = Math.round(totalScore * 10) / 10;
  }
  return score;
}
