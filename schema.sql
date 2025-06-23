-- Create the users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER
);

-- Create the pets table
CREATE TABLE pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    FOREIGN KEY (owner) REFERENCES users(id)
);

-- Insert dummy users
INSERT INTO users (name, age) VALUES ('Alice', 30);
INSERT INTO users (name, age) VALUES ('Bob', 25);
INSERT INTO users (name, age) VALUES ('Charlie', 40);

-- Insert dummy pets
INSERT INTO pets (owner, name, type) VALUES (1, 'Fluffy', 'Cat');
INSERT INTO pets (owner, name, type) VALUES (1, 'Rex', 'Dog');
INSERT INTO pets (owner, name, type) VALUES (2, 'Goldie', 'Fish');
INSERT INTO pets (owner, name, type) VALUES (3, 'Buddy', 'Dog');