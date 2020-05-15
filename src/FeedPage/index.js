import React from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { fetchFeed } from "./api";
import FeedItem from "./FeedItem";

const machine = Machine(
  {
    id: "daily-feed",
    context: {
      feedItems: [],
    },
    initial: "loading",
    states: {
      loading: {
        invoke: {
          src: "loadFeed",
          onDone: {
            target: "ready",
            actions: ["cacheFeed"],
          },
          onError: "error",
        },
      },
      ready: {},
      error: {},
    },
  },
  {
    services: {
      loadFeed: () => {
        return fetchFeed();
      },
    },
    actions: {
      cacheFeed: assign((_, event) => {
        return {
          feedItems: event.data,
        };
      }),
    },
  }
);

function FeedPage() {
  const [state] = useMachine(machine);
  const { feedItems } = state.context;

  if (state.matches("loading")) {
    return <p>Loading...</p>;
  }

  if (state.matches("error")) {
    return <p>Error loading feed. Please try again later.</p>;
  }

  return (
    <div>
      {feedItems.map((feedItem) => {
        return <FeedItem key={feedItem.user} {...feedItem} />;
      })}
    </div>
  );
}

export default FeedPage;
