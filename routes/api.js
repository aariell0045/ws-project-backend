const express = require("express");
const router = express.Router();
const getHandlers = require("./get-handlers-functions");
const postHandlers = require("./post-handlers-functions");
const deleteHandlers = require("./delete-handlers-functions");
const putHandlers = require("./put-handlers-functions");

router.post("/register", (req, res) => postHandlers.registerHandler(req, res));
router.post("/login", (req, res) => postHandlers.loginHandler(req, res));
router.put("/message", (req, res) => putHandlers.addMessage(req, res));
router.put("/edit-message", (req, res) => putHandlers.editMessage(req, res));
router.put("/group", (req, res) => putHandlers.uploadExcelfile(req, res));
router.put("/combine-groups", (req, res) =>
  putHandlers.combineGroups(req, res)
);
router.put("/contact", (req, res) => putHandlers.addContactToGroup(req, res));
router.put("/edit-group", (req, res) => putHandlers.editGroup(req, res));
router.put("/event", (req, res) => putHandlers.addEvent(req, res));
router.put("/task", (req, res) => putHandlers.addTask(req, res));
router.put("/messages-status", (req, res) =>
  putHandlers.updateMessagesStatus(req, res)
);
router.delete("/group", (req, res) => deleteHandlers.removeGroup(req, res));
router.delete("/contact", (req, res) =>
  deleteHandlers.removeContactFromGroup(req, res)
);
router.delete("/event", (req, res) => deleteHandlers.removeEvent(req, res));
router.delete("/task", (req, res) => deleteHandlers.removeTask(req, res));
router.delete("/message", (req, res) => deleteHandlers.deletemessage(req, res));
router.get("/message/:userId", (req, res) =>
  getHandlers.fetchMessages(req, res)
);
router.get("/groups/:userId", (req, res) => getHandlers.fetchGroups(req, res));

router.get("/history/:userId", (req, res) =>
  getHandlers.fetchHistory(req, res)
);

router.get("/event/:userId", (req, res) => getHandlers.fetchEvents(req, res));
router.get("/task/:userId", (req, res) => getHandlers.fetchTasks(req, res));
router.get("/messages-status/:userId", (req, res) =>
  getHandlers.fetchMessagesStatus(req, res)
);

module.exports = router;
