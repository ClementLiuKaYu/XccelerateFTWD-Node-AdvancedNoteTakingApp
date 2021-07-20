class NoteService {
  constructor(knex) {
    this.knex = knex;
  }

  list(userId) {
    return this.knex
      .select("notes.id", "notes.content")
      .from("notes")
      .innerJoin("users", "notes.user_id", "users.id")
      .where("users.id", userId)
      .orderBy("notes.id", "asc")
      .then((notes) => {
        return notes.map((note) => ({ id: note.id, content: note.content }));
      });
  }

  add(note, userId) {
    return this.knex.insert({ content: note, user_id: userId }).into("notes");
  }

  update(noteId, note) {
    return this.knex("notes").where("id", noteId).update({ content: note });
  }

  remove(noteId) {
    return this.knex("notes").where("id", noteId).del();
  }
}

module.exports = NoteService;
