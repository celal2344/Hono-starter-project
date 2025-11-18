import { logger } from "@/utils/logger.js";
import type { QueryParamsType } from "@/utils/schemas/request.js";
import { ObjectId, type Document } from "mongodb";
import { paginationSchema } from "../schemas/response.js";
import { formatZodError } from "../zod-formatter.js";

export const parsePaginationResponseQuery = (query: QueryParamsType, total: number) => {
    const page = query.page;
    const size = query.size;
    const sortBy = query.sortBy || 'timestamps.createdAt';
    const order = query.order || 'ASC';
    const totalPages = Math.ceil(total / size);

    const { data, error } = paginationSchema.safeParse({
        page,
        size,
        sortBy,
        order,
        total,
        totalPages,
    });

    if (error) {
        logger.error({ module: "mongodbUtils", error: formatZodError(error), query }, 'Failed to parse pagination response');
        throw formatZodError(error);
    }

    return data;


}

const convertObjectIds = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertObjectIds);
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key === '_id' && typeof value === 'string' && ObjectId.isValid(value)) {
            result[key] = new ObjectId(value);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = convertObjectIds(value);
        } else {
            result[key] = value;
        }
    }
    return result;
};

export const parseFilters = (filtersString?: string): any => {
    if (!filtersString) {
        return {};
    }
    const parsedFilters = JSON.parse(filtersString);

    if (!filtersString.includes('_id')) {
        return parsedFilters;
    }

    return convertObjectIds(parsedFilters);
};

export const buildAggregationPipeline = (query: QueryParamsType): { pipeline: Document[], filters: Document } => {
    const filters = parseFilters(query.filters);

    // Default to only non-cancelled documents using the new `documentState` structure.
    if (filters["documentState.isCanceled"] === undefined && filters["documentState.cancelledAt"] === undefined) {
        filters["documentState.isCanceled"] = { $eq: false };
        filters["documentState.cancelledAt"] = { $eq: null };
    }

    const page = query.page;
    const size = query.size;
    const sortBy = query.sortBy || "timestamps.createdAt";
    const sortOrder = query.order === 'ASC' ? 1 : -1;

    const pipeline: Document[] = [
        { $match: filters },
        { $sort: { [sortBy]: sortOrder } },
        { $skip: (page - 1) * size },
        { $limit: size }
    ];
    return { pipeline, filters };
};
