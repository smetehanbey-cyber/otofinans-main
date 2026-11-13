import { describe, expect, it } from "vitest";
import { parseMarketQuotes } from "./market-quotes";

describe("parseMarketQuotes", () => {
  it("reads all three currency pairs from the Trunçgil v3 response", () => {
    expect(
      parseMarketQuotes({
        Update_Date: "2026-11-13 13:00:04",
        USD: { Buying: "50,3652", Selling: "50,3691", Change: "%0,22" },
        EUR: { Buying: "55,7164", Selling: "55,7401", Change: "%0,06" },
        GBP: { Buying: "66,6968", Selling: "66,7025", Change: "%0,03" },
      }),
    ).toEqual({
      USD: { buyRate: 50.3652, sellRate: 50.3691, change: 0.22 },
      EUR: { buyRate: 55.7164, sellRate: 55.7401, change: 0.06 },
      GBP: { buyRate: 66.6968, sellRate: 66.7025, change: 0.03 },
    });
  });

  it("keeps real bid and ask values and normalizes Turkish decimals", () => {
    expect(
      parseMarketQuotes({
        USD: { Buying: 45.12, Selling: 45.13, Change: "-0.2%" },
        EUR: { alis: "51,4532", satis: "51,4643", degisim: "%0,05" },
      }),
    ).toEqual({
      USD: { buyRate: 45.12, sellRate: 45.13, change: -0.2 },
      EUR: { buyRate: 51.4532, sellRate: 51.4643, change: 0.05 },
    });
  });

  it("omits incomplete and invalid quotes without inventing missing values", () => {
    expect(
      parseMarketQuotes({
        data: {
          USD: { Buying: "", Selling: 45.13 },
          EUR: { Buying: 51.45 },
          GBP: { Buying: 60, Selling: 60.05 },
        },
      }),
    ).toEqual({ GBP: { buyRate: 60, sellRate: 60.05, change: null } });
  });
});
