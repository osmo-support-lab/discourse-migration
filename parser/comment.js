const fs = require('fs');
const { decode } = require('html-entities');
const yargs = require('yargs');

// Define command-line options using yargs
const options = yargs
  .option('comment_id', {
    alias: 'c',
    describe: 'Filter by comment id',
    type: 'number',
  })
  .option('id', {
    alias: 'i',
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
    const commentId = options.comment_id !== undefined ? parseInt(options.comment_id) : null;
    const threadId = options.id !== undefined ? parseInt(options.id) : null;

    // Filter comments based on command-line arguments and extract required fields
    const filteredComments = comments.filter(comment => {
      return (
        (commentId !== null && comment.id === commentId) ||
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

      return {
        id,
        thread_id,
        parent_id,
        created_at,
        address,
        plaintext: decode(plaintext.replace(/\\n/g, '\n')) // Decode HTML entities and replace escaped newlines
      };
    });

    // Sort comments by created_at in ascending order
    const sortedComments = filteredComments.sort((a, b) => a.created_at.localeCompare(b.created_at));

    // Format the output as a valid JSON string
    const formattedOutput = JSON.stringify(sortedComments, null, 2);

    // Replace escaped newline with actual newline for JSON output
    const finalOutput = formattedOutput.replace(/\\n/g, '\n');

    console.log("Discussion Comments:\n", finalOutput + '\n');
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
