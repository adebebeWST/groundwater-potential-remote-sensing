// scripts/merge-coverage.js
const fs = require('fs');
const path = require('path');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

const map = libCoverage.createCoverageMap({});

['coverage/unit', 'coverage/int', 'coverage/e2e'].forEach(dir => {
  const coverageFile = path.join(dir, 'coverage-final.json');
  if (fs.existsSync(coverageFile)) {
    const content = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
    map.merge(content);
  }
});

const context = libReport.createContext({
  dir: 'coverage',
  coverageMap: map,
});

['text', 'html', 'lcov'].forEach(reportType => {
  reports.create(reportType).execute(context);
});
