async function run() {
  const formData = new FormData();
  formData.append("title", "Test");
  formData.append("description", "Desc");
  formData.append("date", "2026-03-22");

  try {
    const res = await fetch("http://localhost:3000/api/admin/activities", {
      method: "POST",
      body: formData
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY:", text);
    const fs = require('fs');
    fs.writeFileSync('d:/web_portfolio/err.log', res.status + " " + text);
  } catch(e) {
    console.log("FETCH ERROR:", e);
    require('fs').writeFileSync('d:/web_portfolio/err.log', "CATCH: " + e.toString());
  }
}
run();
