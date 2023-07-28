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
        plaintext,
        parent_id,
        created_by,
        created_at,
        updated_at,
        address
      } = comment;

      return {
        id,
        thread_id,
        plaintext: decode(plaintext.replace(/\\n/g, '\n')), // Decode HTML entities and replace escaped newlines
        parent_id,
        created_by,
        created_at,
        ...(created_at !== updated_at && { updated_at }), // Only include updated_at if it's different from created_at
        address
      };
    });

    // Format the output as a valid JSON string
    const formattedOutput = JSON.stringify(filteredComments, null, 2);

    console.log("Filtered Comments:\n", formattedOutput);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
