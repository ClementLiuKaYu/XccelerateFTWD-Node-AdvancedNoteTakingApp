const express = require("express");
const passport = require("passport");
const auth = require("../userAuth/checkAuth");

class PageRouter {
  constructor(knex, noteService) {
    this.router = () => {
      const router = express.Router();

      router.get("/", auth.checkLoggedIn, async (req, res) => {
        const notes = await noteService.list(req.session.passport.user);
        res.render("index", { notes, loggedIn: true });
      });

      router.get("/login", auth.checkNotLoggedIn, (req, res) => {
        res.render("login", {
          message: req.flash().error,
          loggedIn: false,
        });
      });

      router.post(
        "/login",
        passport.authenticate("local-login", {
          successRedirect: "/",
          failureRedirect: "/login",
          failureFlash: true,
        })
      );

      router.get("/register", auth.checkNotLoggedIn, (req, res) => {
        res.render("register", { message: req.flash().error, loggedIn: false });
      });

      router.post(
        "/register",
        passport.authenticate("local-signup", {
          successRedirect: "/",
          failureRedirect: "/register",
          failureFlash: true,
        })
      );

      router.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/login");
      });

      return router;
    };
  }
}

module.exports = PageRouter;
