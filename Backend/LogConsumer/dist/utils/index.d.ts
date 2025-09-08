import { Client } from "@elastic/elasticsearch";
export declare const esClient: Client;
export declare const producer: import("kafkajs").Producer;
export declare const initKafkaProducer: () => Promise<boolean>;
export declare const produceLogs: (topic: string, message: any) => Promise<import("kafkajs").RecordMetadata[]>;
export declare const closeProducer: () => Promise<void>;
export declare const createLogsIndex: () => Promise<void>;
export declare const deleteLogsIndexOnce: () => Promise<void>;
//# sourceMappingURL=index.d.ts.map