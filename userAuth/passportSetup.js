const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const knexConfig = require("../knexfile").development;
const knex = require("knex")(knexConfig);

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    "local-login",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await knex("users")
          .where({ username: username })
          .then((users) => users[0]);
        if (user == null) {
          return done(null, false, { message: "Incorrect credentials." });
        }
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        }
        return done(null, false, { message: "Incorrect credentials." });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await knex("users")
      .where({ id: id })
      .then((users) => users[0]);
    return done(null, user);
  });

  passport.use(
    "local-signup",
    new LocalStrategy(async (username, password, done) => {
      try {
        let users = await knex("users").where({ username: username });
        if (users.length > 0) {
          return done(null, false, { message: "Username already taken." });
        }

        let hashedPassword = (password) => {
          return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
              if (err) {
                reject(err);
              }
              resolve(hash);
            });
          });
        };

        const hash = await hashedPassword(password);

        const newUser = {
          username: username,
          password: hash,
        };
        let userId = await knex("users").insert(newUser).returning("id");
        newUser.id = userId[0];
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    })
  );
};
