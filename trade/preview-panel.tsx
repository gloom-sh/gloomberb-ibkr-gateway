import { Badge, Button, KeyValueRow, Notice, SectionHeading } from "gloomberb/components";
import { Box } from "gloomberb/ui";
import { colors } from "gloomberb/theme";
import { formatCurrency } from "gloomberb/utils";
import type { TradeTicketState } from "../trading/state";
import {
  formatPreviewMetric,
  formatPreviewSummary,
  truncateTradeText as truncateText,
  type TradeTone,
} from "./utils";

export function TradePreviewPanel({
  previewPanelWidth,
  previewTextWidth,
  previewMetricWidth,
  previewTone,
  previewHeading,
  ticketState,
  onPreviewOrder,
  onSubmitOrder,
}: {
  previewPanelWidth?: number;
  previewTextWidth: number;
  previewMetricWidth: number;
  previewTone: TradeTone;
  previewHeading: string;
  ticketState: TradeTicketState;
  onPreviewOrder: () => void;
  onSubmitOrder: () => void;
}) {
  return (
    <Box
      flexDirection="column"
      width={previewPanelWidth}
      minWidth={34}
      border
      borderStyle="rounded"
      borderColor={previewTone === "accent" ? colors.borderFocused : previewTone === "neutral" ? colors.border : colors[previewTone]}
      paddingX={1}
    >
      <Box height={1} flexDirection="row">
        <SectionHeading title="Preview" />
        <Box flexGrow={1} />
        <Badge label={previewHeading} tone={previewTone} />
      </Box>
      <Notice tone={ticketState.preview?.warningText ? "negative" : "muted"}>
        {truncateText(formatPreviewSummary(ticketState.preview), previewTextWidth)}
      </Notice>

      <Box flexDirection="row" flexWrap="wrap" gap={1}>
        <KeyValueRow
          label="Fee"
          value={ticketState.preview?.commission != null
            ? formatCurrency(ticketState.preview.commission, ticketState.preview.commissionCurrency || "USD")
            : "—"}
          width={previewMetricWidth}
        />
        <KeyValueRow
          label="Init"
          value={formatPreviewMetric(ticketState.preview?.initMarginBefore, ticketState.preview?.initMarginAfter)}
          width={previewMetricWidth}
        />
        <KeyValueRow
          label="Maint"
          value={formatPreviewMetric(ticketState.preview?.maintMarginBefore, ticketState.preview?.maintMarginAfter)}
          width={previewMetricWidth}
        />
        <KeyValueRow
          label="Equity"
          value={formatPreviewMetric(ticketState.preview?.equityWithLoanBefore, ticketState.preview?.equityWithLoanAfter)}
          width={previewMetricWidth}
        />
        {ticketState.preview?.warningText && (
          <KeyValueRow
            label="Warn"
            value={ticketState.preview.warningText}
            color={colors.negative}
            width={previewMetricWidth}
          />
        )}
      </Box>

      <Box flexDirection="row" flexWrap="wrap" gap={1}>
        <Button
          label="Preview"
          variant="secondary"
          disabled={ticketState.busy}
          onPress={onPreviewOrder}
        />
        <Box width={1} />
        <Button
          label={ticketState.editingOrderId ? "Submit Change" : "Submit Order"}
          variant="primary"
          disabled={!ticketState.preview || ticketState.busy}
          onPress={onSubmitOrder}
        />
      </Box>
    </Box>
  );
}
