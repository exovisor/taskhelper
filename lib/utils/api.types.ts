export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message?: string;
    };

export type DistinctWithCount<T> = {
  name: T;
  count: number;
}[];
