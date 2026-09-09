import { Badge, Button, Notice, SectionHeading } from "gloomberb/components";
import { Box } from "gloomberb/ui";
import type { TickerFinancials } from "gloomberb/types/financials";
import type { TickerRecord } from "gloomberb/types/ticker";
import type { BrokerAccount } from "gloomberb/types/trading";
import { formatCurrency } from "gloomberb/utils";
import {
  formatQuoteSummary,
  truncateTradeText as truncateText,
  type TradeTone,
} from "../utils";

export function TradeTabHeader({
  ticker,
  financials,
  profileLabel,
  isGatewayMode,
  connectionTone,
  currentAccountId,
  lockedBrokerInstanceId,
  hasAccount,
  activeAccount,
  interactive,
  nextStep,
  workflowTone,
  statusText,
  busy,
  hasError,
  isSuccess,
  onEnterInteractive,
  onExitInteractive,
  onChooseBrokerInstance,
  onChooseAccount,
  onRefresh,
}: {
  ticker: TickerRecord;
  financials?: TickerFinancials | null;
  profileLabel?: string;
  isGatewayMode: boolean;
  connectionTone: TradeTone;
  currentAccountId?: string;
  lockedBrokerInstanceId?: string;
  hasAccount: boolean;
  activeAccount?: BrokerAccount;
  interactive: boolean;
  nextStep: string;
  workflowTone: TradeTone;
  statusText: string;
  busy: boolean;
  hasError: boolean;
  isSuccess: boolean;
  onEnterInteractive: () => void;
  onExitInteractive: () => void;
  onChooseBrokerInstance: () => void;
  onChooseAccount: () => void;
  onRefresh: () => void;
}) {
  return (
    <>
      <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between">
        <Box flexDirection="column" marginBottom={1}>
          <SectionHeading title={[
            `Trade ${ticker.metadata.ticker}`,
            ticker.metadata.name !== ticker.metadata.ticker ? ticker.metadata.name : null,
          ].filter(Boolean).join(" · ")} />
          <Notice tone="muted">{formatQuoteSummary(financials?.quote, { assetCategory: ticker.metadata.assetCategory })}</Notice>
        </Box>

        <Box flexDirection="row" flexWrap="wrap" justifyContent="flex-end" gap={1}>
          <Button
            label={`Broker ${profileLabel ? `${profileLabel} ${isGatewayMode ? "Gateway" : "Flex"}` : "Select profile"}`}
            active={connectionTone === "positive" || connectionTone === "accent"}
            stopPropagation
            onPress={() => { onEnterInteractive(); onChooseBrokerInstance(); }}
          />
          <Button
            label={`Account ${currentAccountId || (lockedBrokerInstanceId ? "Locked" : "Select")}`}
            active={hasAccount}
            stopPropagation
            onPress={() => { onEnterInteractive(); onChooseAccount(); }}
          />
          {activeAccount ? <Badge label={`Net Liq ${formatCurrency(activeAccount.netLiquidation || 0, activeAccount.currency || "USD")}`} />
            : <Button label="Net Liq —" stopPropagation onPress={() => { onEnterInteractive(); onChooseAccount(); }} />}

        </Box>
      </Box>

      <Box flexDirection="row" flexWrap="wrap" gap={1}>
        <Badge label={`Next ${nextStep}`} tone={workflowTone} />
        <Button
          label={`Ticket ${interactive ? "Captured" : "Standby"}`}
          active={interactive}
          onPress={() => (interactive ? onExitInteractive() : onEnterInteractive())}
        />
        <Button
          label="Refresh"
          variant="ghost"
          disabled={busy}
          onPress={onRefresh}
        />
      </Box>

      <Notice tone={hasError ? "negative" : isSuccess ? "positive" : "muted"}>
        {truncateText(statusText, 160)}
      </Notice>
    </>
  );
}
