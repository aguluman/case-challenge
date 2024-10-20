export function generateUniqueReference(): string {
    const randomPart = (length: number) => Math.random().toString(36).substring(2, 2 + length);
    const randomLetters = () => {
        return Array.from({ length: 4 }, () => {
            const char = Math.random().toString(36).charAt(2);
            return Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase();
        }).join('');
    };
    return `${randomLetters()}-${randomPart(4)}-${randomPart(4)}-${randomPart(3)}-${randomPart(3)}`;
}