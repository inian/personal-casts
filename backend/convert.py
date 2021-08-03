import json
import os

from utils import get_secrets
from utils import download_video
from utils import upload_to_storage


# todo: add an option to download only the audio
# ytdl seems to have a postprocessor option

def main(event, context):
    secret_id = os.environ['secret_name']
    region = os.environ['region']
    media_bucket = os.environ['podcast_media_bucket']
    storage_endpoint = os.environ['supabase_url'] + '/storage/v1'
    secrets = get_secrets(secret_id, region)

    print(event, context)

    video_url = event["video_url"]

    service_key = secrets["SERVICE_KEY"]

    try:
        # using the request id as the file name for now
        file_name = '/tmp/' + context.aws_request_id
        download_video(video_url, file_name)
        upload_to_storage(file_name, storage_endpoint,
                          media_bucket, service_key)
    except Exception as e:
        print(e)

    # update the podcast feed with the new video

    body = {
        "message": "Go Serverless v2.0! Your function executed successfully!",
        "input": event,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response
