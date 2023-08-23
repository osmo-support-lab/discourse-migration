const fs = require('fs');
const { decode } = require('html-entities');
const yargs = require('yargs');

// Define command-line options using yargs
const options = yargs
  .option('id', {
    alias: 'i',
    describe: 'Filter by thread id',
    type: 'number',
  })
  .argv;

// Read the file
const filePath = process.argv[2];
fs.readFile(filePath, 'utf8', (err, jsonString) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  try {
    const data = JSON.parse(jsonString);
    const threads = data.result.threads;

    // Get command-line argument
    const id = options.id !== undefined ? parseInt(options.id) : null;

    // Filter threads based on command-line argument and extract required fields
    const filteredThreads = threads
      .filter(thread => {
        return id === null || thread.id === id;
      })
      .map(thread => {
        const {
          id,
          title,
          address,
          plaintext,
        } = thread;

      const decodedPlaintext = decode(plaintext);
      const correctedPlaintext = decodedPlaintext.replace(/\\n/g, '\n');

        return {
          id,
          title,
          address,
          plaintext: correctedPlaintext,
        };
      });

    // Format the output as a valid JSON string
    const formattedOutput = JSON.stringify(filteredThreads, null, 2);

    // Replace escaped newline with actual newline for JSON outpu
    const finalOutput = formattedOutput.replace(/\\n/g, '\n');

    console.log('Discussion Thread:\n', finalOutput);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
