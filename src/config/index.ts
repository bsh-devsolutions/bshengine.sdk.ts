import { BshAuthFn, BshClientFn } from "@src/client/types";
import { BshClient } from "@src/client/bsh-client";

export type GlobalServiceConfig = {
    clientFn: BshClientFn;
    authFn: BshAuthFn;
    host: string;
};

export class GlobalServiceConfiguration {
    private static instance: GlobalServiceConfiguration;

    private config: GlobalServiceConfig | null = null;
    private lastVersion: number = 0;
    private configVersion: number = 0; // Track config changes
    private lastInstance: BshClient | undefined;

    public static getInstance(): GlobalServiceConfiguration {
        if (!GlobalServiceConfiguration.instance) {
            GlobalServiceConfiguration.instance = new GlobalServiceConfiguration();
        }
        return GlobalServiceConfiguration.instance;
    }

    /**
     * Configure global settings for all services
     * @param config - Configuration object containing clientFn (required) and optional host
     */
    public configure(config: GlobalServiceConfig): void {
        if (!config.clientFn) throw new Error('BshClientFn is required for global service configuration');
        this.config = config;
        this.configVersion++;
    }

    /**
     * Get the current config version
     */
    public getConfigVersion(): number {
        return this.configVersion;
    }

    /**
     * Get the configured BshClientFn
     * @throws Error if not configured
     */
    public getClientFn(): BshClientFn {
        if (!this.config) throw new Error('Global service configuration is not set. Please call configure() first.');
        return this.config.clientFn;
    }

    /**
     * Get the configured host (optional)
     */
    public getHost(): string {
        if (!this.config) throw new Error('Global service configuration is not set. Please call configure() first.');
        return this.config.host;
    }

    /**
     * Get the configured authFn
     */
    public getAuthFn(): BshAuthFn {
        if (!this.config) throw new Error('Global service configuration is not set. Please call configure() first.');
        return this.config.authFn;
    }

    /**
     * Check if global configuration is set
     */
    public isConfigured(): boolean {
        return this.config !== null;
    }

    /**
     * Create a BshClient instance using the global configuration
     * @param host - Optional host override. If not provided, uses the globally configured host
     * @throws Error if not configured
     */
    public createClient(): BshClient {
        if (this.lastInstance === undefined || this.lastVersion !== this.configVersion) {
            const clientFn = this.getClientFn();
            const clientHost = this.getHost();
            const authFn = this.getAuthFn();
            this.lastVersion = this.configVersion;
            this.lastInstance = new BshClient(clientHost, clientFn, authFn);
        }
        return this.lastInstance;
    }

    /**
     * Reset the global configuration
     */
    public reset(): void {
        this.config = null;
        this.configVersion++;
    }
}

export const bshConfigs = GlobalServiceConfiguration.getInstance();