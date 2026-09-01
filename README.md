# IBKR Gateway for Gloomberb

Live market data, the trading console, and order entry through IBKR Gateway or TWS.

```bash
gloomberb install gloom-sh/gloomberb-ibkr-gateway
```

Requires [`gloomberb-ibkr`](https://github.com/gloom-sh/gloomberb-ibkr), which owns the Interactive Brokers profile. Install both, then set a profile's connection mode to Gateway.

Press `IBKR` in the command bar for the trading console, or use the Trade tab on any ticker.

## Terminal and desktop only

Gateway speaks the TWS API over a raw TCP socket to a local Gateway or TWS process. A browser cannot open one, so this plugin declares `targets: ["cli", "tui", "desktop"]` and does not appear as installable at term.gloom.sh.

Flex account sync has no such limit — that is why the two are separate plugins.

## What it adds

- **IBKR Console** pane: connection status, accounts, open orders, executions
- **Trade** tab on the ticker research pane, with preview, place, modify, and cancel
- Live quotes, price history, and instrument search sourced from Gateway
- `Buy Selected` / `Sell Selected` commands

## Development

`gloomberb`, `gloomberb-ibkr`, and `react` are peer dependencies. Gloomberb links its own copies in at install time so there is one instance of each in the process.

```bash
bun install
git clone --depth 1 https://github.com/gloom-sh/gloomberb.git /tmp/gloomberb
bun install --cwd /tmp/gloomberb
ln -sfn /tmp/gloomberb node_modules/gloomberb
ln -sfn /tmp/gloomberb/node_modules/react node_modules/react
bun run typecheck && bun test
```

## License

MIT
