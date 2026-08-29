type CaseInsensitive<T extends string> = T | Uppercase<T>;

export type BshSearch<T = unknown> = {
    entity?: string
    alias?: string
    fields?: keyof T | string[]
    filters?: Filter<T>[]
    groupBy?: GroupBy<T>
    sort?: Sort<T>[]
    pagination?: Pagination
    from?: BshSearch<unknown>
}

export const LogicalOperators = ["and", "or", "not"] as const;
export type LogicalOperator = CaseInsensitive<typeof LogicalOperators[number]>;

export const ComparisonOperators = ["eq", "ne", "gt", "gte", "lt", "lte", "like", "ilike", "contains", "icontains", "starts", "istarts", "in", "nin", "between", "isnull", "notnull"] as const;
export type ComparisonOperator = CaseInsensitive<typeof ComparisonOperators[number]>;

export type Filter<T = unknown> = {
    operator?: ComparisonOperator | LogicalOperator;
    field?: string | keyof T;
    value?: unknown;
    type?: string;
    filters?: Filter<T>[];
};

export type GroupBy<T = unknown> = {
    fields?: string[] | keyof T[]
    aggregate?: Aggregate<T>[]
}

export const AggregateFunctions = ["COUNT", "SUM", "AVG", "MIN", "MAX"] as const;
export type AggregateFunction = CaseInsensitive<typeof AggregateFunctions[number]>;

export type Aggregate<T = unknown> = {
    function?: AggregateFunction
    field?: string | keyof T
    alias?: string
}

export type Sort<T> = {
    field?: string | keyof T
    direction?: -1 | 1 | 0
}

export type Pagination = {
    page?: number
    size?: number
}
