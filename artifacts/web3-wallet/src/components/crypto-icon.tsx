const COIN_ICONS: Record<string, string> = {
  BTC:   "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH:   "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  BNB:   "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  USDT:  "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  USDC:  "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  POL:   "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  AVAX:  "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  ARB:   "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  OP:    "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  SOL:   "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  DOT:   "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
  ADA:   "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  XRP:   "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  DOGE:  "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  SHIB:  "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
  LINK:  "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  UNI:   "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
  LTC:   "https://assets.coingecko.com/coins/images/2/small/litecoin.png",
  ATOM:  "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
  DAI:   "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
  AAVE:  "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  CRV:   "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
  MKR:   "https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png",
  COMP:  "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  FTM:   "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png",
  NEAR:  "https://assets.coingecko.com/coins/images/10365/small/near.jpg",
  ICP:   "https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png",
  APT:   "https://assets.coingecko.com/coins/images/26455/small/aptos_round.png",
  SUI:   "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg",
  NX:    "",
  NEXA:  "",
};

const COIN_COLORS: Record<string, string> = {
  BTC:  "#F7931A",
  ETH:  "#627EEA",
  BNB:  "#F0B90B",
  USDT: "#26A17B",
  USDC: "#2775CA",
  MATIC:"#8247E5",
  POL:  "#8247E5",
  AVAX: "#E84142",
  ARB:  "#28A0F0",
  OP:   "#FF0420",
  SOL:  "#9945FF",
  DOT:  "#E6007A",
  ADA:  "#0033AD",
  XRP:  "#00AAE4",
  DOGE: "#C3A634",
  SHIB: "#FFA409",
  LINK: "#2A5ADA",
  UNI:  "#FF007A",
  LTC:  "#BFBBBB",
  ATOM: "#2E3148",
  DAI:  "#F5AC37",
  NX:   "#5B5BE6",
  NEXA: "#5B5BE6",
};

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
  logoUrl?: string;
}

export function CryptoIcon({ symbol, size = 32, className = "", logoUrl }: CryptoIconProps) {
  const upper = symbol.toUpperCase();
  const src = logoUrl || COIN_ICONS[upper];
  const bg = COIN_COLORS[upper] || "#5B5BE6";

  const style: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: "50%",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={upper}
        width={size}
        height={size}
        style={style}
        className={`object-cover ${className}`}
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const parent = el.parentElement;
          if (parent) {
            parent.style.backgroundColor = bg;
            parent.style.display = "flex";
            parent.style.alignItems = "center";
            parent.style.justifyContent = "center";
            parent.style.color = "#fff";
            parent.style.fontWeight = "700";
            parent.style.fontSize = `${Math.round(size * 0.38)}px`;
            parent.textContent = upper.slice(0, 2);
          }
        }}
      />
    );
  }

  return (
    <div
      style={{ ...style, backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: Math.round(size * 0.38) }}
      className={className}
    >
      {upper.slice(0, 2)}
    </div>
  );
}
