
export interface RepoConfig {
    maxLimit: number;
}

export abstract class BaseRepo {

    protected config: RepoConfig;
}
