import json
import os
from feed import Feed
from feeditem import FeedItem

from utils import get_secrets
from utils import download_video
from utils import download_webpage
from utils import upload_to_storage
from utils import id_generator
from podcast import Podcast


# todo: add an option to download only the audio
# ytdl seems to have a postprocessor option

def run(user_id, video_url, storage_endpoint, media_bucket, service_key, type, region, extractor_key):
    # using the request id as the file name for now
    file_id = id_generator()
    folder = '/tmp'

    if 'youtube' in video_url:
        content_type = 'video/mp4' if type == 'video' else 'audio/mp4'
        description, thumbnail, title, size = download_video(
            video_url, folder, file_id, content_type)
    else:
        # assume its a webpage
        content_type = 'audio/mp3'
        description, thumbnail, title, size = download_webpage(
            region=region, webpage_url=video_url, file_path=f'{folder}/{file_id}', extractor_key=extractor_key)
    link = upload_to_storage(file_path=f"{folder}/{file_id}", storage_endpoint=storage_endpoint,
                             bucket_name=media_bucket, service_key=service_key, content_type=content_type, prefix=user_id)
    podcast = Podcast(user_id, storage_endpoint, service_key)
    fi = FeedItem(file_id, title=title, link=link,
                  mimeType=content_type, length=str(size), description=description, thumbnail=thumbnail)
    podcast.add_podcast_item(fi)


def main(event, context):
    secret_id = os.environ['secret_name']
    region = os.environ['region']
    media_bucket = os.environ['podcast_media_bucket']
    storage_endpoint = os.environ['supabase_url'] + '/storage/v1'
    secrets = get_secrets(secret_id, region)
    video_url = event["video_url"]
    type = event["type"]
    owner = event["owner"]
    service_key = secrets["SERVICE_KEY"]
    extractor_key = secrets["EXTRACTOR_KEY"]

    print(event, context)

    # update the podcast feed with the new video
    try:
        run(owner, video_url,
            storage_endpoint, media_bucket, service_key, type, region, extractor_key)
    except Exception as e:
        print(e)
        return {
            "statusCode": 400,
            "body": str(e)
        }

    body = {
        "message": "Go Serverless v2.0! Your function executed successfully!",
        "input": event,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response
