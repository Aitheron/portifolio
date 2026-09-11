import type {SemanticSatellite} from "./portfolio-types";

export function visibleSignals(signals: readonly SemanticSatellite[] = [], surface: "orbit" | "case") {
  return signals.filter(signal => surface === "orbit" ? signal.showInOrbit !== false : signal.showInCase !== false);
}
