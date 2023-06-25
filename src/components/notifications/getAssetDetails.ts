// Define ERC20 token ABI
import { ethers } from 'ethers';

const erc20ABI = [
  // Some parts of the ABI are omitted for brevity
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    type: 'function',
  },
];

export async function getAssetDetails(asset: string, amount: string, provider: ethers.AbstractProvider) {
  // Create a contract instance
  const contract = new ethers.Contract(asset, erc20ABI, provider);

  try {
    // Fetch symbol and decimals
    const [symbol, decimals] = await Promise.all([contract.symbol(), contract.decimals()]);

    // Normalize amount
    const normalizedAmount = ethers.formatUnits(amount, decimals);

    return { normalizedAmount, symbol };
  } catch (error) {
    console.error('Error fetching asset details:', error);
  }
}
