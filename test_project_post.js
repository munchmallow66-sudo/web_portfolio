const formData = new FormData();
formData.append("title", "Test Project Thai");
formData.append("shortDescription", "ทดสอบ");
formData.append("fullDescription", "ทดสอบรายละเอียดแบบเต็ม");

fetch("https://webportfolio-pi-brown.vercel.app/api/admin/projects", {
    method: "POST",
    body: formData
}).then(res => res.json().then(data => console.log(res.status, data)))
  .catch(console.error);
