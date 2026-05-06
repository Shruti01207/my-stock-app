export const serializeWatchlist = (doc: any) => {
    if (!doc) return null;

    return {
        id: doc._id.toString(),
        title: doc.title,
        userId: doc.userId.toString(),
        symbols: doc.symbols,
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
    };
};