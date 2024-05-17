import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AlertStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new cdk.aws_sns.Topic(this, "S3AlertAdi");
    const sub = new cdk.aws_sns_subscriptions.EmailSubscription('sp.aditya@gmail.com')
    topic.addSubscription(sub)
    
    const lam = new cdk.aws_lambda.Function(this, 'alert', {
      runtime : cdk.aws_lambda.Runtime.PYTHON_3_12,
      code: cdk.aws_lambda.Code.fromAsset('./lambda'),
      handler: 'alertScript.lambda_handler',
      environment: {'ALERT_TOPIC_ARN': topic.topicArn}
    })

    const snspublish = new cdk.aws_iam.PolicyStatement({
      actions: ['sns:publish'],
      resources: ['*']
    })

    lam.addToRolePolicy(snspublish)
    
    const mys3 = new cdk.aws_s3.Bucket(this, 'mys3', {
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    // const eventTypes : cdk.aws_s3.EventType[] = [
    //   cdk.aws_s3.EventType.OBJECT_CREATED,
    //   cdk.aws_s3.EventType.OBJECT_REMOVED
    // ];

    mys3.addEventNotification(
          cdk.aws_s3.EventType.OBJECT_CREATED, 
          new cdk.aws_s3_notifications.LambdaDestination(lam))
    mys3.addEventNotification(
      cdk.aws_s3.EventType.OBJECT_REMOVED,
      new cdk.aws_s3_notifications.LambdaDestination(lam)
    );

    
  }
}
