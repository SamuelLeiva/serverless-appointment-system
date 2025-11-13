import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { EventBridgeService } from "../aws/eventBridgeService";

export const makeEventBridgeService = () => {
  const source = process.env.EVENT_BRIDGE_SOURCE;
  const eventBusName = process.env.EVENT_BUS_NAME || "default";

  if (!source) {
    throw new Error("Factory Error: EVENT_BRIDGE_SOURCE no está definido.");
  }

  const ebClient = new EventBridgeClient({});
  return new EventBridgeService(ebClient, source, eventBusName);
};