type ServiceResponse<T, S> = {
    code: S;
    data: T | null;
};
