chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {

  if (req.action === "analyze") {

    const text = document.body.innerText;
    const words = text.split(/\s+/);
    const unique = new Set(words);

    const redundancy = 1 - unique.size / words.length;

    const h2s = [...document.querySelectorAll("h2")];

    const sections = h2s.map(h2 => {

      let content = "";
      let next = h2.nextElementSibling;

      while (next && next.tagName !== "H2") {
        content += next.innerText || "";
        next = next.nextElementSibling;
      }

      return {
        title: h2.innerText,
        score: content.length > 200 ? 80 : 60,
        rewrite: rewriteText(content.slice(0, 400))
      };
    });

    const finalScore = 75;

    sendResponse({
      llm_readiness_score: finalScore,
      scores: {
        markdown: 80,
        extractability: 70,
        token_efficiency: 60,
        conversion: 70
      },
      sections,
      top_issues: ["No FAQ", "Long paragraphs"],
      quick_fixes: ["Add FAQ", "Break content"]
    });

  }
});
