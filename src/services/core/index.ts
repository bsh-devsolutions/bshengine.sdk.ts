export const CoreEntities = {
    BshEntities: 'BshEntities',
    BshSchemas: 'BshSchemas',
    BshTypes: 'BshTypes',

    BshUsers: 'BshUsers',
    BshPolicies: 'BshPolicies',
    BshRoles: 'BshRoles',

    BshFiles: 'BshFiles',

    BshConfigurations: 'BshConfigurations',

    BshEmails: 'BshEmails',
    BshEmailTemplates: 'BshEmailTemplates',

    BshEventLogs: 'BshEventLogs',
    BshTriggers: 'BshTriggers',
    BshTriggerInstances: 'BshTriggerInstances',
} as const;

export type CoreEntities = keyof typeof CoreEntities
