import json

import boto3
from botocore.config import Config
import youtube_dl
import requests


def get_secrets(secret_id, region):
    my_config = Config(
        region_name=region,
    )
    client = boto3.client('secretsmanager', config=my_config)
    response = client.get_secret_value(
        SecretId=secret_id,
    )
    print(response)
    return json.loads(response['SecretString'])


def authenticate_request(auth_header, api_key):
    return auth_header[len("Bearer "):] == api_key


def download_video(video_url, file_name):
    # todo: what about extension
    print("downloading ", video_url, file_name)
    ydl_opts = {
        'outtmpl': file_name,
        'forcefilename': True,
        'forcejson': True
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        response = ydl.download([video_url])
        print(response)


def queue_download(video_url, lambda_name, region):
    print("queueing download ", video_url)
    my_config = Config(
        region_name=region,
    )
    client = boto3.client('lambda', config=my_config)
    response = client.invoke(
        FunctionName=lambda_name,
        InvocationType="Event",
        Payload=json.dumps({"video_url": video_url})
    )
    return response


def upload_to_storage(file_path, storage_endpoint, service_key):
    print("uploding to storage ", file_path)
    response = requests.post(storage_endpoint + '/object/podcast-media/video.mp4', files={
        '': ('', open(file_path, 'rb'), 'video/mp4')
    }, headers={
        'Authorization': 'Bearer ' + service_key,
        'x-upsert': 'true'
    })
    print(response)
    print(response.text)
    return True
