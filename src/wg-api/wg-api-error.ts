declare module "WgApiError" {
    export interface ApiResponse {
        status: "error";
        error: {
            field: string,
            message: string,
            code: number,
            value: string
        };
    }
}
