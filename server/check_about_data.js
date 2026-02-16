const db = require('../config/db');

const checkAbout = () => {
  db.get("SELECT * FROM about", [], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('About Row:', row);
  });
};

checkAbout();
