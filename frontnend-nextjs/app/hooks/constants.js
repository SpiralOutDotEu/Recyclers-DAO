import tokenConfig from './abi/DataGovernanceToken.json';
import governorConfig from './abi/GovernorContract.json';
import timelockConfig from './abi/TimeLock.json';

export const tokenAddress = tokenConfig.address;
export const tokenAbi = tokenConfig.abi;

export const governorAddress = governorConfig.address;
export const governorAbi = governorConfig.abi;
export const timelockAddress = timelockConfig.address;
export const timelockAbi = timelockConfig.abi;


export const customRpcUrl = 'https://filecoin-calibration-testnet.rpc.thirdweb.com';