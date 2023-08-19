tooling to handle and organize historical proposal data/off-chain discussion data

requires npm pkgs 'html-objects, yargs, colors, chalk'

<br>

'propid' -- find proposal by 'proposal_id', scrape 'thread_id' from commonwealth URL if present
requires source data as arg '/path/to/data.json' and flag '--proposal_id <int>' with one or more values
<br>

`node propid.js ./data/proplist.json --proposal_id 569 568`

<br>

'thread' -- find thread by `id` and print
specify source as arg `/path/to/data.json`, req flag `'--id'<int/null>`
<br>

`node thread.js ./data/threads.json -i 1546`

<br>

'comment' -- find comments by `id` [matches 'threads' `id`] or `comment_id`, print in chronological order from first to latest 
specify source as arg `/path/to/data.json`, req one or more flags ` '--id'<int/null> '--comment_id'<int/null>`
<br>

`node comment.js ./data/comments.json -i 1546`
