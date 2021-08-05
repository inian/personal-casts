import feedparser
from feed import Feed
from feeditem import FeedItem

from utils import upload_to_storage
from utils import get_file_from_storage


class Podcast(object):
    """utilities for working with an individual feed item"""

    def __init__(self, user_id, storage_endpoint, service_key):
        super(Podcast, self).__init__()
        self.user_id = user_id
        self.storage_endpoint = storage_endpoint
        self.service_key = service_key
        self.file_name = f'/tmp/{user_id}.xml'
        status, body = get_file_from_storage(storage_endpoint=storage_endpoint,
                                             bucket_name='podcast-xml', file_name=f'{user_id}.xml')
        if status == 200:
            self.feed = self.parse_feed(body)
        else:
            self.feed = self.initialise_podcast_feed()
            self.update()

    def initialise_podcast_feed(self):
        newFeed = Feed(title="Inian's podcast", link="https://example.com",
                       description="Podcast description")
        return newFeed

    def update(self):
        upload_to_storage(file_contents=self.feed.return_feed(), storage_endpoint=self.storage_endpoint,
                          bucket_name='podcast-xml', service_key=self.service_key, content_type='application/rss+xml', file_path=self.file_name)

    def add_podcast_item(self, feeditem):
        self.feed.add_entry(feeditem)
        return self.update()

    def parse_feed(self, feed_content):
        d = feedparser.parse(feed_content)
        feed = Feed(title=d.feed.title, link=d.feed.link,
                    description=d.feed.subtitle)
        for entry in d.entries:
            print(entry['links'])
            fi = FeedItem(id=entry['id'], title=entry['title'], link=entry['links'][-1]['href'], mimeType=entry[
                'links'][-1]['type'], length=entry['links'][-1]['length'], description=entry['summary'])
            feed.add_entry(fi)
        return feed
