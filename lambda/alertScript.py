import boto3
import os
import json
client = boto3.client('sns')
def lambda_handler(event, context):
    client.publish(TopicArn=os.environ['ALERT_TOPIC_ARN'], Message="Object uploaded to S3 " + json.dumps(event))
    return { 'statusCode': 200}