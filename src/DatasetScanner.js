import QuestionsHelper from './helpers/QuestionHelper.js';
import { Scanner } from './Scanner.js';

class DatasetScanner {
  async run() {
    const inputPathAnswer = await QuestionsHelper.askInputPath();
    const scanner = new Scanner(inputPathAnswer.fs.path);
    await scanner.scan();
  }
}

export default DatasetScanner;
