var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.buzzIn = functions.https.onRequest((req, res) => {
  const teamId = req.query.teamId;
  if (teamId > 1) {
    res.status(422);
    res.json({success: false, message: 'Team id must be 0 or 1'});
  } else {
    admin.database().ref('/currentTeam').set(parseInt(teamId, 10))
      .then(snapshot => {
        res.status(200);
        res.json({ success: true, message: 'Current Team set to ' + teamId });
      });
  }
});
