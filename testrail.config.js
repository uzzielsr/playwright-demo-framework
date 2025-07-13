require("dotenv").config();

module.exports = {
  base_url: process.env.TESTRAIL_HOST,
  user: process.env.TESTRAIL_USER,
  pass: process.env.TESTRAIL_PASSWORD,
  project_id: Number(process.env.TESTRAIL_PROJECT_ID),
  suite_id: Number(process.env.TESTRAIL_SUITE_ID),
  create_missing_cases: true,
  testRailUpdateInterval: 0,
  updateResultAfterEachCase: true,
  use_existing_run: {
    id: 0,
  },
  create_new_run: {
    include_all: false,
    run_name:`Automated Run - ${new Date().toLocaleString()}`,
    milestone_id: 0,
  },
  status: {
    passed: 1,
    failed: 5,
    untested: 3,
    skipped: 6,
  },
};