import React from "react";

function FeedItem({ user, mood, text, comments }) {
  return (
    <div key={user}>
      <div>
        <span className="font-bold">{user}</span>
        <span>{mood}</span>
      </div>
      <div>
        <p>{text}</p>
      </div>

      <div className="pl-8">
        {comments.map((comment, index) => {
          return (
            <div key={index}>
              <span className="font-bold">{comment.user}</span>
              <p>{comment.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeedItem;
