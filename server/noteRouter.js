const express = require("express");

class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  router() {
    let router = express.Router();

    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));

    return router;
  }

  get(req, res) {
    this.noteService
      .list(req.session.passport.user)
      .then((notes) => {
        res.json(notes);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  post(req, res) {
    this.noteService
      .add(req.body.note, req.session.passport.user)
      .then(res.redirect("/"))
      .catch((err) => console.log(err));
  }

  put(req, res) {
    this.noteService
      .update(req.params.id, req.body.note)
      .then(() => {
        res.end();
      })
      .catch((err) => console.log(err));
  }

  delete(req, res) {
    this.noteService
      .remove(req.params.id)
      .then(() => {
        res.end();
      })
      .catch((err) => console.log(err));
  }
}

module.exports = NoteRouter;
