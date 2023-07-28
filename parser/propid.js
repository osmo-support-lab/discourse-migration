const fs = require('fs');
const yargs = require('yargs');

// Read the JSON file
function readJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON file:', err.message);
    return null;
  }
}

// Process the filtered proposal list
function processPropList(proposalIds) {
  for (const proposalId of proposalIds) {
    const proposal = propList.find(item => item.proposal_id === proposalId.toString());
    if (proposal) {
      console.log(`Processing Proposal ID: ${proposalId}`);
      const commonwealthUrl = proposal.content.description.match(/https:\/\/commonwealth.im\/osmosis\/discussion\/(\d+)/);
      const commonwealthId = commonwealthUrl ? commonwealthUrl[1] : 'N/A';
      console.log(`Commonwealth ID: ${commonwealthId}`);
    } else {
      console.log(`No proposal found with proposal_id: ${proposalId}`);
    }
  }
}

// Define command-line options using yargs
const options = yargs
  .option('proposal_id', {
    alias: 'p',
    describe: 'Specify proposal_id to filter',
    type: 'array',
    demandOption: true,
  })
  .argv;

// Read the JSON data from the file
const filePath = options._[0];
const propList = readJSONFile(filePath);

// Process each proposal_id specified in the command line
const proposalIds = options.proposal_id.map(proposalId => proposalId.toString());
processPropList(proposalIds);
