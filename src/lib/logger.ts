/**
 * Structured logger for production.
 * In development → console.log with colors.
 * In production  → JSON-structured for log aggregators (Vercel Logs, Datadog, etc.)
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    data?: Record<string, unknown>;
    error?: {
        message: string;
        stack?: string;
    };
}

const isProd = process.env.NODE_ENV === "production";

function formatLog(entry: LogEntry): string {
    if (isProd) {
        // JSON for production log aggregators
        return JSON.stringify(entry);
    }
    // Human-readable for development
    const prefix = `[${entry.level.toUpperCase()}]`;
    const ctx = entry.context ? ` (${entry.context})` : "";
    return `${prefix}${ctx} ${entry.message}`;
}

export const logger = {
    info(message: string, context?: string, data?: Record<string, unknown>) {
        const entry: LogEntry = {
            level: "info",
            message,
            timestamp: new Date().toISOString(),
            context,
            data,
        };
        console.log(formatLog(entry));
    },

    warn(message: string, context?: string, data?: Record<string, unknown>) {
        const entry: LogEntry = {
            level: "warn",
            message,
            timestamp: new Date().toISOString(),
            context,
            data,
        };
        console.warn(formatLog(entry));
    },

    error(
        message: string,
        error?: Error | unknown,
        context?: string,
        data?: Record<string, unknown>
    ) {
        const entry: LogEntry = {
            level: "error",
            message,
            timestamp: new Date().toISOString(),
            context,
            data,
        };

        if (error instanceof Error) {
            entry.error = {
                message: error.message,
                stack: isProd ? undefined : error.stack, // Don't leak stack traces in prod
            };
        }

        console.error(formatLog(entry));
    },

    debug(message: string, context?: string, data?: Record<string, unknown>) {
        if (isProd) return; // No debug logs in production
        const entry: LogEntry = {
            level: "debug",
            message,
            timestamp: new Date().toISOString(),
            context,
            data,
        };
        console.debug(formatLog(entry));
    },
};
