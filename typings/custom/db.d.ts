
export interface ITransaction {
    commit();
    rollback();
    LOCK: any;
}
