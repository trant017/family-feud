var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.buzzIn = functions.https.onRequest((req, res) => {
  const teamId = req.query.teamId;
  const buzzerLocked = admin.database().ref('/buzzerLocked').get();

  if (buzzerLocked) {
    res.status(401);
    return res.json({succes: false, message: 'buzzers are locked'});
  }

  if (teamId < 0 || teamId > 1) {
    res.status(422);
    return res.json({success: false, message: 'Team id must be 0 or 1'});
  }

  admin.database().ref('/buzzerLocked').set(true);
  admin.database().ref('/currentTeam').set(parseInt(teamId, 10))
    .then(snapshot => {
      res.status(200);
      retrun res.json({ success: true, message: 'Current Team set to ' + teamId });
    });
});
