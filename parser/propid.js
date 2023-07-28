const fs = require('fs');
const { decode } = require('html-entities');
const yargs = require('yargs');

// Define command-line options using yargs
const options = yargs
  .option('proposal_id', {
    alias: 'p',
    describe: 'Specify proposal_id to filter',
    type: 'array',
    demandOption: true,
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

    // Get proposal_ids from command-line argument
    const proposalIds = options.proposal_id;

    // Filter proposals based on command-line argument 'proposalIds'
    const filteredProposals = data.filter(proposal => {
      return proposalIds.includes(proposal.proposal_id);
    });

    // Process each filtered proposal
    filteredProposals.forEach(proposal => {
      // Extract the description from the filtered proposal
      const description = proposal.content.description;

      // Extract the number after '/discussion/' in the description URL
      const urlPattern = /\/discussion\/(\d+)/;
      const match = description.match(urlPattern);

      // Check if the desired URL pattern is found
      if (match) {
        const discussionNumber = parseInt(match[1]);
        console.log(`Proposal ID: ${proposal.proposal_id}, Discussion Number: ${discussionNumber}`);
      } else {
        console.log(`Proposal ID: ${proposal.proposal_id}, No discussion URL with domain "commonwealth.im" found in the description.`);
      }
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
