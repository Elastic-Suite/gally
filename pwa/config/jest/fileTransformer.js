/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  process(sourceText, sourcePath) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    }
  },
}
