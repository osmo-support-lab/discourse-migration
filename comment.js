const fs = require('fs');
const { decode } = require('html-entities');
const yargs = require('yargs');

// Define command-line options using yargs
const options = yargs
  .option('id', {
    alias: 'i',
    describe: 'Filter by comment id',
    type: 'number',
  })
  .option('thread_id', {
    alias: 't',
    describe: 'Filter by comment thread_id',
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
    const comments = data.result.comments;

    // Get command-line arguments
    const id = options.id !== undefined ? parseInt(options.id) : null;
    const threadId = options.thread_id !== undefined ? parseInt(options.thread_id) : null;

    // Filter comments based on command-line arguments and extract required fields
    const filteredComments = comments.filter(comment => {
      return (
        (id !== null && comment.id === id) ||
        (threadId !== null && comment.thread_id === threadId)
      );
    }).map(comment => {
      const {
        id,
        thread_id,
        parent_id,
        created_at,
        address,
        plaintext
      } = comment;

      const decodedPlaintext = decode(plaintext);
      const correctedPlaintext = decodedPlaintext.replace(/\\n/g, '\n');

      return {
        id,
        thread_id,
        parent_id,
        created_at,
        address,
        plaintext: correctedPlaintext
      };
    });

    // Sort the comments by created_at in ascending order (oldest to newest)
    const sortedComments = filteredComments.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });

    // Format the output as a valid JSON string
    const formattedOutput = JSON.stringify(filteredComments, null, 2);

    // Replace escaped newline with actual newline for JSON output
    const finalOutput = formattedOutput.replace(/\\n/g, '\n');

    console.log("Discussion Comments:\n", finalOutput);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

