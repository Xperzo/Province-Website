
function addMessage(text, sender) {
  const box = document.getElementById("chatbox");
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .then(res => res.json())
  .then(data => {
    addMessage(data.reply, "bot");
  })
  .catch(err => {
    addMessage("Erreur de connexion au serveur Flask.", "bot");
    console.error(err);
  });

  input.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});
