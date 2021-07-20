$(".note").on("blur", (e) => {
  const noteId = e.target.id;
  console.log($(`#${noteId}`).val());

  axios.put(`/api/notes/${noteId}`, {
    note: $(`#${noteId}`).val(),
  });
});

$(".btn-close").on("click", (e) => {
  const noteId = e.target.nextElementSibling[0].id;
  $.ajax(`/api/notes/${noteId}`, { method: "DELETE" });
  e.target.parentElement.parentElement.remove();
});
