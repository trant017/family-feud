var functions = require('firebase-functions');

var admin = require("firebase-admin");

var serviceAccount = require("../scripts/bibliofamilyfeud-2017-firebase-adminsdk-m74ox-5e07c65b5a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bibliofamilyfeud-2017.firebaseio.com"
});

exports.buzzIn = functions.https.onRequest((req, res) => {
  const teamId = req.query.teamId;
  const buzzerLockedRef = admin.database().ref('/buzzerLocked');

  buzzerLockedRef.once("value", function(snapshot) {
    if (snapshot.val()) {
      res.status(401);
      res.json({succes: false, message: 'buzzers are locked'});
    } else if (teamId < 0 || teamId > 1) {
      res.status(422);
      res.json({success: false, message: 'Team id must be 0 or 1'});
    } else {
      admin.database().ref('/buzzerLocked').set(true);
      admin.database().ref('/currentTeam').set(parseInt(teamId, 10))
      .then(snapshot => {
        res.status(200);
        res.json({ success: true, message: 'Current Team set to ' + teamId });
      });
    }
  });
});
