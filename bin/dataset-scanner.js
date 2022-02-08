import DatasetScanner from '../src/DatasetScanner.js';

(async () => {
  const datasetScanner = new DatasetScanner();
  await datasetScanner.run();
})();
