const mongoose = require("mongoose");
const chai = require("chai");
const chaihHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const Workspace = require("../models/workspace");
const Template = require("../models/template");
const Form = require("../models/form");
const Publish = require("../models/publish");
const Result = require("../models/result");
const fs = require("fs");

chai.use(chaihHttp);

let server;

/**
 * Table of content
 * 1) User Endpoint
 * 2) Workspace Endpoint
 * 3) Template Endpoint
 * 4) Form Endpoint
 * 5) Publish Endpoint
 * 6) Result Endpoint
 */

// User endpoint
describe("Me API Endpoint", () => {
  beforeEach(() => {
    server = require("..");
  }),
    afterEach(done => {
      delete require.cache[require.resolve("..")];
      done();
    }),
    it("should get current user", done => {
      chai
        .request(server)
        .get("/api/v1/me/")
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equals(0);
          done();
        });
    })
});

// User endpoint
describe("User API Endpoint", () => {
  beforeEach(() => {
    server = require("..");
  }),
    afterEach(done => {
      delete require.cache[require.resolve("..")];
      done();
    }),
    it("should get all users", done => {
      chai
        .request(server)
        .get("/api/v1/user/")
        .set("Connection", "close")
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equals(0);
          done();
        });
    }),
    it("should not get user data with false id", done => {
      chai
        .request(server)
        .get("/api/v1/user/209494j404402xJnsj2")
        .set("Connection", "close")
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.length).to.be.undefined;
          done();
        });
    });
});

// Workspace endpoint
describe("Workspace API Endpoint", () => {
  const ENDPOINT_PREFIX = "/api/v1/workspace/";
  beforeEach(() => {
    server = require("..");
  }),
    afterEach(done => {
      delete require.cache[require.resolve("..")];
      done();
    }),
    after(done => {
      // Empty mongo collection
      Workspace.deleteMany({}, err => {
        console.log(err);
        done();
      });
    });
  it("should not fetch workspace with false id", done => {
    chai
      .request(server)
      .get(`${ENDPOINT_PREFIX}sXjkwFeoekf99ne0nC`)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.length).to.be.undefined;
        done();
      });
  }),
    it("should add and fetch workspace", done => {
      const data = {
        name: "Survey Camp",
        user_id: "djd93ik3kioKCNCIO9",
        form_id: "djdndkj3o3j3n30r"
      };
      chai
        .request(server)
        .post(`${ENDPOINT_PREFIX}add/`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(201);

          // Registered workspace new id
          const ID = res.body.data._id;

          // get single workspace
          chai
            .request(server)
            .get(`${ENDPOINT_PREFIX}${ID}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("name");
              done();
            });
        });
    });
});

// Template endpoint
describe("Template API Endpoint", () => {
  const ENDPOINT_PREFIX = "/api/v1/template/";
  beforeEach(() => {
    server = require("..");
  }),
    afterEach(done => {
      delete require.cache[require.resolve("..")];
      done();
    }),
    after(done => {
      // Empty mongo collection
      Template.deleteMany({}, err => {
        console.log(err);
        done();
      });
    });
  it("should fetch all templates", done => {
    chai
      .request(server)
      .get(ENDPOINT_PREFIX)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }),
    it("should add and fetch template", done => {
      const _data = {
        name: "Blue Pie",
        theme: {
          background: "default (1).png",
          fontFamily: "Nunito Sans",
          labelColor: "#555",
          inputColor: "#444",
          type: "image",
          buttonColor: "#eeeeee",
          buttonText: "#555"
        }
      };
      chai
        .request(server)
        .post(`${ENDPOINT_PREFIX}add/`)
        .send(_data)
        .end((err, res) => {
          res.should.have.status(201);

          // Registered workspace new id
          const ID = res.body.data._id;

          chai
            .request(server)
            .put(`${ENDPOINT_PREFIX}${ID}`)
            .send({ form: [] });

          // get single workspace
          chai
            .request(server)
            .get(`${ENDPOINT_PREFIX}${ID}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("name");
              done();
            });
        });
    });
});

// Form Endpoint
describe("Form API Endpoint", () => {
  const ENDPOINT_PREFIX = "/api/v1/form/";
  beforeEach(() => {
    server = require("..");
  }),
    afterEach(done => {
      delete require.cache[require.resolve("..")];
      done();
    }),
    after(done => {
      // Empty mongo collection
      Form.deleteMany({}, err => {
        console.log(err);
        done();
      });
    }),
    it("should add, update and fetch forms", done => {
      const _data = {
        form: [
          {
            label: "How get away with murder",
            placeholder: "Answer",
            type: "text"
          },
          {
            label: "How get away with murder season 2",
            placeholder: "Answer",
            type: "text"
          }
        ],
        template_id: "sjdksksfkjwj",
        user_id: "sjdksksfkjwj"
      };
      // add
      chai
        .request(server)
        .post(`${ENDPOINT_PREFIX}add/`)
        .send(_data)
        .end((err, res) => {
          res.should.have.status(201);
          expect(res.body.data).to.have.property("form") &&
            expect(res.body.data).to.have.property("template_id");

          const _updatedFormData = [
            {
              label: "Friends",
              placeholder: "Answer",
              type: "text"
            }
          ];

          // Get document id
          const ID = res.body.data._id;

          // update
          chai
            .request(server)
            .put(`${ENDPOINT_PREFIX}update/${ID}/`)
            .send({ form: _updatedFormData })
            .end((err, res) => {
              res.should.have.status(200);
              expect(res.body.data).to.have.property("form");
              expect(res.body.data).to.have.property("template_id");
              expect(res.body.data.form[0]).to.include(_updatedFormData[0]);

              chai
                .request(server)
                .get(ENDPOINT_PREFIX)
                .end((err, res) => {
                  res.should.have.status(200);
                  expect(res.body).length.to.be.greaterThan(0);
                  done();
                });
            });
        });
    });
});

// Publish Endpoint
describe("Publish API Endpoint", () => {
  const ENDPOINT_PREFIX = "/api/v1/publish/";
  beforeEach(() => {
    server = require("..");
  }),
    afterEach(done => {
      delete require.cache[require.resolve("..")];
      done();
    }),
    after(done => {
      Publish.deleteMany({}, err => {
        if (err) console.log(err);
        done();
      });
    });
  it("should add and fetch published forms", done => {
    const _data = {
      workspace_id: "5ees8492ubxjv94h9dkd0jNX"
    };

    // add
    chai
      .request(server)
      .post(`${ENDPOINT_PREFIX}add/`)
      .send(_data)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.data).to.have.property("workspace_id");

        // get publish api
        const ID = res.body.data._id;

        // fetch
        chai
          .request(server)
          .get(`${ENDPOINT_PREFIX}${ID}/`)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.workspace_id).to.equal(_data.workspace_id);
            done();
          });
      });
  });
});

// Result Endpoint
describe("Result API Endpoint", () => {
  const ENDPOINT_PREFIX = "/api/v1/result/";
  beforeEach(() => {
    server = require("..");
  }),
    afterEach(done => {
      delete require.cache[require.resolve("..")];
      done();
    }),
    after(done => {
      Result.deleteMany({}, err => {
        if (err) console.log(err);
        // delete log file after tests
        fs.unlinkSync("./error.log");
        done();
      });
    });
  it("should add, add again and fetch results", done => {
    const _data = {
      items: [
        { question: "How old are you", answer: "12" },
        { question: "Name", answer: "Blessing okpokuru" }
      ],
      publish_id: "5ees8492ubxjv94h9dkd0jNX"
    };

    // add
    chai
      .request(server)
      .post(`${ENDPOINT_PREFIX}add/`)
      .send(_data)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.data).to.have.property("items");

        // get publish api
        const ID = res.body.data._id;

        // add one more
        chai
          .request(server)
          .post(`${ENDPOINT_PREFIX}add/`)
          .send(_data)
          .end((err, res) => {
            res.should.have.status(201);
            expect(res.body.data).to.have.property("items");

            // fetch
            chai
              .request(server)
              .get(`${ENDPOINT_PREFIX}${_data.publish_id}/`)
              .end((err, res) => {
                res.should.have.status(200);
                expect(res.body[0].publish_id).to.equal(_data.publish_id);
                done();
              });
          });
      });
  });
});
