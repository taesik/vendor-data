import {dynamodbCreateRecord, dynamodbCreateTable, dynamodbDeleteTable, dynamodbDescribeTable} from "./aws";
import vendors from "./data/vendors";

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

async function init() {
  const vendorsTableName = 'vendors';

  const vendorsTable = await dynamodbDescribeTable(vendorsTableName)

  if (!(vendorsTable instanceof Error)) {
    await dynamodbDeleteTable(vendorsTableName);
    delay(6000);
  }

  const vendorTableParams:AWS.DynamoDB.CreateTableInput = {
    TableName:vendorsTableName,
    KeySchema:[
      {'AttributeName':'twitterId','KeyType':'HASH'}
    ],
    AttributeDefinitions:[
      {'AttributeName':'twitterId','AttributeType':'S'}
    ],
    ProvisionedThroughput:{
      ReadCapacityUnits:10,
      WriteCapacityUnits:10,
    }
  }

  await dynamodbCreateTable(vendorTableParams);
  await delay(6000);

  for (const vendor of vendors) {
    const res = await dynamodbCreateRecord(vendorsTableName, vendor);
    if (res instanceof Error) {
      console.log('Error:',vendor,res);
    }
  }

}


init();