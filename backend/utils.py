import json
import os
import random
import string

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


def download_video(video_url, folder, file_name, content_type):
    print("downloading ", video_url, file_name, type)
    yt = YouTube(video_url)
    video = yt.streams.filter(mime_type=content_type).first()

    video.download(output_path=folder, filename=file_name, skip_existing=True)
    print(yt)
    print(video)
    print(video.filesize)
    return yt.description, yt.thumbnail_url, yt.title, video.filesize


def download_webpage(region, webpage_url, file_path, extractor_key):
    extractor_response = requests.get(
        f"https://extractorapi.com/api/v1/extractor/?apikey={extractor_key}&url={webpage_url}").json()
    # write polly to mp3
    my_config = Config(
        region_name=region,
    )
    client = boto3.client('polly', config=my_config)
    response = client.synthesize_speech(VoiceId='Joanna',
                                        OutputFormat='mp3',
                                        # polly limit
                                        Text=extractor_response["text"][:3000],
                                        Engine='neural')

    file = open(file_path, 'wb')
    file.write(response['AudioStream'].read())
    file.close()
    # description, thumbnail, title, size
    images = extractor_response["images"]
    jpg_images = [img for img in images if "jpg" in img]
    return extractor_response["url"], jpg_images[0] if jpg_images else None, extractor_response["title"], os.path.getsize(file_path)


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def queue_download(video_url, lambda_name, region, type, owner):
    print("queueing download ", video_url)
    my_config = Config(
        region_name=region,
    )
    client = boto3.client('lambda', config=my_config)
    response = client.invoke(
        FunctionName=lambda_name,
        InvocationType="Event",
        Payload=json.dumps(
            {"video_url": video_url, "type": type, "owner": owner})
    )
    return response


def get_file_from_storage(storage_endpoint, bucket_name, file_name):
    url = f"{storage_endpoint}/object/public/{bucket_name}/{file_name}"
    print(url)
    response = requests.get(url)
    return response.status_code, response.text


def upload_to_storage(file_path, storage_endpoint, bucket_name, service_key, content_type, file_contents=None, prefix=None):
    print("uploding to storage ", file_path, file_contents)
    if file_contents:
        with open(file_path, "w") as file:
            file.write(file_contents)

    file_name = file_path.split("/")[-1]
    if prefix:
        storage_path = f"{bucket_name}/{prefix}/{file_name}"
    else:
        storage_path = f"{bucket_name}/{file_name}"

    url = f"{storage_endpoint}/object/{storage_path}"
    response = requests.post(url, files={
        '': ('', open(file_path, 'rb'), content_type)
    }, headers={
        'Authorization': 'Bearer ' + service_key,
        'x-upsert': 'true'
    })

    print(response)
    print(response.text)
    return f"{storage_endpoint}/object/public/{storage_path}"
