export const chunkifyObject = (obj: any, parentId: string) => {
    const chunks: any[] = [];
    let chunk: any = { id: `${parentId}.1` };
    let tokens = 0;
    let index = 1;

    for (const key in obj) {
        if (key === "id" || key === "token_count") continue;

        const words = String(obj[key]).split(" ").length;
        if (tokens + words > 100) {
            chunks.push(chunk);
            index++;
            chunk = { id: `${parentId}.${index}` };
            tokens = 0;
        }

        chunk[key] = obj[key];
        tokens += words;
    }

    chunks.push(chunk);
    return chunks;
}