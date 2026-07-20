export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
}

export class PaginationHelper {
  static paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
    const total = items.length;
    const pageCount = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: items.slice(start, end),
      pagination: {
        page,
        pageSize,
        total,
        pageCount,
      },
    };
  }

  static async paginatePrisma<T>(
    model: any,
    page: number,
    pageSize: number,
    where?: any,
    include?: any,
  ): Promise<PaginatedResponse<T>> {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      model.findMany({
        where,
        include,
        skip,
        take: pageSize,
      }),
      model.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }
}
