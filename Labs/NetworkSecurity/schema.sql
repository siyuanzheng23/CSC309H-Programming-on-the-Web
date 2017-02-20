DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  user_id INT,
  comment TEXT NOT NULL,
  timestamp INTEGER NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, is_admin) VALUES ('Jeff', '$2a$10$nNI0oyy/aFb2tzD1V7PSMOc7pBPEAUt6YJEJQsC2GOe5rL8yznW1O', 1);
INSERT INTO users (username, password, is_admin) VALUES ('Rachel', '$2a$10$nNI0oyy/aFb2tzD1V7PSMOc7pBPEAUt6YJEJQsC2GOe5rL8yznW1O', 1);
