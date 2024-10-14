// Captures 0x + 4 characters, then the last 6 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{6})$/

/**
 * Truncates an ethereum address to the format 0x0000…000000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateEthAddress = (address: string) => {
  const match = address.match(truncateRegex)
  if (!match) return address
  return `${match[1]}…${match[2]}`
}

const adjustSpacing = (tick: number, spacing: number) => {
  return Math.floor(tick / spacing) * spacing
}

function calculateInitialTick(totalSupply: number, marketCap: number, tickSpacing: number) {
  return adjustSpacing(
    Math.floor(Math.log(Math.sqrt(marketCap / totalSupply)) / Math.log(Math.sqrt(1.0001))),
    tickSpacing,
  )
}

export { truncateEthAddress, calculateInitialTick }
