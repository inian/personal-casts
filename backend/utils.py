import json

import boto3
from botocore.config import Config
from pytube import YouTube
import requests


def get_secrets(secret_id, region):
    my_config = Config(
        region_name=region,
    )
    client = boto3.client('secretsmanager', config=my_config)
    response = client.get_secret_value(
        SecretId=secret_id,
    )
    return json.loads(response['SecretString'])


def authenticate_request(auth_header, api_key):
    return auth_header[len("Bearer "):] == api_key


def download_video(video_url, folder, file_name):
    # todo: what about extension
    print("downloading ", video_url, file_name)
    yt = YouTube(video_url)
    video = yt.streams.filter(mime_type='video/mp4').first()
    video.download(output_path=folder, filename=file_name, skip_existing=True)
    print(yt)
    print(video)
    print(video.filesize)
    return yt.description, yt.thumbnail_url, yt.title, video.filesize


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


def upload_to_storage(file_path, storage_endpoint, bucket_name, service_key, content_type, file_contents=None):
    print("uploding to storage ", file_path, file_contents)
    if file_contents:
        with open(file_path, "w") as file:
            file.write(file_contents)

    file_name = file_path.split("/")[-1]
    url = f"{storage_endpoint}/object/{bucket_name}/{file_name}"
    response = requests.post(url, files={
        '': ('', open(file_path, 'rb'), content_type)
    }, headers={
        'Authorization': 'Bearer ' + service_key,
        'x-upsert': 'true'
    })

    print(response)
    print(response.text)
    return f"{storage_endpoint}/object/public/{bucket_name}/{file_name}"
