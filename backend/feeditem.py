class FeedItem(object):
    """utilities for working with an individual feed item"""

    def __init__(self, id=None, title=None, link=None, mimeType=None, length=None, description=None, thumbnail=None, published=None):
        super(FeedItem, self).__init__()
        self.id = id
        self.title = title
        self.link = link
        self.thumbnail = thumbnail
        self.type = mimeType
        self.length = length
        self.author = {'name': 'John Doe', 'email': 'john@example.de'}
        self.description = description
        self.published = published
