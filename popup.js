chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

  chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" }, function (res) {

    if (!res) return;

    document.getElementById("score").innerText = res.llm_readiness_score;

    const deg = res.llm_readiness_score * 3.6;
    document.getElementById("scoreRing").style.background =
      `conic-gradient(#22c55e ${deg}deg, #1e293b ${deg}deg)`;

    document.getElementById("markdown").innerText = res.scores.markdown;
    document.getElementById("extract").innerText = res.scores.extractability;
    document.getElementById("token").innerText = res.scores.token_efficiency;
    document.getElementById("conversion").innerText = res.scores.conversion;

    const issues = document.getElementById("issues");
    res.top_issues.forEach(i => {
      const li = document.createElement("li");
      li.innerText = i;
      issues.appendChild(li);
    });

    const fixes = document.getElementById("fixes");
    res.quick_fixes.forEach(f => {
      const li = document.createElement("li");
      li.innerText = f;
      fixes.appendChild(li);
    });

    const sections = document.getElementById("sections");
    res.sections.forEach(sec => {
      const div = document.createElement("div");
      div.innerHTML = `<b>${sec.title}</b> (${sec.score})<pre>${sec.rewrite}</pre>`;
      sections.appendChild(div);
    });

    document.getElementById("export").onclick = () => {
      const blob = new Blob([JSON.stringify(res, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      chrome.downloads.download({
        url: url,
        filename: "llm-report.json"
      });
    };

  });

});
