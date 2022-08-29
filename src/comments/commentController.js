const pool = require("../db/db");

exports.create_comment = async (req, res) => {
  try {
    const _id = req.params.id;
    const { autor } = req.user;

    const { comment } = req.body;

    const newComment = await pool.query(
      "INSERT INTO comments (comment, autor, post_id) VALUES ($1, $2, $3) RETURNING *",
      [comment, autor, _id]
    );

    res.status(200).send(newComment.rows[0]);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.create_reply = async (req, res) => {
  try {
    const _id = req.params.id;

    const { autor } = req.user;
    const { comment } = req.body;

    const newReply = await pool.query(
      "INSERT INTO replys (comment, autor, parent_id) VALUES ($1, $2, $3) RETURNING *",
      [comment, autor, _id]
    );

    res.status(200).send(newReply.rows[0]);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.get_comments = async (req, res) => {
  pool.query(
    "SELECT * FROM comment_reply WHERE parent_id is null",
    (error, result) => {
      if (error) throw error;
      res.status(200).json(result.rows);
    }
  );
};

exports.get_replies = async (req, res) => {
  pool.query(
    "SELECT * FROM comment_reply WHERE parent_id is not null",
    (error, result) => {
      if (error) throw error;
      res.status(200).json(result.rows);
    }
  );
};
