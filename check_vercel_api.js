async function run() {
  const formData = new FormData();
  formData.append("title", "Test Activity Thai");
  formData.append("description", "Desc");
  formData.append("date", "2026-03-22");

  try {
    const res = await fetch("https://webportfolio-pi-brown.vercel.app/api/admin/activities", {
      method: "POST",
      body: formData
    });
    const text = await res.text();
    require('fs').writeFileSync('d:/web_portfolio/vercel_err.log', res.status + " " + text);
    console.log("Done");
  } catch(e) {
    require('fs').writeFileSync('d:/web_portfolio/vercel_err.log', "CATCH: " + e.toString());
  }
}
run();
