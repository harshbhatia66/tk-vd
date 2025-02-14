document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const timelineScreen = document.getElementById("timeline-screen");
  const messageSection = document.getElementById("message-section");
  const slideContainer = document.getElementById("slide-container");
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  const startPresentationBtn = document.getElementById("start-presentation");
  const personalizedMessageEl = document.getElementById("personalized-message");
  const audioPlayer = document.getElementById("song-player");

  let timelineData = [];
  let currentSlide = 0;
  let finalSlideIndex = 0; // Will be set after loading timelineData

  // Load timeline JSON data
  fetch("timeline.json")
    .then((response) => response.json())
    .then((data) => {
      timelineData = data;
      // The final slide will be an extra goodbye slide
      finalSlideIndex = timelineData.length;
      if (timelineData.length) {
        renderSlide(currentSlide);
      } else {
        slideContainer.textContent = "No slides to display.";
      }
    })
    .catch((error) => console.error("Error loading timeline data:", error));

  // Render slide: if index equals timelineData.length, show final slide with personal message.
  function renderSlide(index) {
    slideContainer.innerHTML = "";

    if (index === timelineData.length) {
      // Final slide reached: hide timelineScreen and show the personal message.
      timelineScreen.classList.add("hidden");
      messageSection.classList.remove("hidden");
      // Set a smaller font size for the final message text.
      personalizedMessageEl.style.fontSize = "0.9em"; // Adjust value as needed.
      typeMessage(
        personalizedMessageEl,
        personalizedMessageEl.getAttribute("data-text"),
        100
      );
      return;
    }

    const slide = timelineData[index];
    if (!slide) return;

    // Create media element
    let mediaEl;
    if (slide.type === "image") {
      mediaEl = document.createElement("img");
      mediaEl.src = slide.src;
      mediaEl.alt = slide.title;
      mediaEl.onerror = () => {
        mediaEl.alt = "Image format not supported.";
      };
      // Reduce the size for slide 1 and slide 16 (assuming index 0 and timelineData.length-1)
      if (index === 0 || index === 15) {
        mediaEl.style.width = "90%"; // Adjust the width as needed.
        mediaEl.style.maxWidth = "500px"; // Optional: constrain the max width.
      }
    } else if (slide.type === "video") {
      mediaEl = document.createElement("video");
      mediaEl.src = slide.src;
      mediaEl.controls = true;
    }
    slideContainer.appendChild(mediaEl);

    // Caption element (date and title)
    const caption = document.createElement("div");
    caption.classList.add("caption");
    caption.innerHTML = `<strong>${slide.date}</strong> - ${slide.title}`;
    slideContainer.appendChild(caption);

    // Description element with typing animation
    const descriptionEl = document.createElement("p");
    descriptionEl.classList.add("description");
    // For the first slide, reduce font size so the text doesn't penetrate the GIF.
    if (index === 0) {
      descriptionEl.style.fontSize = "0.9em"; // Adjust as needed.
    }
    slideContainer.appendChild(descriptionEl);
    typeMessage(
      descriptionEl,
      slide.text || "Default description...",
      50
    );
  }

  // Navigation button event handlers
  nextBtn.addEventListener("click", () => {
    if (currentSlide < finalSlideIndex) {
      currentSlide++;
      renderSlide(currentSlide);
    }
  });
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      renderSlide(currentSlide);
    }
  });

  // Start Presentation: Hide welcome and show timeline.
  // (Note: We no longer unhide the personal message section here.)
  startPresentationBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    timelineScreen.classList.remove("hidden");
    if (audioPlayer.paused) {
      audioPlayer.muted = false;
      audioPlayer.volume = 1.0;
      audioPlayer.play().then(() => {
        console.log("Audio is playing.");
      }).catch((err) => {
        console.error("Audio play failed:", err);
      });
    }
  });

  // Typing animation function
  function typeMessage(element, text, delay = 100) {
    element.textContent = "";
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        element.style.borderRight = "none";
      }
    }, delay);
  }
  
    // Load decorative GIFs arranged in two side columns with groups of 3 each.
    function loadDecoratives() {
      // Define the positions for 10 GIFs in a chessboard-like layout:
      // Left side: Column A (3 GIFs) and Column C (2 GIFs)
      // Right side: Column F (2 GIFs) and Column H (3 GIFs)
      const squares = [
        // Left side (5 GIFs)
        { col: 'A', row: 2 }, // GIF 1
        { col: 'A', row: 4 }, // GIF 2
        { col: 'A', row: 6 }, // GIF 3
        { col: 'C', row: 3 }, // GIF 4
        { col: 'C', row: 5 }, // GIF 5
    
        // Right side (5 GIFs)
        { col: 'F', row: 2 }, // GIF 6
        { col: 'F', row: 4 }, // GIF 7
        { col: 'H', row: 3 }, // GIF 8
        { col: 'H', row: 5 }, // GIF 9
        { col: 'H', row: 7 }  // GIF 10
      ];
    
      // Map columns to horizontal positions (in vw)
      const columnPositions = {
        A: 2,    // Remains at 5vw
        C: 15,   // Increased to 25vw for extra spacing from A
        F: 71.5,   // Moved closer to the center (from 75vw to 65vw)
        H: 85    // Remains at 85vw
      };
    
      // Map rows (2 through 7) to vertical positions (in vh)
      const rowPositions = {
        2: 20,
        3: 30,
        4: 40,
        5: 50,
        6: 60,
        7: 70
      };
    
      const decorativesDiv = document.getElementById("decoratives");
    
      // Loop through squares and place each GIF
      for (let i = 0; i < squares.length; i++) {
        const { col, row } = squares[i];
        const leftPercent = columnPositions[col];
        let topPercent = rowPositions[row];
        
        // For right-side columns (F and H), shift the GIFs a bit higher (up by 5vh)
        if (col === 'F' || col === 'H') {
          topPercent -= 7;
        }
        
        // Make gif1 a little higher by subtracting an additional margin
        if (i === 0) {
          topPercent -= 11; // adjust the offset as desired
        }

        // Make gif1 a little higher by subtracting an additional margin
        if (i === 1) {
          topPercent -= 3; // adjust the offset as desired
        }
        
        // Make gif 6 and 7 a bit lower by adding to the top position
        if (i === 5 || i === 6) {
          topPercent += 20; // adjust the offset as needed
        }

        // Make gif 8 and 9 a little higher by subtracting additional offset
        if (i === 7 || i === 8) {
          topPercent -= 7; // adjust the offset as needed
        }
        
        const img = document.createElement("img");
        img.src = `assets/decoratives/gif${i + 1}.gif`;
        img.alt = `Decorative ${i + 1}`;
        img.style.width = "200px"; // Adjust size as needed

        // Make gif1 a little smaller
        if (i === 0) {
          img.style.width = "160px"; // adjust the width as desired for gif1
        }

        img.style.position = "absolute";
        img.style.left = `${leftPercent}vw`;
        img.style.top = `${topPercent}vh`;
        img.style.pointerEvents = "none";
        
        decorativesDiv.appendChild(img);
      }
    }
      
    loadDecoratives();
  });
