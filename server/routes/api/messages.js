const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    // make sure if users are participating in the conversation
    if (conversation && (conversation.id !== conversationId)) {
      return res.sendStatus(403);
    }

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId, recipientRead: false });
      return res.json({ message, sender });
    }

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      recipientRead: false,
    });



    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.patch('/read', async (req, res) => {
  const messages = req.body;

  if ((Object.keys(messages).length > 0) && (messages.length > 0)) {
    await messages.map(async message => {
      const updatedMessage = {
        id: message.id,
        recipientRead: true,
      }
  
      await Message.update(updatedMessage, {
        where: {
          id: message.id
        }
      })
    })
  }
})

module.exports = router;
