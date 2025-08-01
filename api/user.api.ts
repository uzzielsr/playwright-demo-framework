import { APIRequestContext, expect } from '@playwright/test';

export class UserApi {
    private adminToken: string | null = null;
    private readonly normalizedBaseUrl: string;

    constructor(
        public readonly request: APIRequestContext,
        public readonly baseUrl: string
    ) {
        this.normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
    }

    async getAdminToken(): Promise<string> {
        if (this.adminToken) {
            return this.adminToken;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
            throw new Error('❌ ADMIN_USERNAME or ADMIN_PASSWORD is not defined in environment variables');
        }

        const response = await this.request.post(`${this.normalizedBaseUrl}/rest/V1/integration/admin/token`, {
            data: {
                username: adminUsername,
                password: adminPassword
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status() !== 200) {
            const errorBody = await response.text();
            console.error('❌ Admin token request failed:');
            console.error('Status:', response.status());
            console.error('Response:', errorBody);
            console.error('URL:', `${this.normalizedBaseUrl}/rest/V1/integration/admin/token`);
            console.error('Admin Username:', adminUsername);
            throw new Error(`Failed to get admin token. Status: ${response.status()}, Response: ${errorBody}`);
        }

        expect(response.status()).toBe(200);
        this.adminToken = await response.text();
        this.adminToken = this.adminToken.replace(/"/g, '');

        return this.adminToken;
    }

    async createUser(payload: {
        email: string;
        firstname: string;
        lastname: string;
        password: string;
    }) {
        const token = await this.getAdminToken();

        const customerData = {
            customer: {
                email: payload.email,
                firstname: payload.firstname,
                lastname: payload.lastname,
                website_id: parseInt(process.env.MAGENTO_WEBSITE_ID || '1'),
                store_id: parseInt(process.env.MAGENTO_STORE_ID || '1'),
                group_id: parseInt(process.env.MAGENTO_GROUP_ID || '1')
            },
            password: payload.password
        };

        const response = await this.request.post(`${this.normalizedBaseUrl}/rest/V1/customers`, {
            data: customerData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(200);
        const createdCustomer = await response.json();

        return {
            id: createdCustomer.id,
            email: createdCustomer.email,
            firstname: createdCustomer.firstname,
            lastname: createdCustomer.lastname,
            password: payload.password
        };
    }

    async verifyUserExists(email: string) {
        const token = await this.getAdminToken();

        const response = await this.request.get(
            `${this.normalizedBaseUrl}/rest/V1/customers/search?searchCriteria[filterGroups][0][filters][0][field]=email&searchCriteria[filterGroups][0][filters][0][value]=${encodeURIComponent(email)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        expect(response.status()).toBe(200);
        const searchResult = await response.json();

        if (searchResult.items && searchResult.items.length > 0) {
            return searchResult.items[0];
        } else {
            throw new Error(`User not found: ${email}`);
        }
    }

    async deleteUser(customerId: number) {
        const token = await this.getAdminToken();

        const response = await this.request.delete(`${this.normalizedBaseUrl}/rest/V1/customers/${customerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status() === 404) {
            return;
        }

        expect(response.status()).toBe(200);
    }
}