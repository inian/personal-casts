from feedgen.feed import FeedGenerator


class Feed(object):
    """utilities for interacting with a feed"""

    def __init__(self, title=None, link=None, description=None):
        super(Feed, self).__init__()
        self.title = title
        self.link = link
        self.description = description
        self.items = []

    def add_entry(self, fi):
        self.items.append(fi)

    def return_feed(self):
        fg = FeedGenerator()

        fg.load_extension('podcast')
        fg.language('en')
        fg.podcast.itunes_category('Technology', 'Podcasting')
        fg.author({'name': 'John Doe', 'email': 'john@examples.de'})
        fg.podcast.itunes_subtitle(self.description)
        fg.podcast.itunes_summary(self.description)
        fg.podcast.itunes_image(
            "https://trainingindustry.com/content/uploads/2020/01/Ultimate_Podcast_Guide_1920x1080.jpg")

        fg.title(self.title)
        fg.link(href=self.link, rel='alternate')
        fg.description(self.description)

        for item in self.items:
            fe = fg.add_entry()
            fe.podcast.itunes_image(item.thumbnail)
            fe.id(item.id)
            fe.title(item.title)
            fe.published(item.published)
            fe.author(item.author)
            fe.description(item.description)
            fe.enclosure(item.link, item.length, item.type)

        return fg.rss_str().decode("utf-8")
