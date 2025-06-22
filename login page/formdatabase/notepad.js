const textarea = document.getElementById("textarea");
const notepad = document.getElementById("window");
const closeBtn = document.getElementById("close");
const minimizeBtn = document.getElementById("minimize");
const resizeBtn = document.getElementById("resize");
const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValue = document.getElementById("fontSizeValue");

let isMaximized = false;

function formatText(command) {
  document.execCommand(command, false, null);
}

window.onload = () => {
  const savedText = localStorage.getItem("notepad-text");
  if (savedText) textarea.innerHTML = savedText;

  const initialSize = fontSizeSlider.value;
  textarea.style.fontSize = initialSize + "px";
  fontSizeValue.textContent = initialSize + "px";
};

function saveNotes() {
  localStorage.setItem("notepad-text", textarea.innerHTML);
  alert("Notes saved successfully!");
}

function clearNotes() {
  if (confirm("Are you sure you want to clear your notes?")) {
    textarea.innerHTML = "";
    localStorage.removeItem("notepad-text");
  }
}

closeBtn.onclick = () => {
  notepad.style.display = "none";
};

minimizeBtn.onclick = () => {
  textarea.style.height = "0";
  textarea.style.padding = "0";
};

resizeBtn.onclick = () => {
  if (isMaximized) {
    textarea.style.height = "360px";
  } else {
    textarea.style.height = "510px";
  }
  isMaximized = !isMaximized;
};

fontSizeSlider.addEventListener("input", () => {
  const size = fontSizeSlider.value;
  textarea.style.fontSize = size + "px";
  fontSizeValue.textContent = size + "px";
  console.log("Font size set to:", size); // Debug: check console if this prints correctly
});
