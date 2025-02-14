let highestZ = 1;

// State management
const state = {
  isStarted: false,
};

// Initialize UI
function initializeUI() {
  const welcomeContainer = document.querySelector(".welcome-container");
  const startButton = document.querySelector(".start-button");
  const resetButton = document.querySelector(".reset-button");
  const papers = document.querySelectorAll(".paper");

  startButton.addEventListener("click", () => {
    welcomeContainer.classList.add("hidden");
    resetButton.classList.add("visible");

    papers.forEach((paper, index) => {
      setTimeout(() => {
        paper.classList.remove("hidden");
        paper.classList.add("visible");

        paper.style.transform = `translateX(0px) translateY(0px) rotateZ(${
          Math.random() * 30 - 15
        }deg)`;
      }, index * 200);
    });

    state.isStarted = true;
  });

  resetButton.addEventListener("click", () => {
    // Reset all paper positions
    paperInstances.forEach((p) => p.reset());

    papers.forEach((paper, index) => {
      setTimeout(() => {
        paper.classList.remove("visible");
        paper.classList.add("hidden");
      }, index * 100);
    });

    setTimeout(() => {
      welcomeContainer.classList.remove("hidden");
      resetButton.classList.remove("visible");
      state.isStarted = false;
      highestZ = 1; // Reset z-index counter
    }, papers.length * 100 + 500);
  });
}

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  static lastPaperMoved = false;
  // Add initial position tracking
  initialRotation = Math.random() * 30 - 15;

  init(paper) {
    // Store initial position
    this.rotation = this.initialRotation;

    document.addEventListener("mousemove", (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener("mousedown", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Check if this is the last paper
      if (paper === papers[papers.length - 1]) {
        const valentineMessage = document.querySelector(".valentine-message");
        setTimeout(() => {
          valentineMessage.classList.add("visible");
        }, 500);
      }

      if (e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Add reset method
    this.reset = () => {
      this.currentPaperX = 0;
      this.currentPaperY = 0;
      this.rotation = this.initialRotation;
      this.holdingPaper = false;
      this.rotating = false;
      paper.style.transform = `translateX(0px) translateY(0px) rotateZ(${this.initialRotation}deg)`;
    };
  }
}

// Store paper instances
const paperInstances = [];

// Initialize papers
const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
  paperInstances.push(p);
});

// Initialize UI
initializeUI();