const socket = io();
const comments = document.querySelector("#comments");
const comForm = document.querySelector("#comment-form");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const postForm = document.querySelector("#post-form");
const postList = document.querySelector("#post-list");

socket.on("message", (data) => {
  const status = document.getElementById("status");
  status.innerHTML = `<h2>${data}</h2>`;
});

// SIGN UP
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email1").value;
  const password = document.getElementById("password1").value;

  await fetch("http://localhost:3000/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
});

// LOG IN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const { token } = await response.json();

  localStorage.setItem("token", token);

  const savedToken = localStorage.getItem("token");
});

// Create post
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const content = document.querySelector("#body").value;
  const savedToken = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + savedToken,
    },
    body: JSON.stringify({ title, content }),
  });

  const res = await response.json();

  if (response.status === 400) {
    alert(res.message);
  } else socket.emit("post", res);
});

socket.on("appendPost", (post) => {
  appendPost(post);
});

function appendPost(post) {
  const div = document.createElement("div"),
    button = document.createElement("button");

  div.id = `${post.post_id}`;
  div.innerHTML = `<hr>
  <p>Post by: ${post.autor}
  <p>Title: ${post.title}</p>
   <p>Body: ${post.content}</p>
  `;

  button.innerHTML = "Add comment";

  div.appendChild(button);

  postList.appendChild(div);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const div2 = document.createElement("div"),
      formComment = document.createElement("form"),
      inputComment = document.createElement("input"),
      addComment = document.createElement("button");

    inputComment.placeholder = "Write a comment...";
    inputComment.id = "commentValue";

    addComment.innerHTML = "Send";

    formComment.appendChild(inputComment);
    formComment.appendChild(addComment);
    div2.appendChild(formComment);
    div.appendChild(div2);
    button.disabled = true;

    formComment.addEventListener("submit", async (e) => {
      e.preventDefault();
      const comment = document.querySelector("#commentValue").value;

      const savedToken = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/post/${post.post_id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + savedToken,
          },
          body: JSON.stringify({ comment }),
        }
      );

      const res = await response.json();

      if (response.status === 400) {
        alert(res.message);
      } else socket.emit("commentMsg", res);
      div2.removeChild(formComment);
      button.disabled = false;
    });
  });
}

socket.on("append-comments", (comment) => {
  appendComments(comment);
});

function appendComments(comments) {
  const { comment, post_id, comment_id } = comments;
  const id = document.getElementById(post_id);
  const div = document.createElement("div"),
    replyBtn = document.createElement("button");
  div.innerHTML = `<div id='${comment_id}'>
  <p>Comment By: ${comments.autor}</p>
  <p>Comment: ${comment}</p></div>`;
  replyBtn.innerHTML = "Add Reply";

  if (comment_id != undefined) {
    div.appendChild(replyBtn);
    id.appendChild(div);
  }

  replyBtn.addEventListener("click", (e) => {
    const div1 = document.createElement("div"),
      formReply = document.createElement("form"),
      inputReply = document.createElement("input"),
      addReply = document.createElement("button");

    inputReply.placeholder = "Write a reply...";
    inputReply.id = "replyValue";

    addReply.innerHTML = "Send";

    formReply.appendChild(inputReply);
    formReply.appendChild(addReply);
    div1.appendChild(formReply);
    div.appendChild(div1);
    replyBtn.disabled = true;

    formReply.addEventListener("submit", async (e) => {
      e.preventDefault();

      const comment = document.querySelector("#replyValue").value;

      const savedToken = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/comment/${comment_id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + savedToken,
          },
          body: JSON.stringify({ comment }),
        }
      );

      const res = await response.json();

      if (response.status === 400) {
        alert(res.message);
      } else socket.emit("replyMsg", res);
      div1.removeChild(formReply);
      replyBtn.disabled = false;
    });
  });
}

socket.on("appendReply", (reply) => {
  appendReply(reply);
});

function appendReply(replys) {
  const { comment, parent_id, autor } = replys;
  const id = document.getElementById(parent_id);
  const div = document.createElement("div");

  div.innerHTML = `<p>Reply By: ${autor}</p>
  <p>Reply: ${comment}</p>`;

  if (parent_id != null) {
    id.appendChild(div);
  }
}

// Output Posts
socket.on("output-posts", async () => {
  const response = await fetch("http://localhost:3000/posts/comments/replies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();

  const { posts } = res[0].json_build_object;

  if (posts != null) {
    posts.forEach((post) => {
      appendPost(post);

      if (post.comments != null) {
        post.comments.forEach((comment) => {
          appendComments(comment);

          if (comment.replies != null) {
            comment.replies.forEach((reply) => appendReply(reply));
          }
        });
      }
    });
  }
});
