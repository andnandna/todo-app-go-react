DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(128) NOT NULL,
  isCompleted BOOLEAN NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO
  tasks (title, isCompleted)
VALUES
  ('りんごを買う', false),
  ('散歩する', false),
  ('猫にご飯をあげる', true);