const pool = require("../db/db");

exports.get_posts = async (req, res) => {
  pool.query("SELECT * FROM  posts ORDER BY post_id", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

exports.create_post = async (req, res) => {
  try {
    const { id, autor } = req.user;

    const { title, content } = req.body;

    const post = await pool.query(
      "INSERT INTO posts (title, content, autor) VALUES($1,$2,$3) RETURNING *",
      [title, content, autor]
    );

    res.status(200).send(post.rows[0]);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.update_post = async (req, res) => {
  try {
    const { title, content } = req.body;

    const { id } = req.params;

    const updatedPost = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE post_id = $3 RETURNING *",
      [title, content, id]
    );

    res.status(200).send(updatedPost.rows[0]);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.postsCommentsReplies = async (req, res) => {
  try {
    const posts = await pool.query(
      `SELECT json_build_object(
		'posts', json_agg(
			json_build_object(
				'post_id', p.post_id,
				'title', p.title,
				'content', p.content,
				'autor', p.autor,
				'comments', comments
			)
		)
	) 
FROM posts p
LEFT JOIN (
	SELECT post_id,
			json_agg(
				json_build_object (
					'comment_id', c.comment_id,
					'comment', c.comment,
					'autor', c.autor,
					'post_id', c.post_id,
					'replies', replies
				)
			) comments
	FROM comments c
		LEFT JOIN (
			SELECT parent_id,
				json_agg(
					json_build_object(
						'reply_id', r.reply_id,
						'comment', r.comment,
						'autor', r.autor,
						'parent_id', r.parent_id
					)
				) replies
			FROM replys r
				GROUP BY 1
		) r on c.comment_id = r.parent_id
	GROUP BY post_id 
) c on p.post_id = c.post_id `
    );

    res.status(200).send(posts.rows);
  } catch (e) {
    res.status(500).send(e);
  }
};
