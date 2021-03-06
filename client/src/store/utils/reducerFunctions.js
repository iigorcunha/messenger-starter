export const addMessageToStore = (state, payload) => {
  const { message, sender, currentUser } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };

    if (currentUser && (message.senderId !== currentUser.id)) {
      newConvo.unreadMessages = [{ id: message.id }, ...newConvo.unreadMessages]
    }
   

    return [newConvo, ...state];
  }

  return state.map((convo) => {
    console.log("already exists Convo")
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      if (currentUser && (message.senderId !== currentUser.id)) {
        convoCopy.unreadMessages = [{ id: message.id }, ...convoCopy.unreadMessages]
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateStatusUserToStore = (state, sessions) => {
  return state.map((convo) => {
    if (sessions.some( session => session.id === convo.otherUser.id)) {
      const convoCopy = { ...convo };
        convoCopy.otherUser.online = true;
        return convoCopy;
    } else {
      const convoCopy = { ...convo };
        convoCopy.otherUser.online = false;
        return convoCopy;
    }
  });
}

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      newConvo.unreadMessages = [];
      return newConvo;
    } else {
      return convo;
    }
  });
};
