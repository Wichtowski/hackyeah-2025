export interface HealthResult {
    message: string;
    headerTimestamp?: string;
}
/** Enable or disable verbose API logging */
export declare const enableApiDebug: (enable?: boolean) => void;
/**
 * Reconfigure the underlying Axios client base URL (e.g. when using a device or tunnel).
 */
export declare const configureApi: (options: {
    baseURL: string;
}) => void;
export declare const apiClient: {
    /** Perform a simple backend health check */
    healthCheck: () => Promise<HealthResult>;
};
export default apiClient;
