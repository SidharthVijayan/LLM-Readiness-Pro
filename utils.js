function rewriteText(text) {
  if (text.length > 300) {
    return text.split(".").map(t => "• " + t.trim()).join("\n");
  }
  return "Answer: " + text;
}
