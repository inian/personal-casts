## Personal Casts

This project lets you add Youtube videos and articles to your own personal podcast feed.

You get a personal podcast URL which you can subscribe to in your pocast player.

## Architecture

When a new row is inserted into the queue-jobs table, it triggers a HTTP endpoint. This HTTP endpoint is an API gateway tied to a lambda function called `queue-convert`. The lambda function invokes a new lambda function `convert` and immediately exits. This makes sure that the triggers remain performant.

The `convert` lambda function downloads the youtube video and uploads the result to Supabase Storage. You have the option of only extracting the audio here. We also get the user's podcast feed from Supabase storage and update the feed to include the new item in the podcast feed.

`convert` also supports converting webpages to audio. We use the [extractorapi](https://extractorapi.com/) to get the text of a webpage and send it to [Amazon Polly](https://aws.amazon.com/polly/) to convert it into an audio file. This way you can listen to articles instead of reading it later.

## Limitations

- Amazon Polly only transcodes the first 3000 characters of the article. We will need to change the synthesizespeechtask api call for larger encodes. This will be slightly more complex since we will need to trigger another lambda function to update the podcast feed after the task is done.
- The podcast URL assumes your user id is private which may not be the case. We should have a separate table mapping the user id and the podcast URL
