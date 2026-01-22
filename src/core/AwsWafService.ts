// import { WAFV2 } from 'aws-sdk';
// import { AWS_ACCESS_KEY, AWS_LOCATION, AWS_SECRET_KEY, IPADDRESSVERSION, IPBlockStatus, WAFSCOPE } from '../config';


// export class AwsWafService {

//     private wafClient: WAFV2;
//     private wafScope: string;

//     constructor() {
//         this.wafClient = new WAFV2({
//             accessKeyId: AWS_ACCESS_KEY,
//             secretAccessKey: AWS_SECRET_KEY,
//             region: AWS_LOCATION
//         })
//         this.wafScope = WAFSCOPE
//     }

//     /**
//     List all IP sets in this scope
//     **/
//     public listAllIpsets(): Promise<any> {
//         return new Promise(async (resolve, reject) => {
//             try {

//                 const resp = await this.wafClient.listIPSets({
//                     Scope: this.wafScope,
//                 }).promise();

//                 resolve(resp)
//             } catch (error) {
//                 console.log('-------AwsWafService.listAllIpsets----', error);
//                 reject(error)
//             }
//         })
//     }

//     /**
//     Get a single IP set by ID and Name
//     **/
//     public getIpSet(id: string, name: string): Promise<any> {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 const resp = await this.wafClient.getIPSet({
//                     Id: id,
//                     Name: name,
//                     Scope: this.wafScope,
//                 }).promise();

//                 resolve(resp);
//             } catch (error) {
//                 console.log('-------AwsWafService.getIpSet----', error);
//                 reject(error)
//             }
//         })
//     }

//     /**
//     Create a new IP set
//     **/
//     public createIpSet(name: string, addresses: string[], description = ''): Promise<any> {
//         return new Promise(async (resolve, reject) => {
//             try {

//                 const resp = await this.wafClient.createIPSet({
//                     Name: name,
//                     Scope: this.wafScope,
//                     IPAddressVersion: IPADDRESSVERSION,
//                     Addresses: addresses,
//                     Description: description,
//                 }).promise();

//                 resolve(resp);
//             } catch (error) {
//                 console.log('-------AwsWafService.getIpSet----', error);
//                 reject(error)
//             }
//         })

//     }

//     /**
//     Update an existing IP set's addresses
//     **/
//     public async updateIpSet(id: string, name: string, newAddress: string, isUpdateRemoveFlag: IPBlockStatus): Promise<any> {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 // fetch the latest IPSet with LockToken
//                 const getResp = await this.getIpSet(id, name);

//                 let addresses: string[] = getResp.IPSet.Addresses || [];

//                 const ipCidr = newAddress.includes('/') ? newAddress : `${newAddress}/32`;

//                 if (isUpdateRemoveFlag.includes(IPBlockStatus.ACTIVE)) {
//                     // update or add the IP
//                     if (!addresses.includes(ipCidr)) {
//                         addresses = [...addresses, ipCidr];
//                     }
//                 } else {
//                     // Remove IP
//                     addresses = addresses.filter(addr => addr !== ipCidr);
//                 }


//                 // update IPSet
//                 const resp = await this.wafClient.updateIPSet({
//                     Id: id,
//                     Name: name,
//                     Scope: this.wafScope,
//                     Addresses: addresses,
//                     LockToken: getResp.LockToken!,
//                 }).promise();

//                 resolve(resp);
//             } catch (error) {
//                 console.error('-------AwsWafService.updateIpSet----', error);
//                 reject(error)
//             }
//         });
//     }

//     /**
//     Remove an existing IP set's addresses
//     **/
//     public async removeIpSet(id: string, name: string, newAddresses: string[]): Promise<any> {
//         return new Promise(async (resolve, reject) => {
//             try {
                
//                 // fetch the latest IPSet with LockToken
//                 const getResp = await this.getIpSet(id, name);

//                 // current addresses in the IPSet
//                 let addresses: string[] = getResp.IPSet.Addresses || [];

//                 // normalize each input IP to CIDR format
//                 const ipCidrs = newAddresses.map(ip =>
//                     ip.includes('/') ? ip : `${ip}/32`
//                 );

//                 // Remove each IP
//                 addresses = addresses.filter(addr => !ipCidrs.includes(addr));

//                 // update IPSet on AWS
//                 const resp = await this.wafClient
//                     .updateIPSet({
//                         Id: id,
//                         Name: name,
//                         Scope: this.wafScope,
//                         Addresses: addresses,
//                         LockToken: getResp.LockToken!,
//                     })
//                     .promise();

//                 resolve(resp);
//             } catch (error) {
//                 console.error('-------AwsWafService.removeIpSet----', error);
//                 reject(error);
//             }
//         });
//     }

// }


