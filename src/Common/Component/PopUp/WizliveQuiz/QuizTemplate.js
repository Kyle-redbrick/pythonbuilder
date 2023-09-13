/*
  {
    categories: ["api", "concept"],
    score: { api: 0, concept: 0 },
    text: "",
    imgSrc: "",
    choices: ["", "", "", ""],
    choiceNum: null,
    answerNum: 0
  }
*/

const quizTemplate = {
  quizes: [
    // 1
    {
      categories: ["api"],
      score: { api: 5, concept: 0 },
      text: "스프라이트가 2초 동안 말풍선을 띄우도록 빈칸에 들어갈 알맞은 코드를 골라보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_1.png",
      choices: ["0,2", "2", "20", "200"],
      choiceNum: null,
      answerNum: 2,
    },
    // 2
    {
      categories: ["api"],
      score: { api: 5, concept: 0 },
      text: "스프라이트가 왼쪽으로 100만큼 움직이도록 빈칸에 들어갈 알맞은 코드를 골라보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_2.png",
      choices: ["-100", "100", "-50", "50"],
      choiceNum: null,
      answerNum: 1,
    },
    // 3
    {
      categories: ["api"],
      score: { api: 5, concept: 0 },
      text: "스프라이트가 위로 100만큼 움직이도록 빈칸에 들어갈 알맞은 코드를 골라보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_3.png",
      choices: ["-100", "100", "-50", "50"],
      choiceNum: null,
      answerNum: 1,
    },
    // 4
    {
      categories: ["api"],
      score: { api: 5, concept: 0 },
      text: "오카 스프라이트의 모양을 좌우로 뒤집으려고 합니다. 빈칸에 들어갈 알맞은 코드를 골라보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_4.png",
      choices: ["100", "-100", "true", "false"],
      choiceNum: null,
      answerNum: 3,
    },
    // 5
    {
      categories: ["api"],
      score: { api: 10, concept: 0 },
      text: "오른쪽 방향키를 누르면 오른쪽으로 100만큼, 왼쪽 방향키를 누르면 왼쪽으로 100만큼 이동하려고 합니다. 빈칸에 어떤 것들이 들어가야 할까요?",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_5.png",
      choices: ["right, -100", "left, -100", "right, 100", "left, 100"],
      choiceNum: null,
      answerNum: 1,
    },
    // 6
    {
      categories: ["api"],
      score: { api: 10, concept: 0 },
      text: "‘스페이스’키를 누르면 도트 스프라이트가 화면 밖으로 나가지 못하도록 코딩하려고 합니다.  빈칸에 들어갈 알맞은 명령어를 찾아보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_6.png",
      choices: ["space, true", "left, true", "right, false", "enter, false"],
      choiceNum: null,
      answerNum: 1,
    },
    // 7
    {
      categories: ["api"],
      score: { api: 5, concept: 0 },
      text: "음식 스프라이트를 마우스로 드래그하려고 합니다. 빈칸에 알맞은 내용을 골라보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_7.png",
      choices: ["100", "-100", "true", "false"],
      choiceNum: null,
      answerNum: 3,
    },
    // 8
    {
      categories: ["api", "concept"],
      score: { api: 10, concept: 5 },
      text: "‘happy’ 신호를 받으면 기뻐하는 도트를 코딩하려고 합니다. 빈칸에 들어갈 알맞은 명령어를 찾아보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_8.png",
      choices: ["sendSignal, happy", "playAnimation, happy", "senSignal, victory", "playAnimation, victory"],
      choiceNum: null,
      answerNum: 1,
    },
    // 9
    {
      categories: ["concept"],
      score: { api: 0, concept: 5 },
      text: "우리 주변에서 찾을 수 있는 이벤트가 아닌 것을 골라보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_9.png",
      choices: ["1", "2", "3", "4"],
      choiceNum: null,
      answerNum: 2,
    },
    // 10
    {
      categories: ["api", "concept"],
      score: { api: 10, concept: 5 },
      text: "사탕을 받으면 기뻐하는 ‘로구리’ 스프라이트를 코딩하려고 합니다. 빈칸에 들어갈 알맞은 명령어를 찾아보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_10.png",
      choices: ["true, onClick", "false, onKey", "true, onOverlap", "false, onOverlap"],
      choiceNum: null,
      answerNum: 3,
    },
    // 11
    {
      categories: ["api"],
      score: { api: 5, concept: 0 },
      text: "호이에게 닿으면 없어지는 ‘고기’ 스프라이트를 코딩하려고 합니다. 빈칸에 들어갈 알맞은 명령어를 찾아보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_11.png",
      choices: ["onSignal", "onOverlap", "playAnimation", "playSound"],
      choiceNum: null,
      answerNum: 2,
    },
    // 12
    {
      categories: ["concept"],
      score: { api: 0, concept: 15 },
      text: "다음 문장 중에서 틀린 것을 찾아보세요.",
      imgSrc: "https://wizschool-class-videos.s3.ap-northeast-2.amazonaws.com/quiz/wizlivequiz_1_12.png",
      choices: ["1", "2", "3", "4"],
      choiceNum: null,
      answerNum: 3,
    },
  ],
};

export default quizTemplate;
