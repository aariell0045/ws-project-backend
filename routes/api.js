const express = require("express");
const router = express.Router();
const getHandlers = require("./get-handlers-functions");
const postHandlers = require("./post-handlers-functions");
const deleteHandlers = require("./delete-handlers-functions");
const putHandlers = require("./put-handlers-functions");
router.get('/', function (req, res) {
	res.send("working good");
});

router.post('/register', (req, res) => postHandlers.registerHandler(req, res));
router.post('/login', (req, res) => postHandlers.loginHandler(req, res));
router.put('/message', (req, res) => putHandlers.addMessage(req, res));
router.put('/edit-message', (req, res) => putHandlers.editMessage(req, res));
router.put('/group', (req, res) => putHandlers.uploadExcelfile(req, res));
router.put('/combine-groups', (req, res) => putHandlers.combineGroups(req, res));
router.put('/contact', (req, res) => putHandlers.addContactToGroup(req, res));
router.put('/edit-group', (req, res) => putHandlers.editGroup(req, res));
router.delete('/group', (req, res) => deleteHandlers.removeGroup(req, res));
router.delete('/contact', (req, res) => deleteHandlers.removeContactFromGroup(req, res));
router.delete('/message', (req, res) => deleteHandlers.deletemessage(req, res));
router.get('/message/:userId', (req, res) => getHandlers.fetchMessages(req, res));
router.get('/groups/:userId', (req, res) => getHandlers.fetchGroups(req, res));

module.exports = router;