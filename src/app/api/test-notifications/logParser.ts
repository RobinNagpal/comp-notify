import { eth } from 'web3';

export interface Log {
  topics: string[];
  data: string;
  address: string;
  blockHash: string;
  blockNumber: string;
  transactionHash: string;
  transactionIndex: string;
  logIndex: string;
}

export interface SolidityEvent {
  type: string;
  anonymous?: boolean;
  name: string;
  inputs?: any;
}

export function parseLog(log: Log, abi: SolidityEvent[]): any {
  const events = abi.filter((e) => e.type === 'event' && e.anonymous === false);
  const signature = log.topics[0];

  const event = events.find((e) => {
    const signatureMatches = eth.abi.encodeEventSignature(e) === signature;
    return signatureMatches;
  });

  if (!event) {
    return '';
  }

  const rawReturnValues = eth.abi.decodeLog(event.inputs, log.data, log.topics.slice(1));
  const returnValues = Object.keys(rawReturnValues)
    .filter((key) => isNaN(Number(key)) && key !== '__length__')
    .reduce((obj, key) => ({ ...obj, [key]: rawReturnValues[key] }), {});

  return {
    event: event.name,
    signature: signature,
    address: log.address,
    blockHash: log.blockHash,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    transactionIndex: log.transactionIndex,
    logIndex: log.logIndex,
    raw: {
      data: log.data,
      topics: log.topics,
    },
    returnValues: returnValues,
  };
}
