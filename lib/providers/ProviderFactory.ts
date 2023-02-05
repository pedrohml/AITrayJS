import { UserData } from "../UserData";
import IProvider from "./IProvider";

export class ProviderFactory {
    constructor() {}

    public async getAllProviders(): Promise<IProvider[]> {
        const userData = await UserData.load();
        return userData.providers || [];
    }

    public async getProvider(providerId: string): Promise<IProvider> {
        const providers = await this.getAllProviders();
        return providers.filter(p => p.id === providerId)[0] || null;
    }
}

export default { ProviderFactory };
module.exports = { ProviderFactory };