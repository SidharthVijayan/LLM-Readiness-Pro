function toggle(id) {
  document.getElementById(id).classList.toggle("collapsed");
}

function getStatus(score) {
  if (score > 80) return "Excellent";
  if (score > 65) return "Strong";
  if (score > 50) return "Average";
  return "Weak";
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

  chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" }, function (res) {

    if (!res) return;

    const score = res.llm_readiness_score;

    document.getElementById("score").innerText = score;
    document.getElementById("status").innerText = getStatus(score);

    const deg = score * 3.6;
    document.getElementById("ring").style.background =
      `conic-gradient(#6366f1 ${deg}deg, #1e293b ${deg}deg)`;

    document.getElementById("markdown").innerText = res.scores.markdown;
    document.getElementById("extract").innerText = res.scores.extractability;
    document.getElementById("token").innerText = res.scores.token_efficiency;
    document.getElementById("conversion").innerText = res.scores.conversion;

    const sections = document.getElementById("sections");
    res.sections.forEach(sec => {
      const div = document.createElement("div");
      div.className = "section-card";
      div.innerText = `${sec.title} (${sec.score})`;
      sections.appendChild(div);
    });

    document.getElementById("export").onclick = () => {
      const blob = new Blob([JSON.stringify(res, null, 2)]);
      const url = URL.createObjectURL(blob);

      chrome.downloads.download({
        url,
        filename: "llm-report.json"
      });
    };

  });

});
