import json
import os

from utils import get_secrets
from utils import authenticate_request
from utils import queue_download


# todo: add an option to download only the audio
# ytdl seems to have a postprocessor option

def main(event, context):
    if event["httpMethod"] != 'POST':
        return {
            "statusCode": 405,
            "body": "Invalid method"
        }

    secret_id = os.environ['secret_name']
    region = os.environ['region']
    lambda_name = os.environ['lambda_name']
    secrets = get_secrets(secret_id, region)
    api_key = secrets["API_KEY"]

    is_authenticated_user = False
    if "Authorization" in event["headers"]:
        auth_headers = event["headers"]["Authorization"]
        is_authenticated_user = authenticate_request(auth_headers, api_key)

    print(is_authenticated_user)

    if not is_authenticated_user:
        return {
            "statusCode": 401,
            "body": json.dumps({
                "error": "Unauthorized"
            })
        }

    # async invoke the lambda here
    request_body = json.loads(event["body"])["record"]
    video_url = request_body["video_url"]
    type = request_body["type"]
    queue_download(video_url, lambda_name, region, type)

    body = {
        "message": "Go Serverless v2.0! Your function executed successfully!",
        "input": event,
    }

    response = {"statusCode": 200, "body": json.dumps(body)}

    return response
