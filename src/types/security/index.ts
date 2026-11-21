import {BshDate, BshError, BshObject, BshObjectPure} from '@types';

export type BshUser = {
    userId: string
    tenantId: string
    email: string
    password?: string
    roles: string[]
    status: 'ACTIVATED' | 'REQUIRED_ACTIVATION' | 'DISABLED' | 'REQUIRED_RESET_PASSWORD'
    profile?: {
        firstName?: string
        lastName?: string
        phone?: string
        picture?: string
        tags?: string[]
        [k: string]: unknown
    }
} & BshObject;

export type BshUserInit = {
    email: string
    tenantId?: string
    password?: string
    roles?: string[]
    profile: BshUser['profile']
}

export type BshUserPure = BshObjectPure<BshUser>;

export type BshRole = {
    name: string
    public?: boolean
    admin?: boolean
    description?: string
    bshPlugin?: string;
} & BshObject;

export type BshRolePure = BshObjectPure<BshRole>;

export type BshPolicy = {
    name: string
    description?: string
    principals: {
        type: Uppercase<'user' | 'group' | 'role' | 'apiKey' | 'any'>
        value: string[]
    }[]
    permissions: {
        entity: string[]
        actions: ('READ' | 'WRITE' | 'DELETE' | 'UPDATE' | 'SEARCH' | '*')[]
        allow: boolean
    }[]
    enabled: boolean
    priority?: number
    apiKeyId?: number
    bshPlugin?: string;
} & BshObject;

export type BshPolicyPure = BshObjectPure<BshPolicy>;
export const PrincipalType = ['user', 'role', 'any', 'apiKey', /*'group'*/] as const;
export const PolicyActions = ['*', 'READ', 'WRITE', 'DELETE', 'UPDATE', 'SEARCH'] as const;

export type BshApiKeysScopes = {
    read: boolean
    write: boolean
    delete: boolean
    update: boolean
}

export type BshApiKeysForm = {
    name: string
    description?: string
    duration: number
    type: 'PERSONAL' | 'MACHINE'
    scopes: string[] // Format: ["EntityName:ACTION", ...]
}

export type BshApiKeys = BshApiKeysForm & {
    id: number
    apiKey: string
    startedAt: BshDate
    expiresAt?: BshDate
    status: 'ACTIVE' | 'REVOKED'
    userId?: string
} & BshObject;

export type BshTenant = {
    tenantId: string;
    name: string;
    status: 'Active' | 'Inactive' | 'Blocked';
    description?: string;
    domain?: string;
    email?: string;
    adminId?: string;
    settings?: Record<string, unknown>;
} & BshObject;

export type BshTenantPure = BshObjectPure<BshTenant>;

export type BshSigningKeyStatus = 'Active' | 'Retired' | 'Expired';
export type BshSigningKeyExpireScope = 'none' | 'previous' | 'all';

export type BshSigningKey = {
    kid: string;
    status: BshSigningKeyStatus;
    activatedAt: BshDate;
    rotatesAt?: BshDate | null;
    retiredAt?: BshDate | null;
    verifyUntil?: BshDate | null;
    expiredAt?: BshDate | null;
    rotation?: 'Scheduled' | 'Manual';
    reason?: string | null;
    updatedBy?: string | null;
    current?: boolean;
}

export type BshRotateSigningKey = {
    expire?: BshSigningKeyExpireScope;
    reason?: string;
}

export type BshExpireSigningKey = {
    reason: string;
}

/** Public key of a JSON Web Key Set entry (RFC 7517), as published at `/.well-known/jwks.json`. */
export type BshJwk = {
    kty: 'EC';
    crv: 'P-256' | 'P-384' | 'P-521';
    x: string;
    y: string;
    kid: string;
    alg: 'ES256' | 'ES384' | 'ES512';
    use: 'sig';
    key_ops: ['verify'];
}

export type BshJwks = { keys: BshJwk[]; }

export type BshJwksParams = {
    onSuccess?: (jwks: BshJwks) => void;
    onError?: (error: BshError) => void;
}

export type BshRotateSigningKeyResult = {
    active: BshSigningKey;
    previous?: BshSigningKey | null;
    expired: string[];
    sessionReissued: boolean;
}
