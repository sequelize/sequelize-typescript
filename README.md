# InterCharge (Backend)

This application provides a REST API for the _intercharge_ app and the _Ladestationsfinder_. It also provides a
 cron job scheduled data importer for _eRoamingEVSEData_ and _eRoamingEVSEStatus_ services. 
 
## Server Configuration

### Certificates

Before you can start any server, you have to provide a certificate and a private key for the communication with
 the hubject system under `certificates`.
 
**Notation**

````
  root
    - certificates/
        - private.key
        - private.crt

````

#### Add certificates via .ebextensions (certificates.config)

The certificates for hb authentication will be downloaded from s3 bucket to certificates directory. (Unfortunately it is not possible to download the files directly to the target dir, 
that's why the certificates.config contains a container command for moving the files to the final dir)

In addition to the `certificates.config` file, the bucket policy for the specified files has to be configured to allow elastic beanstalk to download the certificates from the source bucket. 
The policy should look like this:

````
{
	"Id": "Policy1471940803024",
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Stmt1471940796552",
			"Action": [
				"s3:GetObject"
			],
			"Effect": "Allow",
			"Resource": "arn:aws:s3:::intercharge-backend/*",
			"Principal": {
				"AWS": "arn:aws:iam::356886944671:role/aws-elasticbeanstalk-ec2-role"
			}
		}
	]
}
````


### Environment variables

The application needs some environment variables for configuration.

````
  ENVIRONMENT={development|production}
  HBS_EVSE_DATA_ENDPOINT={string}
  NODE_TLS_REJECT_UNAUTHORIZED=0
  HBS_EVSE_STATUS_ENDPOINT={string}
  DB_NAME={string}
  DB_DIALECT=mysql
  DB_USERNAME={string}
  DB_PWD={string}
  DB_HOST={string}

````
 
 **NODE_TLS_REJECT_UNAUTHORIZED** has to be set to 0. Otherwise the self-signed certificates for the 
 communication with hubject system will not work.
 
## Deployment (AWS)

### VPN (VPC)

#### How to create VPN via VPC

http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/vpc-rds.html

1. Use a VPC with public and private subnets.
2. Add a NAT to a public subnet and give it an Elastic IP address.
3. Ensure all traffic from the private subnets goes through your NAT.
4. Create your Elastic Beanstalk application, placing the ELB in a public subnet and the EC2 instances in one or more private subnets.
All incoming traffic will hit your ELB and funnel to your EC2 instances. When your EC2 instances access the web service API, traffic will go through the NAT, thus appearing to originate from the static IP address.
(Source: http://serverfault.com/a/638627)

#### VPC settings can be found in deployment config

`.ebextensions/deployment.config`


### RDS access
The security group of the EC2 instance or the VPC has to be added to the security group of RDS (http://serverfault.com/a/655124). Otherwise RDS will not be accessible from the EC2 instance.

````
Type         | Protocol | Port Range | Source
-------------+----------+------------+-----------
MYSQL/Aurora | TCP      | 3306       | sg-?????

````

## Running node.js server

To start the server use `ENVIRONMENT={development|production} ... DB_HOST={string} npm start` in command line.

## Stack
The application is implemented in _TypeScript_. For the server implementation _express.js_ is used. The framework _sequelize_ 
provides the orm implementation. 

### TypeScript

The documentation for TypeScript can befound [here](https://www.typescriptlang.org/docs/tutorial.html)

### express.js (server framework)

Documentation for the integrated ORM _Sequelize_ can be found [here](http://expressjs.com/en/4x/api.html)

### sequelize (orm)

Documentation for the integrated ORM _Sequelize_ can be found [here](http://docs.sequelizejs.com/en/latest/)

### ORM wrapper for sequelize

For simplicity and to prevent an interface chaos for the interaction of _TypeScript_ and _Sequelize_, a wrapper on top 
of both is implemented. The implementation is currently found in `orm/`.

#### Definition of database models

To define a database model you have to annotate the class(which represents you specific entity) with the `Table` and
`Column` annotations. `Table` for defining the entity and `Column` for defining the column/property of the entity.
 For example:

````

@Table
class Person {

  @Column
  @PrimaryKey
  id: number;

  @Column
  name: string;

}


````

#### Associations

For Relations between entities there are some annotations like `BelongsTo`, `HasOne` or `BelongsToMany` that can be used. To define
foreign keys, use the `ForeignKey` annotation. 

**Many-To-Many**

````

@Table
class Person {

  ... 
  
  @BelongsToMany(() => Group, () => PersonGroup)
  groups: Group[];
  
}

@Table
class Group {

  ...

  @BelongsToMany(() => Person, () => PersonGroup)
  persons: Person[];
  
}

@Table
class PersonGroup {

  @ForeignKey(() => Person)
  personId: number;
  
  @ForeignKey(() => Group)
  groupId: number;

}


````


<!-- TODO -->