const mongodb = require("mongodb");
const express = require("express");
const app = express();
const mongoose=require('mongoose');
const path = require("path");

//test2

app.listen(8080);
app.use(express.urlencoded({ extended: true }));

app.use("/css",express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")))
app.use("/js",express.static(path.join(__dirname,"node_modules/bootstrap/dist/js")))
app.use(express.static("css"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

const Parcel = require('./models/parcel')

const url = "mongodb://localhost:27017/warehouse";


mongoose.connect(url,function(err){
  if(err===null)
  console.log('Connected Successfully');

});


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/addparcel", function (req, res) {
  res.sendFile(path.join(__dirname, "views/addparcel.html"));
});
// app.get("/getparcel", function (req, res) {
//   res.sendFile(path.join(__dirname, "views/getparcel.html"));
// });
app.get("/delete", function (req, res) {
  res.sendFile(path.join(__dirname, "views/delete.html"));
});
app.get("/update", function (req, res) {
  res.sendFile(path.join(__dirname, "views/update.html"));
});
app.get("/getparcelsender", function (req, res) {
  res.sendFile(path.join(__dirname, "views/getparcelsender.html"));
});
app.get("/getparcelweight", function (req, res) {
  res.sendFile(path.join(__dirname, "views/getparcelweight.html"));
});


app.post("/addparcel", function (req, res) {
  let aParcel = req.body;
  let parcel=new Parcel(aParcel);
  parcel.save(function(err){
      if(err)
      console.log('Unable to save' + err);
      else console.log("Saved Successfully!!")
  })

  res.redirect("/getparcel");

  console.log(aParcel,"here u go");
});

// app.get("/getparcel", function (req, res) {
//   res.render(path.join(__dirname, "views/getparcel.html"), { PosDb: db });
// });

app.get("/getparcel", function (req, res) {
  Parcel.find({}, function (err, docs) {
    res.render("getparcel.html", {
      PosDb: docs,
    });
    console.log(docs);

  });
  
});

app.post("/getparcelsender", function (req, res) {
  let getSender=req.body.sender
  Parcel.find({ sender: getSender }, function (err, docs) {
    res.render("getparcelsender.html", {
      PosDb: docs,
    });
    console.log(docs);

  });
  
});

app.post("/getparcelweight", function (req, res) {
  let getWeight1=req.body.weight1
  let getWeight2=req.body.weight2
  Parcel.where('weight').gte(getWeight1).lte(getWeight2).exec(function (err, docs) {
    console.log(docs);
    res.render("getparcelweight.html", {
      PosDb: docs,
    });
    console.log(docs);


});

  
});

app.post("/deletepost", function (req, res) {
  let delId = req.body.id;
  console.log(delId);
  Parcel.deleteMany({ _id: delId }, function (err, doc) {
    console.log(doc);
    if (err) throw err;
    res.sendFile(path.join(__dirname, "views/delete.html"));


});

});

app.post("/deletesender", function (req, res) {
  let delSender = req.body.sender;

  Parcel.deleteMany({ sender: delSender }, function (err, doc) {
    console.log(doc);
    if (err) throw err;
    res.sendFile(path.join(__dirname, "views/delete.html"));


});


});

app.post("/deletepostbysenseraddress", function (req, res) {
  let delSender = req.body.sender;
  let delAdress = req.body.address;
  console.log(delAdress);
  db.collection("lib").deleteMany(
    { $and: [{ sender: delSender }, { address: delAdress }] },
    function (err, result) {
      if (err) throw err;
      res.sendFile(path.join(__dirname, "views/delete.html"));
      console.log(result);
    }
  );
});

app.post("/deletepostbysenserweight", function (req, res) {
  let delSender = req.body.sender;
  let delWeight = req.body.weight;
  db.collection("lib").deleteMany(
    { $and: [{ sender: delSender }, { weight: delWeight }] },
    function (err, result) {
      if (err) throw err;
      res.sendFile(path.join(__dirname, "views/delete.html"));
      console.log(result);
    }
  );
});

app.post("/update", function (req, res) {
  let parcel = req.body;
  let updateId = req.body.id;
  let filter = { _id: mongodb.ObjectId(parcel.id) };
  let theUpdate = {
    $set: {
      sender: parcel.sender,
      weight: parcel.weight,
      address: parcel.address,
    },
  };
  // db.collection("lib").updateMany(filter, theUpdate);

  Parcel.updateMany(filter, theUpdate, function (err, doc) {
    console.log(doc);
});
  res.redirect("/getparcel"); // redirect the client to list users page
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views/404.html"));
});
