export const getEndpointHash = (
    endpoint: string,
    args: Record<string, any>
) => {
    const paramsHash = JSON.stringify(args);
    return `$${endpoint}-${paramsHash}`;
};
