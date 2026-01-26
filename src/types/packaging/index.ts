import { BshDate, BshObject, BshObjectPure } from "../core";

export type BshPlugin = {
    id: string
    name: string
    description: string
    version: string
    author: string
    license: string
    lastInstalledAt: BshDate
    variables: Record<string, unknown>,
    image: string;
} & BshObject;

export type BshPluginPure = {
    id: string
    name: string
    description?: string
    version?: string
    author?: string
    license?: string
    variables?: Record<string, unknown>,
    image?: string;
}

export type BshPluginHistory = {
    id: number;
    pluginId: string;
    pluginName: string;
    version: string;
    source: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
    startedAt: BshDate;
    completedAt?: BshDate;
    totalFiles: number;
    successCount: number;
    failedCount: number;
    processedFiles: Record<string, // Entity
        Record<string, // File
            { index: number, success: boolean, content?: object }[] // File content
        >
    >;
    errors: unknown[];
} & BshObject;

export type PluginInstalledResponse = {
    history: number,
    pluginId: string,
    pluginName: string,
    totalFiles: number,
    successCount: number,
    failedCount: number,
}