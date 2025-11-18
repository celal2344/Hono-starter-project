import type { Filter } from '@/components/ui/filters';

export function convertFiltersToMongo(filters: Filter[]): Record<string, any> {
  const andConditions: any[] = [];

  filters.forEach((filter) => {
    const { field, operator, values } = filter;

    if (!values || values.length === 0 || values.every((v) => v === null || v === undefined || v === '')) {
      return;
    }

    let condition: any;

    switch (operator) {
      case 'is':
        condition = { [field]: { $in: values.filter((v) => v !== null && v !== undefined) } };
        break;

      case 'is_not':
        condition = { [field]: { $nin: values.filter((v) => v !== null && v !== undefined) } };
        break;

      case 'contains':
        condition = {
          [field]: {
            $regex: String(values[0] || ''),
            $options: 'i',
          },
        };
        break;

      case 'not_contains':
        condition = {
          [field]: {
            $not: {
              $regex: String(values[0] || ''),
              $options: 'i',
            },
          },
        };
        break;

      case 'equals':
        condition = { [field]: values[0] };
        break;

      case 'not_equals':
        condition = { [field]: { $ne: values[0] } };
        break;

      case 'greater_than':
        condition = { [field]: { $gt: Number(values[0]) } };
        break;

      case 'less_than':
        condition = { [field]: { $lt: Number(values[0]) } };
        break;

      case 'greater_than_or_equal':
        condition = { [field]: { $gte: Number(values[0]) } };
        break;

      case 'less_than_or_equal':
        condition = { [field]: { $lte: Number(values[0]) } };
        break;

      case 'between':
        if (values.length >= 2 && values[0] !== null && values[1] !== null) {
          condition = {
            [field]: {
              $gte: Number(values[0]),
              $lte: Number(values[1]),
            },
          };
        }
        break;

      case 'not_between':
        if (values.length >= 2 && values[0] !== null && values[1] !== null) {
          condition = {
            $or: [
              { [field]: { $lt: Number(values[0]) } },
              { [field]: { $gt: Number(values[1]) } },
            ],
          };
        }
        break;

      case 'before':
        condition = { [field]: { $lt: Number(values[0]) } };
        break;

      case 'after':
        condition = { [field]: { $gt: Number(values[0]) } };
        break;

      default:
        return;
    }

    if (condition) {
      andConditions.push(condition);
    }
  });

  if (andConditions.length === 0) {
    return {};
  }

  if (andConditions.length === 1) {
    return andConditions[0];
  }

  return { $and: andConditions };
}

