import React from "react";

function groupEmojis(reactions) {
  const result = {};

  for (let i = 0; i < reactions.length; i++) {
    const emoji = reactions[i]["emoji"];
    if (result[emoji] === undefined) {
      result[emoji] = 0;
    }
    result[emoji]++;
  }

  return result;
}

function FeedItem({ user, mood, text, comments, reactions }) {
  const reactionObj = groupEmojis(reactions);
  const reactionKeys = Object.keys(reactionObj);

  return (
    <div key={user}>
      <div>
        <span className="font-bold">{user}</span>
        <span>{mood}</span>
      </div>
      <div>
        <p>{text}</p>
      </div>
      <div className="flex">
        {reactionKeys.map((reaction, index) => (
          <div key={index}>
            {reaction} {reactionObj[reaction]}
          </div>
        ))}
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
