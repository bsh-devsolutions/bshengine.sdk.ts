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
