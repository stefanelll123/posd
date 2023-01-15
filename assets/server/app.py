from flask import Flask
from flask_cors import CORS, cross_origin
from flask import Response, request
import os
import cognitojwt

import boto3

app = Flask(__name__)
CORS(app)
#cors = CORS(app, resources={r"*": {"origins": "*"}})

def validateGroupUpdateInput(input):
    if input.get('username') == None or input.get('groupName') == None:
        return False
    if input['username'] == '' or input['groupName'] == '':
        return False
    
    return True

attributions = {
    'profile': ['CEO', 'ItSupport', 'Managers', 'Finance', 'Employees'],
    'employees': ['CEO', 'Managers', 'Finance'],
    'salaries': ['CEO', 'Finance'],
    'access': ['CEO', 'ItSupport'],
}

def validateRole(headers, action):
    accessToken = headers.get('Authorization')
    region = 'us-east-1'
    userPoolId = os.environ.get('USER_POOL_ID')
    clientId = os.environ.get('USER_POOL_WEB_CLIENT_ID')
    claims = cognitojwt.decode(accessToken, region, userPoolId, app_client_id=clientId, testmode=True)
    
    roles = claims['cognito:groups']
    for role in roles:
        if role in attributions[action]:
            return True
    
    return False
    

@app.route("/api/access/add", methods = ['POST'])
#@cross_origin()
def addAccess():
    try:
        if not validateRole(request.headers, 'access'):
            return Response(status=401)
        
        if request == None or len(request.data) == 0:
            return Response(status=400)
        
        input = request.json
        userPoolId = os.environ.get('USER_POOL_ID')
        
        if not validateGroupUpdateInput(input):
            return Response(status=400)
        
        client = boto3.client('cognito-idp')
        client.admin_add_user_to_group(
            UserPoolId=userPoolId,
            Username=input['username'],
            GroupName=input['groupName']
        )
        
        return Response(status=200)
    except:
        return Response(status=500)
  
@app.route("/api/access/remove", methods = ['POST'])
#@cross_origin()
def removeAccess():
    try:    
        if not validateRole(request.headers, 'access'):
            return Response(status=401)
        if request == None or len(request.data) == 0:
            return Response(status=400)
        
        input = request.json
        userPoolId = os.environ.get('USER_POOL_ID')
        
        if not validateGroupUpdateInput(input):
            return Response(status=400)
        
        client = boto3.client('cognito-idp')
        client.admin_remove_user_to_group(
            UserPoolId=userPoolId,
            Username=input['username'],
            GroupName=input['groupName']
        )
        
        return Response(status=200) 
    except:
        return Response(status=500) 
    
@app.route("/api/profile", methods = ['GET'])
#@cross_origin()
def getProfile():
    try:    
        if not validateRole(request.headers, 'profile'):
            return Response(status=401)
        
        profileBucketName = os.environ.get('PROFILE_BUCKET')
        
        client = boto3.client('s3')
        response = client.get_object(Bucket=profileBucketName, Key='index.html')
        page = response['Body'].read()
        
        return Response(page, status=200) 
    except:
        return Response(status=500) 
    
    
@app.route("/api/employees", methods = ['GET'])
#@cross_origin()
def getEmployees():
    try:    
        if not validateRole(request.headers, 'employees'):
            return Response(status=401)
        
        employeesBucketName = os.environ.get('EMPLOYEES_BUCKET')
        print(employeesBucketName)
        
        client = boto3.client('s3')
        response = client.get_object(Bucket=employeesBucketName, Key='index.html')
        print(response)
        page = response['Body'].read()
        
        return Response(page, status=200) 
    except Exception as e:
        print(e)
        return Response(status=500) 
    
@app.route("/api/salaries", methods = ['GET'])
#@cross_origin()
def getSalaries():
    try:    
        if not validateRole(request.headers, 'salaries'):
            return Response(status=401)
        
        salariesBucketName = os.environ.get('SALARIES_BUCKET')
        
        client = boto3.client('s3')
        response = client.get_object(Bucket=salariesBucketName, Key='index.html')
        page = response['Body'].read()
        
        return Response(page, status=200) 
    except:
        return Response(status=500) 

@app.route("/api/users", methods = ['POST'])
#@cross_origin()
def createUser():
    try:
        if not validateRole(request.headers, 'access'):
            return Response(status=401)
        userPoolId = os.environ.get('USER_POOL_ID')
        
        if request == None or len(request.data) == 0:
            return Response(status=400)
        
        input = request.json
        
        client = boto3.client('cognito-idp')
        client.admin_create_user(
            UserPoolId=userPoolId,
            Username=input['username'],
            ValidationData=[
                {
                    'Name': 'Email',
                    'Value': input['username']
                }
            ],
            TemporaryPassword=input['temporaryPassword'],
            DesiredDeliveryMediums=['EMAIL']
        )
        
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=500)

@app.route('/api/test', methods = ['POST'])
def testing():
    print('START TESTING')
    try:
        token = request.json['token']
        region = 'us-east-1'
        userPoolId = os.environ.get('USER_POOL_ID')
        clientId = os.environ.get('USER_POOL_WEB_CLIENT_ID')
        
        app.logger.info(userPoolId)
        app.logger.info(clientId)
        
        print(userPoolId)
        print(clientId)        
        
        try:
            claims = cognitojwt.decode(token, region, userPoolId, app_client_id=clientId, testmode=True)
            app.logger.info(claims)
            print(claims)
        except Exception as e:
            print(e) 
            print('Error first decoding') 
    except:
        print('EROAREEE') 
    
    return Response(status=200)

app.run(debug=True)