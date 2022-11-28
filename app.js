"use strict";
const express = require('express');
const session = require("express-session");
const app = express();
const fs = require("fs");
const mysql = require('mysql2');
const {
  JSDOM
} = require('jsdom');
const multer = require("multer");
app.use("/img", express.static("./img"));
app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/img1", express.static("./img1"));

app.use(session({
  secret: "spoopy",
  name: "StudentVote",
  resave: false,
  saveUninitialized: true
}));

let dbPass = '123456';
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./img")
  },
  filename: function (req, file, callback) {
    callback(null, "my" + req.session.userid + ".png");
  }
});
const upload = multer({
  storage: storage
});

app.post('/upload-images', upload.array("files"), function (req, res) {
  for (let i = 0; i < req.files.length; i++) {
    req.files[i].filename = req.files[i].originalname;
  }
});

app.get("/", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/profile");
  } else {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: dbPass,
      multipleStatements: true
    });
    const createDBAndTables = fs.readFileSync('./Data.sql', "utf8").toString();
    connection.connect();
    connection.query(createDBAndTables, function (error, results, fields) {
      if (error) {
        console.log(error);
      }

    });
    connection.end();
    let doc = fs.readFileSync('./landingpage.html', "utf8");
    res.send(doc);
  }
});
app.get("/adminUsers", function (req, res) {
  if (req.session.loggedIn && req.session.code == true) {
    let doc = fs.readFileSync("./adminUsers.html", "utf-8");
    res.send(doc);
  } else {
    res.redirect("/");
  }

})

app.get("/EXIT1", function (req, res) {

  let doc = fs.readFileSync("./home.html", "utf-8");
  res.send(doc);
})

app.get("/EXIT2", function (req, res) {

  let doc = fs.readFileSync("./home.html", "utf-8");
  res.send(doc);
})

app.get("/GAME1", function (req, res) {

  let doc = fs.readFileSync("./GuessColor.html", "utf-8");
  res.send(doc);
})

app.get("/GAME2", function (req, res) {

  let doc = fs.readFileSync("./game.html", "utf-8");
  res.send(doc);
})

app.get("/profile", function (req, res) {
  if (req.session.loggedIn) {
    let doc1 = fs.readFileSync('./dashboard.html', "utf8");
    let doc2 = fs.readFileSync('./home.html', "utf8");
    let dom = new JSDOM(doc2);
    let n = req.session.userid;
    let name1 = "my" + n + ".png";
    let page = ' <img class = "avatar" src="img/' + name1 + '">';
    let page1 = ' <img class = "avatar" src="img/default.png">';

    const path = "./img/" + name1;
    if (fs.existsSync(path))
      dom.window.document.querySelector("#im").innerHTML = page;
    else {
      dom.window.document.querySelector("#im").innerHTML = page1;
    }

    if (req.session.code == true)
      res.send(doc1);
    else
      res.send(dom.serialize());
  } else {
    res.redirect("/");
  }

});

app.get("/nav", function (req, res) {
  let doc = fs.readFileSync("./common/nav.html", "utf-8");
  res.send(doc);
});

app.get("/footer", function (req, res) {
  let doc = fs.readFileSync("./common/footer.html", "utf-8");
  res.send(doc);
});

app.get("/allUsers", function (req, res) {

  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: dbPass,
    database: "COMP2800"
  });
  let myResults = null;
  connection.connect();
  connection.query(
    "SELECT * FROM BBY04_user",
    function (error, results, fields) {
      res.send(results);
    }
  );

});

app.get("/change_logo", function (req, res) {
  let doc = fs.readFileSync("./ProfilePage_icon.html", "utf-8");
  res.send(doc);
});

app.get("/userprofile", function (req, res) {
  if (req.session.loggedIn) {
    let doc2 = fs.readFileSync('./profilePage.html', "utf8");
    res.send(doc2);
  } else {
    res.redirect("/");
  }
});


app.get("/signup", function (req, res) {
  if (req.session.loggedIn) {
    let doc1 = fs.readFileSync('./dashboard.html', "utf8");
    let doc2 = fs.readFileSync('./home.html', "utf8");
    if (req.session.code == true)
      res.send(doc1);
    else
      res.send(doc2);
  } else {
    let doc = fs.readFileSync('./signup.html', "utf8");
    res.send(doc);
  }

});
app.get("/createUser", function (req, res) {
  if (req.session.loggedIn && req.session.code == true) {
    let doc = fs.readFileSync("./createUser.html", "utf-8");
    res.send(doc);
  } else {
    res.redirect("/");
  }
})

app.get("/login_landing", function (req, res) {
  if (req.session.loggedIn) {
    let doc1 = fs.readFileSync('./dashboard.html', "utf8");
    let doc2 = fs.readFileSync('./home.html', "utf8");
    if (req.session.code == true)
      res.send(doc1);
    else
      res.send(doc2);
  } else {
    let doc = fs.readFileSync('./login.html', "utf8");
    res.send(doc);
  }

});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// for the create user admin page
app.post('/add-user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  let string = req.body.email;
  if (string.includes("@my.bcit.ca")) {

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: dbPass,
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('Select * from BBY04_user where email = ?', [req.body.email], function (error, result1s, fields) {
      if (result1s.length == 0) {
        connection.query('INSERT INTO BBY04_user (email, password,code) values (?, ?, ?)',
          [req.body.email, req.body.password, req.body.code],
          function (error, results, fields) {
            if (error) {
              console.log(error);
            }
            res.send({
              status: "success",
              msg: "User Created"
            });

          });


        connection.end();
      } else {
        res.send({
          status: "fail",
          msg: "User already exists"
        })
      }
    })
  } else {
    res.send({
      status: "fail",
      msg: "User email domain is not correct. Use my.bcit.ca"
    });
  }
});

app.post('/add-user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  let string = req.body.email;
  if (string.includes("@my.bcit.ca")) {

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: dbPass,
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('INSERT INTO BBY04_user (email, password,code) values (?, ?, ?)',
      [req.body.email, req.body.password, req.body.code],
      function (error, results, fields) {
        if (error) {}
        res.send({
          status: "success",
          msg: "User Created"
        });

      });


    connection.end();
  } else {
    res.send({
      status: "fail",
      msg: "User email domain is not correct."
    });
  }
});
app.post("/updateUser", function (req, res) {
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();

  let n = req.body.email;
  let char = n.substring(0, 1);
  if (req.body.email.includes("@my.bcit.ca") && char != "@") {

    connection.query("Select * from BBY04_user where email = ?", [req.body.email], async function (error1, result1, field1) {
      if (result1.length == 0) {
        connection.query('UPDATE BBY04_user SET email = ? , password = ? WHERE ID = ?',
          [req.body.email, req.body.password, req.body.ID],
          function (error, results, fields) {
            if (error) {
              console.log(error);
            }
            res.send({
              status: "success",
              msg: "Record updated."
            });
            connection.end();
          })

      } else {
        res.send({
          status: "fail",
          msg: "User already exists"
        })
      }

    })

  } else {
    res.send({
      status: "fail",
      msg: "User email domain is not correct. Use my.bcit.ca"
    })
  }


})

app.post("/delUser", function (req, res) {
  if (req.body.email == req.session.email) {
    res.send({
      status: "fail",
      msg: "Cannot delete your own account."
    });
  } else {
    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: dbPass,
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('DELETE FROM BBY04_user WHERE email = ?',
      [req.body.email],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
        res.send({
          status: "success",
          msg: "Record deleted."
        });

      });
  }


})
//allevents displayed
app.get("/allevents", function (req, res) {

  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: dbPass,
    database: "COMP2800"
  });
  let myResults = null;
  connection.connect();
  connection.query(
    "SELECT * FROM BBY04_events",
    function (error, results, fields) {

      if (results.length == 0) {
        res.send = {
          status: "fail",
          msg: "No events found"
        }
      } else {
        res.send(results);
      }
    }
  );
});

//deletes events 
app.post("/delEvent", function (req, res) {
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query('DELETE FROM BBY04_events WHERE EventName = ? AND InstituteName = ?',
    [req.body.eventName, req.body.instituteName],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      res.send({
        status: "success",
        msg: "Record deleted."
      });

    });
})

//uploads images for events
const storage2 = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./img")
  },
  filename: function (req, file, callback) {
    callback(null, "event" + Date.now() + ".png");
  }
});
const upload2 = multer({
  storage: storage2
});

app.post("/uploadEventImage", upload2.single("files"), function (req, res) {
  return res.json({
    path: req.file.path
  })
});

//Events page
app.get('/events', function (req, res) {
  if (req.session.loggedIn && req.session.code == true) {
    let doc = fs.readFileSync("./allEvents.html", "utf-8")
    res.send(doc);
  } else {
    res.redirect("/");
  }
});

//adds an event
app.post("/addEvent", function (req, res) {
  req.session.eventName = req.body.eventName;
  req.session.instituteName = req.body.instituteName;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query('INSERT INTO bby04_events (InstituteName,EventName,StartDate,EndDate,Description,ImagePath) values (?,?,?,?,?,?);',
    [req.body.instituteName, req.body.eventName, req.body.strtDate, req.body.endDate, req.body.des, req.body.imgPath],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      res.send({
        status: "success",
        msg: "Record deleted."
      });

    });
});

//updates the event
app.post("/updateEvent", function (req, res) {
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query('UPDATE BBY04_events SET InstituteName = ? , EventName = ? , StartDate = ? , EndDate = ? , Description = ?, ImagePath = ? WHERE ID = ?',
    [req.body.instituteName, req.body.eventName, req.body.strtDate, req.body.endDate, req.body.des, req.body.imgPath, req.body.ID],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send({
          status: "success",
          msg: "Record update"
        });
      }
    })
});

app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  let results = authenticate(req.body.email, req.body.password,
    function (userRecord) {

      if (userRecord == null) {
        res.send({
          status: "fail",
          msg: "User account not found/Password is not correct."
        });
      } else {
        req.session.loggedIn = true;
        req.session.email = userRecord.email;
        req.session.userid = userRecord.ID;
        const mysql = require("mysql2");
        const connection = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: dbPass,
          database: "COMP2800"
        });
        let myResults = null;
        connection.connect();
        connection.query(
          "SELECT code FROM BBY04_user where email='admin@my.bcit.ca' ",
          function (error, results, fields) {
            let admincode = results[0].code;
            if (userRecord.code == admincode) {
              req.session.code = true
            } else {
              req.session.code = false
            }
            req.session.save(function (err) {});
            res.send({
              status: "success",
              msg: "Logged in."
            });
          }
        );
      }
    });
});

app.get("/logout", function (req, res) {

  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Unable to log out")
      } else {

        res.redirect("/");
      }
    });
  }
});

function authenticate(email, password, callback) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: dbPass,
    database: "COMP2800"
  });
  connection.connect();
  connection.query(
    "SELECT * FROM BBY04_user WHERE email = ? AND password = ?", [email, password],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return callback(results[0]);
      } else {
        return callback(null);
      }

    }
  );

}


app.post('/update-customer', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query('UPDATE BBY04_user SET email = ? , password=? WHERE ID = ?',
    [req.body.email, req.body.password, req.session.userid],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      res.send({
        status: "success",
        msg: "Recorded updated."
      });

    });
  connection.end();

});


app.get("/updatescore1", function (req, res) {
  let a = req.session.userid;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("Select * from BBY04_user where ID = ? ", [a], function (error1, result1, field1) {
    let b = req.query.score1;
    if (result1[0].score1 > b)
      b = result1[0].score1;
    connection.query('UPDATE BBY04_user SET score1 = ?  WHERE ID = ?',
      [b, a],
      function (error, results, fields) {
        res.send({
          status: "success",
          msg: "Record updated."
        });
        connection.end();
      })

  })

})

app.get("/updatescore2", function (req, res) {
  let a = req.session.userid;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("Select * from BBY04_user where ID = ? ", [a], function (error1, result1, field1) {
    let b = req.query.score1;
    if (result1[0].score1 > b)
      b = result1[0].score1;
    connection.query('UPDATE BBY04_user SET score2 = ?  WHERE ID = ?',
      [b, a],
      function (error, results, fields) {
        res.send({
          status: "success",
          msg: "Record updated."
        });
        connection.end();
      })

  })

})


app.get("/getscore1", function (req, res) {
  let a = req.session.userid;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("Select score1 from BBY04_user where ID = ? ", [a],
    function (error, results, fields) {
  //    let a = results[0].score1;
      res.send(results[0]);
    })
})

app.get("/getscore2", function (req, res) {
  let a = req.session.userid;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("Select score2 from BBY04_user where ID = ? ", [a],
    function (error, results, fields) {
  //    let a = results[0].score1;
      res.send(results[0]);
    })
})

app.get("/EVENTRESULT", function (req, res) {
  let a = req.session.userid;
  let b = req.query.eventid;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("SELECT Result FROM  BBY04_VOTERESULT WHERE USERID = ? AND   EVENTID= ? ",
    [a, b],
    function (error, results, fields) {
      if (results != null) {
        res.send(results);
      } else
        res.send(3);
    });
})


app.get("/EVENTRESULT1", function (req, res) {
  let b = req.query.eventid;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("SELECT count(*) AS count FROM  BBY04_VOTERESULT WHERE  EVENTID= ? ",
    [b],
    function (error, results, fields) {
      let string = results[0].count.toString();
      res.send(string);
    })

})

app.get("/EVENTRESULT2", function (req, res) {
  let b = req.query.eventid;
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("SELECT count(*) AS count FROM  BBY04_VOTERESULT WHERE Result=1 AND EVENTID= ? ",
    [b],
    function (error, results, fields) {
      let string = results[0].count.toString();
      res.send(string);
    })

})

app.get("/EVENTRESULT3", function (req, res) {
  let b = req.query.eventid
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("SELECT ENDDATE FROM  BBY04_EVENTS WHERE ID= ? ",
    [b],
    function (error, results, fields) {
      let string = results[0].ENDDATE;
      res.send(string);
    });
})


app.get("/EVENTDES", function (req, res) {
  let b = req.query.eventid
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("SELECT Description FROM  BBY04_EVENTS WHERE ID= ? ",
    [b],
    function (error, results, fields) {
      res.send(results);
    });
})


app.get("/updatevent", function (req, res) {
  let a = req.session.userid;
  let b = req.query.eventid
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("insert into BBY04_VOTERESULT values (?,?,?) ",
    [b, a, 1],
    function (error, results, fields) {
      res.send(results);
    });
})

app.get("/updatevent1", function (req, res) {
  let a = req.session.userid;
  let b = req.query.eventid
  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbPass,
    database: 'COMP2800'
  });
  connection.connect();
  connection.query("insert into BBY04_VOTERESULT values (?,?,?) ",
    [b, a, 0],
    function (error, results, fields) {
      res.send(results);
    });
})

let port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Memory Game APP listening on port ' + port + '!');
});