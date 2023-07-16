// parse JSON respectively for 'id' and/or 'thread_id', int 'null'
// node script.js /path/to/data.json 69420 null

const fs = require('fs');
const { decode } = require('html-entities');

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
    const id = process.argv[3] ? parseInt(process.argv[3]) : null;
    const threadId = process.argv[4] ? parseInt(process.argv[4]) : null;

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
