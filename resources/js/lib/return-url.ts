export function currentReturnUrl(): string {
    return window.location.pathname + window.location.search;
}