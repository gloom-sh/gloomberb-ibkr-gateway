import { Badge, Button, Notice, SectionHeading, type ButtonVariant } from "gloomberb/components";
import { Box } from "gloomberb/ui";
import { colors } from "gloomberb/theme";
import type { BrokerContractRef } from "gloomberb/types/instrument";
import type { TickerRecord } from "gloomberb/types/ticker";
import { formatMarketPrice, formatMarketQuantity } from "gloomberb/market-data";
import type { TradeTicketState } from "../trading/state";
import { truncateTradeText as truncateText } from "./utils";

/** Formats a ticket field and enters capture mode before opening its domain editor. */
function TicketField({ label, value, fieldWidth, widthOverride, active, disabled, variant, onEnterInteractive, onPress }: {
  label: string;
  value: string;
  fieldWidth: number;
  widthOverride?: number;
  active?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  onEnterInteractive: () => void;
  onPress?: () => void;
}) {
  const width = widthOverride ?? fieldWidth;
  const display = truncateText(`${label} ${value}`, Math.max(6, width - 2));
  return <Box width={width} marginRight={1}>
    {onPress ? <Button
      label={`${label} ${value}`} displayLabel={display} width={width}
      active={active} disabled={disabled} variant={variant}
      stopPropagation
      onPress={() => { onEnterInteractive(); onPress(); }}
    /> : <Badge label={display} />}
  </Box>;
}

export function TradeTicketPanel({
  interactive,
  panelWidth,
  ticketPanelWidth,
  coreFieldWidth,
  orderFieldWidth,
  fieldWidth,
  fieldTextWidth,
  ticketHint,
  profileLabel,
  hasProfile,
  contractValue,
  hasContract,
  currentAccountId,
  hasAccount,
  ticketState,
  ticker,
  activeContract,
  showLimit,
  showStop,
  contractMeta,
  onEnterInteractive,
  onChooseBrokerInstance,
  onChooseInstrument,
  onChooseAccount,
  onToggleSide,
  onEditOrderType,
  onEditQuantity,
  onEditLimitPrice,
  onEditStopPrice,
}: {
  interactive: boolean;
  panelWidth?: number;
  ticketPanelWidth: number;
  coreFieldWidth: number;
  orderFieldWidth: number;
  fieldWidth: number;
  fieldTextWidth: number;
  ticketHint: string;
  profileLabel?: string;
  hasProfile: boolean;
  contractValue: string;
  hasContract: boolean;
  currentAccountId?: string;
  hasAccount: boolean;
  ticketState: TradeTicketState;
  ticker: TickerRecord;
  activeContract: BrokerContractRef;
  showLimit: boolean;
  showStop: boolean;
  contractMeta: string;
  onEnterInteractive: () => void;
  onChooseBrokerInstance: () => void;
  onChooseInstrument: () => void;
  onChooseAccount: () => void;
  onToggleSide: () => void;
  onEditOrderType: () => void;
  onEditQuantity: () => void;
  onEditLimitPrice: () => void;
  onEditStopPrice: () => void;
}) {
  const fieldProps = {
    fieldWidth,
    onEnterInteractive,
  };

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      width={panelWidth}
      border
      borderStyle="rounded"
      borderColor={interactive ? colors.borderFocused : colors.border}
      paddingX={1}
    >
      <Box height={1} flexDirection="row">
        <SectionHeading title="Ticket" />
        <Box flexGrow={1} />
        <Badge label={interactive ? "Captured" : "Ready"} tone={interactive ? "positive" : "neutral"} />
      </Box>
      <Notice tone="muted">{truncateText(ticketHint, Math.max(ticketPanelWidth - 4, 24))}</Notice>
      <Box height={1} />

      <Box flexDirection="row" flexWrap="wrap">
        <TicketField
          {...fieldProps}
          label="Profile"
          value={profileLabel ?? "Choose profile"}
          active={hasProfile}
          widthOverride={coreFieldWidth}
          onPress={onChooseBrokerInstance}
        />
        <TicketField
          {...fieldProps}
          label="Ticker"
          value={contractValue}
          active={hasContract}
          widthOverride={coreFieldWidth}
          onPress={onChooseInstrument}
        />
        <TicketField
          {...fieldProps}
          label="Account"
          value={currentAccountId || "Select account"}
          active={hasAccount}
          widthOverride={coreFieldWidth}
          onPress={onChooseAccount}
        />
      </Box>
      <Box height={1} />
      <Box flexDirection="row" flexWrap="wrap">
        <TicketField
          {...fieldProps}
          label="Side"
          value={ticketState.draft.action}
          variant={ticketState.draft.action === "BUY" ? "primary" : "danger"}
          widthOverride={orderFieldWidth}
          onPress={onToggleSide}
        />
        <TicketField
          {...fieldProps}
          label="Type"
          value={ticketState.draft.orderType}
          widthOverride={orderFieldWidth}
          onPress={onEditOrderType}
        />
        <TicketField
          {...fieldProps}
          label="Qty"
          value={formatMarketQuantity(ticketState.draft.quantity, {
            assetCategory: ticker.metadata.assetCategory,
            contractSecType: activeContract.secType,
            maxWidth: fieldTextWidth,
          })}
          widthOverride={orderFieldWidth}
          onPress={onEditQuantity}
        />
        {showLimit && (
          <TicketField
            {...fieldProps}
            label="Limit"
            value={ticketState.draft.limitPrice != null
              ? formatMarketPrice(ticketState.draft.limitPrice, {
                assetCategory: ticker.metadata.assetCategory,
                contractSecType: activeContract.secType,
                maxWidth: fieldTextWidth,
              })
              : "—"}
            widthOverride={orderFieldWidth}
            onPress={onEditLimitPrice}
          />
        )}
        {showStop && (
          <TicketField
            {...fieldProps}
            label="Stop"
            value={ticketState.draft.stopPrice != null
              ? formatMarketPrice(ticketState.draft.stopPrice, {
                assetCategory: ticker.metadata.assetCategory,
                contractSecType: activeContract.secType,
                maxWidth: fieldTextWidth,
              })
              : "—"}
            widthOverride={orderFieldWidth}
            onPress={onEditStopPrice}
          />
        )}
        <TicketField
          {...fieldProps}
          label="TIF"
          value={ticketState.draft.tif || "DAY"}
          widthOverride={orderFieldWidth}
        />
        {ticketState.editingOrderId && (
          <TicketField
            {...fieldProps}
            label="Mode"
            value={`Edit #${ticketState.editingOrderId}`}
            widthOverride={orderFieldWidth}
          />
        )}
      </Box>
      <Box height={1} />
      <Notice tone="muted">{contractMeta}</Notice>
    </Box>
  );
}
