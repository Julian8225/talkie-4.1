const socket = io();
const form = document.getElementById("chat-form");
const input = document.getElementById("msg-input");
const messages = document.getElementById("messages");
const imgBtn = document.getElementById("img-btn");
const imgInput = document.getElementById("img-input");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function(msg) {
  const item = document.createElement("div");
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

imgBtn.addEventListener("click", () => {
  imgInput.click();
});

imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    socket.emit("image message", data.imageUrl);
  });
});

socket.on("image message", function(imgUrl) {
  const item = document.createElement("div");
  const img = document.createElement("img");
  img.src = imgUrl;
  item.appendChild(img);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
