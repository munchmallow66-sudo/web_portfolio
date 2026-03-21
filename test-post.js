const formData = new FormData();
formData.append("title", "กิจกรรมใหม่");
formData.append("description", "รายละเอียด");
formData.append("date", "2026-03-21");

fetch("http://localhost:3000/api/admin/activities", {
    method: "POST",
    body: formData
}).then(res => res.json().then(data => console.log(res.status, data)))
  .catch(console.error);
