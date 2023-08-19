const fs = require('fs');
const yargs = require('yargs');
const colors = require('colors');

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
      const commonwealthId = commonwealthUrl ? commonwealthUrl[1] : null;
      console.log(`Commonwealth ID: ${commonwealthId ? colors.green(commonwealthId) : colors.yellow('N/A')}`);
      console.log(`Title: ${colors.blue(proposal.content.title)}`);
      console.log(); // Empty line between items
    } else {
      console.log(`No proposal found with proposal_id: ${proposalId}`);
      console.log(); // Empty line between items
    }
  }
}

// Function to expand a range of integers (e.g., "200-203") into an array of individual integers [200, 201, 202, 203]
function expandRange(range) {
  const rangeArray = range.split('-').map(Number);
  if (rangeArray.length === 2) {
    const [start, end] = rangeArray;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  return rangeArray;
}

// Define command-line options using yargs
const options = yargs
  .option('proposal_id', {
    alias: 'p',
    describe: 'Specify proposal_id(s) to filter, you can use a range like "200-203"',
    type: 'string',
    demandOption: true,
  })
  .argv;

// Read the JSON data from the file
const filePath = options._[0];
const propList = readJSONFile(filePath);

// Process each proposal_id specified in the command line, including ranges
const proposalIdsInput = options.proposal_id.split(/\s+/);
const proposalIds = proposalIdsInput.flatMap(expandRange).map(proposalId => proposalId.toString());
processPropList(proposalIds);

