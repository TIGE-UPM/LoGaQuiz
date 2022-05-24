const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./LoGaQuiz.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the LoGaQuiz database.");
});

let createTest = `CREATE TABLE IF NOT EXISTS Tests (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        image TEXT,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
);`;

let createQuestion = `CREATE TABLE IF NOT EXISTS Questions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        test_id INTEGER, 
                        title TEXT NOT NULL,
                        image TEXT,
                        type TEXT NOT NULL,
                        allocated_time INTEGER NOT NULL,
                        question_order INTEGER NOT NULL,
                        weight INTEGER NOT NULL,
                        FOREIGN KEY (test_id)
                            REFERENCES Tests (id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
);`;

let createAnswer = `CREATE TABLE IF NOT EXISTS Answers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        question_id INTEGER, 
                        title TEXT NOT NULL,
                        is_correct INTEGER NOT NULL,
                        FOREIGN KEY (question_id)
                            REFERENCES Questions (id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
);`;

let createTestInstance = `CREATE TABLE IF NOT EXISTS TestInstances (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        test_id INTEGER, 
                        played_at TEXT NOT NULL,
                        current_question INTEGER,
                        finished INTEGER NOT NULL,
                        FOREIGN KEY (test_id)
                            REFERENCES Tests (id)
                                ON DELETE NO ACTION
                                ON UPDATE NO ACTION
);`;

let createPlayerInstance = `CREATE TABLE IF NOT EXISTS PlayerInstances (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        test_instance_id INTEGER, 
                        name TEXT NOT NULL,
                        ranking INTEGER,
                        current_score INTEGER,
                        FOREIGN KEY (test_instance_id)
                            REFERENCES TestInstances (id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
);`;

let createAnswerInstance = `CREATE TABLE IF NOT EXISTS AnswerInstances (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        test_instance_id INTEGER,
                        player_instance_id INTEGER,
                        question_id INTEGER,
                        answer_id INTEGER,
                        answer_time REAL NOT NULL,
                        FOREIGN KEY (test_instance_id)
                            REFERENCES TestInstances (id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE,
                        FOREIGN KEY (player_instance_id)
                            REFERENCES PlayerInstances (id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE,
                        FOREIGN KEY (question_id)
                            REFERENCES Questions (id)
                                ON DELETE NO ACTION
                                ON UPDATE NO ACTION,
                        FOREIGN KEY (answer_id)
                            REFERENCES Answers (id)
                                ON DELETE NO ACTION
                                ON UPDATE NO ACTION
    
);`;

db.run(createTest, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Tests Table created correctly");
  }
});

db.run(createQuestion, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Questions Table created correctly");
  }
});

db.run(createAnswer, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Answers Table created correctly");
  }
});

db.run(createTestInstance, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("TestInstances Table created correctly");
  }
});

db.run(createPlayerInstance, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("PlayerInstances Table created correctly");
  }
});

db.run(createAnswerInstance, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("AnswerInstances Table created correctly");
  }
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});
