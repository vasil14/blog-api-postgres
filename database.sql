CREATE DATABASE blog_app;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  createt_at TIMESTAMP NOT NULL DEFAULT NOW() 
);

CREATE TABLE tokens(
  token_id SERIAL PRIMARY KEY,
  token VARCHAR,
  user_id INT,
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  createt_at TIMESTAMP NOT NULL DEFAULT NOW() 
);

CREATE TABLE posts(
  post_id SERIAL PRIMARY KEY,
  title VARCHAR(25) NOT NULL,
  content VARCHAR(255) NOT NULL,
  autor VARCHAR,
  FOREIGN KEY(autor) REFERENCES users(name) ,
  createt_at TIMESTAMP NOT NULL DEFAULT NOW() 
);

CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  comment VARCHAR(50) NOT NULL,
  autor VARCHAR,
  FOREIGN KEY(autor) REFERENCES users(name) ,
  post_id INT ,
  FOREIGN KEY(post_id) REFERENCES posts(post_id),
  createt_at TIMESTAMP NOT NULL DEFAULT NOW() 
);

CREATE TABLE replys (
  reply_id SERIAL PRIMARY KEY,
  comment VARCHAR(50) NOT NULL,
  autor VARCHAR,
  FOREIGN KEY(autor) REFERENCES users(name) ,
  parent_id INT,
  FOREIGN KEY(parent_id) REFERENCES comments(comment_id),
  createt_at TIMESTAMP NOT NULL DEFAULT NOW() 
);

CREATE TABLE posts_comments (
  post_id INT ,
  FOREIGN KEY(post_id) REFERENCES posts(post_id),
  comment_id INT,
  FOREIGN KEY(comment_id) REFERENCES comments(comment_id),
);


CREATE TABLE comments_reply (
  comment_id INT,
  FOREIGN KEY(comment_id) REFERENCES comments(comment_id),
  reply_id INT ,
  FOREIGN KEY(reply_id) REFERENCES replys(reply_id)
);



