export interface IDataSource {
    truncate: () => Promise<void>,
}
