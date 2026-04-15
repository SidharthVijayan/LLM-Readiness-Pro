document.querySelectorAll("p").forEach(p => {

  if (p.innerText.split(" ").length > 120) {

    p.classList.add("llm-highlight");

    p.addEventListener("click", () => {

      const improved = rewriteText(p.innerText);

      const panel = document.createElement("div");
      panel.className = "llm-fix-panel";

      panel.innerHTML = `
        <div>${improved}</div>
        <button>Apply</button>
      `;

      document.body.appendChild(panel);

      panel.querySelector("button").onclick = () => {
        p.innerText = improved;
        panel.remove();
      };
    });
  }

});
