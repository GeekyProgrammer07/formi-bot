export const estimateTokenCount = (text: any) => {
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 0.75);
};