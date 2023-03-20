const quizForm = document.querySelector("#quiz-form");
const submitButton = document.querySelector("#submit-button");
const resultContainer = document.querySelector("#result-container");
const firework = document.querySelector("#fireworks");

submitButton.addEventListener("click", () => {
  const isChecked = [...quizForm.elements].some((element) => element.checked);
  if (!isChecked) {
    alert("please select an answer before submitting.");
    console.log(isChecked);
    submitButton.disabled = !isChecked;
  }
});
quizForm.addEventListener("change", () => {
  const isChecked = [...quizForm.elements].some((element) => element.checked);
  submitButton.disabled = !isChecked;
});
const questions = [
  {
    question: "What is the capital of France?",
    options: [
      { value: "a", text: "Paris" },
      { value: "b", text: "London" },
      { value: "c", text: "Madrid" },
    ],
    answer: "a",
    type: "radio",
  },
  {
    question: "What is the largest country in the world?",
    options: [
      { value: "a", text: "Russia" },
      { value: "b", text: "China" },
      { value: "c", text: "USA" },
    ],
    answer: "a",
    type: "radio",
  },
  {
    question: "What is the capital of Italy?",
    options: [
      { value: "a", text: "Milan" },
      { value: "b", text: "Venice" },
      { value: "c", text: "Rome" },
    ],
    answer: "c",
    type: "radio",
  },
  {
    question: "Which of the following are programming languages?",
    options: [
      { value: "a", text: "HTML" },
      { value: "b", text: "Python" },
      { value: "c", text: "Java" },
    ],
    answer: ["c", "b"],
    type: "checkbox",
  },
];

function showResult() {
  let correctAnswers = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    let selectedOption = quizForm.elements[`q${i + 1}`].value;
    const selectedAnswers = [];
    const answer = question.answer;
    if (question.type === "checkbox") {
      const selectedOptions = quizForm.elements[`q${i + 1}`];
      for (let j = 0; j < selectedOptions.length; j++) {
        if (selectedOptions[j].checked) {
          selectedAnswers.push(selectedOptions[j].value);
        }
        const sortedArr1 = question.answer.sort();
        const sortedArr2 = selectedAnswers.sort();
        selectedOption = sortedArr2.join(", ");
        if (JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2)) {
          correctAnswers++;
        }
      }
    } else {
      if (selectedOption === answer) {
        correctAnswers++;
      }
    }
    const questionResult = document.createElement("div");
    questionResult.classList.add("question-result");
    questionResult.innerHTML = `
      <p><strong>Question:</strong> ${question.question}</p>
      <p><strong>Your answer:</strong> ${selectedOption}</p>
      <p><strong>Correct answer:</strong> ${answer}</p>
    `;
    resultContainer.appendChild(questionResult);
  }

  const totalQuestions = questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const resultSummary = document.createElement("div");
  resultSummary.classList.add("result-summary");
  resultSummary.innerHTML = `
    <h2>Result:</h2>
    <p>You got ${correctAnswers} out of ${totalQuestions} questions correct (${percentage}%)</p>
    <button class="back" onclick="goBack()">Back</button>
  `;
  resultContainer.appendChild(resultSummary);

  if (percentage === 100) {
    const cons = document.createElement("canvas");
    cons.setAttribute("id", "canvas");
    cons.innerHTML = `
        <canvas></canvas>
        `;
    firework.appendChild(cons);
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();

    window.requestAnimationFrame(updateWorld);
    window.addEventListener("resize", resizeCanvas, false);
    // window.addEventListener("DOMContentLoaded", onLoad, false);

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

    var canvas,
      ctx,
      w,
      h,
      particles = [],
      probability = 0.04,
      xPoint,
      yPoint;

    function resizeCanvas() {
      if (!!canvas) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }
    }

    function updateWorld() {
      update();
      paint();
      window.requestAnimationFrame(updateWorld);
    }

    function update() {
      if (particles.length < 500 && Math.random() < probability) {
        createFirework();
      }
      var alive = [];
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].move()) {
          alive.push(particles[i]);
        }
      }
      particles = alive;
    }

    function paint() {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, w, h);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
      }
    }

    function createFirework() {
      xPoint = Math.random() * (w - 200) + 100;
      yPoint = Math.random() * (h - 200) + 100;
      var nFire = Math.random() * 50 + 100;
      var c =
        "rgb(" +
        ~~(Math.random() * 200 + 55) +
        "," +
        ~~(Math.random() * 200 + 55) +
        "," +
        ~~(Math.random() * 200 + 55) +
        ")";
      for (var i = 0; i < nFire; i++) {
        var particle = new Particle();
        particle.color = c;
        var vy = Math.sqrt(25 - particle.vx * particle.vx);
        if (Math.abs(particle.vy) > vy) {
          particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
      }
    }

    function Particle() {
      this.w = this.h = Math.random() * 4 + 1;

      this.x = xPoint - this.w / 2;
      this.y = yPoint - this.h / 2;

      this.vx = (Math.random() - 0.5) * 10;
      this.vy = (Math.random() - 0.5) * 10;

      this.alpha = Math.random() * 0.5 + 0.5;

      this.color;
    }

    Particle.prototype = {
      gravity: 0.05,
      move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        if (
          this.x <= -this.w ||
          this.x >= screen.width ||
          this.y >= screen.height ||
          this.alpha <= 0
        ) {
          return false;
        }
        return true;
      },
      draw: function (c) {
        c.save();
        c.beginPath();

        c.translate(this.x + this.w / 2, this.y + this.h / 2);
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;

        c.closePath();
        c.fill();
        c.restore();
      },
    };
  }

  quizForm.style.display = "none";
  resultContainer.style.display = "block";
}

quizForm.addEventListener("submit", function (e) {
  e.preventDefault();
  showResult();
});
function goBack() {
  location.reload();
}