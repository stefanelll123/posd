from aws_cdk import (
    App,
    Aws,
    RemovalPolicy,
    Stack,
    aws_cognito as cognito,
    aws_s3 as s3,
    aws_s3_deployment as s3deploy,
    aws_iam as iam,
    region_info as regionInfo
)
from constructs import Construct


app = App()

class CognitoUserPoolStack(Stack):
  def __init__(self,
                scope: Construct,
                id: str,
                **kwargs) -> None:
    super().__init__(scope, id, **kwargs)

    cognito_user_pool = cognito.UserPool(self, "posd-user-pool",
      user_pool_name="posd-user-pool",
      sign_in_aliases=cognito.SignInAliases(
          email=True
      ),
      self_sign_up_enabled=True,
      auto_verify=cognito.AutoVerifiedAttrs(
          email=True
      ),
      user_verification=cognito.UserVerificationConfig(
          email_subject="You need to verify your email",
          email_body="Thanks for signing up Your verification code is {####}",
          email_style=cognito.VerificationEmailStyle.CODE
      ),
      standard_attributes=cognito.StandardAttributes(
          family_name=cognito.StandardAttribute(
              required=True,
              mutable=True,
          ),
          address=cognito.StandardAttribute(
              required=True,
              mutable=True
          )
      ),
      custom_attributes={
          "created_at": cognito.DateTimeAttribute(),
          "employee_id": cognito.NumberAttribute(min=1, max=100, mutable=False),
          "is_admin": cognito.BooleanAttribute(mutable=True),
      },
      password_policy=cognito.PasswordPolicy(
          min_length=8,
          require_lowercase=True,
          require_uppercase=True,
          require_digits=True,
          require_symbols=True
      ),
      account_recovery=cognito.AccountRecovery.EMAIL_ONLY,
      removal_policy=RemovalPolicy.DESTROY
    )

    app_client = cognito_user_pool.add_client(
      "posd-app-client",
      user_pool_client_name="posd-app-client",
      auth_flows=cognito.AuthFlow(
          user_password=True,
          user_srp=True
      )
    )
    
    def createStaticPage(id, resource):    
        bucket = s3.Bucket(self, id, block_public_access=s3.BlockPublicAccess.BLOCK_ALL)
        bucket.grant_read_write(iam.AccountRootPrincipal())
        
        s3deploy.BucketDeployment(self, id + "-file", 
            sources=[s3deploy.Source.asset(resource)],
            destination_bucket=bucket
        )
        
        return bucket
    
    profileBucket = createStaticPage('profile-page-s3', './assets/profile')
    employeesBucket = createStaticPage('employees-page-s3', './assets/employees')
    salariesBucket = createStaticPage('salaries-page-s3', './assets/salaries')
    
    service = iam.FederatedPrincipal('cognito-identity.amazonaws.com')
    
    employeeRole = iam.Role(self, 'Employee', assumed_by=service)
    managerRole = iam.Role(self, 'Manager', assumed_by=service)
    financeRole = iam.Role(self, 'Finance', assumed_by=service)
    ceoRole = iam.Role(self, 'CEO', assumed_by=service)
    itSupportRole = iam.Role(self, 'itSupport', assumed_by=service)
    
    profileBucket.grant_read(employeeRole)
    profileBucket.grant_read(managerRole)
    profileBucket.grant_read(financeRole)
    profileBucket.grant_read(ceoRole)
    profileBucket.grant_read(itSupportRole)
    
    employeesBucket.grant_read(managerRole)
    employeesBucket.grant_read(financeRole)
    employeesBucket.grant_read(ceoRole)
    
    salariesBucket.grant_read(financeRole)
    salariesBucket.grant_read(ceoRole)
    
    employeeUserGroup = cognito.CfnUserPoolGroup(self, 'employee-user-group', user_pool_id=cognito_user_pool.user_pool_id,
                                    description='User pool group for all employees',
                                    group_name="Employees", role_arn=employeeRole.role_arn)
    
    
    managerUserGroup = cognito.CfnUserPoolGroup(self, 'manager-user-group', user_pool_id=cognito_user_pool.user_pool_id,
                                    description='User pool group for managers',
                                    group_name="Managers", role_arn=managerRole.role_arn)
    
    financeUserGroup = cognito.CfnUserPoolGroup(self, 'finance-user-group', user_pool_id=cognito_user_pool.user_pool_id,
                                    description='User pool group for finance',
                                    group_name="Finance", role_arn=financeRole.role_arn)
    
    ceoUserGroup = cognito.CfnUserPoolGroup(self, 'ceo-user-group', user_pool_id=cognito_user_pool.user_pool_id,
                                    description='User pool group for ceo',
                                    group_name="CEO", role_arn=ceoRole.role_arn)
    
    itUserGroup = cognito.CfnUserPoolGroup(self, 'it-user-group', user_pool_id=cognito_user_pool.user_pool_id,
                                    description='User pool group for it support',
                                    group_name="ItSupport", role_arn=itSupportRole.role_arn)
    
    
CognitoUserPoolStack(app, "CognitoUserPoolStack")
app.synth()