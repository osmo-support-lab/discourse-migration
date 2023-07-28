## tooling to handle and organize historical proposal data/off-chain discussion data

requires npm pkgs 'html_objects, yargs'

<br>

'comments' -- find comments by 'id' or 'thread_id', print in chronological order from first to latest 
requires source data as arg '/path/to/data.json', accepts flags '--id'<int/null> and/or '--thread_id'<int/null>
`node comments.js ./data/comment.json --id 69420 --thread_id null`

<br>

'propid' -- find proposal by 'proposal_id', scrape 'thread_id' from commonwealth URL if present
requires source data as arg '/path/to/data.json' and flag '--proposal_id <int>' with one or more values
`node propid.js ./data/proplist.json --proposal_id 569 568`
