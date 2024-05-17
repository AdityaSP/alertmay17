import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AlertStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  //First hat: Infra provider or Framework team
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
    const lamname = new cdk.CfnOutput(this, 'alertlambdaname', {
      value: lam.functionName,
      exportName: 'alter-lambda-name'
    })

  }
}
