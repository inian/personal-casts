from feed import Feed
from feeditem import FeedItem
from utils import upload_to_storage


class Podcast(object):
    """utilities for working with an individual feed item"""

    def __init__(self, user_id, storage_endpoint, service_key):
        super(Podcast, self).__init__()
        self.user_id = user_id
        self.storage_endpoint = storage_endpoint
        self.service_key = service_key
        self.file_name = f'/tmp/{user_id}.xml'
        if False:
            # get feed from table
            self.feed = self.get_podcast_feed(user_id)
        else:
            self.feed = self.initialise_podcast_feed()
            self.update()

    def initialise_podcast_feed(self):
        # adds a new row in the podcast table
        # uploads an empty rss feed to storage
        newFeed = Feed(title="Inian's podcast", link="https://example.com",
                       description="Podcast description")
        return newFeed

    def update(self):
        upload_to_storage(file_contents=self.feed.return_feed(), storage_endpoint=self.storage_endpoint,
                          bucket_name='podcast-xml', service_key=self.service_key, content_type='application/rss+xml', file_path=self.file_name)

    def add_podcast_item(self, feeditem):
        # adds a new item to the user's podcast feed
        # takes in a feeditem
        self.feed.add_entry(feeditem)
        self.update()

        return True
